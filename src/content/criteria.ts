/**
 * Criteria content.
 *
 * Deliberately separate from `locales/*.ts`: these are long-form bilingual
 * pieces with nested lists, which would make the flat dictionaries unreadable.
 * Same precedent as `content/guide.ts` — typed data, not interpolated strings.
 *
 * Honesty rule: nothing here describes a scoring formula or claims that the
 * analysis already runs. Every example is framed as a possibility.
 */
export type CriterionKey =
  | 'visualConsistency'
  | 'typography'
  | 'layout'
  | 'usability'
  | 'responsiveness'
  | 'accessibility';

export interface CriterionContent {
  /** Display name of the category. */
  name: string;
  /** One-line summary used on cards and in the index. */
  summary: string;
  /** What the evaluation looks at. */
  what: string;
  /** Why this category matters to the people using the site. */
  why: string;
  /** Problems a reviewer might observe. */
  problems: string[];
  /** Directions a recommendation might take. */
  recommendations: string[];
}

type Locale = 'en' | 'id';

export const criteriaContent: Record<Locale, Record<CriterionKey, CriterionContent>> = {
  en: {
    visualConsistency: {
      name: 'Visual Consistency',
      summary: 'Do the parts look like they belong to the same product?',
      what:
        'How colours, spacing, corner radii, borders, and elevation repeat across screens — and whether elements that behave the same way look the same way.',
      why:
        'Every inconsistency is a small decision your visitor has to make. When identical actions wear different clothes, people hesitate, trust drops, and the interface starts to feel assembled rather than designed.',
      problems: [
        'Two buttons that do the same thing but use different shapes or colours.',
        'Card corners, borders, and shadows that vary from one section to the next.',
        'A colour that appears in six slightly different shades across a flow.',
        'Icons drawn in mismatched weights, or filled icons mixed with outlines for the same meaning.',
      ],
      recommendations: [
        'Group repeated elements and describe the one visual rule they should share.',
        'Name the token that should drive a value, so the fix happens at the source rather than per screen.',
        'Show the inconsistent instances side by side, so the difference is obvious without explanation.',
      ],
    },
    typography: {
      name: 'Typography & Readability',
      summary: 'Can the words be read comfortably, at a glance and at length?',
      what:
        'Type scale, line length, line height, weight, contrast, alignment, and how well the hierarchy separates headings, body copy, labels, and captions.',
      why:
        'Text carries most of a product. When reading demands effort, visitors skim less carefully, miss the point, and abandon a page that was perfectly functional underneath.',
      problems: [
        'Body copy set at a size or line length that forces the eye to track back.',
        'Headings and body text that are too close in size to establish order.',
        'Long paragraphs in a light weight on a dark background.',
        'Uppercase paragraphs or very tight letter spacing that slow reading down.',
      ],
      recommendations: [
        'Suggest a short set of type sizes and state where each one belongs.',
        'Propose a line length and line height for the reading column.',
        'Reserve emphasis for the few words that genuinely deserve it.',
      ],
    },
    layout: {
      name: 'Layout & Spacing',
      summary: 'Does the page breathe, and does its structure read without words?',
      what:
        'Spacing rhythm, alignment, grid behaviour, grouping through proximity, use of white space, and whether related things sit together.',
      why:
        'Spacing is the cheapest way to communicate relationship. When everything is equally close to everything else, nothing looks related, and the visitor has to read the page instead of seeing it.',
      problems: [
        'Section padding that changes between two otherwise identical blocks.',
        'Labels drifting away from the fields they describe.',
        'Content that touches the edge of its container on one breakpoint only.',
        'A dense block with no clear entry point, because every element carries equal weight.',
      ],
      recommendations: [
        'Define one spacing rhythm and point out where the current page steps outside it.',
        'Regroup content by proximity so the structure survives without decoration.',
        'Introduce a clear opening pause at the top of each section.',
      ],
    },
    usability: {
      name: 'Navigation & Usability',
      summary: 'Can someone find their way without being told how?',
      what:
        'Menu structure, active and current states, link wording, feedback after actions, form behaviour, and whether the interface explains itself at the moment it is needed.',
      why:
        'A beautiful page that hides its next step still fails. Usability is the difference between a visitor who finishes the task and one who quietly leaves without ever reporting a bug.',
      problems: [
        'A primary action that is visually weaker than a secondary one.',
        'Menu items whose labels mean the same thing in two different places.',
        'No visible state after an action, leaving the visitor unsure it happened.',
        'Error messages that appear far from the field that caused them.',
      ],
      recommendations: [
        'Reword a label so its destination is predictable before the click.',
        'Strengthen the one action the page actually wants.',
        'Add immediate, local feedback at the point of action rather than at the top of the page.',
      ],
    },
    responsiveness: {
      name: 'Responsiveness',
      summary: 'Does it hold together from a phone to a wide monitor?',
      what:
        'Re-flow across viewport widths, touch target sizes, navigation behaviour on small screens, overflow, and whether content order still makes sense when columns collapse.',
      why:
        'A layout that only works on the designer’s monitor is a layout that fails for most visitors. Breakpoints are where quiet bugs live: clipped text, unreachable buttons, sideways scrolling.',
      problems: [
        'A row of controls that never wraps and forces horizontal scrolling.',
        'Touch targets below the recommended size for a thumb.',
        'A desktop menu that simply shrinks instead of adapting.',
        'Content that reorders on collapse and now reads out of sequence.',
      ],
      recommendations: [
        'Describe the intended behaviour at each width rather than prescribing a rewrite.',
        'Flag elements that need a larger hit area on touch devices.',
        'Point out where column collapse changes the reading order.',
      ],
    },
    accessibility: {
      name: 'Accessibility',
      summary: 'Can people with different abilities use this too?',
      what:
        'Text contrast, focus visibility, keyboard reachability, semantics and heading order, alternative text, motion, and label association — measured against recognised guidance such as WCAG 2.2 AA.',
      why:
        'Accessibility is not an extra audience; it is the same audience at a different moment. Someone using a keyboard, a screen reader, or a bright screen in daylight is not an edge case, and exclusion is usually invisible to the team that built the page.',
      problems: [
        'Muted text that falls below the minimum contrast ratio for body copy.',
        'Focus outlines removed for aesthetics, leaving keyboard users lost.',
        'Interactive elements built from non-semantic containers.',
        'Motion that keeps running and cannot be paused.',
      ],
      recommendations: [
        'Raise a colour to the nearest passing value and say which pairing fails.',
        'Restore a visible focus state that reads clearly against the surface.',
        'Pair a visual pattern with the semantic element that already does the job.',
      ],
    },
  },

  id: {
    visualConsistency: {
      name: 'Konsistensi Visual',
      summary: 'Apakah bagian-bagiannya terasa berasal dari produk yang sama?',
      what:
        'Bagaimana warna, jarak, sudut lengkung, garis, dan bayangan berulang di antarhalaman — dan apakah elemen yang berperilaku sama juga tampil sama.',
      why:
        'Setiap ketidakkonsistenan adalah keputusan kecil yang harus diambil pengunjung. Saat aksi yang sama tampil dengan baju berbeda, orang ragu, kepercayaan menurun, dan antarmuka mulai terasa dirakit, bukan dirancang.',
      problems: [
        'Dua tombol dengan fungsi sama tapi bentuk atau warnanya berbeda.',
        'Sudut, garis, dan bayangan kartu yang berubah dari satu bagian ke bagian lain.',
        'Satu warna yang muncul dalam enam nuansa yang sedikit berbeda di satu alur.',
        'Ikon dengan ketebalan garis tidak seragam, atau ikon solid bercampur outline untuk makna yang sama.',
      ],
      recommendations: [
        'Kelompokkan elemen berulang dan sebutkan satu aturan visual yang seharusnya dipakai bersama.',
        'Sebutkan token yang seharusnya mengatur nilai tersebut, agar perbaikan terjadi di sumber, bukan per halaman.',
        'Tampilkan contoh yang tidak konsisten berdampingan, supaya perbedaannya terlihat tanpa perlu dijelaskan.',
      ],
    },
    typography: {
      name: 'Tipografi & Keterbacaan',
      summary: 'Apakah teksnya nyaman dibaca, sekilas maupun dalam durasi lama?',
      what:
        'Skala tipografi, panjang baris, tinggi baris, ketebalan, kontras, perataan, dan seberapa jelas hierarki memisahkan judul, isi, label, serta keterangan.',
      why:
        'Teks membawa sebagian besar isi produk. Saat membaca butuh usaha, pengunjung menyimak lebih ceroboh, melewatkan inti, dan meninggalkan halaman yang sebenarnya berfungsi baik.',
      problems: [
        'Teks isi dengan ukuran atau panjang baris yang memaksa mata melompat balik.',
        'Judul dan isi yang ukurannya terlalu berdekatan sehingga urutan tidak terbaca.',
        'Paragraf panjang dengan ketebalan tipis di atas latar gelap.',
        'Paragraf huruf kapital semua, atau jarak huruf terlalu rapat, yang memperlambat membaca.',
      ],
      recommendations: [
        'Usulkan set ukuran teks yang ringkas dan sebutkan di mana masing-masing dipakai.',
        'Sarankan panjang baris dan tinggi baris untuk kolom baca.',
        'Simpan penekanan hanya untuk beberapa kata yang benar-benar layak ditonjolkan.',
      ],
    },
    layout: {
      name: 'Tata Letak & Jarak',
      summary: 'Apakah halaman terasa lapang, dan strukturnya terbaca tanpa kata?',
      what:
        'Ritme jarak, perataan, perilaku grid, pengelompokan lewat kedekatan, penggunaan ruang kosong, dan apakah hal yang berkaitan diletakkan berdekatan.',
      why:
        'Jarak adalah cara termurah untuk menyatakan hubungan. Saat semua elemen sama dekatnya dengan semua elemen lain, tidak ada yang terlihat berhubungan, dan pengunjung harus membaca halaman alih-alih melihatnya.',
      problems: [
        'Jarak antarbagian yang berubah pada dua blok yang seharusnya identik.',
        'Label yang menjauh dari kolom isian yang dijelaskannya.',
        'Konten yang menempel ke tepi kontainer hanya di satu ukuran layar.',
        'Blok padat tanpa titik masuk yang jelas, karena semua elemen berbobot sama.',
      ],
      recommendations: [
        'Tetapkan satu ritme jarak dan tunjukkan di mana halaman saat ini keluar dari ritme itu.',
        'Susun ulang kelompok konten lewat kedekatan agar strukturnya tetap terbaca tanpa dekorasi.',
        'Tambahkan jeda pembuka yang jelas di awal setiap bagian.',
      ],
    },
    usability: {
      name: 'Navigasi & Kegunaan',
      summary: 'Apakah orang bisa menemukan jalannya tanpa harus diberi tahu?',
      what:
        'Struktur menu, status aktif dan posisi saat ini, pilihan kata pada tautan, umpan balik setelah aksi, perilaku formulir, dan apakah antarmuka menjelaskan dirinya tepat saat dibutuhkan.',
      why:
        'Halaman yang indah tapi menyembunyikan langkah berikutnya tetap gagal. Kegunaan adalah pembeda antara pengunjung yang menyelesaikan tugas dan yang diam-diam pergi tanpa pernah melaporkan masalah.',
      problems: [
        'Aksi utama yang secara visual lebih lemah daripada aksi sekunder.',
        'Item menu yang labelnya berarti hal sama di dua tempat berbeda.',
        'Tidak ada perubahan status setelah aksi, sehingga pengunjung ragu apakah berhasil.',
        'Pesan kesalahan yang muncul jauh dari kolom yang menyebabkannya.',
      ],
      recommendations: [
        'Rumuskan ulang label agar tujuannya bisa diperkirakan sebelum diklik.',
        'Perkuat satu aksi yang sebenarnya diinginkan halaman tersebut.',
        'Tambahkan umpan balik langsung di titik aksi, bukan di bagian atas halaman.',
      ],
    },
    responsiveness: {
      name: 'Responsivitas',
      summary: 'Apakah tetap utuh dari ponsel sampai monitor lebar?',
      what:
        'Alur ulang di berbagai lebar layar, ukuran area sentuh, perilaku navigasi di layar kecil, luapan konten, dan apakah urutan konten tetap masuk akal saat kolom menyempit.',
      why:
        'Tata letak yang hanya rapi di monitor perancang adalah tata letak yang gagal bagi sebagian besar pengunjung. Breakpoint adalah tempat bug senyap bersembunyi: teks terpotong, tombol tak terjangkau, gulir menyamping.',
      problems: [
        'Baris kontrol yang tidak pernah membungkus sehingga memaksa gulir horizontal.',
        'Area sentuh yang lebih kecil dari ukuran nyaman untuk jempol.',
        'Menu desktop yang hanya mengecil alih-alih menyesuaikan diri.',
        'Konten yang berubah urutan saat kolom menyempit sehingga urutan bacanya rusak.',
      ],
      recommendations: [
        'Jelaskan perilaku yang diinginkan di tiap lebar layar, bukan memerintahkan penulisan ulang.',
        'Tandai elemen yang perlu area sentuh lebih besar di perangkat sentuh.',
        'Tunjukkan di mana penyempitan kolom mengubah urutan baca.',
      ],
    },
    accessibility: {
      name: 'Aksesibilitas',
      summary: 'Apakah orang dengan kemampuan berbeda juga bisa memakainya?',
      what:
        'Kontras teks, visibilitas fokus, keterjangkauan lewat keyboard, semantik dan urutan judul, teks alternatif, gerak, serta keterkaitan label — diukur terhadap acuan yang diakui seperti WCAG 2.2 AA.',
      why:
        'Aksesibilitas bukan audiens tambahan; itu audiens yang sama di momen yang berbeda. Orang yang memakai keyboard, pembaca layar, atau layar terang di bawah sinar matahari bukan kasus pinggiran, dan pengucilan biasanya tak terlihat oleh tim yang membangun halaman.',
      problems: [
        'Teks redup dengan rasio kontras di bawah batas minimum untuk teks isi.',
        'Garis fokus dihilangkan demi estetika, sehingga pengguna keyboard kehilangan jejak.',
        'Elemen interaktif dibangun dari kontainer yang tidak semantik.',
        'Gerak yang terus berjalan dan tidak bisa dihentikan.',
      ],
      recommendations: [
        'Naikkan warna ke nilai lolos terdekat dan sebutkan pasangan warna mana yang gagal.',
        'Kembalikan status fokus yang jelas terlihat di atas permukaannya.',
        'Pasangkan pola visual dengan elemen semantik yang memang sudah menjalankan fungsinya.',
      ],
    },
  },
};

/** Fixed order used by the index, the cards, and the admin criteria list. */
export const criterionOrder: CriterionKey[] = [
  'visualConsistency',
  'typography',
  'layout',
  'usability',
  'responsiveness',
  'accessibility',
];
