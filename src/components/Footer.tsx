export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" className="py-10">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-dark/70">
        © {year} Jason Charwin. Built with Next.js, Tailwind, and shadcn/ui.
      </div>
    </footer>
  );
}

export default Footer;

