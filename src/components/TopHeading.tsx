import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function TopHeading() {
  return (
    <div className="w-full h-36 sm:h-44 md:h-48 flex items-start justify-center pt-3 sm:pt-4 px-6">
      <svg
        className="heading-svg w-full h-full"
        viewBox="0 0 1000 200"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="site-title"
      >
        <title id="site-title">Jason In Data</title>
        {/* Stroke pass for handwriting */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${greatVibes.className} heading-write-stroke`}
          style={{ fontSize: "min(12vw, 140px)" }}
        >
          Jason In Data
        </text>
        {/* Fill pass fades in */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${greatVibes.className} heading-write-fill`}
          style={{ fontSize: "min(12vw, 140px)" }}
        >
          Jason In Data
        </text>
      </svg>
    </div>
  );
}
