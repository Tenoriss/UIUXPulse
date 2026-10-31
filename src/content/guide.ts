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
      body: 'Sign in to reach your evaluations and reports. Authentication is not connected in this preview, so the form only validates input.',
    },
    signUp: {
      name: 'Pip',
      page: 'Create account',
      title: 'Set up in a minute',
      body: 'An email and a password are all we ask for. Your workspace is where evaluations and reports collect.',
    },
    forgotPassword: {
      name: 'Pip',
      page: 'Forgot password',
      title: 'Password reset',
      body: 'Enter the email you signed up with. No reset email is actually sent while authentication is still a preview.',
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
      body: 'Masuk untuk membuka evaluasi dan laporan Anda. Autentikasi belum terhubung pada pratinjau ini, jadi formulir hanya memvalidasi masukan.',
    },
    signUp: {
      name: 'Pip',
      page: 'Buat akun',
      title: 'Siap dalam satu menit',
      body: 'Cukup email dan kata sandi. Ruang kerja Anda adalah tempat evaluasi dan laporan dikumpulkan.',
    },
    forgotPassword: {
      name: 'Pip',
      page: 'Lupa kata sandi',
      title: 'Setel ulang kata sandi',
      body: 'Masukkan email yang Anda pakai mendaftar. Tidak ada email setel ulang yang benar-benar dikirim selama autentikasi masih pratinjau.',
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
