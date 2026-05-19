import prisma from '@/lib/prisma';
import BlogForm from '@/components/Admin/BlogForm';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  
  if (isNaN(id)) {
    return notFound();
  }

  const post = await prisma.blogPost.findUnique({
    where: { id }
  });

  if (!post) {
    return notFound();
  }

  return (
    <div className="space-y-12">
      <header>
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Content Management</span>
        <h1 className="text-5xl font-black tracking-tight text-slate-900">Edit Article</h1>
        <p className="text-slate-400 mt-4 max-w-2xl font-medium text-lg">Modify your article content, metadata, or featured image.</p>
      </header>

      <BlogForm initialData={post} />
    </div>
  );
}
