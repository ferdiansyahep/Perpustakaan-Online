import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// Kartu skeleton untuk state loading
const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col rounded-lg border border-slate-300/60 shadow overflow-hidden">
    <div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-11/12" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-8/12" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
    </div>
  </div>
);

const Koleksi = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBooks = useCallback(async (signal) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/books`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : data || []);
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Gagal ambil data buku:", err);
      setErrorMsg("Gagal memuat data. Periksa koneksi atau server API.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBooks(controller.signal);
    return () => controller.abort();
  }, [fetchBooks]);

  const filteredBooks = books.filter(
    (book) =>
      (book.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.main_author || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRetry = () => {
    const controller = new AbortController();
    fetchBooks(controller.signal);
    // tidak perlu simpan controllernya untuk retry satu kali
  };

  return (
    <div
      className="flex flex-col min-h-screen px-2 py-6 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900/40 dark:to-slate-950"
      aria-busy={status === "loading"}
      aria-live="polite"
    >
      {/* Search */}
      <div className="flex justify-center items-center">
        <div className="items-center justify-center mb-4 w-full sm:w-3/4 md:w-1/2">
          <input
            type="text"
            placeholder="Cari judul atau penulis…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Loading (skeleton) */}
      {status === "loading" && (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </section>
      )}

      {/* Error state + retry */}
      {status === "error" && (
        <div className="flex flex-col items-center text-center gap-3 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            <span className="font-medium">Tidak berhasil dimuat</span>
          </div>
          <p className="text-sm">{errorMsg}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Grid Buku */}
      {status === "success" && (
        <>
          {filteredBooks.length === 0 ? (
            <div className="col-span-full text-center text-slate-500">
              Tidak ada buku ditemukan…
            </div>
          ) : (
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
              {filteredBooks.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="block h-full">
                  <article className="flex flex-col h-full rounded-lg border border-slate-300/60 shadow hover:shadow-md overflow-hidden">
                    <img
                      src={`${API_BASE}/assets/${book.cover_file || "fallback.png"}`}
                      alt={book.title}
                      className="w-full aspect-[3/4] object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `${API_BASE}/assets/fallback.png`;
                      }}
                    />
                    <div className="flex flex-col gap-1 p-3 grow">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {book.main_author || "Tidak diketahui"}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-3">
                        {book.description || ""}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Koleksi;
