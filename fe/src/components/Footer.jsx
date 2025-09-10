const Footer = () => {
    return (
        <section className="bg-white-100 border-t border-slate-200/60 bg-white">
        <footer className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
    
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
   
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">PO</span>
            <p className="font-semibold">Perpustakaan Online</p>
          </div>
    

          <p className="text-sm text-slate-500">© 2025 Perpustakaan Online. All rights reserved.</p>
        </div>
      </footer>
    </section>
    )
}

export default Footer