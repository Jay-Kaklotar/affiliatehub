import { FetchedProductDetails } from './types';

// Robust helper to decode decimal, hexadecimal, and standard HTML entities
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x22;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (match, dec) => {
      const num = parseInt(dec, 10);
      return isNaN(num) ? match : String.fromCharCode(num);
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      const num = parseInt(hex, 16);
      return isNaN(num) ? match : String.fromCharCode(num);
    });
}

// Utility to decode Unicode escapes (like \u002F for slashes) and escaped characters inside raw JSON/HTML urls
function decodeEscapedUrl(urlStr: string): string {
  if (!urlStr) return '';
  return urlStr
    .replace(/\\u002[fF]/g, '/')
    .replace(/\\\//g, '/')
    .replace(/\\/g, '')
    .trim();
}

// Convert compressed or scaled image URLs into their high-resolution original counterparts
function cleanProductImageUrl(imgUrl: string): string {
  if (!imgUrl) return '';
  
  // Unescape unicode elements
  const cleanUrl = decodeEscapedUrl(imgUrl);
  
  // Amazon image cleanup
  if (cleanUrl.includes('amazon.com') || cleanUrl.includes('media-amazon.com')) {
    return cleanUrl.replace(/\._[A-Za-z0-9_,-]+_(?=\.[a-zA-Z]+$)/, '');
  }
  
  // Myntra image cleanup: automatically transform listing thumbnails into full 1080p high-resolution photos
  if (cleanUrl.includes('myntassets.com')) {
    // 1. Force the standard https protocol to avoid duplicate listings (http vs https)
    let normalized = cleanUrl.replace(/^http:/i, 'https:');
    
    // 2. Strip dynamic version sub-directories (like /v1/, /v2/) right after the domain to ensure matching paths
    normalized = normalized.replace(/assets\.myntassets\.com\/v[0-9]+\//i, 'assets.myntassets.com/');
    
    // 3. Strip out all existing height, width, quality, and compression parameters to avoid duplicates
    let cleanPath = normalized.replace(/(?:h_[0-9]+,w_[0-9]+,[a-z_0-9,]+|h_[0-9]+,q_[0-9]+,w_[0-9]+|h_[0-9]+,w_[0-9]+)\/?/gi, '');
    
    // 4. Insert exactly ONE clean high-resolution modifier right after the assets domain
    return cleanPath.replace('assets.myntassets.com/', 'assets.myntassets.com/h_1440,q_90,w_1080/');
  }
  
  return cleanUrl;
}

export async function scrapeProductFromUrl(url: string): Promise<FetchedProductDetails | null> {
  try {
    const scraperApiKey = process.env.SCRAPER_API_KEY;
    let html = '';

    if (scraperApiKey && scraperApiKey.trim()) {
      console.log('Routing request through ScraperAPI to bypass bot detection...');
      let scraperApiUrl = `http://api.scraperapi.com/?api_key=${encodeURIComponent(scraperApiKey.trim())}&url=${encodeURIComponent(url)}`;
      
      const lowercaseUrl = url.toLowerCase();
      if (lowercaseUrl.includes('myntra.com')) {
        // Myntra is a heavy JS-SPA, requiring full browser rendering
        scraperApiUrl += '&render=true&country_code=in';
      } else if (lowercaseUrl.includes('meesho.com') || lowercaseUrl.includes('flipkart.com')) {
        // Meesho and Flipkart are fully static SSR HTML, they do not need slow JS rendering, only Indian proxies!
        scraperApiUrl += '&country_code=in';
      }

      const response = await fetch(scraperApiUrl, {
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      if (!response.ok) {
        throw new Error(`ScraperAPI returned status: ${response.status}. Please verify your API key or limit.`);
      }
      html = await response.text();
    } else {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to reach the product page. E-commerce platform returned HTTP Status: ${response.status}.`);
      }

      html = await response.text();
    }

    // Check if we were blocked by Captcha/Bot/Cloudflare checks
    const isCloudflareBlock = html.includes('<title>Attention Required! | Cloudflare</title>') || 
                              html.includes('<title>Just a moment...</title>') ||
                              html.includes('cf-challenge-running') ||
                              html.includes('id="cf-challenge-error"');
    const isAmazonBlock = html.includes('api-services-support@amazon.com') || 
                          (html.includes('Robot Check') && html.includes('/errors/validateCaptcha'));
    const isGenericBlock = (html.includes('Access Denied') || html.includes('Forbidden')) && html.length < 15000;

    if (isCloudflareBlock || isAmazonBlock || isGenericBlock) {
      let platformName = 'The e-commerce platform';
      const lowercaseUrl = url.toLowerCase();
      if (lowercaseUrl.includes('amazon')) platformName = 'Amazon';
      else if (lowercaseUrl.includes('flipkart')) platformName = 'Flipkart';
      else if (lowercaseUrl.includes('meesho')) platformName = 'Meesho';
      else if (lowercaseUrl.includes('myntra')) platformName = 'Myntra';

      throw new Error(`${platformName}'s security system blocked the automated request (Captcha/Robot Check/WAF). To bypass this and auto-import easily, please add a SCRAPER_API_KEY in your .env file.`);
    }

    // 1. Extract Product Title
    let name = '';
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ||
                         html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      name = ogTitleMatch[1].trim();
    } else {
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        name = titleMatch[1].trim();
      }
    }

    if (name) {
      // Clean up common platform-specific trailing page title suffixes dynamically
      name = decodeHtmlEntities(name)
        // Trim leading "Buy " prefix if present
        .replace(/^Buy\s+/i, '')
        // Clean trailing platform signatures
        .replace(/\s*[:-|]\s*Amazon\s*(?:\.in|\.com)?\s*$/i, '')
        .replace(/\s*[:-|]\s*Flipkart\s*(?:\.com)?\s*$/i, '')
        .replace(/\s*[:-|]\s*Meesho\s*$/i, '')
        .replace(/\s*[:-|]\s*Myntra\s*$/i, '')
        .replace(/\s*[:-|]\s*Online\s+at\s+Low\s+Prices\s+in\s+India\s*$/i, '')
        .replace(/\s*[:-|]\s*Buy\s+.*Online\s*$/i, '')
        // Clean Myntra specifics (e.g. "- - Apparel for Women from ... at Rs. ...")
        .replace(/\s*-\s*-\s*Apparel\s+.*$/i, '')
        .replace(/\s*at\s+Rs\.\s*\d+.*$/i, '')
        .trim();
    }

    // 2. Extract Product Images
    const rawImages: string[] = [];
    
    // Pattern A: Landing image element
    const landingImageMatch = html.match(/<img[^>]+id=["']landingImage["'][^>]+src=["']([^"']+)["']/i) ||
                             html.match(/src=["']([^"']+)["'][^>]+id=["']landingImage["']/i);
    if (landingImageMatch && landingImageMatch[1]) {
      rawImages.push(landingImageMatch[1].trim());
    }

    // Pattern B: Old high-res attribute
    const oldHiresMatch = html.match(/data-old-hires=["']([^"']+)["']/i);
    if (oldHiresMatch && oldHiresMatch[1]) {
      rawImages.push(oldHiresMatch[1].trim());
    }

    // Pattern C: OpenGraph image tag
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogImageMatch && ogImageMatch[1]) {
      rawImages.push(ogImageMatch[1].trim());
    }

    // Pattern D: Amazon dynamic images JSON block
    const imageBlockMatch = html.match(/data-a-dynamic-image=["']({.*?})["']/);
    if (imageBlockMatch && imageBlockMatch[1]) {
      try {
        const decoded = imageBlockMatch[1].replace(/&quot;/g, '"');
        const imgMap = JSON.parse(decoded);
        const urls = Object.keys(imgMap);
        urls.forEach(url => {
          if (!rawImages.includes(url) && !url.includes('sprite')) {
            rawImages.push(url);
          }
        });
      } catch (e) {
        console.warn('Failed to parse dynamic image JSON:', e);
      }
    }

    // Pattern E: Script colorImages block
    const colorImagesRegex = /"hiRes"\s*:\s*"([^"]+)"/gi;
    let colorMatch;
    while ((colorMatch = colorImagesRegex.exec(html)) !== null) {
      if (colorMatch[1] && !rawImages.includes(colorMatch[1])) {
        rawImages.push(colorMatch[1]);
      }
    }

    // Pattern F: Extract images from structured application/ld+json SEO schemas (Guarantees only genuine product photos)
    const ldJsonMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (ldJsonMatches) {
      for (const ldMatch of ldJsonMatches) {
        try {
          const jsonText = ldMatch.replace(/<script[^>]*>|<\/script>/gi, '').trim();
          const parsed = JSON.parse(jsonText);
          const objects = Array.isArray(parsed) ? parsed : [parsed];
          for (const obj of objects) {
            if (obj['@type'] === 'Product' || obj.type === 'Product' || obj.image) {
              const schemaImages = obj.image;
              if (schemaImages) {
                const imgArray = Array.isArray(schemaImages) ? schemaImages : [schemaImages];
                imgArray.forEach((img: any) => {
                  let imgUrl = '';
                  if (typeof img === 'string') {
                    imgUrl = img;
                  } else if (img && typeof img === 'object' && img.url) {
                    imgUrl = img.url;
                  }
                  if (imgUrl && !imgUrl.includes('logo') && !imgUrl.includes('placeholder')) {
                    rawImages.push(imgUrl.trim());
                  }
                });
              }
            }
          }
        } catch (e) {
          // Fallback if full parse fails: search for image strings inside the schema tag
          const schemaUrlRegex = /(https:\/\/[^"'\s,]+(?:jpg|jpeg|png|webp))/gi;
          let schemaUrlMatch;
          while ((schemaUrlMatch = schemaUrlRegex.exec(ldMatch)) !== null) {
            const imgUrl = decodeEscapedUrl(schemaUrlMatch[1]);
            if (!imgUrl.includes('logo') && !imgUrl.includes('placeholder') && !imgUrl.includes('banner')) {
              rawImages.push(imgUrl);
            }
          }
        }
      }
    }

    // Pattern G: Extract Myntra album gallery images from window.__myx script (Guarantees original model photos)
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes('myntra.com')) {
      const myntraAlbumRegex = /"imageURL"\s*:\s*"([^"]+)"/gi;
      let albumMatch;
      while ((albumMatch = myntraAlbumRegex.exec(html)) !== null) {
        const imgUrl = decodeEscapedUrl(albumMatch[1]);
        // Filter out promotional badges
        if (!imgUrl.includes('retaillabs') && !imgUrl.includes('banner') && !imgUrl.includes('coupon') && !imgUrl.includes('badge')) {
          rawImages.push(imgUrl);
        }
      }
    }

    // Pattern H: Extract Meesho gallery images from responsive states
    if (lowercaseUrl.includes('meesho.com')) {
      const meeshoGalleryRegex = /"(?:original_image_url|image_url|imageUrl|images)"\s*:\s*"([^"]+)"/gi;
      let meeshoMatch;
      while ((meeshoMatch = meeshoGalleryRegex.exec(html)) !== null) {
        const imgUrl = decodeEscapedUrl(meeshoMatch[1]);
        if (!imgUrl.includes('placeholder') && !imgUrl.includes('banner') && !rawImages.includes(imgUrl)) {
          rawImages.push(imgUrl);
        }
      }
    }

    // Clean all extracted image URLs to obtain high-resolution originals
    const images = rawImages
      .map(img => cleanProductImageUrl(img))
      .filter((img, index, self) => img && self.indexOf(img) === index);

    // 3. Extract Price
    let price = 0;
    
    // Look for Amazon price element class
    const priceWholeMatch = html.match(/<span\s+class=["']a-price-whole["']>(.*?)<\/span>/i);
    if (priceWholeMatch && priceWholeMatch[1]) {
      const parsedPrice = parseFloat(priceWholeMatch[1].replace(/[^0-9]/g, ''));
      if (!isNaN(parsedPrice)) {
        price = parsedPrice;
      }
    }

    // Fallback to robust schema and generic price tag matching (quoted and unquoted JSON values)
    if (price === 0) {
      const priceRegexes = [
        /"price"\s*:\s*"?([0-9]+(?:\.[0-9]+)?)"?/i,
        /meta\s+property=["']product:price:amount["']\s+content=["']([0-9.]+)["']/i,
        /meta\s+property=["']og:price:amount["']\s+content=["']([0-9.]+)["']/i,
        /meta\s+name=["']twitter:data1["']\s+value=["']Rs\.\s*([0-9.]+)["']/i,
        /"discountedPrice"\s*:\s*"?([0-9]+)"?/i,
        /"mrp"\s*:\s*"?([0-9]+)"?/i,
        /"priceWhole"\s*:\s*"?([0-9]+)"?/i,
      ];
      for (const regex of priceRegexes) {
        const match = html.match(regex);
        if (match && match[1]) {
          const parsedPrice = parseFloat(match[1]);
          if (!isNaN(parsedPrice) && parsedPrice > 0) {
            price = parsedPrice;
            break;
          }
        }
      }
    }

    // 4. Extract Description
    let description = '';
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (ogDescMatch && ogDescMatch[1]) {
      description = decodeHtmlEntities(ogDescMatch[1].replace(/<[^>]*>/g, '')).trim();
    }

    // 4.5 Extract Rating
    let rating = 0;
    const ratingMatch = html.match(/<span\s+class=["']a-icon-alt["']>([0-9.]+)\s+out\s+of\s+5\s+stars/i) ||
                        html.match(/class=["']a-icon\s+a-icon-star\s+a-star-([0-9-]+)["']/i);
    if (ratingMatch && ratingMatch[1]) {
      const parsedRating = parseFloat(ratingMatch[1].replace('-', '.'));
      if (!isNaN(parsedRating)) {
        rating = parsedRating;
      }
    }

    // 4.7 Extract Stock Status (Out of Stock check)
    let isAvailable = true;
    const availabilityText = html.match(/id=["']availability["'][^>]*>([\s\S]*?)<\/span>/i) ||
                             html.match(/id=["']outOfStock["'][^>]*>([\s\S]*?)<\/div>/i);
    if (availabilityText && availabilityText[1]) {
      const text = availabilityText[1].toLowerCase();
      if (text.includes('currently unavailable') || text.includes('out of stock') || text.includes('unavailable')) {
        isAvailable = false;
      }
    } else if (html.toLowerCase().includes('currently unavailable') || html.toLowerCase().includes('out of stock')) {
      isAvailable = false;
    }

    // 5. Extract Product Features (Bullet points / Specifications)
    const features: string[] = [];
    
    // Pattern A: Standard Amazon bullet points
    const bulletListMatch = html.match(/<ul\s+class=["']a-unordered-list\s+a-vertical\s+a-spacing-mini["']>([\s\S]*?)<\/ul>/i);
    if (bulletListMatch && bulletListMatch[1]) {
      const liRegex = /<span\s+class=["']a-list-item["']>([\s\S]*?)<\/span>/gi;
      let match;
      while ((match = liRegex.exec(bulletListMatch[1])) !== null) {
        const cleanBullet = decodeHtmlEntities(match[1].replace(/<[^>]*>/g, '')).trim();
        if (cleanBullet && cleanBullet.length > 5 && !features.includes(cleanBullet)) {
          features.push(cleanBullet);
        }
      }
    }

    // Pattern B: Myntra specifications (e.g. index-rowKey / index-rowValue)
    if (lowercaseUrl.includes('myntra.com')) {
      const specRegex = /<div[^>]*class=["']index-rowKey["'][^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class=["']index-rowValue["'][^>]*>([\s\S]*?)<\/div>/gi;
      let specMatch;
      while ((specMatch = specRegex.exec(html)) !== null) {
        const key = decodeHtmlEntities(specMatch[1].replace(/<[^>]*>/g, '')).trim();
        const value = decodeHtmlEntities(specMatch[2].replace(/<[^>]*>/g, '')).trim();
        if (key && value) {
          const cleanSpec = `${key}: ${value}`;
          if (!features.includes(cleanSpec)) {
            features.push(cleanSpec);
          }
        }
      }
    }

    // Pattern C: Meesho and generic specs key-value blocks
    const genericSpecRegex = /(?:class|id)=["'][^"']*(?:key|specs-key|SpecsKey)[^"']*["'][^>]*>([^<]+)<\/[a-z0-9]+>\s*<[a-z0-9]+[^>]*(?:class|id)=["'][^"']*(?:value|specs-value|SpecsValue)[^"']*["'][^>]*>([^<]+)<\/[a-z0-9]+/gi;
    let genMatch;
    while ((genMatch = genericSpecRegex.exec(html)) !== null) {
      const key = decodeHtmlEntities(genMatch[1].replace(/<[^>]*>/g, '')).trim();
      const value = decodeHtmlEntities(genMatch[2].replace(/<[^>]*>/g, '')).trim();
      if (key && value) {
        const cleanSpec = `${key}: ${value}`;
        if (!features.includes(cleanSpec)) {
          features.push(cleanSpec);
        }
      }
    }

    if (!name) {
      throw new Error('Could not identify the product title from the page layout. Please enter details manually.');
    }

    let platform = 'E-Commerce';
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      const parts = hostname.replace('www.', '').split('.');
      if (parts.length > 0) {
        platform = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    } catch (e) {
      console.error('Failed to extract platform name dynamically:', e);
    }

    let logo = '/placeholder-logo-vectors.svg';
    if (platform.toLowerCase().includes('flipkart')) {
      logo = '/flipkart.png';
    } else if (platform.toLowerCase().includes('meesho')) {
      logo = '/meesho.png';
    }

    return {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4),
      description: description || '',
      price: price || 0,
      rating: rating || 0,
      images: images.length > 0 ? images.slice(0, 5) : [],
      features: features.length > 0 ? features.slice(0, 5) : [],
      offers: [
        {
          platform,
          price: price || 0,
          affiliateLink: url,
          logo,
          label: '',
          isAvailable
        }
      ]
    };
  } catch (error: any) {
    console.error('Scraper Network Error:', error);
    if (error.message && (error.message.includes('403') || error.message.includes('Forbidden'))) {
      throw new Error('This e-commerce platform (like Meesho/Flipkart) has strict firewalls (Cloudflare/Akamai WAF) that block automated server requests. Please copy-paste the product details manually to keep them 100% authentic.');
    }
    throw new Error(error.message || 'Network failure while fetching the product page. Please try again.');
  }
}
