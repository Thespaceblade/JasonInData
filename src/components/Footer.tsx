export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" className="py-10">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-dark/70">
        © {year} Made with ❤️ by Jason Charwin in Chapel Hill.
      </div>
    </footer>
  );
}

export default Footer;

