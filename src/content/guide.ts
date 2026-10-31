/**
 * Mascot guide content.
 *
 * Kept out of `locales/*.ts` on purpose: the guide needs user-controlled props
 * (`{action}`), and the dictionaries only interpolate `Record<string, string>`.
 *
 * Every route the product exposes has an entry here, in both languages, so the
 * guide can never fall back to a raw key.
 */
export interface GuideContent {
  /** Short name of the character, used in the bubble. */
  name: string;
  /** One-line explanation of what this page is for. */
  title: string;
  /** Two or three sentences, max one tip. */
  body: string;
  /** Optional call to action label; paired with `actionTo`. */
  action?: string;
  actionTo?: string;
}

export interface GuidePage extends GuideContent {
  /** Human-readable page name used in the aria-label. */
  page: string;
}

type Locale = 'en' | 'id';

export const guideContent: Record<Locale, Record<string, GuidePage>> = {
  en: {
    home: {
      name: 'Pip',
      page: 'Home',
      title: 'Here is what we do',
      body: 'Submit a website URL, pick the pages that matter, and get a calm read on usability, hierarchy, and craft. We only analyse — your site is never modified.',
      action: 'Start an evaluation',
      actionTo: '/start',
    },
    about: {
      name: 'Pip',
      page: 'About',
      title: 'Why this exists',
      body: 'UIUXPulse is an evaluation practice, not a redesign service. Read what it is for, what it refuses to do, and the four principles that decide the rest.',
    },
    criteria: {
      name: 'Pip',
      page: 'Evaluation criteria',
      title: 'Six things we look at',
      body: 'Each category explains what is checked, why it matters, and what a problem or a recommendation might look like. Examples only — no secret formula.',
    },
    start: {
      name: 'Pip',
      page: 'Start an evaluation',
      title: 'One step before the workspace',
      body: 'An evaluation needs a workspace so it can be revisited later. Sign in and you will be brought straight back to where you were headed.',
    },
    howItWorks: {
      name: 'Pip',
      page: 'How it works',
      title: 'Three quiet steps',
      body: 'Add a URL, choose the pages you want reviewed, then read the report. Nothing is installed and nothing is changed on your side.',
    },
    principles: {
      name: 'Pip',
      page: 'Principles',
      title: 'We read, we never rewrite',
      body: 'Every finding is an observation with evidence attached. A recommendation is a suggestion for your team to act on, never an automatic change.',
    },
    methodology: {
      name: 'Pip',
      page: 'Methodology',
      title: 'What a report contains',
      body: 'Composite scores, findings, visual evidence, and recommendations — the same four sections in every evaluation, so two reports can be compared honestly.',
    },
    signIn: {
      name: 'Pip',
      page: 'Sign in',
      title: 'Welcome back',
      body: 'Sign in to reach your evaluations and reports. This build keeps demo accounts in your browser only — register one first if you have not yet.',
    },
    register: {
      name: 'Pip',
      page: 'Create account',
      title: 'Set up in a minute',
      body: 'A name, an email, and a password are all we ask for. The account lives in this browser only — a demo session, not a real sign-up.',
    },
    forgotPassword: {
      name: 'Pip',
      page: 'Forgot password',
      title: 'Password reset',
      body: 'Enter the account email and we describe what a reset would do. No email is ever sent in this demo.',
    },
    resetPassword: {
      name: 'Pip',
      page: 'Reset password',
      title: 'Choose a new password',
      body: 'Set a new password for a demo account. Nothing is emailed and nothing is verified, but the new password really does replace the old one here.',
    },
    websites: {
      name: 'Pip',
      page: 'My websites',
      title: 'One record per site',
      body: 'Register a site once, then every evaluation and report for it stays together. Counts come from real records — nothing is simulated here.',
      action: 'Add a website',
      actionTo: '/app/websites/new',
    },
    websiteDetail: {
      name: 'Pip',
      page: 'Website',
      title: 'Everything about one site',
      body: 'Edit the name, address, or description, or start an evaluation from here. Deleting the site keeps its evaluation history.',
    },
    dashboard: {
      name: 'Pip',
      page: 'Dashboard',
      title: 'Your workspace',
      body: 'Evaluations and reports live here. The counters start at zero because no data is generated in this phase.',
      action: 'Open evaluations',
      actionTo: '/app/evaluations',
    },
    evaluations: {
      name: 'Pip',
      page: 'Evaluations',
      title: 'Your submissions',
      body: 'Every website you send us appears here with its selected pages. The new evaluation form captures a URL only — nothing is scanned yet.',
    },
    evaluationWizard: {
      name: 'Pip',
      page: 'New evaluation',
      title: 'Four steps, one configuration',
      body: 'Choose a website, pick up to ten of its pages, then the categories and viewports this evaluation should cover. Saving stores the configuration — nothing is scanned.',
    },
    evaluationDetail: {
      name: 'Pip',
      page: 'Evaluation',
      title: 'A saved configuration',
      body: 'This record holds the pages, categories, and viewports you chose. There are no findings or scores, because no analysis has run.',
    },
    evaluationResults: {
      name: 'Pip',
      page: 'Results',
      title: 'A demo of the results view',
      body: 'Everything on this page comes from a fixture set and is labelled as such. No website was analysed, and your saved evaluation record is untouched.',
    },
    evaluationReport: {
      name: 'Pip',
      page: 'Report',
      title: 'The document, ready to export',
      body: 'This preview mirrors the PDF exactly. A configuration report needs no analysis — the demo report adds scores and findings, and says so on every page.',
    },
    reports: {
      name: 'Pip',
      page: 'Reports',
      title: 'Finished evaluations',
      body: 'Completed reports arrive here with scores, evidence, and recommendations. Empty until the first evaluation finishes.',
    },
    settings: {
      name: 'Pip',
      page: 'Settings',
      title: 'Workspace preferences',
      body: 'The language switch here is live and applies immediately across the whole app. Other preferences arrive with the backend.',
    },
    admin: {
      name: 'Pip',
      page: 'Admin overview',
      title: 'Internal tools',
      body: 'This area is for the evaluation team: queue, reviewers, and criteria. Access control is a structural preview for now.',
    },
    adminQueue: {
      name: 'Pip',
      page: 'Review queue',
      title: 'Waiting for a reviewer',
      body: 'Submitted evaluations land here to be assigned. The queue is empty until submissions are enabled.',
    },
    adminUsers: {
      name: 'Pip',
      page: 'Users',
      title: 'People and access',
      body: 'Reviewers and client accounts will be listed here with their roles and permissions.',
    },
    adminCriteria: {
      name: 'Pip',
      page: 'Criteria',
      title: 'How we score',
      body: 'Scoring criteria, weights, and report templates are managed here. The skeleton shows the shape the editor will take.',
    },
    notFound: {
      name: 'Pip',
      page: 'Page not found',
      title: 'This page wandered off',
      body: 'The link may be outdated, or the page does not exist in this preview build.',
      action: 'Back to home',
      actionTo: '/',
    },
  },

  id: {
    home: {
      name: 'Pip',
      page: 'Beranda',
      title: 'Ini yang kami lakukan',
      body: 'Kirim URL situs, pilih halaman yang penting, lalu terima pembacaan tenang atas kegunaan, hierarki, dan kualitas detail. Kami hanya menganalisis — situs Anda tidak diubah.',
      action: 'Mulai evaluasi',
      actionTo: '/start',
    },
    about: {
      name: 'Pip',
      page: 'Tentang',
      title: 'Kenapa ini ada',
      body: 'UIUXPulse adalah praktik evaluasi, bukan layanan desain ulang. Baca tujuannya, batas yang dijaganya, dan empat prinsip yang menentukan sisanya.',
    },
    criteria: {
      name: 'Pip',
      page: 'Kriteria evaluasi',
      title: 'Enam hal yang kami periksa',
      body: 'Tiap kategori menjelaskan apa yang dinilai, kenapa penting, dan seperti apa potensi masalah maupun rekomendasinya. Hanya contoh — tanpa rumus rahasia.',
    },
    start: {
      name: 'Pip',
      page: 'Mulai evaluasi',
      title: 'Satu langkah sebelum ruang kerja',
      body: 'Evaluasi butuh ruang kerja agar bisa dibuka lagi nanti. Masuk dulu, lalu Anda dibawa kembali ke tujuan semula.',
    },
    howItWorks: {
      name: 'Pip',
      page: 'Cara kerja',
      title: 'Tiga langkah tenang',
      body: 'Tambahkan URL, pilih halaman yang ingin ditinjau, lalu baca laporannya. Tidak ada yang dipasang dan tidak ada yang berubah di sisi Anda.',
    },
    principles: {
      name: 'Pip',
      page: 'Prinsip',
      title: 'Kami membaca, bukan menulis ulang',
      body: 'Setiap temuan adalah observasi dengan bukti terlampir. Rekomendasi adalah saran untuk tim Anda kerjakan, bukan perubahan otomatis.',
    },
    methodology: {
      name: 'Pip',
      page: 'Metodologi',
      title: 'Isi sebuah laporan',
      body: 'Skor gabungan, temuan, bukti visual, dan rekomendasi — empat bagian yang sama di setiap evaluasi, agar dua laporan bisa dibandingkan dengan jujur.',
    },
    signIn: {
      name: 'Pip',
      page: 'Masuk',
      title: 'Selamat datang kembali',
      body: 'Masuk untuk membuka evaluasi dan laporan Anda. Build ini menyimpan akun demo di browser Anda saja — daftar dulu kalau belum punya.',
    },
    register: {
      name: 'Pip',
      page: 'Buat akun',
      title: 'Siap dalam satu menit',
      body: 'Nama, email, dan kata sandi sudah cukup. Akun ini hanya hidup di browser Anda — sesi demo, bukan pendaftaran sungguhan.',
    },
    forgotPassword: {
      name: 'Pip',
      page: 'Lupa kata sandi',
      title: 'Setel ulang kata sandi',
      body: 'Masukkan email akun dan kami jelaskan apa yang dilakukan proses reset. Tidak ada email yang dikirim di demo ini.',
    },
    resetPassword: {
      name: 'Pip',
      page: 'Setel ulang kata sandi',
      title: 'Pilih kata sandi baru',
      body: 'Tetapkan kata sandi baru untuk akun demo. Tidak ada email dan tidak ada verifikasi, tapi kata sandi barunya benar-benar menggantikan yang lama di sini.',
    },
    websites: {
      name: 'Pip',
      page: 'Situs web saya',
      title: 'Satu catatan per situs',
      body: 'Daftarkan situs sekali, lalu setiap evaluasi dan laporannya tetap terkumpul. Angkanya berasal dari data nyata — tidak ada yang disimulasikan.',
      action: 'Tambah situs web',
      actionTo: '/app/websites/new',
    },
    websiteDetail: {
      name: 'Pip',
      page: 'Situs web',
      title: 'Semua tentang satu situs',
      body: 'Edit nama, alamat, atau deskripsi, atau mulai evaluasi dari sini. Menghapus situs tetap menyimpan riwayat evaluasinya.',
    },
    dashboard: {
      name: 'Pip',
      page: 'Dasbor',
      title: 'Ruang kerja Anda',
      body: 'Evaluasi dan laporan tersimpan di sini. Penghitung mulai dari nol karena belum ada data yang dibuat pada tahap ini.',
      action: 'Buka evaluasi',
      actionTo: '/app/evaluations',
    },
    evaluations: {
      name: 'Pip',
      page: 'Evaluasi',
      title: 'Kiriman Anda',
      body: 'Setiap situs yang Anda kirim muncul di sini beserta halaman yang dipilih. Formulir evaluasi baru hanya menangkap URL — belum ada pemindaian.',
    },
    evaluationWizard: {
      name: 'Pip',
      page: 'Evaluasi baru',
      title: 'Empat langkah, satu konfigurasi',
      body: 'Pilih situs web, tentukan hingga sepuluh halamannya, lalu kategori dan viewport yang dicakup evaluasi ini. Menyimpan berarti menyimpan konfigurasi — tidak ada pemindaian.',
    },
    evaluationDetail: {
      name: 'Pip',
      page: 'Evaluasi',
      title: 'Konfigurasi tersimpan',
      body: 'Catatan ini menyimpan halaman, kategori, dan viewport yang Anda pilih. Tidak ada temuan atau skor, karena belum ada analisis yang berjalan.',
    },
    evaluationResults: {
      name: 'Pip',
      page: 'Hasil',
      title: 'Demo tampilan hasil',
      body: 'Semua isi halaman ini berasal dari data contoh dan diberi label demikian. Tidak ada situs yang dianalisis, dan catatan evaluasi Anda tidak berubah.',
    },
    evaluationReport: {
      name: 'Pip',
      page: 'Laporan',
      title: 'Dokumen siap diekspor',
      body: 'Pratinjau ini sama persis dengan PDF-nya. Laporan konfigurasi tidak butuh analisis — laporan demo menambahkan skor dan temuan, dan menyatakannya di setiap halaman.',
    },
    reports: {
      name: 'Pip',
      page: 'Laporan',
      title: 'Evaluasi yang selesai',
      body: 'Laporan selesai muncul di sini dengan skor, bukti, dan rekomendasi. Masih kosong sampai evaluasi pertama selesai.',
    },
    settings: {
      name: 'Pip',
      page: 'Pengaturan',
      title: 'Preferensi ruang kerja',
      body: 'Pilihan bahasa di sini langsung berlaku ke seluruh aplikasi. Preferensi lain menyusul bersama backend.',
    },
    admin: {
      name: 'Pip',
      page: 'Ringkasan admin',
      title: 'Perkakas internal',
      body: 'Area ini untuk tim evaluasi: antrean, peninjau, dan kriteria. Kontrol akses masih berupa pratinjau struktural.',
    },
    adminQueue: {
      name: 'Pip',
      page: 'Antrean tinjauan',
      title: 'Menunggu peninjau',
      body: 'Evaluasi yang dikirim masuk ke sini untuk ditugaskan. Antrean kosong sampai pengiriman diaktifkan.',
    },
    adminUsers: {
      name: 'Pip',
      page: 'Pengguna',
      title: 'Orang dan akses',
      body: 'Peninjau dan akun klien akan terdaftar di sini beserta peran dan izinnya.',
    },
    adminCriteria: {
      name: 'Pip',
      page: 'Kriteria',
      title: 'Cara kami menilai',
      body: 'Kriteria penilaian, bobot, dan templat laporan dikelola di sini. Kerangka ini menunjukkan bentuk editornya nanti.',
    },
    notFound: {
      name: 'Pip',
      page: 'Halaman tidak ditemukan',
      title: 'Halaman ini tersesat',
      body: 'Tautannya mungkin sudah usang, atau halaman ini belum ada di build pratinjau.',
      action: 'Kembali ke beranda',
      actionTo: '/',
    },
  },
};
