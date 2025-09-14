import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

export default function ConnectFooterSection() {
  return (
    <section aria-labelledby="connect-title" id="connect" className="bg-[#0a1a2f] text-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <ConnectSection />
      </div>
      <div className="mt-8 text-sm text-white/70">
        <Footer />
      </div>
    </section>
  );
}
