import { Product } from "@/types";

export const fetchMockProducts = async (query: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description: "The latest iPhone 15 Pro Max with titanium finish and A17 Pro chip.",
      price: 159900,
      images: ["/assets/images/placeholder.jpg"], // Ensure to have a placeholder or handle missing image
      categoryId: "1",
      category: { name: "Smartphones", slug: "smartphones" },
      rating: 4.8,
      isTrending: true,
      vendorLogo: "/placeholder-logo-vectors.svg",
      discount: 10,
      offers: [
        {
          platform: "Amazon",
          price: 159900,
          affiliateLink: "#",
          logo: "/placeholder-logo-vectors.svg",
        },
      ],
      features: ["A17 Pro chip", "Titanium body", "48MP camera"],
    },
    {
      id: "2",
      name: "MacBook Air M2",
      slug: "macbook-air-m2",
      description: "Supercharged by M2, the MacBook Air is strikingly thin and brings exceptional speed.",
      price: 114900,
      images: ["/assets/images/placeholder.jpg"],
      categoryId: "2",
      category: { name: "Laptops", slug: "laptops" },
      rating: 4.9,
      vendorLogo: "/assets/images/flipkart.png",
      discount: 15,
      offers: [
        {
          platform: "Flipkart",
          price: 114900,
          affiliateLink: "#",
          logo: "/assets/images/flipkart.png",
        },
      ],
      features: ["M2 chip", "13.6-inch Liquid Retina display", "18 hrs battery"],
    },
    {
      id: "3",
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description: "Industry leading noise canceling wireless headphones.",
      price: 29990,
      images: ["/assets/images/placeholder.jpg"],
      categoryId: "3",
      category: { name: "Audio", slug: "audio" },
      rating: 4.7,
      vendorLogo: "/placeholder-logo-vectors.svg",
      discount: 5,
      offers: [
        {
          platform: "Amazon",
          price: 29990,
          affiliateLink: "#",
          logo: "/placeholder-logo-vectors.svg",
        },
      ],
      features: ["Industry-leading ANC", "30 hrs battery", "High-Resolution Audio"],
    },
    {
      id: "4",
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Galaxy AI is here. Welcome to the era of mobile AI.",
      price: 129999,
      images: ["/assets/images/placeholder.jpg"],
      categoryId: "1",
      category: { name: "Smartphones", slug: "smartphones" },
      rating: 4.8,
      isTrending: true,
      vendorLogo: "/assets/images/samsung.png",
      discount: 8,
      offers: [
        {
          platform: "Samsung",
          price: 129999,
          affiliateLink: "#",
          logo: "/assets/images/samsung.png",
        },
      ],
      features: ["Galaxy AI", "S Pen", "200MP camera"],
    }
  ];
};
