import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.offer.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})

  // Create Categories
  const homeOffice = await prisma.category.create({
    data: {
      name: 'Home Office',
      slug: 'home-office',
      icon: 'HomeOffice',
    },
  })

  const tech = await prisma.category.create({
    data: {
      name: 'Tech Accessories',
      slug: 'tech-accessories',
      icon: 'Tech',
    },
  })

  // Create a Product
  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
      price: 148900,
      categoryId: tech.id,
      images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=600&q=80'],
      rating: 4.9,
      discount: 5,
      isTrending: true,
      source: 'MANUAL',
      features: ['A17 Pro Chip', 'Titanium Design', '48MP Camera'],
      offers: {
        create: [
          {
            platform: 'Amazon',
            price: 148900,
            affiliateLink: 'https://amazon.in/s?k=iphone+15+pro+max',
            logo: '/amazon.png',
          },
          {
            platform: 'Flipkart',
            price: 156900,
            affiliateLink: 'https://flipkart.com/search?q=iphone+15+pro+max',
            logo: '/flipkart.png',
          },
        ],
      },
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
