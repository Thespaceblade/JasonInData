import NoteList from "@/components/NoteList";

const notes = {
  iAm: [
    "Data Science student at UNC Chapel Hill (Dean’s List, Fall 2024).",
    "Research presenter (AAAD Undergraduate Research Conference, 2025).",
    "Builder who ships in Next.js, Python/pandas, and Tailwind/shadcn.",
    "Worship leader & community volunteer; founder of a piano academy.",
  ],
  iBuilt: [
    "Wasting No Time: cross-country correlation analysis on child wasting (Data/ML project).",
    "Natural-language → SQL mini-backend with Python tool calls.",
    "Kaggle Brain Stroke CT dataset exploration (filtering & EDA with pandas).",
    "Home server with Tailscale; remote dev & self-hosted portfolio.",
  ],
  iHave: [
    "Case-comp semi-finalist (P&G Fabric Care, Top-20 of 45 teams).",
    "Led 16+ beginner piano students through Faber curriculum.",
    "Interned at various Data analytics & Data Science roles.",
    "Interests across AI/ML, data engineering, and usable design systems.",
  ],
};

export default function HighlightsSection() {
  return (
    <section aria-labelledby="highlights-title" id="highlights" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <h1 id="connect-title" className="mb-6 font-display text-8xl font-semibold text-center">
          Highlights
        </h1>
      </div>
      <NoteList title="I am" items={notes.iAm} />
      <NoteList title="I built" items={notes.iBuilt} />
      <NoteList title="I have" items={notes.iHave} />
    </section>
  );
}

