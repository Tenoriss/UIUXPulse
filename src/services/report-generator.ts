import { jsPDF } from 'jspdf';
import type { ReportDocument, ReportFact, ReportFinding, ReportRecommendation } from './report.types';

/**
 * Client-side PDF generation.
 *
 * Uses jsPDF with its built-in Times/Helvetica metrics: no web fonts are
 * embedded, so the file stays small and generation is synchronous. That choice
 * has one consequence worth stating plainly — the base fonts are WinAnsi
 * encoded, so text is transliterated to Latin-1 before it is drawn.
 * `sanitise()` is therefore applied to *every* string, including URLs, and a
 * character outside that set degrades to a visible stand-in rather than a
 * corrupt glyph or a thrown error.
 */

/* ------------------------------------------------------------------ layout */

const PAGE = { width: 595.28, height: 841.89 }; // A4 in points
const MARGIN = { top: 64, right: 56, bottom: 72, left: 56 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
const BOTTOM_LIMIT = PAGE.height - MARGIN.bottom;

const COLOR = {
  ink: '#1a1a18',
  soft: '#4a4a44',
  faint: '#7a776e',
  line: '#d8d5cb',
  sage: '#6f7f66',
  sageLight: '#eef1ea',
  demo: '#8a4b3a',
  demoLight: '#f6ece7',
  paper: '#ffffff',
};

type Font = 'times' | 'helvetica';

interface Cursor {
  y: number;
  page: number;
}

/* ------------------------------------------------------------- sanitation */

/**
 * Map text onto the WinAnsi character set the base fonts can encode.
 *
 * Latin-1 plus the typographic punctuation jsPDF already handles is passed
 * through; anything else is replaced with a close ASCII stand-in so a report
 * with an unusual URL or name still renders legibly.
 */
export function sanitise(value: string): string {
  return (
    value
      // Common substitutions first, so the intent survives.
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2013\u2014\u2015]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/[\u00A0\u2007\u202F]/g, ' ')
      .replace(/[\u2022\u25CF]/g, '-')
      .replace(/[\u2192\u27A1]/g, '->')
      // Anything still outside Latin-1 cannot be encoded by the base fonts.
      .replace(/[^\u0000-\u00FF]/g, '?')
  );
}

/* ---------------------------------------------------------------- helpers */

function setFont(doc: jsPDF, family: Font, style: 'normal' | 'bold' | 'italic', size: number) {
  doc.setFont(family, style);
  doc.setFontSize(size);
}

/** Height a paragraph will occupy, without drawing it. */
function measure(doc: jsPDF, value: string, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(sanitise(value), maxWidth) as string[];
  return Math.max(1, lines.length) * lineHeight;
}

/** Widest an unbreakable token may be before it is hard-split. */
function breakLongTokens(doc: jsPDF, value: string, maxWidth: number): string {
  const clean = sanitise(value);
  if (doc.getTextWidth(clean) <= maxWidth) return clean;

  // Long URLs have no spaces, so `splitTextToSize` cannot break them. Insert
  // zero-width opportunities by hand — a soft split every ~40 chars keeps a
  // 300-character URL inside the margin without truncating it.
  const chunks: string[] = [];
  let current = '';
  for (const char of clean) {
    current += char;
    if (doc.getTextWidth(current) > maxWidth - 8) {
      chunks.push(current);
      current = '';
    }
  }
  if (current) chunks.push(current);
  return chunks.join('\u200B') === '' ? clean : chunks.join('\n');
}

/** Draw a paragraph with manual wrapping and page breaks. */
function paragraph(
  doc: jsPDF,
  value: string,
  cursor: Cursor,
  opts: {
    x?: number;
    width?: number;
    size?: number;
    family?: Font;
    style?: 'normal' | 'bold' | 'italic';
    color?: string;
    lineHeight?: number;
    gapAfter?: number;
  } = {},
) {
  const x = opts.x ?? MARGIN.left;
  const width = opts.width ?? CONTENT_WIDTH;
  setFont(doc, opts.family ?? 'helvetica', opts.style ?? 'normal', opts.size ?? 10);
  doc.setTextColor(opts.color ?? COLOR.soft);
  const lineHeight = opts.lineHeight ?? (opts.size ?? 10) * 1.45;

  const prepared = breakLongTokens(doc, value, width);
  // Hard-split segments are already newline-separated; let jsPDF wrap the rest.
  const segments = prepared.split('\n');
  for (const segment of segments) {
    const lines = doc.splitTextToSize(segment, width) as string[];
    for (const line of lines) {
      if (cursor.y + lineHeight > BOTTOM_LIMIT) {
        newPage(doc, cursor);
        setFont(doc, opts.family ?? 'helvetica', opts.style ?? 'normal', opts.size ?? 10);
        doc.setTextColor(opts.color ?? COLOR.soft);
      }
      doc.text(line, x, cursor.y);
      cursor.y += lineHeight;
    }
  }

  cursor.y += opts.gapAfter ?? 0;
}

