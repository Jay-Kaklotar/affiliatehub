'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createBlogPost(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const author = formData.get('author') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as string;
  const category = formData.get('category') as string;
  const excerpt = formData.get('excerpt') as string || (content ? content.substring(0, 150) + '...' : '');

  try {
    await prisma.blogPost.create({
      data: { 
        title, 
        slug, 
        excerpt, 
        content, 
        image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80', 
        category, 
        author: author || 'Admin',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    });
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Create Blog Error:', error);
    return { success: false, error: 'Failed to create blog post.' };
  }
}

export async function updateBlogPost(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const excerpt = formData.get('excerpt') as string || '';
  const content = formData.get('content') as string;
  const image = formData.get('image') as string;
  const category = formData.get('category') as string;
  const author = formData.get('author') as string;

  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        category,
        author: author || 'Admin',
      }
    });
    revalidatePath('/admin/blogs');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Update Blog Error:', error);
    return { success: false, error: 'Failed to update blog post.' };
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete blog post.' };
  }
}

export async function toggleBlogFeatured(id: number, status: boolean) {
  try {
    // Using Raw SQL as a fallback because of Prisma Client locking issues on Windows
    const statusInt = status ? 1 : 0;
    await prisma.$executeRawUnsafe(
      `UPDATE BlogPost SET isFeatured = ${statusInt} WHERE id = ${id}`
    );
    
    revalidatePath('/admin/blogs');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to update featured status' };
  }
}
