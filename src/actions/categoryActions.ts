'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { put } from '@vercel/blob';

const cleanSlug = (slug: string) => {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = cleanSlug(formData.get('slug') as string);
  const iconFile = formData.get('icon') as File;

  let iconPath = '/tag.png'; // Default

  try {
    if (iconFile && iconFile.size > 0) {
      const filename = `${Date.now()}-${iconFile.name.replace(/\s+/g, '-')}`;
      const blob = await put(filename, iconFile, {
        access: 'public',
        storeId: process.env.BLOB_STORE_ID
      });
      iconPath = blob.url;
    }

    await prisma.category.create({
      data: { name, slug, icon: iconPath }
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create category.' };
  }
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const slug = cleanSlug(formData.get('slug') as string);
  const iconFile = formData.get('icon') as File;

  try {
    const data: any = { name, slug };

    if (iconFile && iconFile.size > 0) {
      const filename = `${Date.now()}-${iconFile.name.replace(/\s+/g, '-')}`;
      const blob = await put(filename, iconFile, {
        access: 'public',
        storeId: process.env.BLOB_STORE_ID
      });
      data.icon = blob.url;
    }

    await prisma.category.update({
      where: { id },
      data
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to update category.' };
  }
}

export async function deleteCategory(id: number) {
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      // Find or create "Uncategorized" category
      let uncategorized = await prisma.category.findUnique({
        where: { slug: 'uncategorized' }
      });

      if (!uncategorized) {
        uncategorized = await prisma.category.create({
          data: {
            name: 'Uncategorized',
            slug: 'uncategorized',
            icon: '/tag.png'
          }
        });
      }

      // Move all products to "Uncategorized"
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: uncategorized.id }
      });
    }

    await prisma.category.delete({
      where: { id }
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: 'Failed to delete category.' };
  }
}