function rule(doc: jsPDF, y: number, color = COLOR.line, x = MARGIN.left, width = CONTENT_WIDTH) {
  doc.setDrawColor(color);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + width, y);
}

/* ------------------------------------------------------------ page frame */

function drawChrome(doc: jsPDF, meta: ReportDocument['meta'], pageNumber: number) {
  // Header: brand + report type, then a hairline.
  setFont(doc, 'helvetica', 'bold', 8);
  doc.setTextColor(COLOR.sage);
  doc.text('UIUXPULSE', MARGIN.left, MARGIN.top - 26);

  setFont(doc, 'helvetica', 'normal', 8);
  doc.setTextColor(COLOR.faint);
  const typeLabel = sanitise(meta.typeLabel.toUpperCase());
  doc.text(typeLabel, PAGE.width - MARGIN.right, MARGIN.top - 26, { align: 'right' });

  // Demo reports say so on every page, not just the cover. Printed as a filled
  // chip so it survives photocopying and greyscale printing.
  if (meta.isDemo) {
    setFont(doc, 'helvetica', 'bold', 7);
    const chipLabel = 'DEMO';
    const chipWidth = doc.getTextWidth(chipLabel) + 9;
    const chipRight = PAGE.width - MARGIN.right - doc.getTextWidth(typeLabel) - 10;
    doc.setFillColor(COLOR.demo);
    doc.roundedRect(chipRight - chipWidth, MARGIN.top - 33.5, chipWidth, 10.5, 2, 2, 'F');
    doc.setTextColor('#ffffff');
    doc.text(chipLabel, chipRight - chipWidth / 2, MARGIN.top - 26, { align: 'center' });
  }
  rule(doc, MARGIN.top - 18);

  // Footer: website name only. The page number is added in a final pass once
  // the total is known, so it is drawn exactly once per page.
  rule(doc, PAGE.height - MARGIN.bottom + 18);
  setFont(doc, 'helvetica', 'normal', 8);
  doc.setTextColor(COLOR.faint);
  const nameLines = doc.splitTextToSize(sanitise(meta.websiteName), CONTENT_WIDTH - 90) as string[];
  doc.text(nameLines[0] ?? '', MARGIN.left, PAGE.height - MARGIN.bottom + 32);
  void pageNumber;
}

function newPage(doc: jsPDF, cursor: Cursor, meta?: ReportDocument['meta']) {
  doc.addPage();
  cursor.page += 1;
  cursor.y = MARGIN.top + 16;
  if (meta) drawChrome(doc, meta, cursor.page);
}

/* --------------------------------------------------------------- sections */

function heading(doc: jsPDF, value: string, cursor: Cursor, meta: ReportDocument['meta']) {
  // Keep a heading with at least a little of its section.
  if (cursor.y + 64 > BOTTOM_LIMIT) newPage(doc, cursor, meta);
  cursor.y += 10;
  setFont(doc, 'times', 'bold', 15);
  doc.setTextColor(COLOR.ink);
  paragraph(doc, value, cursor, {
    family: 'times',
    style: 'bold',
    size: 15,
    color: COLOR.ink,
    lineHeight: 19,
    gapAfter: 6,
  });
  rule(doc, cursor.y - 2, COLOR.sage);
  cursor.y += 12;
}

