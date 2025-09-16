"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatusGrid from "@/components/StatusGrid";
import { Github, Linkedin, Mail, Instagram, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";

export type HeroSectionClientProps = {
  images: string[];
};

export default function HeroSectionClient({ images }: HeroSectionClientProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);
  const [imgIndex, setImgIndex] = React.useState(0);

  function polar(radius: number, angleDeg: number) {
    const a = (angleDeg * Math.PI) / 180;
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
  }

  const desktopAngles = [-90, -90 + 72, -90 + 144, -90 + 216, -90 + 288];
  const desktopRadius = 210;
  const desktopPositions = desktopAngles.map((ang) => polar(desktopRadius, ang));

  const mobilePositions = [
    { x: 0, y: -128 },
    { x: 0, y: -64 },
    { x: 0, y: 64 },
    { x: 0, y: 128 },
    { x: 0, y: 192 },
  ];

  const orbitLinks = [
    { href: "https://www.linkedin.com/in/jasoncharwin05", label: "LinkedIn", icon: <Linkedin /> },
    { href: "https://github.com/Thespaceblade", label: "GitHub", icon: <Github /> },
    { href: "mailto:charwin.jason@proton.me", label: "Email", icon: <Mail /> },
    { href: "https://www.instagram.com/jasoncharwin/", label: "Instagram", icon: <Instagram /> },
    { href: "#", label: "Calendar", icon: <CalendarDays /> },
  ];

  const iconBaseClasses =
    "flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-surface text-dark shadow-sm leading-none transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_90%,var(--primary)_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  const renderIcon = (node: React.ReactNode) => {
    if (React.isValidElement(node)) {
      return React.cloneElement(node as React.ReactElement<any>, {
        className: cn((node as any).props?.className, "block h-full w-full"),
        "aria-hidden": true,
        focusable: false,
      });
    }
    return node;
  };

  React.useEffect(() => {
    if (reduce || images.length <= 1) return;
    const id = setInterval(() => setImgIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length, reduce]);

  return (
    <section aria-labelledby="hero-title" className="bg-[#0a1a2f] text-white">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen grid grid-cols-1 md:grid-cols-2"
        >
          {/* Left half: Image + orbit + text */}
          <div className="flex items-center justify-center py-16">
            <div className="w-full max-w-xl text-center">
              <div
                className="relative mx-auto grid h-80 w-80 place-items-center sm:h-96 sm:w-96"
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
              >
                {/* Circular image (grayscale) with overlapping crossfade */}
                <div className="relative h-80 w-80 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-96 sm:w-96">
                  <AnimatePresence initial={false} mode="sync">
                    <motion.img
                      key={images[imgIndex]}
                      src={images[imgIndex]}
                      alt="Jason Charwin profile"
                      className={`absolute inset-0 h-full w-full object-cover grayscale transition duration-300 ${hovered ? "blur-[2px]" : "blur-0"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
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
                </div>

                {/* Orbit icons anchored at image center */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
                            <span aria-hidden className="block h-10 w-10">{renderIcon(l.icon)}</span>
                            <span className="sr-only">{l.label}</span>
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
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
                            <span aria-hidden className="block h-10 w-10">{renderIcon(l.icon)}</span>
                            <span className="sr-only">{l.label}</span>
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <h1 id="hero-title" className="mt-8 font-display text-6xl sm:text-7xl font-bold tracking-tight">Hi, I’m Jason.</h1>
              <p className="mx-auto max-w-2xl text-lg text-white/80">a student from north carolina</p>
              <div className="flex items-center justify-center gap-3 pt-2">
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
      </div>
    </section>
  );
}
