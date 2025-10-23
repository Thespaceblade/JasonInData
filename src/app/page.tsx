import HeroSection from "@/components/HeroSectionServer";
import HighlightsSection from "@/components/HighlightsSection";
import ConnectFooterSection from "@/components/ConnectFooterSection";
import ProjectsSection from "@/components/ProjectsSection";

export default function Page() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <HighlightsSection />
      <ConnectFooterSection />
    </>
  );
}