function factsBlock(doc: jsPDF, items: ReportFact[], cursor: Cursor, meta: ReportDocument['meta']) {
  const labelWidth = 132;
  const valueWidth = CONTENT_WIDTH - labelWidth - 16;

  for (const item of items) {
    setFont(doc, 'helvetica', 'normal', 9);
    const rowHeight = Math.max(
      14,
      measure(doc, item.value, valueWidth, 13),
    );

    if (cursor.y + rowHeight > BOTTOM_LIMIT) newPage(doc, cursor, meta);

    setFont(doc, 'helvetica', 'normal', 8.5);
    doc.setTextColor(COLOR.faint);
    doc.text(sanitise(item.label.toUpperCase()), MARGIN.left, cursor.y);

    const savedY = cursor.y;
    cursor.y = savedY;
    paragraph(doc, item.value, cursor, {
      x: MARGIN.left + labelWidth,
      width: valueWidth,
      size: 9.5,
      color: COLOR.ink,
      lineHeight: 13,
    });
    cursor.y = Math.max(cursor.y, savedY + rowHeight);
  }
  cursor.y += 8;
}

function groupsBlock(
  doc: jsPDF,
  groups: Array<{ label: string; items: string[] }>,
  cursor: Cursor,
  meta: ReportDocument['meta'],
) {
  for (const group of groups) {
    if (cursor.y + 40 > BOTTOM_LIMIT) newPage(doc, cursor, meta);

    setFont(doc, 'helvetica', 'bold', 9);
    doc.setTextColor(COLOR.soft);
    doc.text(sanitise(group.label.toUpperCase()), MARGIN.left, cursor.y);
    cursor.y += 14;

    for (const item of group.items) {
      if (cursor.y + 16 > BOTTOM_LIMIT) newPage(doc, cursor, meta);
      setFont(doc, 'helvetica', 'normal', 9.5);
      doc.setTextColor(COLOR.sage);
      doc.text('—', MARGIN.left, cursor.y);
      paragraph(doc, item, cursor, {
        x: MARGIN.left + 14,
        width: CONTENT_WIDTH - 14,
        size: 9.5,
        color: COLOR.ink,
        lineHeight: 13.5,
      });
      cursor.y += 3;
    }
    cursor.y += 12;
  }
}

function calloutBlock(doc: jsPDF, body: string, cursor: Cursor, meta: ReportDocument['meta']) {
  setFont(doc, 'helvetica', 'normal', 9.5);
  const inner = CONTENT_WIDTH - 28;
  const h = measure(doc, body, inner, 14) + 22;

  if (cursor.y + h > BOTTOM_LIMIT) newPage(doc, cursor, meta);

  doc.setFillColor(COLOR.sageLight);
  doc.roundedRect(MARGIN.left, cursor.y - 12, CONTENT_WIDTH, h, 3, 3, 'F');
  doc.setFillColor(COLOR.sage);
  doc.rect(MARGIN.left, cursor.y - 12, 2.5, h, 'F');

  const savedY = cursor.y;
  cursor.y = savedY + 3;
  paragraph(doc, body, cursor, {
    x: MARGIN.left + 16,
    width: inner,
    size: 9.5,
    color: COLOR.ink,
    lineHeight: 14,
  });
  cursor.y = Math.max(cursor.y, savedY - 12 + h) + 18;
}

