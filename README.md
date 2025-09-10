# Perpustakaan Online

Monorepo aplikasi **Perpustakaan Online** (Full‑Stack) dengan struktur **FE** (Frontend) dan **BE** (Backend).

- **FE**: React + Vite + Tailwind + React Router
- **BE**: Node.js + Express + MySQL (mysql2 / pool)

> Catatan: `node_modules/` dan semua file `.env` **tidak** masuk repo (diabaikan lewat `.gitignore`). Siapkan **`.env.example`** di `FE/` dan `BE/` untuk dokumentasi variabel lingkungan.

---

## 📁 Struktur Proyek

```
perpus/
├─ FE/                      # Frontend (React + Vite + Tailwind)
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ assets/
│  │  └─ main.jsx / main.tsx
│  ├─ index.html
│  ├─ vite.config.(js|ts)
│  ├─ package.json
│  └─ .env.example         # contoh variabel env FE (tanpa nilai sensitif)
│
├─ BE/                      # Backend (Express + MySQL)
│  ├─ src/
│  │  ├─ app.js / server.js
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  └─ db.js             # konfigurasi mysql pool
│  ├─ package.json
│  └─ .env.example         # contoh variabel env BE (tanpa nilai sensitif)
│
├─ .gitignore
└─ README.md
```

---

## 🚀 Fitur Singkat

- Pencarian & daftar buku (judul/penulis)
- Halaman detail buku (`/books/:id`)
- API backend untuk data buku (list & detail)
- Konfigurasi siap untuk pengembangan lokal (Vite dev + Express dev)

---

## 🔧 Prasyarat

- **Node.js** v18+ (disarankan LTS)
- **MySQL** 8+ (atau kompatibel)
- **Git** dan akses **SSH** ke GitHub (disarankan)

---

## ⚙️ Konfigurasi Environment

### `FE/.env.example`
```bash
# URL dasar API. Saat dev biasanya:
VITE_API_BASE_URL=http://localhost:3000/api
```

### `BE/.env.example`
```bash
# Port server backend
PORT=3000

# Koneksi database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=perpus_db

# (opsional) CORS
CORS_ORIGIN=http://localhost:5173
```

> Buat file `.env` dari masing‑masing `.env.example` dan isi nilainya secara lokal. **Jangan commit `.env`** ke Git.

---

## 🗄️ Setup Database (Contoh Sederhana)

Contoh skema minimal untuk memulai:

```sql
CREATE DATABASE IF NOT EXISTS perpus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE perpus_db;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  cover_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- View yang umum dipakai di controller:
CREATE OR REPLACE VIEW v_books_overview AS
SELECT id, title, author, cover_url, created_at
FROM books;
```

> Di backend, controller contoh: `SELECT * FROM v_books_overview ORDER BY title;`

---

## ▶️ Menjalankan Proyek (Development)

### 1) Install dependencies
```bash
# Backend
cd BE
npm install

# Frontend
cd ../FE
npm install
```

### 2) Jalankan backend
```bash
cd BE
npm run dev     # jika pakai nodemon
# atau
npm start
```

### 3) Jalankan frontend (Vite)
```bash
cd FE
npm run dev     # default di http://localhost:5173
```

### 4) Konfigurasi CORS / Proxy
- **Opsi A – CORS di BE**: aktifkan CORS di backend (mis. `app.use(cors({ origin: process.env.CORS_ORIGIN }))`).
- **Opsi B – Proxy Vite**: arahkan `/api` ke backend di `vite.config.(js|ts)`:
```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```
Pastikan FE memanggil endpoint relatif `/api/...` agar proxy bekerja saat dev.

---

## 🌐 API (Ringkas)

Base URL saat dev: `http://localhost:3000/api`

### `GET /api/books`
Balikkan daftar buku (berdasar view `v_books_overview`), contoh respons:
```json
[
  { "id": 1, "title": "Atomic Habits", "author": "James Clear", "cover_url": null, "created_at": "2025-01-01T00:00:00Z" }
]
```

### `GET /api/books/:id`
Detail 1 buku.

> Tambahkan endpoint sesuai kebutuhan (POST/PUT/DELETE) dengan validasi dan error handling yang baik.

---

## 🧱 Pola Kode & Praktik Baik

**Backend (Express)**
- Struktur: `routes/`, `controllers/`, `db.js` (pool MySQL).
- Query terparametrisasi (`?`) untuk mencegah SQL injection.
- Middleware error handler & logging.
- Gunakan `dotenv` untuk baca `.env`.

**Frontend (React + Vite)**
- State lokal per komponen, pisahkan komponen presentasi & container bila kompleks.
- Gunakan `import.meta.env.VITE_*` untuk env FE.
- Tailwind untuk styling; jaga konsistensi class utilitas.

---

## 📦 .gitignore (Monorepo)

`.gitignore` di root (disarankan):
```gitignore
# Dependencies
**/node_modules/

# Environments
**/.env
**/.env.*
!**/.env.example

# Build & cache umum
**/dist/
**/build/
**/.cache/
**/coverage/

# Vite/Next (opsional)
FE/.next/
FE/out/
FE/dist/

# Logs
**/npm-debug.log*
**/yarn-error.log*
**/pnpm-debug.log*
.DS_Store
```

Jika terlanjur ke‑commit:
```bash
git rm -r --cached FE/node_modules BE/node_modules
git rm --cached FE/.env BE/.env
git commit -m "chore: stop tracking node_modules and .env"
git push
```

> Untuk menghapus jejak `.env` dari **riwayat**: gunakan `git filter-repo` atau BFG, lalu **rotate semua secret** yang pernah dipublikasikan.

---

## 🧪 Testing (opsional)

- Tambahkan Jest/Vitest untuk FE/BE sesuai kebutuhan.
- Contoh skrip:
```json
// package.json
"scripts": {
  "test": "vitest"
}
```

---

## 🛠️ Troubleshooting

- **CORS error**: pastikan `CORS_ORIGIN` di BE atau set proxy di Vite.
- **Koneksi DB gagal**: cek kredensial `.env` dan pastikan MySQL berjalan.
- **Push HTTP error**: gunakan **SSH** remote GitHub untuk stabilitas:
  ```bash
  git remote set-url origin git@github.com:USERNAME/NAMA_REPO.git
  ```

---

## 📮 Kontribusi

1. Fork → Buat branch fitur → Commit terstruktur (Conventional Commits)  
2. PR dengan deskripsi jelas (screenshots bila UI berubah)  
3. Sertakan perubahan skema DB/migrasi bila ada

---

## 📜 Lisensi

MIT — Silakan gunakan dan kembangkan sesuai kebutuhan.
