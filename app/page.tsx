// app/page.tsx

export default function Home() {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Jason Charwin</h1>
        <h2 className="text-xl md:text-2xl text-gray-400 mb-6">Data Scientist • Developer • Creative Thinker</h2>
        <p className="max-w-xl text-gray-300 mb-8">
          I build meaningful, user-centric tools that solve real-world problems. Currently studying at UNC Chapel Hill.
        </p>
        <a
          href="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          View Projects
        </a>
      </main>
    );
  }