function scoreBlock(
  doc: jsPDF,
  score: number,
  explanation: string,
  priorities: Array<{ label: string; count: number }>,
  cursor: Cursor,
  meta: ReportDocument['meta'],
) {
  if (cursor.y + 130 > BOTTOM_LIMIT) newPage(doc, cursor, meta);

  // Score ring, drawn as arcs — same idea as the on-screen gauge.
  const cx = MARGIN.left + 46;
  const cy = cursor.y + 40;
  const radius = 34;
  const start = cursor.y + 6;

  doc.setDrawColor(COLOR.line);
  doc.setLineWidth(7);
  doc.circle(cx, cy, radius);

  const value = Math.max(0, Math.min(100, score));

  // jsPDF has no arc primitive in its typed surface, so the filled share is
  // drawn as a dense run of short chords. At 96 segments the corners are below
  // half a point and the ring reads as a smooth arc in print and on screen.
  if (value > 0) {
    const radians = (value / 100) * Math.PI * 2;
    const segments = Math.max(8, Math.ceil((radians / (Math.PI * 2)) * 96));
    doc.setDrawColor(COLOR.sage);
    doc.setLineWidth(7);
    doc.setLineCap('round');

    let previous: [number, number] | null = null;
    for (let step = 0; step <= segments; step += 1) {
      const angle = -Math.PI / 2 + (radians * step) / segments;
      const point: [number, number] = [
        cx + Math.cos(angle) * radius,
        cy + Math.sin(angle) * radius,
      ];
      if (previous) doc.line(previous[0], previous[1], point[0], point[1]);
      previous = point;
    }
    doc.setLineCap('butt');
  }

  setFont(doc, 'times', 'bold', 26);
  doc.setTextColor(COLOR.ink);
  doc.text(String(value), cx, cy + 4, { align: 'center' });
  setFont(doc, 'helvetica', 'normal', 7);
  doc.setTextColor(COLOR.faint);
  doc.text('/ 100', cx, cy + 16, { align: 'center' });

  const textX = cx + radius + 28;
  const textWidth = MARGIN.left + CONTENT_WIDTH - textX;
  let y = start + 8;

  setFont(doc, 'helvetica', 'normal', 8);
  doc.setTextColor(COLOR.faint);
  doc.text('OVERALL SCORE', textX, y);
  y += 18;

  const savedY = cursor.y;
  cursor.y = y;
  paragraph(doc, explanation, cursor, {
    x: textX,
    width: textWidth,
    size: 9,
    color: COLOR.soft,
    lineHeight: 12.5,
  });
  y = Math.max(cursor.y, savedY + 70);

  // Priority counts as a small table of labelled figures.
  const colWidth = CONTENT_WIDTH / Math.max(1, priorities.length);
  priorities.forEach((item, index) => {
    const x = MARGIN.left + index * colWidth;
    setFont(doc, 'helvetica', 'normal', 7.5);
    doc.setTextColor(COLOR.faint);
    doc.text(sanitise(item.label.toUpperCase()), x, y + 12);
    setFont(doc, 'times', 'bold', 18);
    doc.setTextColor(COLOR.ink);
    doc.text(String(item.count), x, y + 32);
  });

  cursor.y = y + 48;
}

function tableBlock(
  doc: jsPDF,
  columns: string[],
  rows: string[][],
  cursor: Cursor,
  meta: ReportDocument['meta'],
) {
  const widths =
    columns.length === 3
      ? [CONTENT_WIDTH - 150, 80, 70]
      : columns.map(() => CONTENT_WIDTH / columns.length);

  const drawHeader = () => {
    setFont(doc, 'helvetica', 'bold', 8);
    doc.setTextColor(COLOR.faint);
    doc.setFillColor(COLOR.sageLight);
    doc.rect(MARGIN.left, cursor.y - 11, CONTENT_WIDTH, 18, 'F');
    let x = MARGIN.left + 6;
    columns.forEach((column, index) => {
      const align = index === 0 ? 'left' : 'right';
      doc.text(
        sanitise(column.toUpperCase()),
        align === 'right' ? x + widths[index] - 12 : x,
        cursor.y,
        { align },
      );
      x += widths[index];
    });
    cursor.y += 20;
  };

  if (cursor.y + 40 > BOTTOM_LIMIT) newPage(doc, cursor, meta);
  drawHeader();

  rows.forEach((row, rowIndex) => {
    setFont(doc, 'helvetica', 'normal', 9.5);
    const rowHeight = Math.max(
      16,
      measure(doc, row[0] ?? '', widths[0] - 12, 13),
    );
    if (cursor.y + rowHeight > BOTTOM_LIMIT) {
      newPage(doc, cursor, meta);
      drawHeader();
    }

    let x = MARGIN.left + 6;
    row.forEach((cell, index) => {
      const align = index === 0 ? 'left' : 'right';
      setFont(doc, index === 0 ? 'helvetica' : 'times', index === 0 ? 'normal' : 'bold', index === 0 ? 9.5 : 11);
      doc.setTextColor(index === 0 ? COLOR.ink : COLOR.soft);
      doc.text(
        sanitise(cell),
        align === 'right' ? x + widths[index] - 12 : x,
        cursor.y,
        { align },
      );
      x += widths[index];
    });

    cursor.y += rowHeight;
    if (rowIndex < rows.length - 1) rule(doc, cursor.y - 6, '#ecebe5');
  });

  cursor.y += 10;
}

