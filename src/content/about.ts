/**
 * About page content, both languages.
 *
 * No company history, no team, no testimonials, no invented numbers — the
 * product is a single-person practice and the copy stays honest about that.
 */
export interface PrincipleItem {
  title: string;
  body: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  lede: string;
  /** Short standfirst shown under the opener rule. */
  standfirst: string;
  sections: {
    whatLabel: string;
    whatTitle: string;
    whatBody: string[];
    purposeLabel: string;
    purposeTitle: string;
    purposeBody: string[];
    problemsLabel: string;
    problemsTitle: string;
    problemsLead: string;
    problems: PrincipleItem[];
    whyLabel: string;
    whyTitle: string;
    whyBody: string[];
  };
  principlesLabel: string;
  principlesTitle: string;
  principlesLead: string;
  principles: PrincipleItem[];
  /** Placement note shown in the honesty block. */
  status: {
    label: string;
    title: string;
    body: string;
  };
}

type Locale = 'en' | 'id';

export const aboutContent: Record<Locale, AboutContent> = {
  en: {
    eyebrow: 'About',
    title: 'A second pair of eyes, not a second pair of hands.',
    lede:
      'UIUXPulse is an evaluation practice for websites that already exist. It reads a site the way a careful reviewer would, then hands back what it found — with evidence your team can check and recommendations you decide what to do with.',
    standfirst:
      'No redesigns. No automatic edits. No published changes to your site.',
    sections: {
      whatLabel: 'What it is',
      whatTitle: 'An evaluation tool, deliberately on one side of the line.',
      whatBody: [
        'Most tools in this space drift toward making changes: generating a new section, restyling a page, publishing an improvement. UIUXPulse stops short of that on purpose. It analyses and it recommends, and then it gets out of the way.',
        'A review takes a website URL, a handful of pages you choose, and the criteria you care about. What comes back is structured: a score per category, specific findings tied to specific elements, visual evidence of what was observed, and recommendations written in plain language.',
      ],
      purposeLabel: 'Purpose',
      purposeTitle: 'To make the quality of an interface discussable.',
      purposeBody: [
        'Design debates stall because they are usually arguments about taste. A structured evaluation gives a team something shared to look at: here is what was measured, here is where it was observed, here is why it matters. You can disagree with a conclusion and still understand it.',
        'The platform exists for the people who will actually do the work — designers, engineers, and the person holding the roadmap — so that a conversation about improvement starts from evidence rather than from the loudest opinion in the room.',
      ],
      problemsLabel: 'Problems',
      problemsTitle: 'What it tries to fix.',
      problemsLead:
        'These are the recurring situations the product is built around. None of them are solved by a checklist handed to a team without context.',
      problems: [
        {
          title: 'Evaluations that read as verdicts',
          body: 'A score with no reasoning behind it cannot be acted on, argued with, or learned from. Findings without evidence feel like an opinion, and opinions get ignored.',
        },
        {
          title: 'Feedback that arrives without priority',
          body: 'A list of forty issues treats a broken navigation flow and a misaligned icon as equals. Teams then fix the easy ones and never reach the ones that matter.',
        },
        {
          title: 'Reviews that assume a rebuild',
          body: 'Much advice implies starting over. Most teams cannot start over — they have a live product, existing users, and a small window for changes that must count.',
        },
        {
          title: 'Improvements nobody can verify',
          body: 'When a change happens automatically, the reasoning behind it disappears. The team learns nothing, and the same problem returns with the next release.',
        },
      ],
      whyLabel: 'Why structure',
      whyTitle: 'Why structured evaluation matters.',
      whyBody: [
        'Unstructured review is a conversation. Structured evaluation is a record: the same criteria applied the same way to the same pages, so that two reviews can be compared and progress can be measured instead of remembered.',
        'Structure is also what makes a finding fair. When the criteria are published in advance, the judgement is open to challenge — and a judgement that can be challenged is one a team can trust.',
        'And structure protects the site being reviewed. A review that reports rather than mutates leaves your product exactly as your users know it, while your team decides what to change.',
      ],
    },
    principlesLabel: 'Principles',
    principlesTitle: 'Four rules that decide everything else.',
    principlesLead:
      'These are not values on a wall. Each one constrains what the product is allowed to do.',
    principles: [
      {
        title: 'Evidence over assumptions',
        body: 'Every finding points at something that can be seen: an element, a page, a viewport width. If it cannot be evidenced, it is not a finding — it is a hunch, and hunches stay out of the report.',
      },
      {
        title: 'Clarity over complexity',
        body: 'A report is written to be read once and understood. One clear sentence about what to change beats a metric nobody can interpret, and a shorter criteria set that is actually applied beats a longer one that is skimmed.',
      },
      {
        title: 'Recommendations without automatic changes',
        body: 'Nothing is ever modified, restyled, or published on a reviewed site. Recommendations are proposals that belong to your team, in your codebase, on your schedule.',
      },
      {
        title: 'Better experiences through informed decisions',
        body: 'The goal is not a higher score. The goal is a team that understands its own interface well enough to make the next decision — and the one after that — with confidence.',
      },
    ],
    status: {
      label: 'Current status',
      title: 'A frontend built in the open.',
      body: 'This build is the public website and workspace interface. Authentication, website scanning, and scoring are documented as the intended workflow but are not connected yet — the interface shows its structure honestly rather than inventing results.',
    },
  },

  id: {
    eyebrow: 'Tentang',
    title: 'Sudut pandang kedua, bukan tangan kedua.',
    lede:
      'UIUXPulse adalah praktik evaluasi untuk situs yang sudah ada. Ia membaca situs sebagaimana peninjau yang teliti membacanya, lalu mengembalikan temuannya — dengan bukti yang bisa tim Anda periksa dan rekomendasi yang keputusannya ada di tangan Anda.',
    standfirst:
      'Tanpa desain ulang. Tanpa perubahan otomatis. Tanpa menerbitkan apa pun ke situs Anda.',
    sections: {
      whatLabel: 'Apa ini',
      whatTitle: 'Alat evaluasi yang sengaja berhenti di satu sisi garis.',
      whatBody: [
        'Sebagian besar alat di ranah ini bergerak ke arah mengubah: membuat bagian baru, menata ulang gaya halaman, menerbitkan perbaikan. UIUXPulse sengaja berhenti sebelum itu. Ia menganalisis dan merekomendasikan, lalu mundur.',
        'Satu tinjauan menerima URL situs, beberapa halaman yang Anda pilih, dan kriteria yang Anda pedulikan. Yang kembali bersifat terstruktur: skor per kategori, temuan spesifik yang menempel pada elemen tertentu, bukti visual atas apa yang teramati, dan rekomendasi dalam bahasa yang bisa dipahami semua orang.',
      ],
      purposeLabel: 'Tujuan',
      purposeTitle: 'Membuat kualitas antarmuka bisa diperbincangkan.',
      purposeBody: [
        'Perdebatan desain sering berhenti karena isinya soal selera. Evaluasi terstruktur memberi tim sesuatu yang sama-sama bisa dilihat: ini yang diukur, ini tempat teramatinya, ini alasan pentingnya. Anda boleh tidak setuju dengan kesimpulannya dan tetap memahaminya.',
        'Platform ini dibuat untuk orang-orang yang akan mengerjakan sendiri perbaikannya — desainer, engineer, dan pemegang roadmap — sehingga percakapan tentang peningkatan dimulai dari bukti, bukan dari pendapat paling lantang di ruangan.',
      ],
      problemsLabel: 'Masalah',
      problemsTitle: 'Apa yang ingin diperbaiki.',
      problemsLead:
        'Ini situasi berulang yang menjadi dasar produk ini. Tidak satu pun selesai hanya dengan daftar periksa yang diberikan tanpa konteks.',
      problems: [
        {
          title: 'Evaluasi yang terasa seperti vonis',
          body: 'Skor tanpa penalaran tidak bisa dikerjakan, dibantah, atau dipelajari. Temuan tanpa bukti terasa seperti pendapat, dan pendapat cenderung diabaikan.',
        },
        {
          title: 'Masukan yang datang tanpa prioritas',
          body: 'Daftar berisi empat puluh masalah memperlakukan alur navigasi yang rusak dan ikon yang tidak lurus sebagai hal setara. Tim lalu mengerjakan yang mudah dan tidak pernah sampai ke yang penting.',
        },
        {
          title: 'Tinjauan yang mengasumsikan bongkar total',
          body: 'Banyak saran menyiratkan memulai dari nol. Padahal sebagian besar tim tidak bisa begitu — produk sudah berjalan, pengguna sudah ada, dan jendela untuk perubahan sempit sehingga harus tepat sasaran.',
        },
        {
          title: 'Perbaikan yang tak bisa ditelusuri',
          body: 'Saat perubahan terjadi otomatis, penalarannya hilang. Tim tidak belajar apa pun, dan masalah yang sama kembali pada rilis berikutnya.',
        },
      ],
      whyLabel: 'Kenapa terstruktur',
      whyTitle: 'Kenapa evaluasi terstruktur itu penting.',
      whyBody: [
        'Tinjauan tanpa struktur hanyalah percakapan. Evaluasi terstruktur adalah catatan: kriteria yang sama diterapkan dengan cara yang sama pada halaman yang sama, sehingga dua tinjauan bisa dibandingkan dan kemajuan bisa diukur, bukan sekadar diingat.',
        'Struktur juga yang membuat temuan adil. Ketika kriteria diumumkan lebih dulu, penilaian terbuka untuk ditantang — dan penilaian yang bisa ditantang adalah penilaian yang bisa dipercaya tim.',
        'Struktur juga melindungi situs yang ditinjau. Tinjauan yang melaporkan alih-alih mengubah meninggalkan produk Anda persis seperti yang dikenal pengguna, sementara tim Anda yang memutuskan apa yang perlu diubah.',
      ],
    },
    principlesLabel: 'Prinsip',
    principlesTitle: 'Empat aturan yang menentukan sisanya.',
    principlesLead:
      'Ini bukan nilai-nilai yang dipajang. Masing-masing membatasi apa yang boleh dilakukan produk.',
    principles: [
      {
        title: 'Bukti di atas asumsi',
        body: 'Setiap temuan menunjuk pada sesuatu yang bisa dilihat: elemen, halaman, lebar layar. Kalau tidak bisa dibuktikan, itu bukan temuan — itu dugaan, dan dugaan tidak masuk laporan.',
      },
      {
        title: 'Kejelasan di atas kerumitan',
        body: 'Laporan ditulis untuk dibaca sekali dan langsung dipahami. Satu kalimat jelas tentang apa yang perlu diubah lebih berguna daripada metrik yang tak bisa ditafsirkan, dan sedikit kriteria yang benar-benar diterapkan lebih baik daripada banyak kriteria yang hanya dipindai.',
      },
      {
        title: 'Rekomendasi tanpa perubahan otomatis',
        body: 'Tidak ada yang pernah diubah, ditata ulang, atau diterbitkan pada situs yang ditinjau. Rekomendasi adalah usulan milik tim Anda, di kode Anda, sesuai jadwal Anda.',
      },
      {
        title: 'Pengalaman lebih baik lewat keputusan yang terinformasi',
        body: 'Tujuannya bukan skor yang lebih tinggi. Tujuannya adalah tim yang memahami antarmukanya sendiri dengan cukup baik untuk mengambil keputusan berikutnya — dan keputusan sesudahnya — dengan yakin.',
      },
    ],
    status: {
      label: 'Status saat ini',
      title: 'Frontend yang dibangun terbuka.',
      body: 'Build ini adalah situs publik dan antarmuka ruang kerja. Autentikasi, pemindaian situs, dan penilaian sudah didokumentasikan sebagai alur yang dituju tetapi belum tersambung — antarmuka menampilkan strukturnya secara jujur alih-alih mengarang hasil.',
    },
  },
};
