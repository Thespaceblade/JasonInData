// components/Navbar.tsx
export default function Navbar() {
    return (
      <nav className="w-full flex items-center justify-between py-4 px-8 bg-white shadow-md">
        <h1 className="text-xl font-bold">Jason Charwin</h1>
        <div className="space-x-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/projects" className="hover:underline">Projects</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </nav>
    );
  }