function findingsBlock(
  doc: jsPDF,
  items: ReportFinding[],
  cursor: Cursor,
  meta: ReportDocument['meta'],
) {
  items.forEach((item, index) => {
    setFont(doc, 'times', 'bold', 11.5);
    const titleHeight = measure(doc, item.title, CONTENT_WIDTH, 15);
    const metaHeight = measure(
      doc,
      `${item.category} · ${item.priority} · ${item.assessment}`,
      CONTENT_WIDTH,
      12,
    );
    const blockStart = titleHeight + metaHeight + 30;

    // Never start a finding at the very bottom of a page.
    if (cursor.y + blockStart > BOTTOM_LIMIT) newPage(doc, cursor, meta);

    setFont(doc, 'helvetica', 'normal', 7.5);
    doc.setTextColor(COLOR.faint);
    doc.text(`${String(index + 1).padStart(2, '0')}`, MARGIN.left, cursor.y);

    paragraph(doc, item.title, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      family: 'times',
      style: 'bold',
      size: 11.5,
      color: COLOR.ink,
      lineHeight: 15,
    });

    paragraph(
      doc,
      `${item.category} · ${item.priority} · ${item.assessment}`,
      cursor,
      {
        x: MARGIN.left + 22,
        width: CONTENT_WIDTH - 22,
        size: 8,
        color: COLOR.sage,
        lineHeight: 11,
        gapAfter: 5,
      },
    );

    paragraph(doc, item.description, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 9.5,
      color: COLOR.soft,
      lineHeight: 13.5,
      gapAfter: 5,
    });

    // Page + viewport, with the URL hard-wrapped so a long path stays inside.
    paragraph(doc, `${item.page} — ${item.viewport}`, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 8,
      family: 'helvetica',
      color: COLOR.faint,
      lineHeight: 11,
      gapAfter: 6,
    });

    paragraph(doc, item.whyItMatters, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 9,
      style: 'italic',
      color: COLOR.soft,
      lineHeight: 12.5,
      gapAfter: 14,
    });

    if (index < items.length - 1) {
      if (cursor.y > BOTTOM_LIMIT - 12) newPage(doc, cursor, meta);
      rule(doc, cursor.y - 6, '#ecebe5');
      cursor.y += 10;
    }
  });
}

function recommendationsBlock(
  doc: jsPDF,
  items: ReportRecommendation[],
  cursor: Cursor,
  meta: ReportDocument['meta'],
) {
  items.forEach((item, index) => {
    setFont(doc, 'times', 'bold', 11.5);
    if (cursor.y + 90 > BOTTOM_LIMIT) newPage(doc, cursor, meta);

    setFont(doc, 'helvetica', 'normal', 7.5);
    doc.setTextColor(COLOR.faint);
    doc.text(`${String(index + 1).padStart(2, '0')}`, MARGIN.left, cursor.y);

    paragraph(doc, item.title, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      family: 'times',
      style: 'bold',
      size: 11.5,
      color: COLOR.ink,
      lineHeight: 15,
    });

    paragraph(doc, `${item.priority} · ${item.category}`, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 8,
      color: COLOR.sage,
      lineHeight: 11,
      gapAfter: 5,
    });

    paragraph(doc, item.explanation, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 9.5,
      color: COLOR.soft,
      lineHeight: 13.5,
      gapAfter: 6,
    });

    paragraph(doc, `Related finding: ${item.relatedFinding}`, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 8.5,
      style: 'italic',
      color: COLOR.sage,
      lineHeight: 12,
      gapAfter: 6,
    });

    paragraph(doc, `Improvement: ${item.improvement}`, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 9,
      color: COLOR.soft,
      lineHeight: 12.5,
      gapAfter: 4,
    });

    paragraph(doc, `Expected benefit: ${item.benefit}`, cursor, {
      x: MARGIN.left + 22,
      width: CONTENT_WIDTH - 22,
      size: 9,
      color: COLOR.soft,
      lineHeight: 12.5,
      gapAfter: 14,
    });

    if (index < items.length - 1) {
      if (cursor.y > BOTTOM_LIMIT - 12) newPage(doc, cursor, meta);
      rule(doc, cursor.y - 6, '#ecebe5');
      cursor.y += 10;
    }
  });
}

/* ------------------------------------------------------------------ cover */

