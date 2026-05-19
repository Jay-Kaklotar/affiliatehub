import { getAllPosts } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | AffiliateHub Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <nav className="mb-16">
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
            <span>←</span> Back to Guides
          </Link>
        </nav>

        <article>
          <header className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{post.category}</span>
              <time className="text-[9px] font-black uppercase tracking-widest text-slate-400">{post.date}</time>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-10 leading-[1.1] text-slate-900">
              {post.title}
            </h1>

            <p className="text-xl md:text-2xl font-medium text-slate-500 leading-relaxed mb-16 max-w-2xl border-l-4 border-blue-600 pl-8">
              {post.excerpt}
            </p>

            <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-slate-100 shadow-2xl relative bg-slate-50">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          <section className="blog-content prose max-w-none prose-slate prose-headings:text-slate-900 prose-headings:font-black">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl md:text-5xl font-black tracking-tighter mt-20 mb-8 text-slate-900" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl md:text-4xl font-black tracking-tighter mt-16 mb-6 text-slate-900" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl md:text-3xl font-black tracking-tighter mt-12 mb-4 text-slate-900" {...props} />,
                p: ({ node, ...props }) => {
                  const hasImage = node?.children?.some((child: any) => {
                    if (child.tagName === 'img') return true;
                    if (child.tagName === 'a' && child.children?.some((c: any) => c.tagName === 'img')) return true;
                    return false;
                  });
                  if (hasImage) {
                    return <div className="my-8">{props.children}</div>;
                  }
                  return <p className="text-lg leading-relaxed text-slate-600 mb-8 font-medium" {...props} />;
                },
                li: ({ node, ...props }) => <li className="text-lg text-slate-600 mb-2 font-medium" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-10 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-10 space-y-2" {...props} />,
                img: ({ node, ...props }) => (
                  <div className="my-16 rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50">
                    <img className="w-full object-cover" {...props} />
                  </div>
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 bg-slate-50 px-8 py-6 my-12 italic text-xl font-bold text-slate-800 rounded-r-2xl" {...props} />
                ),
                hr: () => <hr className="my-20 border-slate-100" />
              }}
            >
              {post.content}
            </ReactMarkdown>
          </section>

          <footer className="mt-32 pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center font-black text-white uppercase tracking-tighter">AH</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Written by</p>
                <p className="text-sm font-bold text-slate-900">{post.author}</p>
              </div>
            </div>

            <Link
              href="/shop"
              className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Shop Curated Gear
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}