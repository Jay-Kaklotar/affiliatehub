import { Metadata } from "next";
import { Icons } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Us | AffiliateHub",
  description: "Have a question or a product recommendation? Reach out to the AffiliateHub team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        <header className="max-w-3xl mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
            Let&apos;s talk about <br />
            your next <span className="text-blue-600">setup upgrade.</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium leading-relaxed">
            Have a question about a product? Or maybe you want us to review something specific? We&apos;re all ears.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Contact Form */}
          <section className="lg:col-span-7">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900 shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                <select 
                  id="subject"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900 shadow-sm appearance-none"
                >
                  <option>Product Inquiry</option>
                  <option>Partnership Request</option>
                  <option>Report a Broken Link</option>
                  <option>General Feedback</option>
                </select>
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                <textarea 
                  id="message"
                  rows={6}
                  placeholder="How can we help you today?"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-[2rem] px-8 py-6 outline-none transition-all font-bold text-slate-900 shadow-sm resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                Send Message
              </button>
            </form>
          </section>

          {/* Contact Sidebar */}
          <aside className="lg:col-span-5 space-y-12">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
              <h3 className="text-xl font-black tracking-tighter mb-8 uppercase">Direct Contact</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Icons.HomeOffice className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Us</div>
                    <div className="text-lg font-bold">hello@affiliatehub.com</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Icons.Star className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Social Media</div>
                    <div className="text-lg font-bold">@affiliatehub_deals</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5">
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  We typically respond within 24-48 hours. For urgent link reports, please use the &quot;Report a Broken Link&quot; subject.
                </p>
              </div>
            </div>

            <div className="p-10 border border-slate-100 rounded-[2.5rem]">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6">Our Mission</h4>
              <p className="text-slate-500 text-sm leading-loose font-medium">
                At AffiliateHub, our goal is to eliminate the guesswork from online shopping. We analyze hundreds of products so you don&apos;t have to.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
