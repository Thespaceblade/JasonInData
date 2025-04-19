// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="w-full py-6 px-8 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Jason Charwin. All rights reserved.
      </footer>
    );
  }