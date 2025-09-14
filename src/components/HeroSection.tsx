"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatusGrid from "@/components/StatusGrid";
import { ChevronDown, Github, Linkedin, Mail, Twitter, CalendarDays } from "lucide-react";

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);
  const [imgIndex, setImgIndex] = React.useState(0);

  // Helper to position orbiting icons
  function polar(radius: number, angleDeg: number) {
    const a = (angleDeg * Math.PI) / 180;
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
  }

  // Desktop: five icons around a circle, evenly spaced
  const desktopAngles = [-90, -18, 54, 126, 198];
  const desktopRadius = 140;
  const desktopPositions = desktopAngles.map((ang) => polar(desktopRadius, ang));

  // Mobile: compact vertical fan
  const mobilePositions = [
    { x: 0, y: -96 },
    { x: 0, y: -48 },
    { x: 0, y: 48 },
    { x: 0, y: 96 },
    { x: 0, y: 144 },
  ];

  const orbitLinks = [
    { href: "https://www.linkedin.com/in/jasoncharwin05", label: "LinkedIn", icon: <Linkedin /> },
    { href: "https://github.com/Thespaceblade", label: "GitHub", icon: <Github /> },
    { href: "mailto:jason.charwin360@gmail.com", label: "Email", icon: <Mail /> },
    { href: "#", label: "Twitter", icon: <Twitter /> },
    { href: "#", label: "Calendar", icon: <CalendarDays /> },
  ];

  // 2x larger bubbles, icons centered
  const iconBaseClasses =
    "flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface text-dark shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_90%,var(--primary)_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  // Rotating profile images (place in /public)
  const profileImages = React.useMemo(
    () => ["/profile-1.jpg", "/profile-2.jpg", "/profile-3.jpg", "/profile-4.jpg", "/profile-5.jpg"],
    []
  );

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setImgIndex((i) => (i + 1) % profileImages.length), 4000);
    return () => clearInterval(id);
  }, [profileImages.length, reduce]);

  return (
    <section aria-labelledby="hero-title" className="bg-[#0a1a2f] text-white">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen grid grid-cols-1 md:grid-cols-2"
        >
          {/* Left half: profile + orbit + text/CTAs */}
          <div className="flex items-center justify-center py-16">
            <div className="w-full max-w-xl text-center">
              {/* Profile + Orbit (centered) */}
              <div
                className="relative mx-auto grid h-96 w-96 place-items-center sm:h-[28rem] sm:w-[28rem]"
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
              >
                {/* Circular image with coin-flip */}
                <motion.div
                  style={{ transformPerspective: 800 }}
                  initial={{ rotateY: 0 }}
                  animate={hovered ? { rotateY: 180 } : { rotateY: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative h-72 w-72 overflow-hidden rounded-full border-2 border-dark shadow-lg sm:h-80 sm:w-80"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={profileImages[imgIndex]}
                      src={profileImages[imgIndex]}
                      alt="Jason Charwin profile"
                      className={`absolute inset-0 h-full w-full object-cover transition duration-300 ${
                        hovered ? "blur-[2px]" : "blur-0"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </AnimatePresence>
                  <div
                    className={`absolute inset-0 grid place-items-center transition-all duration-300 ${
                      hovered ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium text-surface transition-all duration-300 ${
                        hovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      }`}
                    >
                      Connect with me!
                    </span>
                  </div>
                </motion.div>

                {/* Orbit icons anchored at image center */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {/* Desktop: circular layout */}
                  <div className="hidden md:block">
                    {orbitLinks.map((l, i) => {
                      const target = desktopPositions[i];
                      return (
                        <motion.div
                          key={l.label}
                          className="absolute left-0 top-0"
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
                          animate={
                            hovered && !reduce
                              ? { x: target.x, y: target.y, opacity: 1, scale: 1 }
                              : { x: 0, y: 0, opacity: hovered ? 1 : 0, scale: 1 }
                          }
                          transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.6 }}
                          whileHover={{ scale: 1.06 }}
                        >
                          <a
                            href={l.href}
                            target={l.href.startsWith("http") ? "_blank" : undefined}
                            rel={l.href.startsWith("http") ? "noreferrer noopener" : undefined}
                            aria-label={l.label}
                            className={`${iconBaseClasses} pointer-events-auto -translate-x-1/2 -translate-y-1/2`}
                          >
                            <span aria-hidden className="h-8 w-8">{l.icon}</span>
                            <span className="sr-only">{l.label}</span>
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                  {/* Mobile: vertical fan */}
                  <div className="md:hidden">
                    {orbitLinks.map((l, i) => {
                      const target = mobilePositions[i];
                      return (
                        <motion.div
                          key={l.label}
                          className="absolute left-0 top-0"
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
                          animate={
                            hovered && !reduce
                              ? { x: target.x, y: target.y, opacity: 1, scale: 1 }
                              : { x: 0, y: 0, opacity: hovered ? 1 : 0, scale: 1 }
                          }
                          transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.6 }}
                          whileHover={{ scale: 1.06 }}
                        >
                          <a
                            href={l.href}
                            target={l.href.startsWith("http") ? "_blank" : undefined}
                            rel={l.href.startsWith("http") ? "noreferrer noopener" : undefined}
                            aria-label={l.label}
                            className={`${iconBaseClasses} pointer-events-auto -translate-x-1/2 -translate-y-1/2`}
                          >
                            <span aria-hidden className="h-8 w-8">{l.icon}</span>
                            <span className="sr-only">{l.label}</span>
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-center md:text-left">
                <h1 id="hero-title" className="font-display text-6xl sm:text-7xl font-bold tracking-tight">
                  Hi, I’m Jason.
                </h1>
                <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed mx-auto md:mx-0">
                  a student from north carolina
                </p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-7 pt-2">
                <Button asChild aria-label="Connect with Jason">
                  <a href="#connect">Connect</a>
                </Button>
                <Button variant="secondary" asChild aria-label="View highlights">
                  <a href="#highlights">Highlights</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right half: StatusGrid centered */}
          <div className="flex items-center justify-center py-16">
            <div className="w-full max-w-xl">
              <StatusGrid />
            </div>
          </div>
        </motion.div>

        {/* Chevron to Highlights */}
        <div className="mt-12 flex justify-center">
          <a
            href="#highlights"
            aria-label="Scroll to highlights"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-dark transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--primary)_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <ChevronDown className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
