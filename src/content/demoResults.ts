import type { EvaluationCategoryId, EvaluationViewportId } from '@/services/workspace.types';
import type { AssessmentType, ResultPriority } from '@/services/evaluation-results.types';

/**
 * Demo results copy.
 *
 * Kept out of `locales/*.ts` for the same reason as `criteria.ts`: these are
 * long-form bilingual passages with structure, and flattening them into the
 * dictionary would make both files unreadable. Ids are shared between locales,
 * so a missing translation is a type error rather than a fallback string.
 *
 * Everything here is illustrative. The copy is written as example findings for
 * a fictional studio site, never as the result of an actual analysis.
 */

type Locale = 'en' | 'id';

export interface FindingCopy {
  title: string;
  description: string;
  whyItMatters: string;
  /** Short label describing the evidence this finding would carry. */
  evidenceNote: string;
}

export interface RecommendationCopy {
  title: string;
  explanation: string;
  improvement: string;
  benefit: string;
}

export interface CategoryNoteCopy {
  note: string;
}

export interface DemoResultsCopy {
  findings: Record<string, FindingCopy>;
  recommendations: Record<string, RecommendationCopy>;
  categoryNotes: Record<EvaluationCategoryId, string>;
  summary: {
    strengths: string[];
    improvements: string[];
    nextActions: string[];
  };
}

export const assessmentCopy: Record<Locale, Record<AssessmentType, string>> = {
  en: {
    measured: 'Automatically measured',
    heuristic: 'Heuristic assessment',
    manual: 'Requires manual review',
  },
  id: {
    measured: 'Diukur otomatis',
    heuristic: 'Penilaian heuristik',
    manual: 'Perlu tinjauan manual',
  },
};

