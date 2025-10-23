"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Project = {
  title: string;
  description: string;
  href: string;
  image: string;
  label: string;
};

const projects: Project[] = [
  {
    title: "F1 Corner Analysis",
    description: "A chatbot supported web app for analyzing Formula 1 cornering data using AI.",
    href: "https://f1-corner-analysis.vercel.app",
    image: "/Logos/f1-navy.png",
    label: "Analytics",
  },
  {
    title: "Search for Second Earth",
    description: "Immersive exoplanet discovery interface charting candidates that resemble Earth, built with interactive data visualizations.",
    href: "https://secondearth.vercel.app",
    image: "/Logos/second-earth.png",
    label: "Data Viz",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      key={project.href}
      href={project.href}
      target={project.href.startsWith("http") ? "_blank" : undefined}
      rel={project.href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="group relative flex h-full w-[240px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-[0_20px_40px_-24px_rgba(12,18,32,0.3)] transition-transform duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef1f6] sm:w-[250px] lg:w-[260px]"
      whileHover={{ y: -10 }}
      whileTap={{ y: -2 }}
      aria-label={`Open ${project.title}`}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/50 opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-dark">
          {project.label}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-start gap-2 p-5">
        <h3 className="text-lg font-semibold text-dark">{project.title}</h3>
        <p className="text-sm text-dark/70">{project.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-500 group-hover:gap-2 group-hover:text-dark">
          Visit project
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </motion.a>
  );
}

export default function ProjectsSection() {
  return (
    <section
      aria-labelledby="projects-title"
      id="projects"
      className="relative overflow-hidden bg-[#eef1f6] text-dark py-20"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-3xl"
        animate={{ x: [0, 18, -12, 0], y: [0, 10, -14, 0], opacity: [0.7, 0.85, 0.65, 0.7] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-gradient-to-tr from-[#9aa6ff40] via-[#c5d1ff20] to-transparent blur-3xl"
        animate={{ x: [0, -24, 16, 0], y: [0, -10, 12, 0], opacity: [0.45, 0.65, 0.55, 0.45] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="projects-title"
            className="mb-6 font-display text-8xl font-extrabold text-center"
          >
            Projects
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-dark/70">
            An updated tracker of the experiments, dashboards, and tools I’m working on!
          </p>
        </div>

        <div className="mt-12 overflow-x-auto pb-4">
          <div className="flex gap-6 justify-center">
            {projects.map((project) => (
              <ProjectCard key={project.href} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