function drawCover(doc: jsPDF, report: ReportDocument) {
  const { meta } = report;

  // Demo reports are unmistakable from the first page.
  if (meta.isDemo) {
    doc.setFillColor(COLOR.demoLight);
    doc.rect(0, 0, PAGE.width, PAGE.height, 'F');
    doc.setDrawColor(COLOR.demo);
    doc.setLineWidth(2);
    doc.rect(24, 24, PAGE.width - 48, PAGE.height - 48);
  }

  setFont(doc, 'helvetica', 'bold', 10);
  doc.setTextColor(COLOR.sage);
  doc.text('UIUXPULSE', MARGIN.left, MARGIN.top + 6);

  setFont(doc, 'helvetica', 'normal', 8);
  doc.setTextColor(COLOR.faint);
  doc.text('Editorial-grade UI/UX evaluation', MARGIN.left, MARGIN.top + 20);

  if (meta.isDemo) {
    doc.setFillColor(COLOR.demo);
    doc.roundedRect(PAGE.width - MARGIN.right - 96, MARGIN.top - 4, 96, 22, 4, 4, 'F');
    setFont(doc, 'helvetica', 'bold', 10);
    doc.setTextColor('#ffffff');
    doc.text('DEMO DATA', PAGE.width - MARGIN.right - 48, MARGIN.top + 11, { align: 'center' });
  }

  let y = 250;

  setFont(doc, 'times', 'bold', 34);
  doc.setTextColor(COLOR.ink);
  const titleLines = doc.splitTextToSize(sanitise(meta.title), CONTENT_WIDTH) as string[];
  titleLines.forEach((line) => {
    doc.text(line, MARGIN.left, y);
    y += 40;
  });

  y += 6;
  rule(doc, y, COLOR.sage);
  y += 30;

  setFont(doc, 'times', 'normal', 20);
  doc.setTextColor(COLOR.ink);
  const nameLines = doc.splitTextToSize(sanitise(meta.websiteName), CONTENT_WIDTH) as string[];
  nameLines.forEach((line) => {
    doc.text(line, MARGIN.left, y);
    y += 25;
  });

  y += 2;
  setFont(doc, 'helvetica', 'normal', 10);
  doc.setTextColor(COLOR.soft);
  const urlLines = doc.splitTextToSize(sanitise(meta.websiteUrl), CONTENT_WIDTH) as string[];
  urlLines.forEach((line) => {
    doc.text(line, MARGIN.left, y);
    y += 14;
  });

  const footerY = PAGE.height - MARGIN.bottom - 60;
  rule(doc, footerY, COLOR.line);

  const cells: Array<[string, string]> = [
    ['REPORT TYPE', meta.typeLabel.toUpperCase()],
    ['GENERATED', meta.generatedAt.slice(0, 10)],
  ];
  cells.forEach(([label, value], index) => {
    const x = MARGIN.left + index * (CONTENT_WIDTH / 2);
    setFont(doc, 'helvetica', 'normal', 7.5);
    doc.setTextColor(COLOR.faint);
    doc.text(sanitise(label), x, footerY + 18);
    setFont(doc, 'helvetica', 'bold', 9.5);
    doc.setTextColor(meta.isDemo && index === 0 ? COLOR.demo : COLOR.ink);
    doc.text(sanitise(value), x, footerY + 32);
  });

  if (meta.isDemo) {
    setFont(doc, 'helvetica', 'normal', 8);
    doc.setTextColor(COLOR.demo);
    doc.text(
      sanitise('Illustrative demonstration data — not an analysis of this website.'),
      MARGIN.left,
      footerY + 52,
    );
  }
}

/* ------------------------------------------------------------- entry point */

/**
 * Build the PDF for a report document.
 *
 * Returns the jsPDF instance so callers can download, preview, or inspect it.
 * Multi-page content is driven by `Cursor`: every draw helper checks the
 * bottom margin before writing and starts a new page (with chrome) when needed,
 * so nothing is clipped or overlapped.
 */
