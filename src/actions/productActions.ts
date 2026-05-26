'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string || '';
  const rawSlug = formData.get('slug') as string || '';
  const slug = (rawSlug || name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const description = formData.get('description') as string || '';
  const price = Math.round(parseFloat(formData.get('price') as string) || 0);
  const rating = parseFloat(formData.get('rating') as string) || 0;
  const categoryId = parseInt(formData.get('categoryId') as string) || 0;
  
  const imagesStr = formData.get('images') as string || '';
  const images = imagesStr.split('\n').filter(i => i.trim() !== '');
  
  const featuresStr = formData.get('features') as string || '';
  const features = featuresStr.split('\n').filter(f => f.trim() !== '');

  const offersJson = formData.get('offers') as string || '[]';
  const isTrending = formData.get('isTrending') === 'true';
  const isDealOfTheWeek = formData.get('isDealOfTheWeek') === 'true';
  const offersData = JSON.parse(offersJson);

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        rating,
        categoryId,
        images,
        features,
        isTrending,
        isDealOfTheWeek,
        offers: {
          create: offersData.map((o: any) => ({
            platform: o.platform || 'Store',
            price: Math.round(parseFloat(o.price) || 0),
            affiliateLink: o.affiliateLink || '#',
            logo: o.logo || '/placeholder-logo-vectors.svg',
            label: o.label || '',
            isAvailable: o.isAvailable !== false,
          })),
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin/deals');
    revalidatePath('/shop');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Create Error:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get('name') as string || '';
  const slug = formData.get('slug') as string || '';
  const description = formData.get('description') as string || '';
  const price = Math.round(parseFloat(formData.get('price') as string) || 0);
  const rating = parseFloat(formData.get('rating') as string) || 0;
  const categoryId = parseInt(formData.get('categoryId') as string) || 0;
  
  const imagesStr = formData.get('images') as string || '';
  const images = imagesStr.split('\n').filter(i => i.trim() !== '');
  
  const featuresStr = formData.get('features') as string || '';
  const features = featuresStr.split('\n').filter(f => f.trim() !== '');

  const offersJson = formData.get('offers') as string || '[]';
  const isTrendingRaw = formData.get('isTrending');
  const isDealOfTheWeekRaw = formData.get('isDealOfTheWeek');
  const offersData = JSON.parse(offersJson);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        rating,
        categoryId,
        images,
        features,
        ...(isTrendingRaw !== null ? { isTrending: isTrendingRaw === 'true' } : {}),
        ...(isDealOfTheWeekRaw !== null ? { isDealOfTheWeek: isDealOfTheWeekRaw === 'true' } : {}),
        offers: {
          deleteMany: {},
          create: offersData.map((o: any) => ({
            platform: o.platform || 'Store',
            price: Math.round(parseFloat(o.price) || 0),
            affiliateLink: o.affiliateLink || '#',
            logo: o.logo || '/placeholder-logo-vectors.svg',
            label: o.label || '',
            isAvailable: o.isAvailable !== false,
          })),
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin/deals');
    revalidatePath(`/product/${slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Update Error Details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return { success: false, error: `Failed to update product: ${error.message}` };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.$executeRaw`DELETE FROM Offer WHERE productId = ${id}`;
    await prisma.$executeRaw`DELETE FROM Product WHERE id = ${id}`;
    
    revalidatePath('/admin/products');
    revalidatePath('/admin/deals');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function toggleTrending(id: number, status: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isTrending: status }
    });
    revalidatePath('/admin/deals');
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update trending status' };
  }
}

export async function toggleDealOfTheWeek(id: number, status: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isDealOfTheWeek: status }
    });
    revalidatePath('/admin/deals');
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update deal status' };
  }
}
