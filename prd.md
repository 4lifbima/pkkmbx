Berikut adalah **Brief, PRD (Product Requirement Document), dan Rencana Implementasi** untuk membangun website **PKKMB Teknik Informatika FT UNG** dengan desain modern, mewah, elegan, dan responsif, sesuai dengan referensi gambar yang diberikan, serta menggunakan **VueJS + TypeScript + Tailwind CSS**, **Iconify**, dan **Plus Jakarta Sans**.

---

## 📋 **1. Project Brief**

### Nama Proyek
Website PKKMB Teknik Informatika FT UNG

### Tujuan
Membangun website resmi untuk PKKMB Teknik Informatika FT UNG yang informatif, modern, dan representatif, guna menyambut mahasiswa baru dengan pengalaman digital yang profesional dan engaging.

### Target Audiens
- Mahasiswa baru Teknik Informatika
- Panitia PKKMB
- Dosen dan civitas akademika
- Publik umum

### Referensi Desain
Gaya seperti gambar yang diberikan:  
- Hero section dengan CTA "Start Free Trial" (disesuaikan konteks PKKMB)  
- Insight overview card  
- Statistik berbentuk chart  
- Logo partner / sponsor  
- Fitur-fitur dalam bentuk kartu  
- Footer dengan daftar menu

---

## 🎨 **2. Desain dan Branding**

### Warna Utama
- **Primary**: `#7B5AE6` (Ungu elegan)
- **Base / Background**: Putih (`#FFFFFF`)
- **Aksen**: Abu-abu terang (`#F5F7FA`) untuk background section
- **Teks Utama**: Hitam lembut (`#1A1F36`)
- **Teks Sekunder**: Abu-abu (`#4A5568`)

### Tipografi
- **Font Utama**: Plus Jakarta Sans (dari Google Fonts)
- Penggunaan weight: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

### Ikon
- Menggunakan **Iconify** dengan koleksi seperti `mdi`, `ph`, `heroicons`, dll.

---

## 🧱 **3. Struktur Halaman**

### Header
- Logo PKKMB / Teknik Informatika
- Navigasi: Beranda, Tentang, Agenda, Kontak
- Tombol "Login Panitia" (opsional)

### Hero Section
- Headline: **"Selamat Datang di PKKMB Teknik Informatika FT UNG"**
- Subheadline: "Membangun Generasi Digital yang Kreatif dan Inovatif"
- CTA: "Daftar Sekarang" (gaya seperti "Start Free Trial")
- Ilustrasi atau gambar suasana kampus

### Insight Overview
- Kartu informasi seperti:
  - Peserta Terdaftar: `320+`
  - Panitia: `45`
  - Kegiatan: `12`
  - Prodi: `1`

### Statistik / Chart
- Grafik sederhana (bisa pakai SVG atau chart library seperti Chart.js atau Recharts jika diperlukan)
- Contoh: Persentase peminat berdasarkan jalur masuk

### Trusted By / Partner
- Logo mitra: BEM, DPM, Himatif, Sponsor (jika ada)

### Fitur Unggulan (3 Kartu)
1. **Informasi Lengkap** – Semua info PKKMB dalam satu tempat
2. **Jadwal Terpadu** – Akses jadwal kegiatan dengan mudah
3. **Pengumuman Real-time** – Update terbaru langsung ke dashboard

### Tentang PKKMB
- Sejarah singkat, visi misi, atau sambutan ketua panitia
- Tombol "Pelajari Lebih Lanjut"

### Footer
- Navigasi cepat
- Kontak: Email, IG, TikTok
- Copyright

---

## ⚙️ **4. Tech Stack**

| Komponen       | Teknologi               |
|----------------|--------------------------|
| Framework      | Vue 3 (Composition API)  |
| Bahasa         | TypeScript               |
| Styling        | Tailwind CSS             |
| Ikon           | Iconify                  |
| Font           | Plus Jakarta Sans        |
| Routing        | Vue Router               |
| State Management | Pinia (jika perlu)     |
| Chart (opsional) | Chart.js atau Recharts |

---

## 📱 **5. Responsivitas**

- Mobile-first approach
- Breakpoints Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
- Navigasi mobile menggunakan hamburger menu
- Grid fleksibel untuk kartu dan layout

---

## 🗂️ **6. Struktur Folder (Vue + TypeScript)**

```
src/
├── assets/
│   └── images/
├── components/
│   ├── Header.vue
│   ├── Footer.vue
│   ├── HeroSection.vue
│   ├── InsightCard.vue
│   ├── StatisticChart.vue
│   ├── FeatureCard.vue
│   └── TrustedBrands.vue
├── views/
│   ├── HomeView.vue
│   ├── AboutView.vue
│   └── ContactView.vue
├── router/
│   └── index.ts
├── types/
│   └── index.ts
├── App.vue
├── main.ts
└── style.css (Tailwind)
```

---

## 🚀 **7. Fitur Tambahan (Opsional)**

- Animasi scroll (AOS atau Vue Transitions)
- Dark mode toggle (jika diperlukan)
- Form pendaftaran online
- Dashboard panitia (login protected)
- Countdown menuju hari H PKKMB

---

## ✅ **8. Deliverables**

- Source code Vue + TypeScript
- Dokumentasi singkat
- File README.md

---