export const priorityCopy: Record<Locale, Record<ResultPriority, string>> = {
  en: { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' },
  id: { critical: 'Kritis', high: 'Tinggi', medium: 'Sedang', low: 'Rendah' },
};

export const viewportCopy: Record<Locale, Record<EvaluationViewportId, string>> = {
  en: { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' },
  id: { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Seluler' },
};

export const demoResultsCopy: Record<Locale, DemoResultsCopy> = {
  en: {
    findings: {
      'contrast-body': {
        title: 'Body text contrast falls below the readable threshold',
        description:
          'Secondary paragraphs sit on a muted surface at roughly 3.1:1 contrast — under the 4.5:1 that normal-size text needs.',
        whyItMatters:
          'Low-contrast body copy is the most common reason a page becomes tiring to read, and it is unreadable for many low-vision visitors.',
        evidenceNote: 'A contrast measurement of the body text against its background.',
      },
      'type-scale-jump': {
        title: 'Heading sizes jump without an intermediate step',
        description:
          'Section headings pass from 44px straight to 18px, so the hierarchy collapses between sections.',
        whyItMatters:
          'A missing step in the type scale makes the page read as unrelated blocks rather than one document.',
        evidenceNote: 'A scale breakdown of the headings found on the page.',
      },
      'line-length': {
        title: 'Paragraphs run wider than a comfortable measure',
        description:
          'Intro copy spans the full container at 1440px, producing lines of roughly 110 characters.',
        whyItMatters:
          'Long lines make the eye lose its place on the return sweep, which slows reading noticeably.',
        evidenceNote: 'A measure calculation based on container width and font size.',
      },
      'spacing-inconsistent': {
        title: 'Section spacing varies between neighbours',
        description:
          'Vertical gaps alternate between 64px, 96px, and 72px across consecutive sections with no pattern.',
        whyItMatters:
          'Uneven rhythm reads as unfinished, and it makes the page harder to scan for structure.',
        evidenceNote: 'A spacing histogram across the page sections.',
      },
      'tap-targets': {
        title: 'Icon buttons are smaller than the minimum touch target',
        description:
          'Three social icon links measure 20×20px at mobile width, below the 24×24px minimum.',
        whyItMatters:
          'Small targets cause mis-taps, and they are especially difficult for users with limited dexterity.',
        evidenceNote: 'A measured bounding box for each interactive element.',
      },
      'nav-no-current': {
        title: 'Current page is not indicated in the navigation',
        description:
          'The header navigation renders every item identically, with no active state for the page in view.',
        whyItMatters:
          'Without a current-page marker, visitors lose their position in the site — a particular problem on a deep page.',
        evidenceNote: 'A structural comparison of navigation item states.',
      },
      'overflow-mobile': {
        title: 'Pricing table overflows horizontally on mobile',
        description:
          'The three-column comparison table is wider than the 390px viewport and scrolls the whole page sideways.',
        whyItMatters:
          'Horizontal scroll on a phone hides content off-screen and makes the page feel broken.',
        evidenceNote: 'A width comparison between the container and the viewport.',
      },
      'img-no-alt': {
        title: 'Case study images have no text alternative',
        description:
          'Four project thumbnails are rendered as background images or without a meaningful alternative text.',
        whyItMatters:
          'Screen reader users receive nothing where sighted users see a project — the content simply disappears.',
        evidenceNote: 'A markup inspection of image elements and their alternatives.',
      },
      'focus-invisible': {
        title: 'Focus ring disappears on dark surfaces',
        description:
          'Keyboard focus is drawn in the same tone as the surface behind it for links inside dark sections, leaving no visible indicator.',
        whyItMatters:
          'Keyboard users cannot tell where they are, which makes the page effectively unusable without a mouse.',
        evidenceNote: 'A visual comparison of focused and unfocused states.',
      },
      'button-inconsistent': {
        title: 'Two button styles for the same action',
        description:
          '"View project" appears as a filled pill on the landing section and as a text link with an arrow inside case cards.',
        whyItMatters:
          'When the same action wears two different shapes, visitors hesitate over whether they do the same thing.',
        evidenceNote: 'A side-by-side comparison of the two button treatments.',
      },
    },

    recommendations: {
      'rec-contrast': {
        title: 'Raise secondary text to the nearest passing contrast value',
        explanation:
          'The body colour is close to passing: lifting it two steps on the neutral ramp clears 4.5:1 without changing the page’s character.',
        improvement:
          'Adjust the muted-text token rather than individual paragraphs, so every page inherits the fix at once.',
        benefit:
          'Long-form copy becomes comfortable to read and legible for low-vision visitors.',
      },
      'rec-scale': {
        title: 'Insert an intermediate heading size',
        explanation:
          'Add one step between the section heading and the body size, then apply it to all sub-sections.',
        improvement:
          'Express the scale as tokens so a new section cannot invent its own size.',
        benefit: 'The page reads as one document with a clear outline.',
      },
      'rec-measure': {
        title: 'Constrain the intro measure',
        explanation:
          'Cap the intro text container at roughly 70 characters and let the surrounding grid keep its full width.',
        improvement: 'Apply the cap as a shared prose container used by every long-form block.',
        benefit: 'Reading speed improves and paragraphs stop feeling like a wall of text.',
      },
      'rec-rhythm': {
        title: 'Adopt one vertical rhythm',
        explanation:
          'Pick a single section gap and a half-step for related blocks, then replace the three current values.',
        improvement: 'Drive spacing from the existing spacing tokens instead of per-section values.',
        benefit: 'The page reads as deliberate, and future sections stay consistent by default.',
      },
      'rec-targets': {
        title: 'Enlarge the social icon targets',
        explanation:
          'Keep the 20px glyph but give each link a 44px hit area through padding.',
        improvement: 'Apply a shared minimum-size rule to every icon-only control.',
        benefit: 'Fewer mis-taps, especially for visitors with limited dexterity.',
      },
      'rec-current': {
        title: 'Mark the current page in the navigation',
        explanation:
          'Compare the current route against each navigation item and style the match, with an accessible current state rather than colour alone.',
        improvement: 'Add `aria-current` alongside the visual change so it is announced as well as seen.',
        benefit: 'Visitors always know where they are in the site.',
      },
      'rec-overflow': {
        title: 'Let the comparison table adapt below tablet width',
        explanation:
          'Stack the pricing columns into cards under 768px, or allow the table itself to scroll inside a bounded container.',
        improvement: 'Contain the scroll to the table so the page never scrolls sideways.',
        benefit: 'Mobile visitors see every plan without losing their place on the page.',
      },
      'rec-alt': {
        title: 'Give every project image a text alternative',
        explanation:
          'Describe what each thumbnail shows, or mark it decorative when the surrounding text already carries the meaning.',
        improvement: 'Check the alternative text as part of the content workflow, not at the end.',
        benefit: 'Screen reader users receive the same project context as everyone else.',
      },
      'rec-focus': {
        title: 'Draw a focus ring that survives every surface',
        explanation:
          'Use a two-tone ring — a light inner line with a darker outer edge — so it stays visible on both dark and light sections.',
        improvement: 'Apply it globally through one focus-visible rule.',
        benefit: 'Keyboard navigation becomes traceable across the whole site.',
      },
      'rec-buttons': {
        title: 'One visual treatment per action',
        explanation:
          'Decide whether the primary action is a filled pill or a link with an arrow, then remove the other form.',
        improvement: 'Document the choice next to the button component so new sections inherit it.',
        benefit: 'Visitors stop second-guessing whether two differently shaped controls do the same thing.',
      },
    },

    categoryNotes: {
      visualConsistency:
        'Buttons and badges repeat a single shape language, but the same action still appears in two treatments.',
      typography:
        'The display face carries the page well; body measure and the gap in the scale are what hold it back.',
      layout:
        'The grid holds up on desktop, though the vertical rhythm and mobile table need attention.',
      usability:
        'Navigation is simple and short, but it never says where you are, and some controls are hard to hit.',
      responsiveness:
        'The layout adapts cleanly in most places; the wide comparison table is the clear exception.',
      accessibility:
        'Contrast and focus visibility are the two issues most likely to block someone outright.',
    },

    summary: {
      strengths: [
        'A distinctive editorial voice that survives at every viewport.',
        'Navigation is short, predictable, and free of dead ends.',
        'The card system reuses a small set of surfaces consistently.',
      ],
      improvements: [
        'Secondary text contrast and body measure pull against the otherwise strong typography.',
        'The pricing table is the one place where mobile layout genuinely breaks.',
        'Focus and image alternatives are the gaps most likely to exclude someone entirely.',
      ],
      nextActions: [
        'Fix contrast and focus visibility first — both are cheap and both unblock real users.',
        'Then contain the mobile table, which is the most visible mobile defect.',
        'Leave the scale and rhythm refinements for a single dedicated pass.',
      ],
    },
  },

  id: {
    findings: {
      'contrast-body': {
        title: 'Kontras teks isi di bawah ambang keterbacaan',
        description:
          'Paragraf sekunder berada di permukaan redup dengan kontras sekitar 3,1:1 — di bawah 4,5:1 yang dibutuhkan teks ukuran normal.',
        whyItMatters:
          'Teks isi berkontras rendah adalah penyebab paling umum halaman melelahkan dibaca, dan tidak terbaca bagi banyak pengguna dengan penglihatan lemah.',
        evidenceNote: 'Pengukuran kontras teks isi terhadap latarnya.',
      },
      'type-scale-jump': {
        title: 'Ukuran judul melompat tanpa langkah antara',
        description:
          'Judul bagian melompat dari 44px langsung ke 18px, sehingga hierarki runtuh antar bagian.',
        whyItMatters:
          'Langkah yang hilang dalam skala tipografi membuat halaman terbaca sebagai blok-blok terpisah, bukan satu dokumen.',
        evidenceNote: 'Rincian skala judul yang ditemukan di halaman.',
      },
      'line-length': {
        title: 'Paragraf lebih lebar dari ukuran baca yang nyaman',
        description:
          'Teks pengantar memenuhi kontainer pada 1440px, menghasilkan baris sekitar 110 karakter.',
        whyItMatters:
          'Baris panjang membuat mata kehilangan tempat saat kembali ke awal, dan memperlambat membaca secara nyata.',
        evidenceNote: 'Perhitungan lebar baca berdasarkan lebar kontainer dan ukuran huruf.',
      },
      'spacing-inconsistent': {
        title: 'Jarak antar bagian tidak seragam',
        description:
          'Celah vertikal bergantian antara 64px, 96px, dan 72px pada bagian-bagian berurutan tanpa pola.',
        whyItMatters:
          'Ritme yang tidak rata terasa belum selesai, dan membuat struktur halaman sulit dipindai.',
        evidenceNote: 'Histogram jarak di seluruh bagian halaman.',
      },
      'tap-targets': {
        title: 'Tombol ikon lebih kecil dari target sentuh minimum',
        description:
          'Tiga tautan ikon sosial berukuran 20×20px pada lebar seluler, di bawah minimum 24×24px.',
        whyItMatters:
          'Target kecil menyebabkan salah ketuk, terutama bagi pengguna dengan keterbatasan ketangkasan.',
        evidenceNote: 'Kotak batas terukur untuk setiap elemen interaktif.',
      },
      'nav-no-current': {
        title: 'Halaman aktif tidak ditandai di navigasi',
        description:
          'Navigasi kepala menampilkan semua item dengan gaya sama, tanpa status aktif untuk halaman yang sedang dibuka.',
        whyItMatters:
          'Tanpa penanda halaman aktif, pengunjung kehilangan posisi di dalam situs — terutama di halaman yang dalam.',
        evidenceNote: 'Perbandingan struktur status item navigasi.',
      },
      'overflow-mobile': {
        title: 'Tabel harga meluap horizontal di seluler',
        description:
          'Tabel perbandingan tiga kolom lebih lebar dari viewport 390px dan membuat seluruh halaman bergeser ke samping.',
        whyItMatters:
          'Gulir horizontal di ponsel menyembunyikan konten di luar layar dan membuat halaman terasa rusak.',
        evidenceNote: 'Perbandingan lebar antara kontainer dan viewport.',
      },
      'img-no-alt': {
        title: 'Gambar studi kasus tanpa alternatif teks',
        description:
          'Empat gambar mini proyek dirender sebagai gambar latar atau tanpa teks alternatif yang bermakna.',
        whyItMatters:
          'Pengguna pembaca layar tidak menerima apa pun di tempat pengguna lain melihat sebuah proyek — kontennya hilang begitu saja.',
        evidenceNote: 'Pemeriksaan markup elemen gambar dan alternatifnya.',
      },
      'focus-invisible': {
        title: 'Cincin fokus hilang di permukaan gelap',
        description:
          'Fokus keyboard digambar dengan nada yang sama dengan permukaan di belakangnya pada tautan di bagian gelap, sehingga tidak ada indikator yang terlihat.',
        whyItMatters:
          'Pengguna keyboard tidak tahu di mana posisi mereka, yang membuat halaman praktis tak terpakai tanpa tetikus.',
        evidenceNote: 'Perbandingan visual antara keadaan fokus dan tidak fokus.',
      },
      'button-inconsistent': {
        title: 'Dua gaya tombol untuk aksi yang sama',
        description:
          '"Lihat proyek" tampil sebagai pil terisi di bagian pendaratan dan sebagai tautan teks dengan panah di dalam kartu studi kasus.',
        whyItMatters:
          'Ketika aksi yang sama memakai dua bentuk berbeda, pengunjung ragu apakah keduanya melakukan hal yang sama.',
        evidenceNote: 'Perbandingan berdampingan antara dua perlakuan tombol tersebut.',
      },
    },

    recommendations: {
      'rec-contrast': {
        title: 'Naikkan teks sekunder ke nilai kontras terdekat yang lolos',
        explanation:
          'Warna teks isi hampir lolos: menaikkannya dua langkah pada tangga netral sudah melewati 4,5:1 tanpa mengubah karakter halaman.',
        improvement:
          'Sesuaikan token teks redup, bukan paragraf satu per satu, agar semua halaman mewarisi perbaikannya sekaligus.',
        benefit: 'Teks panjang menjadi nyaman dibaca dan terbaca bagi pengguna dengan penglihatan lemah.',
      },
      'rec-scale': {
        title: 'Sisipkan satu ukuran judul di antaranya',
        explanation:
          'Tambahkan satu langkah antara ukuran judul bagian dan ukuran teks isi, lalu terapkan ke semua sub-bagian.',
        improvement: 'Nyatakan skala sebagai token agar bagian baru tidak mengarang ukurannya sendiri.',
        benefit: 'Halaman terbaca sebagai satu dokumen dengan kerangka yang jelas.',
      },
      'rec-measure': {
        title: 'Batasi lebar baca teks pengantar',
        explanation:
          'Batasi kontainer teks pengantar pada sekitar 70 karakter dan biarkan grid di sekitarnya tetap selebar penuh.',
        improvement: 'Terapkan batas itu sebagai kontainer prosa bersama untuk setiap blok teks panjang.',
        benefit: 'Kecepatan membaca membaik dan paragraf tidak lagi terasa seperti dinding teks.',
      },
      'rec-rhythm': {
        title: 'Gunakan satu ritme vertikal',
        explanation:
          'Pilih satu celah antar bagian dan satu setengah langkah untuk blok terkait, lalu ganti tiga nilai yang ada sekarang.',
        improvement: 'Ambil jarak dari token spasi yang sudah ada, bukan nilai per bagian.',
        benefit: 'Halaman terasa disengaja, dan bagian baru otomatis konsisten.',
      },
      'rec-targets': {
        title: 'Perbesar target ikon sosial',
        explanation: 'Pertahankan ikon 20px, tetapi beri setiap tautan area sentuh 44px melalui padding.',
        improvement: 'Terapkan aturan ukuran minimum bersama untuk setiap kontrol khusus ikon.',
        benefit: 'Lebih sedikit salah ketuk, terutama bagi pengunjung dengan keterbatasan ketangkasan.',
      },
      'rec-current': {
        title: 'Tandai halaman aktif di navigasi',
        explanation:
          'Bandingkan rute aktif dengan setiap item navigasi dan beri gaya pada yang cocok, dengan status aktif yang aksesibel, bukan hanya warna.',
        improvement: 'Tambahkan `aria-current` bersama perubahan visual agar diumumkan sekaligus terlihat.',
        benefit: 'Pengunjung selalu tahu posisi mereka di dalam situs.',
      },
      'rec-overflow': {
        title: 'Biarkan tabel perbandingan menyesuaikan di bawah lebar tablet',
        explanation:
          'Susun kolom harga menjadi kartu di bawah 768px, atau biarkan tabel itu sendiri bergulir di dalam kontainer terbatas.',
        improvement: 'Batasi gulir pada tabel agar halaman tidak pernah bergeser ke samping.',
        benefit: 'Pengunjung seluler melihat semua paket tanpa kehilangan posisi.',
      },
      'rec-alt': {
        title: 'Beri setiap gambar proyek alternatif teks',
        explanation:
          'Jelaskan apa yang ditampilkan setiap gambar mini, atau tandai sebagai dekoratif bila teks di sekitarnya sudah membawa maknanya.',
        improvement: 'Periksa teks alternatif sebagai bagian dari alur konten, bukan di akhir.',
        benefit: 'Pengguna pembaca layar menerima konteks proyek yang sama dengan yang lain.',
      },
      'rec-focus': {
        title: 'Gambar cincin fokus yang bertahan di semua permukaan',
        explanation:
          'Gunakan cincin dua nada — garis dalam terang dengan tepi luar lebih gelap — sehingga tetap terlihat di bagian gelap maupun terang.',
        improvement: 'Terapkan secara global melalui satu aturan focus-visible.',
        benefit: 'Navigasi keyboard menjadi bisa dilacak di seluruh situs.',
      },
      'rec-buttons': {
        title: 'Satu perlakuan visual per aksi',
        explanation:
          'Putuskan apakah aksi utama berupa pil terisi atau tautan dengan panah, lalu hapus bentuk lainnya.',
        improvement: 'Dokumentasikan pilihan itu di samping komponen tombol agar bagian baru mewarisinya.',
        benefit: 'Pengunjung tidak lagi ragu apakah dua kontrol berbentuk berbeda melakukan hal yang sama.',
      },
    },

    categoryNotes: {
      visualConsistency:
        'Tombol dan label mengulang satu bahasa bentuk, tetapi aksi yang sama masih muncul dalam dua perlakuan.',
      typography:
        'Tipografi display membawa halaman ini dengan baik; lebar baca dan celah skala yang menahannya.',
      layout:
        'Grid bertahan di desktop, meski ritme vertikal dan tabel seluler perlu perhatian.',
      usability:
        'Navigasi sederhana dan singkat, tetapi tidak pernah memberi tahu posisi Anda, dan sebagian kontrol sulit dijangkau.',
      responsiveness:
        'Tata letak menyesuaikan dengan bersih di sebagian besar tempat; tabel perbandingan lebar adalah pengecualiannya.',
      accessibility:
        'Kontras dan visibilitas fokus adalah dua masalah yang paling mungkin menghalangi seseorang sepenuhnya.',
    },

    summary: {
      strengths: [
        'Suara editorial yang khas dan bertahan di setiap ukuran layar.',
        'Navigasi singkat, mudah ditebak, dan tanpa jalan buntu.',
        'Sistem kartu memakai sedikit permukaan secara konsisten.',
      ],
      improvements: [
        'Kontras teks sekunder dan lebar baca bertentangan dengan tipografi yang sebenarnya kuat.',
        'Tabel harga adalah satu-satunya tempat tata letak seluler benar-benar rusak.',
        'Fokus dan alternatif gambar adalah celah yang paling mungkin mengecualikan seseorang.',
      ],
      nextActions: [
        'Perbaiki kontras dan visibilitas fokus lebih dulu — keduanya murah dan membuka akses nyata.',
        'Lalu batasi tabel seluler, cacat seluler yang paling terlihat.',
        'Sisakan penyempurnaan skala dan ritme untuk satu langkah khusus.',
      ],
    },
  },
};
