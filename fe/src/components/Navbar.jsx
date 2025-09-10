import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:glass">
      {/* jadikan relative agar anak absolute bisa anchor ke sini */}
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* brand */}
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">PO</span>
            <span className="leading-tight font-semibold">Perpustakaan Online</span>
          </Link>

          {/* desktop */}
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li><Link className="hover:text-indigo-600" to="/">Home</Link></li>
            <li><Link className="hover:text-indigo-600" to="/koleksi">Koleksi</Link></li>
            <li><Link className="hover:text-indigo-600" to="/about">About</Link></li>
          </ul>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Login</Link>
          </div>

          {/* toggle */}
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* overlay klik-luar (optional) */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/20"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* panel mobile: absolute/fixed supaya tidak menambah tinggi header */}
        <div
          id="mobile-menu"
          className={`md:hidden fixed left-0 right-0 top-16 z-50
                      transition-transform duration-200 ease-out
                      ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"}`}
        >
          <div className="mx-4 rounded-2xl border border-slate-200/60 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <ul className="flex flex-col gap-1 p-2 text-sm">
              <li><Link to="/" className="block rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">Home</Link></li>
              <li><Link to="/koleksi" className="block rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">Koleksi</Link></li>
              <li><Link to="/about" className="block rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">About</Link></li>
            </ul>
            <div className="p-2">
              <Link to="/login" className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
