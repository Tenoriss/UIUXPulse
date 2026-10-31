/**
 * How It Works content, both languages.
 *
 * The page describes the intended workflow only. Nothing here claims that
 * scanning or scoring already runs — the status band says the opposite.
 */
export interface WorkflowStep {
  kicker: string;
  title: string;
  body: string;
  /** Short concrete detail, e.g. what the interface asks for. */
  detail: string;
}

export interface HowItWorksContent {
  eyebrow: string;
  title: string;
  lede: string;
  workflowLabel: string;
  workflowTitle: string;
  workflowLead: string;
  steps: WorkflowStep[];
  statusLabel: string;
  statusTitle: string;
  statusBody: string;
  liveNow: string;
  intended: string;
  liveItems: string[];
  intendedItems: string[];
  outputsLabel: string;
  outputsTitle: string;
  outputsLead: string;
  outputs: { title: string; body: string }[];
  rulesLabel: string;
  rulesTitle: string;
  rules: string[];
}

type Locale = 'en' | 'id';

export const howItWorksContent: Record<Locale, HowItWorksContent> = {
  en: {
    eyebrow: 'How it works',
    title: 'Eight steps, one quiet loop.',
    lede:
      'From a URL to a report your team can read in one sitting. Every step below describes the intended product workflow; the interface in this build shows the structure, not the automated analysis.',
    workflowLabel: 'Workflow',
    workflowTitle: 'The intended path.',
    workflowLead:
      'Ordered deliberately. Nothing runs before you have chosen what to evaluate and how.',
    steps: [
      {
        kicker: 'Account',
        title: 'Create an account or sign in',
        body: 'Your workspace holds every evaluation and report, so a review can be revisited months later instead of lost in a thread.',
        detail: 'Email and password. Registration stays optional until you start an evaluation.',
      },
      {
        kicker: 'Input',
        title: 'Submit a website URL',
        body: 'One property per evaluation keeps findings legible. The URL is treated as the reference point for every page you select next.',
        detail: 'The form asks for the origin, not a full path.',
      },
      {
        kicker: 'Scope',
        title: 'Select the pages to evaluate',
        body: 'Pick the screens that carry the experience — landing, pricing, onboarding, the flow that matters most to the business.',
        detail: 'A handful of pages reads better than an entire site.',
      },
      {
        kicker: 'Focus',
        title: 'Choose categories and viewport sizes',
        body: 'Decide which criteria matter for this review, and at which widths the pages should be considered: mobile, tablet, desktop.',
        detail: 'The six categories are documented on the evaluation criteria page.',
      },
      {
        kicker: 'Analysis',
        title: 'The system evaluates the selected pages',
        body: 'Each page is reviewed against the chosen categories at the chosen widths, and observations are collected into findings rather than a flat list of issues.',
        detail: 'Planned capability — not connected in this build.',
      },
      {
        kicker: 'Read',
        title: 'Review scores and findings',
        body: 'A score per category, and a finding for each observation, tied to the specific element and page it came from.',
        detail: 'Every finding carries its criteria, so a judgement can be challenged.',
      },
      {
        kicker: 'Act',
        title: 'Explore improvement recommendations',
        body: 'Suggestions written for the people who will do the work, ordered by what is worth doing first, with effort stated plainly.',
        detail: 'Proposals only. Nothing is applied to your site.',
      },
      {
        kicker: 'Share',
        title: 'Export the evaluation report',
        body: 'Take the report out of the tool and into the conversation your team is already having — in a format a reader can open without an account.',
        detail: 'Export is part of the intended workflow, not yet available.',
      },
    ],
    statusLabel: 'Status',
    statusTitle: 'Intended workflow, honest build.',
    statusBody:
      'This phase is the interface. Authentication is a frontend mock, and no website is crawled, scanned, or scored. The two lists below keep that distinction visible wherever the product is described.',
    liveNow: 'Available in this build',
    intended: 'Intended, not yet connected',
    liveItems: [
      'Public website, workspace, and admin shells in English and Indonesian',
      'The complete evaluation flow, laid out screen by screen',
      'Validation, empty states, and honest placeholder data throughout',
    ],
    intendedItems: [
      'Accounts and sessions',
      'Website scanning across selected pages and viewports',
      'Scoring, findings, evidence capture, and report export',
    ],
    outputsLabel: 'Output',
    outputsTitle: 'What comes back.',
    outputsLead:
      'The same four sections in every report, so that two reports can be compared honestly.',
    outputs: [
      {
        title: 'Scores',
        body: 'A signal per chosen category, presented with the criteria behind it rather than as a bare number.',
      },
      {
        title: 'Findings',
        body: 'Specific observations, each tied to one criterion, one element, and one page.',
      },
      {
        title: 'Evidence',
        body: 'A visual reference for what was observed, so the discussion is about the screen rather than about memory.',
      },
      {
        title: 'Recommendations',
        body: 'A suggested direction with effort stated, owned by your team and applied on your schedule — or not at all.',
      },
    ],
    rulesLabel: 'Boundaries',
    rulesTitle: 'What this workflow never does.',
    rules: [
      'It never modifies, restyles, or republishes the site being evaluated.',
      'It never presents an opinion as a measurement.',
      'It never scores a page it was not given permission to read.',
    ],
  },

  id: {
    eyebrow: 'Cara kerja',
    title: 'Delapan langkah, satu alur yang tenang.',
    lede:
      'Dari sebuah URL menjadi laporan yang bisa dibaca tim Anda dalam satu duduk. Semua langkah di bawah menggambarkan alur produk yang dituju; antarmuka pada build ini menampilkan strukturnya, bukan analisis otomatisnya.',
    workflowLabel: 'Alur kerja',
    workflowTitle: 'Jalur yang dituju.',
    workflowLead:
      'Urutannya disengaja. Tidak ada yang berjalan sebelum Anda menentukan apa yang dinilai dan pada ukuran layar apa.',
    steps: [
      {
        kicker: 'Akun',
        title: 'Buat akun atau masuk',
        body: 'Ruang kerja Anda menyimpan setiap evaluasi dan laporan, sehingga tinjauan bisa dibuka lagi berbulan-bulan kemudian alih-alih hilang di sebuah percakapan.',
        detail: 'Email dan kata sandi. Pendaftaran tetap opsional sampai Anda memulai evaluasi.',
      },
      {
        kicker: 'Masukan',
        title: 'Kirim URL situs',
        body: 'Satu properti per evaluasi membuat temuan tetap mudah dibaca. URL menjadi titik acuan untuk setiap halaman yang Anda pilih berikutnya.',
        detail: 'Formulir meminta alamat utama, bukan path lengkap.',
      },
      {
        kicker: 'Cakupan',
        title: 'Pilih halaman yang dievaluasi',
        body: 'Pilih layar yang membawa pengalaman utama — landing, harga, onboarding, alur yang paling penting bagi bisnis.',
        detail: 'Beberapa halaman terbaca lebih baik daripada seluruh situs.',
      },
      {
        kicker: 'Fokus',
        title: 'Tentukan kategori dan ukuran layar',
        body: 'Tentukan kriteria mana yang penting untuk tinjauan ini, dan pada lebar berapa halaman dinilai: ponsel, tablet, desktop.',
        detail: 'Enam kategori didokumentasikan di halaman kriteria evaluasi.',
      },
      {
        kicker: 'Analisis',
        title: 'Sistem mengevaluasi halaman terpilih',
        body: 'Setiap halaman ditinjau terhadap kategori dan lebar layar yang dipilih, lalu pengamatan dikelompokkan menjadi temuan, bukan daftar masalah yang rata.',
        detail: 'Kemampuan yang direncanakan — belum tersambung di build ini.',
      },
      {
        kicker: 'Baca',
        title: 'Tinjau skor dan temuan',
        body: 'Satu skor per kategori, dan satu temuan untuk setiap pengamatan, melekat pada elemen dan halaman asalnya.',
        detail: 'Setiap temuan membawa kriterianya, sehingga penilaian bisa ditantang.',
      },
      {
        kicker: 'Tindak',
        title: 'Telusuri rekomendasi perbaikan',
        body: 'Saran yang ditulis untuk orang yang akan mengerjakannya, diurutkan berdasarkan apa yang layak dikerjakan lebih dulu, dengan perkiraan usaha yang jujur.',
        detail: 'Hanya usulan. Tidak ada yang diterapkan ke situs Anda.',
      },
      {
        kicker: 'Bagikan',
        title: 'Ekspor laporan evaluasi',
        body: 'Bawa laporan keluar dari alat ini dan masuk ke percakapan yang sudah berjalan di tim Anda — dalam format yang bisa dibuka pembaca tanpa akun.',
        detail: 'Ekspor bagian dari alur yang dituju, belum tersedia.',
      },
    ],
    statusLabel: 'Status',
    statusTitle: 'Alur yang dituju, build yang jujur.',
    statusBody:
      'Fase ini adalah antarmukanya. Autentikasi masih tiruan di sisi frontend, dan tidak ada situs yang dirayapi, dipindai, atau dinilai. Dua daftar di bawah menjaga perbedaan itu tetap terlihat di mana pun produk ini dijelaskan.',
    liveNow: 'Tersedia di build ini',
    intended: 'Dituju, belum tersambung',
    liveItems: [
      'Situs publik, ruang kerja, dan panel admin dalam bahasa Indonesia dan Inggris',
      'Alur evaluasi lengkap, tersusun layar demi layar',
      'Validasi, empty state, dan data contoh yang jujur di seluruh antarmuka',
    ],
    intendedItems: [
      'Akun dan sesi',
      'Pemindaian situs pada halaman dan ukuran layar terpilih',
      'Penilaian, temuan, pengambilan bukti, dan ekspor laporan',
    ],
    outputsLabel: 'Keluaran',
    outputsTitle: 'Apa yang Anda terima.',
    outputsLead:
      'Empat bagian yang sama di setiap laporan, sehingga dua laporan bisa dibandingkan secara adil.',
    outputs: [
      {
        title: 'Skor',
        body: 'Sinyal per kategori yang dipilih, disajikan bersama kriterianya, bukan sebagai angka telanjang.',
      },
      {
        title: 'Temuan',
        body: 'Pengamatan spesifik, masing-masing melekat pada satu kriteria, satu elemen, dan satu halaman.',
      },
      {
        title: 'Bukti',
        body: 'Rujukan visual atas apa yang teramati, supaya diskusi berjalan soal layarnya, bukan soal ingatan.',
      },
      {
        title: 'Rekomendasi',
        body: 'Arah yang disarankan beserta perkiraan usahanya, milik tim Anda dan dikerjakan sesuai jadwal Anda — atau tidak sama sekali.',
      },
    ],
    rulesLabel: 'Batas',
    rulesTitle: 'Yang tidak pernah dilakukan alur ini.',
    rules: [
      'Tidak pernah mengubah, menata ulang gaya, atau menerbitkan ulang situs yang dievaluasi.',
      'Tidak pernah menyajikan pendapat sebagai hasil pengukuran.',
      'Tidak pernah menilai halaman yang tidak diizinkan untuk dibaca.',
    ],
  },
};
