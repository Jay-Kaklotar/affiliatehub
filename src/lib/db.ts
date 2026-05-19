import prisma from "./prisma";

export async function getAllCategories(): Promise<any[]> {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

function parseProductData(p: any) {
  if (!p) return null;
  return {
    ...p,
    isTrending: Boolean(p.isTrending),
    isDealOfTheWeek: Boolean(p.isDealOfTheWeek),
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
  };
}

function parseOfferData(o: any) {
  if (!o) return null;
  return {
    ...o,
    isAvailable: Boolean(o.isAvailable ?? true),
    price: Number(o.price)
  };
}

export async function getAllProducts(): Promise<any[]> {
  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product ORDER BY createdAt DESC`;
  for (let p of products) {
    const offers: any[] = await prisma.$queryRaw`SELECT * FROM Offer WHERE productId = ${p.id}`;
    p.offers = offers.map(parseOfferData);
    const cat = await prisma.category.findUnique({ where: { id: p.categoryId } });
    p.category = cat;
    Object.assign(p, parseProductData(p));
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<any | null> {
  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product WHERE slug = ${slug} LIMIT 1`;
  if (products.length === 0) return null;
  const p = products[0];
  const offers: any[] = await prisma.$queryRaw`SELECT * FROM Offer WHERE productId = ${p.id}`;
  p.offers = offers.map(parseOfferData);
  const cat = await prisma.category.findUnique({ where: { id: p.categoryId } });
  p.category = cat;
  return parseProductData(p);
}

export async function getProductsByCategory(categorySlug: string): Promise<any[]> {
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return [];
  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product WHERE categoryId = ${category.id} ORDER BY createdAt DESC`;
  for (let p of products) {
    const offers: any[] = await prisma.$queryRaw`SELECT * FROM Offer WHERE productId = ${p.id}`;
    p.offers = offers.map(parseOfferData);
    p.category = category;
    Object.assign(p, parseProductData(p));
  }
  return products;
}

export async function getRelatedProductsByCategory(categorySlug: string, currentProductId: number): Promise<any[]> {
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return [];
  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product WHERE categoryId = ${category.id} AND id != ${currentProductId} LIMIT 4`;
  for (let p of products) {
    const offers: any[] = await prisma.$queryRaw`SELECT * FROM Offer WHERE productId = ${p.id}`;
    p.offers = offers.map(parseOfferData);
    p.category = category;
    Object.assign(p, parseProductData(p));
  }
  return products;
}

export async function getAllPosts(): Promise<any[]> {
  const posts: any[] = await prisma.$queryRaw`SELECT * FROM BlogPost ORDER BY createdAt DESC`;
  return posts.map(p => ({ ...p, isFeatured: Boolean(p.isFeatured) }));
}

export async function getLatestPosts(): Promise<any[]> {
  const posts: any[] = await prisma.$queryRaw`SELECT * FROM BlogPost WHERE isFeatured = 1 ORDER BY createdAt DESC`;
  return posts.map(p => ({ ...p, isFeatured: Boolean(p.isFeatured) }));
}

export async function getTrendingProducts(): Promise<any[]> {
  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product WHERE isTrending = 1 ORDER BY createdAt DESC`;
  for (let p of products) {
    const offers: any[] = await prisma.$queryRaw`SELECT * FROM Offer WHERE productId = ${p.id}`;
    p.offers = offers.map(parseOfferData);
    const cat = await prisma.category.findUnique({ where: { id: p.categoryId } });
    p.category = cat;
    Object.assign(p, parseProductData(p));
  }
  return products;
}

export async function getDealOfTheWeekProducts(): Promise<any[]> {
  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product WHERE isDealOfTheWeek = 1 ORDER BY createdAt DESC`;
  for (let p of products) {
    const offers: any[] = await prisma.$queryRaw`SELECT * FROM Offer WHERE productId = ${p.id}`;
    p.offers = offers.map(parseOfferData);
    const cat = await prisma.category.findUnique({ where: { id: p.categoryId } });
    p.category = cat;
    Object.assign(p, parseProductData(p));
  }
  return products;
}

export async function getAllPlatforms(): Promise<any[]> {
  return await prisma.platform.findMany({
    orderBy: { name: 'asc' }
  });
}

