import { AffiliateClient, FetchedProductDetails } from './types';
import { scrapeProductFromUrl } from './scraper';

class AffiliateRouter implements AffiliateClient {
  async fetchProduct(url: string): Promise<FetchedProductDetails | null> {
    // 1. Try to scrape real-time information from the live e-commerce URL. No fake/mock data.
    const scrapedData = await scrapeProductFromUrl(url);
    if (!scrapedData) {
      throw new Error('E-commerce platform blocked the automated request (Captcha/Security Check) or the page structure is unsupported. Please enter details manually.');
    }
    return scrapedData;
  }
}

export const affiliateService = new AffiliateRouter();
export * from './types';
