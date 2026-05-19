import { NextRequest, NextResponse } from 'next/server';
import { affiliateService } from '@/lib/affiliate';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Product URL is required' },
        { status: 400 }
      );
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format. Must start with http:// or https://' },
        { status: 400 }
      );
    }

    const data = await affiliateService.fetchProduct(url);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract product details from URL' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Affiliate API fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product URLs array is required' },
        { status: 400 }
      );
    }

    const fetchedDetailsArray = [];
    const errors: string[] = [];

    for (const url of urls) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        continue;
      }
      try {
        const data = await affiliateService.fetchProduct(url);
        if (data) {
          fetchedDetailsArray.push(data);
        }
      } catch (e: any) {
        console.warn(`Failed to fetch for URL: ${url}`, e);
        errors.push(`${url}: ${e.message || 'Unknown error'}`);
      }
    }

    if (fetchedDetailsArray.length === 0) {
      const combinedError = errors.length > 0 
        ? errors.join(' | ') 
        : 'Failed to extract product details from all provided URLs.';
      return NextResponse.json(
        { success: false, error: combinedError },
        { status: 404 }
      );
    }

    // Merging logic:
    // 1. Find the first item that has a non-empty name to use as base
    const baseDetails = fetchedDetailsArray.find(d => d.name) || fetchedDetailsArray[0];

    // 2. Aggregate other fields, falling back to other items if base is empty
    const name = baseDetails.name || '';
    const slug = baseDetails.slug || '';
    const description = baseDetails.description || fetchedDetailsArray.find(d => d.description)?.description || '';
    const rating = baseDetails.rating || fetchedDetailsArray.find(d => d.rating)?.rating || 0;
    
    // Aggregate unique images
    const imagesSet = new Set<string>();
    fetchedDetailsArray.forEach(d => {
      if (d.images) d.images.forEach(img => imagesSet.add(img));
    });
    const images = Array.from(imagesSet).slice(0, 5);

    // Aggregate unique features
    const featuresSet = new Set<string>();
    fetchedDetailsArray.forEach(d => {
      if (d.features) d.features.forEach(f => featuresSet.add(f));
    });
    const features = Array.from(featuresSet).slice(0, 5);

    // Aggregate all offers
    const offers = fetchedDetailsArray.flatMap(d => d.offers);

    const mergedData = {
      name,
      slug,
      description,
      rating,
      images,
      features,
      offers
    };

    return NextResponse.json({ success: true, data: mergedData });
  } catch (error: any) {
    console.error('Affiliate API fetch POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
