import fs from "node:fs/promises";
import path from "node:path";
import HeroSectionClient from "@/components/HeroSectionClient";

export default async function HeroSectionServer() {
  const publicDir = path.join(process.cwd(), "public");
  let images: string[] = [];
  try {
    const entries = await fs.readdir(publicDir, { withFileTypes: true });
    const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".JPG", ".JPEG", ".PNG", ".WEBP", ".GIF"]);
    images = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => exts.has(path.extname(n)))
      .filter((n) => !/^favicon|apple-touch-icon|og|opengraph|twitter|vercel/i.test(n))
      .map((n) => `/${encodeURIComponent(n).replace(/%2F/g, "/")}`);
  } catch {
    images = [];
  }

  if (images.length === 0) {
    images = ["/pfp%201.jpeg"]; // fallback
  }

  return <HeroSectionClient images={images} />;
}

