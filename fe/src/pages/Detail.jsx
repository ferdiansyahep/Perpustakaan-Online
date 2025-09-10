import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:3000";

const Detail = () => {
  const { id } = useParams(); // id = id buku dari DB
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [zoom, setZoom] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch detail buku
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/books/${id}`);
        const data = await res.json();
        if (res.ok) setBook(data);
        else setBook(null);
      } catch (e) {
        console.error("Gagal fetch detail:", e);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Fetch daftar semua buku (untuk prev/next)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE}/books`);
        const data = await res.json();
        setBooks(data || []);
      } catch (e) {
        console.error("Gagal fetch list buku:", e);
      }
    };
    fetchAll();
  }, []);

  const currentIndex = books.findIndex((b) => String(b.id) === String(id));
  const total = books.length;

  const goPrev = () => {
    if (!books.length) return;
    const prevIndex = (currentIndex - 1 + total) % total;
    navigate(`/books/${books[prevIndex].id}`);
    setZoom(false);
  };

  const goNext = () => {
    if (!books.length) return;
    const nextIndex = (currentIndex + 1) % total;
    navigate(`/books/${books[nextIndex].id}`);
    setZoom(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") navigate("/koleksi");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, total, books]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-600">Data buku tidak ditemukan.</p>
        <Link
          to="/koleksi"
          className="inline-block mt-4 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  const imgSrc = `${API_BASE}/assets/${book.cover_file || "fallback.png"}`;

  return (
    <>
      <header className="sticky top-0 z-10 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900/40 dark:to-slate-950 text-black">
        <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Detail Buku</h1>
          <Link
            to="/koleksi"
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Kembali ke Daftar
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <section className="grid md:grid-cols-2 gap-6">
          {/* Gambar */}
          <div className="bg-white/80 rounded-xl flex items-center justify-center p-3 overflow-hidden">
            <img
              src={imgSrc}
              alt={book.title}
              className={[
                "w-auto",
                zoom
                  ? "max-h-none h-[80vh] cursor-zoom-out"
                  : "max-h-[70vh] cursor-zoom-in",
                "object-contain select-none transition-all duration-200",
              ].join(" ")}
              onClick={() => setZoom((z) => !z)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${API_BASE}/assets/fallback.png`;
              }}
              draggable={false}
            />
          </div>

          {/* Detail */}
          <div>
            <h2 className="text-2xl font-semibold">{book.title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {book.main_author || "Tidak diketahui"}
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              {book.description || ""}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={imgSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                Buka gambar asli
              </a>
              <button
                onClick={() => setZoom((z) => !z)}
                className="text-sm px-2 py-1 border rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {zoom ? "Kecilkan" : "Perbesar"}
              </button>
            </div>

            {books.length > 1 && (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={goPrev}
                  className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  ‹ Prev
                </button>
                <button
                  onClick={goNext}
                  className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Next ›
                </button>
              </div>
            )}

            <p className="mt-3 text-xs text-slate-500">
              Gunakan ←/→ untuk pindah buku, Esc untuk kembali ke daftar.
            </p>
          </div>
        </section>

        {books.length > 0 && currentIndex >= 0 && (
          <div className="mt-6 text-center text-slate-500">
            {currentIndex + 1} / {total}
          </div>
        )}
      </main>
    </>
  );
};

export default Detail;
