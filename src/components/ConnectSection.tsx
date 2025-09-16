"use client";
import { motion } from "framer-motion";
import IconTile from "@/components/IconTile";
import { Github, Linkedin, Mail, Instagram, CalendarDays } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function ConnectSection() {
  return (
    <section aria-labelledby="connect-title" id="connect" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h1 id="connect-title" className="mb-6 font-display text-8xl font-extrabold text-center">
          Connect
        </h1>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mx-auto max-w-3xl flex flex-wrap justify-center gap-6"
        >
          <motion.div variants={item}>
            <IconTile
              href="https://github.com/Thespaceblade"
              icon={<Github className="h-6 w-6" />}
              label="GitHub"
              external
            />
          </motion.div>
          <motion.div variants={item}>
            <IconTile
              href="https://www.linkedin.com/in/jasoncharwin05"
              icon={<Linkedin className="h-6 w-6" />}
              label="LinkedIn"
              external
            />
          </motion.div>
          <motion.div variants={item}>
            <IconTile
              href="mailto:jason.charwin360@gmail.com"
              icon={<Mail className="h-6 w-6" />}
              label="Email"
            />
          </motion.div>
          <motion.div variants={item}>
            <IconTile
              href="https://www.instagram.com/jasoncharwin/"
              icon={<Instagram className="h-6 w-6" />}
              label="Instagram"
              external
            />
          </motion.div>
          <motion.div variants={item}>
            <IconTile href="#" icon={<CalendarDays className="h-6 w-6" />} label="Calendar" />
          </motion.div>
          {/* Tel omitted unless provided */}
        </motion.div>
      </div>
    </section>
  );
}

export default ConnectSection;
