function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 dark:text-slate-300">
        <p>© 2026 Ecomus Store. Made for seamless shopping.</p>
        <div className="flex gap-4">
          <span>Fast delivery</span>
          <span>Secure checkout</span>
          <span>Friendly support</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
