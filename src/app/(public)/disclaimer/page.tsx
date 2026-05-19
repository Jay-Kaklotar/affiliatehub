import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclaimer | AffiliateHub",
  description: "Transparency is our core value. Read our full affiliate disclosure regarding our partnerships with Amazon and other retailers.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        <header className="mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block">Transparency First</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
            Affiliate <span className="text-blue-600">Disclaimer.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Last Updated: May 2026</p>
        </header>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-600 font-medium leading-loose">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">1. Amazon Associates Program</h2>
            <p className="font-bold text-slate-900">
              AffiliateHub is a participant in the Amazon Services LLC Associates Program.
            </p>
            <p>
              This is an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and its affiliated sites. As an Amazon Associate, we earn from qualifying purchases. This means that if you click on a link and buy a product, we receive a small commission at no extra cost to you.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">2. Other Affiliate Relationships</h2>
            <p>
              In addition to Amazon, we may also participate in affiliate programs with Flipkart, Meesho, and other retailers. The purpose is the same: to earn a small commission that helps us maintain and grow this platform while keeping the content free for you.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">3. Editorial Integrity</h2>
            <p>
              Our product recommendations are based on thorough research, user reviews, and technical specifications. While we earn commissions, this does not influence our editorial judgment. We only recommend products we truly believe offer value to our readers.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">4. Price & Availability</h2>
            <p>
              Prices and product availability are accurate as of the time of our latest check but are subject to change by the retailer. Any price and availability information displayed on the retailer&apos;s site at the time of purchase will apply.
            </p>
          </section>

          <footer className="pt-12 border-t border-slate-100">
            <p>
              Questions? Feel free to reach out via our <a href="/contact" className="text-blue-600 font-bold underline">Contact Page</a>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
