import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AffiliateHub",
  description: "Learn how we protect your privacy and handle your data at AffiliateHub.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        <header className="mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block">Legal Protection</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
            Privacy <span className="text-blue-600">Policy.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Last Updated: May 2026</p>
        </header>

        <div className="prose prose-slate max-w-none space-y-12 text-slate-600 font-medium leading-loose">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">1. Introduction</h2>
            <p>
              Welcome to AffiliateHub. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">2. Data We Collect</h2>
            <p>
              We do not require users to create accounts to browse our recommendations. However, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Usage Data:</strong> Includes information about how you use our website, products and services.</li>
              <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">3. Affiliate Links & Cookies</h2>
            <p>
              AffiliateHub uses affiliate links. When you click on a link to a retailer (like Amazon or Flipkart), a cookie may be placed on your browser to track the referral. This allows us to earn a small commission at no extra cost to you.
            </p>
            <p>
              These cookies are managed by the respective affiliate networks and retailers. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">4. Third-Party Links</h2>
            <p>
              This website includes links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at <strong>privacy@affiliatehub.com</strong> or through our <a href="/contact" className="text-blue-600 underline">Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
