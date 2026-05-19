export interface FetchedProductDetails {
  name: string;
  slug: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  features: string[];
  offers: {
    platform: string;
    price: number;
    affiliateLink: string;
    logo: string;
    label: string;
    isAvailable: boolean;
  }[];
}

export interface AffiliateClient {
  fetchProduct(url: string): Promise<FetchedProductDetails | null>;
}
