import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AtomicHabitsImg from "../../public/assets/atomic-habits.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const nav = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/books`);
        const data = await res.json();
        if (!ignore) setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Gagal ambil buku:", e);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return books
      .filter(
        (b) =>
          (b.title || "").toLowerCase().includes(s) ||
          (b.main_author || "").toLowerCase().includes(s)
      )
      .slice(0, 8);
  }, [q, books]);

  // buku preview (kartu kanan) berubah mengikuti hasil teratas
  const featured = filtered[0] || null;
  const featuredCover = featured
    ? `${API_BASE}/assets/${featured.cover_file || "fallback.png"}`
    : AtomicHabitsImg;
  const featuredTitle = featured ? featured.title : "Atomic Habits";
  const featuredSubtitle = featured ? (featured.main_author || "Tidak diketahui") : "Favorit Minggu Ini";

  // klik di luar -> tutup suggestions
  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/koleksi?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const gotoBook = (id) => {
    setOpen(false);
    nav(`/books/${id}`);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter" && activeIdx >= 0 && filtered[activeIdx]) {
      e.preventDefault();
      gotoBook(filtered[activeIdx].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900/40 dark:to-slate-950"
        aria-label="Pengenalan"
      >
        <div className="min-h-screen items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-2 gap-10">
          {/* Kiri: teks + search */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Temukan Buku Favoritmu &{" "}
              <span className="text-indigo-600">Tingkatkan Literasi</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Akses ribuan koleksi buku digital secara gratis—koleksi, rekomendasi,
              hingga klub baca—semua dalam satu tempat.
            </p>

            <form
              className="mt-6"
              role="search"
              aria-label="Cari buku"
              onSubmit={submitSearch}
              ref={boxRef}
            >
              <div className="relative flex rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <input
                  id="searchInput"
                  type="search"
                  placeholder="Cari judul, penulis, atau ISBN…"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setOpen(true);
                    setActiveIdx(-1);
                  }}
                  onFocus={() => filtered.length && setOpen(true)}
                  onKeyDown={onKeyDown}
                  aria-expanded={open}
                  aria-controls="suggestions-list"
                  className="w-full rounded-xl px-3 py-2 outline-none placeholder:text-slate-400 bg-transparent"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700"
                >
                  Cari Buku Sekarang
                </button>
              </div>

              {/* Suggestions */}
              <div className="relative">
                <ul
                  id="suggestions-list"
                  className={`absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 ${
                    open && filtered.length ? "" : "hidden"
                  }`}
                  aria-live="polite"
                >
                  {filtered.map((b, i) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => gotoBook(b.id)}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          i === activeIdx ? "bg-slate-50 dark:bg-slate-800" : ""
                        }`}
                      >
                        <img
                          src={`${API_BASE}/assets/${b.cover_file || "fallback.png"}`}
                          alt=""
                          className="h-10 w-7 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{b.title}</p>
                          <p className="truncate text-xs text-slate-500">{b.main_author || "Tidak diketahui"}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                  {!filtered.length && q.trim() && (
                    <li className="px-3 py-2 text-sm text-slate-500">Tidak ada hasil…</li>
                  )}
                </ul>
              </div>
            </form>

            {/* Kategori cepat */}
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {["Fiksi","Nonfiksi","Sains","Sejarah","Pemrograman"].map((k) => (
                <Link
                  key={k}
                  to={`/koleksi?search=${encodeURIComponent(k)}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900"
                >
                  {k}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
                <dt className="text-xs text-slate-500">Koleksi</dt>
                <dd className="text-xl font-semibold">120K+</dd>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
                <dt className="text-xs text-slate-500">Anggota</dt>
                <dd className="text-xl font-semibold">24K</dd>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
                <dt className="text-xs text-slate-500">Kepuasan</dt>
                <dd className="text-xl font-semibold">98%</dd>
              </div>
            </dl>
          </div>

          {/* Kanan: kartu preview dinamis */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="rounded-[var(--radius)] overflow-hidden shadow-2xl w-65 border border-slate-200/60 dark:border-slate-800">
                <img
                  src={featuredCover}
                  alt={featured ? featured.title : "Rak buku perpustakaan yang rapi"}
                  className="h-[380px] w-100 object-cover rounded-2xl transition-opacity duration-200"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900">
                <p className="text-xs text-slate-500">{featured ? "Hasil teratas" : "Favorit Minggu Ini"}</p>
                <p className="text-sm font-semibold line-clamp-2">{featuredTitle}</p>
                {featured && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{featuredSubtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
