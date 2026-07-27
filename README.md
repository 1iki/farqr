# FARQR - Free QR Code Generator

**FARQR** adalah aplikasi web generator Kode QR yang kaya fitur, modern, dan gratis. Aplikasi ini dirancang sebagai duplikat (*clone*) dari situs web [GenQRCode.com](https://genqrcode.com/) dengan tampilan antarmuka premium, kustomisasi penuh, fitur multi-bahasa, serta mode Gelap (*Dark*) dan Terang (*Light*).

---

## 🚀 Fitur Utama

### 1. 12 Tipe Kode QR
- **URL**: Tautan situs web biasa.
- **Text**: Teks bebas atau catatan.
- **vCard**: Kartu kontak lengkap (Nama, HP, Telepon, Email, Perusahaan, Alamat, Website, Catatan).
- **Email**: Alamat email penerima, subjek, dan isi pesan (*mailto:*).
- **WhatsApp**: Tautan langsung ke nomor WhatsApp beserta pesan otomatis.
- **WiFi**: Konfigurasi koneksi jaringan WiFi (SSID, Password, Jenis Enkripsi WPA/WEP, Jaringan Tersembunyi).
- **Phone**: Nomor telepon untuk panggilan langsung (*tel:*).
- **SMS**: Pesan SMS otomatis ke nomor tujuan (*smsto:*).
- **Calendar**: Acara kalender VEVENT (Judul, Lokasi, Waktu Mulai/Selesai, Deskripsi).
- **Geolocation**: Koordinat peta (Latitude & Longitude).
- **Cryptocurrency**: Alamat dompet Bitcoin (BTC), Bitcoin Cash (BCH), Ethereum (ETH), atau Litecoin (LTC) beserta jumlah koin.
- **Social Media**: Tautan profil media sosial (Instagram, Facebook, LinkedIn, dll).

---

### 2. Kustomisasi Desain Lengkap
- **6 Bentuk Titik (Dot Shape)**: Square, Dots, Rounded, Extra-Rounded, Classy, Classy-Rounded.
- **5 Variasi Pola Sudut (Finder Pattern)**: Kombinasi bentuk luar dan titik tengah sudut QR.
- **Color Picker**: Pemilihan warna depan (*Foreground*) dan warna belakang (*Background*) secara bebas dengan kode Hex.
- **Upload Logo / Gambar**: Tambahkan logo bisnis atau ikon di tengah kode QR (dukungan Drag & Drop).
- **Tingkat Koreksi Kesalahan (Error Correction Level)**: Pilihan tingkat **L** (7%), **M** (15%), **Q** (25%), dan **H** (30%).
- **Ukuran Margin**: Pengaturan jarak border tepi QR (0 - 10).

---

### 3. Card Preview & Ekspor Format
- **Pratinjau Real-Time**: Hasil QR dapat langsung dilihat dan disesuaikan ukurannya secara dinamis.
- **Range Slider Ukuran Gambar**: Ubah resolusi hasil unduhan dari `100 x 100` piksel hingga `4000 x 4000` piksel.
- **Dukungan Format Unduhan**:
  - `PNG`, `SVG`, `JPEG`, `WEBP`, `PDF` (dengan tampilan A4 siap cetak).
  - Tombol pendukung format `EPS`, `TIFF`, `GIF`, `STL`, `3MF`, `OBJ`.
- **Sematkan Kode QR (Embed QR Code)**: Dapatkan tautan gambar langsung dan cuplikan kode HTML untuk disematkan pada situs web atau email.

---

### 4. Pengalaman Pengguna (UX)
- **Multi-Bahasa (i18n)**: 
  - Bahasa Default: **English (EN)** 🇬🇧.
  - Bahasa Kedua: **Bahasa Indonesia (ID)** 🇮🇩.
  - Pilihan bahasa tersimpan otomatis di `localStorage`.
- **Toggle Tema (Dark & Light Mode)**:
  - Mode Gelap (*Dark Mode*) bawaan dengan efek *glassmorphism* dan aksen gradien.
  - Mode Terang (*Light Mode*) dengan kontras bersih.
  - Pilihan tema tersimpan otomatis di `localStorage`.
- **Desain Responsif**: Tampilan optimal di desktop, tablet, dan smartphone.

---

## 📖 Panduan Pengguna (User Guide)

### Langkah 1: Pilih Tipe QR Code
1. Pada bagian atas halaman, klik salah satu **Tab Tipe QR** (contoh: *URL*, *WiFi*, atau *vCard*).
2. Isi formulir data yang sesuai di dalam panel **Data Input**.

### Langkah 2: Kustomisasi Desain (Opsional)
1. Buka panel **Design Customization**.
2. Pilih bentuk titik QR (*Dot Shape*) dan bentuk sudut (*Finder Pattern*).
3. Atur warna depan dan warna latar belakang menggunakan **Color Picker**.
4. (Opsional) Upload gambar logo milik Anda untuk diletakkan di tengah kode QR.
5. Atur tingkat *Error Correction* dan ukuran *Margin* sesuai kebutuhan.

### Langkah 3: Buat Kode QR
1. Klik tombol **Generate QR Code** / **Buat Kode QR**.
2. Pratinjau kode QR akan langsung muncul pada kartu pratinjau di sebelah kanan.

### Langkah 4: Unduh / Sematkan Kode QR
1. Gunakan slider **Image size** di bawah pratinjau untuk menyesuaikan resolusi gambar (misal: `1000 x 1000`).
2. Klik tombol format unduhan yang Anda inginkan (seperti **PNG**, **SVG**, **JPEG**, atau **PDF**).
3. Jika ingin menyematkan kode QR di situs web lain, klik tombol **Embed QR Code** untuk mendapatkan tautan & kode HTML embed.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5 & CSS3**: Menggunakan CSS Custom Properties (Tokens), Flexbox, CSS Grid, dan animasi mikro tanpa ketergantungan framework CSS berat.
- **JavaScript (ES6+ Vanilla)**: Arsitektur tanpa kerangka kerja JS eksternal yang rumit.
- **Bootstrap 5.3.6**: Dipakai untuk komponen Layout Grid, Modal, dan Navbar.
- **FontAwesome 6.5.2**: Ikon visual interaktif.
- **qr-code-styling**: Library rendering QR Code berbasis Canvas/SVG dengan dukungan bentuk kustom & logo overlay.
- **jsPDF**: Ekspor dokumen PDF berkualitas tinggi secara *client-side*.

---

## 📁 Struktur Proyek

```
FARQR/
├── index.html          # Halaman utama aplikasi web
├── css/
│   └── style.css       # Token warna, Dark/Light mode, layout & animasi
├── js/
│   ├── translations.js # Kamus bahasa i18n (English & Bahasa Indonesia)
│   └── app.js          # Logika generator QR, mesin i18n, & penukar tema
└── README.md           # Dokumentasi & panduan penggunaan
```

---

## 💻 Cara Menjalankan Proyek Secara Lokal

Aplikasi ini bersifat **100% Client-Side** dan tidak memerlukan dependensi backend atau proses *build*.

### Cara 1: Langsung Buka File HTML
Buka file `index.html` langsung menggunakan browser favorit Anda (Chrome, Firefox, Edge, Safari).

### Cara 2: Menjalankan Server Lokal (Opsional)
Menggunakan `npx serve` dari terminal:
```bash
# Jalankan di dalam folder FARQR
npx -y serve . -l 3000
```
Buka browser dan akses `http://localhost:3000`.

---

## 📄 Lisensi & Hak Cipta
* 'QR Code' adalah merek dagang terdaftar dari **DENSO WAVE INCORPORATED**.
* FARQR dikembangkan sebagai alat generator QR Code gratis yang dapat digunakan untuk kepentingan pribadi maupun komersial.