export function buildReportPdf(report: ReportDocument): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  doc.setProperties({
    title: sanitise(report.meta.title),
    subject: sanitise(report.meta.typeLabel),
    author: 'UIUXPulse',
    creator: 'UIUXPulse (client-side generation)',
    keywords: sanitise(`${report.meta.websiteName}, ${report.meta.websiteUrl}`),
  });

  drawCover(doc, report);

  // Page 2 onwards: chrome on every page, then the sections in order.
  const cursor: Cursor = { y: MARGIN.top + 16, page: 1 };
  newPage(doc, cursor, report.meta);

  // Contents — a short index that mirrors the section order below.
  setFont(doc, 'times', 'bold', 15);
  doc.setTextColor(COLOR.ink);
  cursor.y += 10;
  doc.text(sanitise('Contents'), MARGIN.left, cursor.y);
  cursor.y += 8;
  rule(doc, cursor.y, COLOR.sage);
  cursor.y += 18;

  report.sections.forEach((section, index) => {
    setFont(doc, 'helvetica', 'normal', 9.5);
    doc.setTextColor(COLOR.faint);
    doc.text(`${String(index + 1).padStart(2, '0')}`, MARGIN.left, cursor.y);
    setFont(doc, 'helvetica', 'normal', 10);
    doc.setTextColor(COLOR.soft);
    doc.text(sanitise(section.heading), MARGIN.left + 24, cursor.y);
    cursor.y += 16;
  });

  cursor.y += 6;
  rule(doc, cursor.y, COLOR.line);
  cursor.y += 6;

  for (const section of report.sections) {
    heading(doc, section.heading, cursor, report.meta);

    switch (section.kind) {
      case 'facts':
        factsBlock(doc, section.items, cursor, report.meta);
        break;
      case 'groups':
        groupsBlock(doc, section.groups, cursor, report.meta);
        break;
      case 'callout':
        calloutBlock(doc, section.body, cursor, report.meta);
        break;
      case 'score':
        scoreBlock(doc, section.score, section.explanation, section.priorities, cursor, report.meta);
        break;
      case 'table':
        tableBlock(doc, section.columns, section.rows, cursor, report.meta);
        break;
      case 'findings':
        findingsBlock(doc, section.items, cursor, report.meta);
        break;
      case 'recommendations':
        recommendationsBlock(doc, section.items, cursor, report.meta);
        break;
    }
  }

  // Disclaimer always gets its own space at the end.
  if (cursor.y + 80 > BOTTOM_LIMIT) newPage(doc, cursor, report.meta);
  cursor.y += 12;
  rule(doc, cursor.y, COLOR.line);
  cursor.y += 22;

  setFont(doc, 'helvetica', 'bold', 8);
  doc.setTextColor(COLOR.faint);
  doc.text('DISCLAIMER', MARGIN.left, cursor.y);
  cursor.y += 16;

  const boxTop = cursor.y - 12;
  const inner = CONTENT_WIDTH - 28;
  setFont(doc, 'helvetica', 'normal', 9);
  const bodyHeight = measure(doc, report.disclaimer, inner, 13) + 22;

  doc.setFillColor(report.meta.isDemo ? COLOR.demoLight : COLOR.sageLight);
  doc.roundedRect(MARGIN.left, boxTop, CONTENT_WIDTH, bodyHeight, 3, 3, 'F');
  doc.setFillColor(report.meta.isDemo ? COLOR.demo : COLOR.sage);
  doc.rect(MARGIN.left, boxTop, 2.5, bodyHeight, 'F');

  cursor.y = boxTop + 14;
  paragraph(doc, report.disclaimer, cursor, {
    x: MARGIN.left + 16,
    width: inner,
    size: 9,
    color: COLOR.ink,
    lineHeight: 13,
  });

  // Second pass over the pages we actually produced, so the numbering is right
  // on every page including ones added while drawing.
  const total = doc.getNumberOfPages();
  for (let page = 2; page <= total; page += 1) {
    doc.setPage(page);
    setFont(doc, 'helvetica', 'normal', 8);
    doc.setTextColor(COLOR.faint);
    doc.text(`${page} / ${total}`, PAGE.width - MARGIN.right, PAGE.height - MARGIN.bottom + 32, {
      align: 'right',
    });
  }

  return doc;
}

/**
 * Generate and hand the file to the browser.
 *
 * `save()` is the download path; keeping it here means the pages and the list
 * share one call and one filename convention.
 */
export function downloadReportPdf(report: ReportDocument): void {
  const doc = buildReportPdf(report);
  doc.save(report.meta.fileName);
}

/** Raw bytes, used by tests and by anything that wants to stream the file. */
export function reportPdfBytes(report: ReportDocument): Uint8Array {
  return buildReportPdf(report).output('arraybuffer') as unknown as Uint8Array;
}
