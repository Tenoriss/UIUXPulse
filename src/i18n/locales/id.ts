import type { Dictionary } from './en';

/**
 * Indonesian dictionary.
 * Typed as `Dictionary`, so a missing or mistyped key breaks the build.
 */
export const id: Dictionary = {
  meta: {
    localeName: 'Bahasa Indonesia',
  },

  common: {
    appName: 'UIUXPulse',
    tagline: 'Evaluasi UI/UX dengan ketelitian editorial',
    loading: 'Memuat',
    search: 'Cari',
    close: 'Tutup',
    cancel: 'Batal',
    confirm: 'Konfirmasi',
    save: 'Simpan',
    submit: 'Kirim',
    next: 'Berikutnya',
    back: 'Kembali',
    continue: 'Lanjutkan',
    comingSoon: 'Segera hadir',
    readOnly: 'Pratinjau baca-saja',
    or: 'atau',
    previewNotice: 'Build pratinjau — belum ada data nyata yang dimuat pada tahap ini.',
    optional: 'Opsional',
    required: 'Wajib',
    all: 'Semua',
    none: 'Tidak ada',
    skipToContent: 'Lompat ke konten',
    toggleTheme: 'Ganti tema',
    language: 'Bahasa',
    changeLanguage: 'Ubah bahasa',
    menu: 'Menu',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    more: 'Lainnya',
    soon: 'Segera',
    you: 'Anda',
  },

  nav: {
    home: 'Beranda',
    howItWorks: 'Cara kerja',
    principles: 'Prinsip',
    pricing: 'Harga',
    signIn: 'Masuk',
    signUp: 'Buat akun',
    dashboard: 'Dasbor',
  },

  developer: {
    eyebrow: 'Dibangun oleh',
    title: 'Dibuat oleh Satu Orang, Tanpa Kompromi.',
    lead: 'UIUXPulse dirancang dan dikembangkan sepenuhnya secara mandiri — mulai dari arsitektur frontend, desain sistem, hingga logika aplikasi. Setiap baris kode dan detail visual lahir dari satu tangan yang sama, memastikan konsistensi desain, kecepatan performa, dan pengalaman pengguna yang utuh tanpa celah.',
    purposeLabel: 'Tujuan',
    purpose:
      'UIUXPulse hadir untuk memberi tim produk sudut pandang kedua atas situs yang sudah mereka miliki: temuan yang jelas, bukti visual, dan rekomendasi yang bisa dikerjakan sendiri — tanpa pernah menyentuh atau mengubah situs yang dinilai.',
    github: 'GitHub',
    instagram: 'Instagram',
    githubNote: 'Kode sumber, riwayat commit, dan issue',
    instagramNote: 'Catatan proses dan suasana di balik layar',
    visit: 'Buka profil',
    backToTop: 'Kembali ke atas',
    madeWith: 'Dirancang dan dibangun di kamar kost',
  },

  footer: {
    description:
      'Praktik evaluasi independen untuk tim yang peduli pada rasa sebuah situs, bukan hanya tampilannya.',
    product: 'Produk',
    resources: 'Sumber daya',
    company: 'Perusahaan',
    methodology: 'Metodologi',
    documentation: 'Dokumentasi',
    changelog: 'Catatan rilis',
    about: 'Tentang',
    contact: 'Kontak',
    privacy: 'Privasi',
    terms: 'Ketentuan',
    rights: 'Seluruh hak dilindungi.',
    disclaimer:
      'UIUXPulse mengevaluasi dan memberi rekomendasi. Kami tidak pernah mengubah, mendesain ulang, atau menerbitkan perubahan pada situs yang kami tinjau.',
  },

  home: {
    available: 'Menerima evaluasi baru',
    heroLineOne: 'Evaluasi',
    heroLineTwo: 'Situs Web',
    heroAccent: 'dengan niat',
    heroEyebrow: 'Studio evaluasi UI/UX',
    heroTitle: 'Kejelasan untuk',
    heroTitleAccent: 'situs',
    heroTitleRest: 'yang sudah Anda miliki.',
    heroLead:
      'Kirim satu URL, pilih halaman yang penting, lalu terima pembacaan yang tenang dan terstruktur atas kegunaan, hierarki, dan kualitas detail — lengkap dengan bukti visual dan rekomendasi yang bisa Anda kerjakan sendiri.',
    heroPrimary: 'Mulai evaluasi',
    heroSecondary: 'Lihat cara kerjanya',
    heroMeta: 'Praktik evaluasi · Jakarta / jarak jauh',
    heroPortraitAlt: 'Maskot piksel UIUXPulse',
    heroSupport: 'Skor, bukti, dan rekomendasi — tanpa pernah mengubah situs Anda.',
    heroScroll: 'Bagian pilihan',
    indexLabel: 'Indeks laporan',
    heroNote: 'Tanpa memindai ruang privat. Tanpa mengubah situs Anda. Selamanya.',
    statsLabel: 'Sekilas',
    stats: {
      pages: { value: '06', label: 'Halaman dapat dipilih per evaluasi' },
      evidence: { value: '04', label: 'Bagian tetap di setiap laporan' },
      languages: { value: '02', label: 'Bahasa laporan, EN dan ID' },
    },
    marquee: 'Kegunaan · Hierarki · Tipografi · Aksesibilitas · Gerak · Kepercayaan',

    principlesEyebrow: 'Prinsip',
    principlesTitle: 'Kami membaca situs Anda. Kami tidak menulis ulang.',
    principlesLead:
      'Evaluasi adalah tindakan yang berbeda dari penulisan. Semua yang kami hasilkan adalah observasi, artefak, atau rekomendasi — bukan perubahan pada produk Anda.',
    principles: {
      observe: {
        title: 'Amati, jangan ubah',
        body: 'Situs yang ditinjau tetap apa adanya. Temuan dicatat sebagai bukti, tangkapan layar, dan anotasi di luar basis kode Anda.',
      },
      explain: {
        title: 'Jelaskan alasannya',
        body: 'Setiap skor membawa kriteria di baliknya, sehingga desainer bisa tidak setuju dan tetap memahaminya.',
      },
      prioritise: {
        title: 'Utamakan yang berdampak',
        body: 'Rekomendasi disusun menurut dampak dan usaha, agar perbaikan bisa diurutkan, bukan dikerjakan sekaligus.',
      },
    },

    flowEyebrow: 'Cara kerja',
    flowTitle: 'Tiga langkah tenang.',
    flowLead:
      'Jalur yang sengaja dibuat singkat, dari pengiriman hingga laporan yang bisa dibaca tim Anda dalam satu duduk.',
    flow: {
      submit: {
        title: 'Kirim URL',
        body: 'Tambahkan situs yang ingin ditinjau. Satu properti per evaluasi menjaga temuan tetap terbaca.',
      },
      select: {
        title: 'Pilih halaman',
        body: 'Pilih halaman yang membawa pengalaman — beranda, harga, orientasi, alur yang paling penting.',
      },
      receive: {
        title: 'Terima laporan',
        body: 'Skor, bukti, dan rekomendasi datang bersama, diurutkan berdasarkan apa yang perlu diperbaiki lebih dulu.',
      },
    },

    scopeEyebrow: 'Cakupan',
    scopeTitle: 'Isi laporan Pulse',
    scopeLead:
      'Bagian yang tetap, konsisten di setiap evaluasi, sehingga dua laporan bisa dibandingkan dengan jujur.',
    scope: {
      scores: { title: 'Skor gabungan', body: 'Sinyal keseluruhan dan per kriteria beserta bobotnya.' },
      findings: { title: 'Temuan', body: 'Observasi spesifik, masing-masing terikat pada kriteria dan halaman.' },
      evidence: { title: 'Bukti visual', body: 'Tangkapan beranotasi dari elemen yang sedang dibahas.' },
      recommendations: {
        title: 'Rekomendasi',
        body: 'Arah yang disarankan dengan dampak, usaha, dan pemilik yang jelas di pihak Anda.',
      },
    },

    ctaEyebrow: 'Mulai',
    ctaTitle: 'Mulai dari satu halaman.',
    ctaLead:
      'Evaluasi pertama biasanya yang paling kecil. Kirim satu halaman beranda dan lihat bagaimana laporannya terbaca.',
    ctaButton: 'Mulai evaluasi',
    ctaSecondary: 'Baca metodologi',
  },

  pricing: {
    monthly: 'Bulanan',
    annual: 'Tahunan',
    notice: 'Paket dan harga masih disusun. Tidak ada yang dapat dibeli pada pratinjau ini.',
  },

  auth: {
    eyebrow: 'Akun',
    signInTitle: 'Selamat datang kembali.',
    signInLead: 'Masuk untuk meninjau evaluasi dan laporan Anda.',
    signUpTitle: 'Buat akun Anda.',
    signUpLead: 'Siapkan ruang kerja untuk evaluasi Anda dalam waktu kurang dari satu menit.',
    email: 'Alamat email',
    emailPlaceholder: 'anda@studio.com',
    password: 'Kata sandi',
    passwordPlaceholder: 'Minimal 8 karakter',
    confirmPassword: 'Konfirmasi kata sandi',
    fullName: 'Nama lengkap',
    fullNamePlaceholder: 'Nadia Pratama',
    organization: 'Studio atau perusahaan',
    organizationPlaceholder: 'Opsional',
    remember: 'Biarkan saya tetap masuk',
    forgot: 'Lupa kata sandi?',
    signIn: 'Masuk',
    signUp: 'Buat akun',
    noAccount: 'Belum punya akun?',
    hasAccount: 'Sudah punya akun?',
    createOne: 'Buat sekarang',
    signInInstead: 'Masuk',
    terms: 'Dengan melanjutkan Anda menyetujui ketentuan evaluasi dan catatan privasi.',
    showPassword: 'Tampilkan kata sandi',
    hidePassword: 'Sembunyikan kata sandi',
    previewNotice:
      'Build pratinjau — autentikasi belum terhubung. Formulir ini hanya memvalidasi masukan.',
    asideTitle: 'Evaluasi adalah sudut pandang kedua, bukan tangan kedua.',
    asideBody:
      'Laporan ditulis untuk orang-orang yang akan mengerjakannya: desainer, engineer, dan pemilik peta jalan.',
  },

  dashboard: {
    nav: {
      overview: 'Ringkasan',
      evaluations: 'Evaluasi',
      reports: 'Laporan',
      settings: 'Pengaturan',
      admin: 'Admin',
    },
    workspace: 'Ruang kerja',
    greeting: 'Senang melihat Anda',
    greetingBody: 'Evaluasi dan laporan Anda tersimpan di sini.',
    newEvaluation: 'Evaluasi baru',
    overview: 'Ringkasan',
    recent: 'Evaluasi terbaru',
    recentEmptyTitle: 'Belum ada evaluasi',
    recentEmptyBody:
      'Kirim URL situs untuk memulai evaluasi pertama Anda. Laporan akan muncul di sini setelah evaluasi selesai.',
    recentEmptyAction: 'Kirim URL',
    activity: 'Aktivitas',
    activityEmptyTitle: 'Belum ada yang ditampilkan',
    activityEmptyBody: 'Tindakan pada evaluasi Anda akan dicatat di sini.',
    stats: {
      evaluations: 'Evaluasi',
      reports: 'Laporan',
      pages: 'Halaman ditinjau',
      pending: 'Menunggu tinjauan',
    },
    disclaimer:
      'UIUXPulse hanya menganalisis dan memberi rekomendasi. Situs yang dievaluasi tidak pernah diubah.',
    signOut: 'Keluar',
    urlLabel: 'URL situs web',
    urlPlaceholder: 'https://studio-aria.com',
    reportPreview: 'Isi sebuah laporan',
    settings: {
      title: 'Pengaturan',
      body: 'Preferensi ruang kerja, bahasa, dan bawaan laporan akan diatur di sini.',
    },
    evaluations: {
      title: 'Evaluasi',
      body: 'Setiap situs yang dikirim beserta halamannya akan terdaftar di sini setelah pengiriman diaktifkan.',
    },
    reports: {
      title: 'Laporan',
      body: 'Laporan yang selesai, skor, dan bukti akan dikumpulkan di sini.',
    },
  },

  admin: {
    nav: {
      overview: 'Ringkasan',
      queue: 'Antrean tinjauan',
      users: 'Pengguna',
      criteria: 'Kriteria',
      settings: 'Pengaturan',
    },
    title: 'Administrasi',
    subtitle: 'Perkakas internal untuk praktik evaluasi.',
    restricted: 'Area terbatas',
    restrictedBody:
      'Shell ini adalah pratinjau struktural. Kontrol akses belum diberlakukan sampai autentikasi terhubung.',
    metrics: {
      queue: 'Dalam antrean',
      active: 'Dikerjakan',
      published: 'Terbit',
      reviewers: 'Peninjau',
    },
    queueEmptyTitle: 'Antrean kosong',
    queueEmptyBody: 'Evaluasi yang dikirim akan muncul di sini untuk ditugaskan.',
    criteriaTitle: 'Set kriteria',
    criteriaBody:
      'Kriteria penilaian, bobot, dan templat laporan dikelola di sini pada tahap berikutnya.',
  },

  states: {
    loading: 'Memuat',
    loadingBody: 'Mengambil status terbaru dari tampilan ini.',
    emptyTitle: 'Belum ada apa pun di sini',
    emptyBody: 'Ketika ada yang bisa ditampilkan, itu akan muncul di ruang ini.',
    errorTitle: 'Ada yang gagal diam-diam',
    errorBody: 'Bagian ini tidak dapat dimuat. Coba lagi, atau lanjutkan ke tempat lain.',
    retry: 'Coba lagi',
    notFoundTitle: 'Halaman ini tersesat',
    notFoundBody:
      'Tautannya mungkin sudah usang, atau halaman ini belum ada di build pratinjau.',
    notFoundAction: 'Kembali ke beranda',
    forbiddenTitle: 'Tidak tersedia di sini',
    forbiddenBody: 'Anda tidak memiliki akses ke area ini pada pratinjau saat ini.',
  },

  validation: {
    required: 'Kolom ini wajib diisi.',
    email: 'Masukkan alamat email yang valid.',
    passwordMin: 'Gunakan minimal 8 karakter.',
    passwordMatch: 'Kata sandi tidak cocok.',
    url: 'Masukkan URL yang valid, termasuk https://',
  },

  toast: {
    dismiss: 'Tutup notifikasi',
    successTitle: 'Selesai',
    infoTitle: 'Perhatian',
    errorTitle: 'Terjadi kesalahan',
  },

  guide: {
    open: 'Pip menjelaskan: {page}',
    hide: 'Sembunyikan Pip',
    show: 'Tampilkan Pip',
  },

  modal: {
    close: 'Tutup dialog',
  },

  dropdown: {
    openMenu: 'Buka menu',
    noResults: 'Tidak ada hasil',
  },

  tabs: {
    label: 'Bagian',
  },

  pagination: {
    label: 'Navigasi halaman',
    previous: 'Sebelumnya',
    next: 'Berikutnya',
  },
};
