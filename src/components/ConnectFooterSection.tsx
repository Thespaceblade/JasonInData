import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

export default function ConnectFooterSection() {
  return (
    <section aria-labelledby="connect-title" id="connect" className="bg-[#0a1a2f] text-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <ConnectSection />
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </section>
  );
}

