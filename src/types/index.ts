export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  category: any;

  rating: number;
  isTrending?: boolean;
  isDealOfTheWeek?: boolean;
  vendorLogo: string;
  discount: number;
  offers: {
    platform: string;
    price: number;
    affiliateLink: string;
    logo: string;
  }[];
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
}
