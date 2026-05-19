import prisma from '@/lib/prisma';
import { PenTool, Plus, Calendar, User, Edit3, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlogToggle from '@/components/Admin/BlogToggle';
import { DeleteBlogButton } from '@/components/Admin/DeleteBlogButton';

export default async function AdminBlogsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Content Management</span>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Blog Posts</h1>
        </div>
        <Link href="/admin/blogs/new" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
          <Plus size={18} />
          <span>Write Article</span>
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-[10px_16px]">Article</th>
              <th className="p-[10px_16px]">Category</th>
              <th className="p-[10px_16px]">Date</th>
              <th className="p-[10px_16px]">Status</th>
              <th className="p-[10px_16px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="group hover:bg-slate-50 transition-colors">
                <td className="p-[10px_16px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative">
                      <Image 
                        src={(post.image || '').trim()} 
                        alt="" 
                        fill
                        unoptimized
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">{post.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">by {post.author}</p>
                    </div>
                  </div>
                </td>
                <td className="p-[10px_16px]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{post.category}</span>
                </td>
                <td className="p-[10px_16px]">
                  <span className="text-xs font-bold text-slate-500">{post.date}</span>
                </td>
                <td className="p-[10px_16px]">
                  <BlogToggle id={post.id} isFeatured={Boolean(post.isFeatured)} />
                </td>
                <td className="p-[10px_16px]">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/blogs/${post.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <DeleteBlogButton id={post.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <PenTool size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No articles yet.</p>
            <Link href="/admin/blogs/new" className="text-blue-600 font-bold text-xs mt-4 inline-block hover:underline">Write your first article</Link>
          </div>
        )}
      </div>
    </div>
  );
}

