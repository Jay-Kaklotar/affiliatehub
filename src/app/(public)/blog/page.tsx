import Link from "next/link";
import { getAllPosts } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Buying Guides & Gear Reviews | AffiliateHub",
  description: "Read our expert-curated buying guides to make smarter shopping decisions. Honest reviews of tech, home office, and lifestyle accessories.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        {/* Semantic Header */}
        <header className="max-w-3xl mb-20">
          <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Expert Insights & Hacks</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
            Read Before <br />
            <span className="text-blue-600 italic">You Buy.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
            Honest reviews, setup guides, and budget hacks. We do the research so you don&apos;t have to. Updated weekly.
          </p>
        </header>

        {/* Blog Grid with Semantic Articles */}
        <section aria-label="Latest buying guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 flex flex-col h-full"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={`Featured image for: ${post.title}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Guide</span>
                      <time dateTime={post.date} className="text-[10px] font-black uppercase tracking-widest text-slate-400">{post.date}</time>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-4 text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-8 line-clamp-3 font-medium text-sm">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-900">
                      <span>Read Full Guide</span>
                      <span className="group-hover:translate-x-2 transition-transform" aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
