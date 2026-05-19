'use server';

import prisma from "@/lib/prisma";

export async function getSearchSuggestions(query: string) {
  if (!query || query.trim().length < 2) return [];

  const searchTerm = query.trim().toLowerCase();

  try {
    // Search Products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      take: 4,
      select: {
        name: true,
        slug: true,
      },
    });

    // Search Blogs
    const blogs = await prisma.blogPost.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { excerpt: { contains: searchTerm } },
        ],
      },
      take: 3,
      select: {
        title: true,
        slug: true,
      },
    });

    // Search Categories
    const categories = await prisma.category.findMany({
      where: {
        name: { contains: searchTerm },
      },
      take: 2,
      select: {
        name: true,
        slug: true,
      },
    });

    const suggestions = [
      ...products.map(p => ({ type: 'product' as const, text: p.name, slug: p.slug })),
      ...blogs.map(b => ({ type: 'blog' as const, text: b.title, slug: b.slug })),
      ...categories.map(c => ({ type: 'category' as const, text: c.name, slug: c.slug })),
    ];

    return suggestions;
  } catch (error) {
    console.error("Search suggestions error:", error);
    return [];
  }
}
