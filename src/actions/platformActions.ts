'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPlatforms() {
  try {
    const platforms = await prisma.platform.findMany({
      orderBy: { name: 'asc' }
    });

    // Count products for each platform
    const platformsWithCount = await Promise.all(platforms.map(async (platform) => {
      const count = await prisma.offer.count({
        where: { platform: platform.name }
      });
      return { ...platform, productCount: count };
    }));

    return platformsWithCount;
  } catch (error) {
    console.error("Error fetching platforms:", error);
    return [];
  }
}

export async function createPlatform(data: { name: string, logo?: string, defaultLink?: string }) {
  try {
    const platform = await prisma.platform.create({
      data: {
        name: data.name,
        logo: data.logo || null,
        defaultLink: data.defaultLink || null,
        isVisible: true
      }
    });
    revalidatePath("/admin/platforms");
    return { success: true, platform };

  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Platform name already exists" };
    }
    return { success: false, error: "Something went wrong" };
  }
}

export async function updatePlatform(id: number, data: { name: string, logo?: string, defaultLink?: string }) {
  try {
    const platform = await prisma.platform.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo || null,
        defaultLink: data.defaultLink || null
      }
    });

    revalidatePath("/admin/platforms");
    revalidatePath("/shop");
    return { success: true, platform };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Platform name already exists" };
    }
    return { success: false, error: "Failed to update platform" };
  }
}

export async function updatePlatformVisibility(id: number, isVisible: boolean) {
  try {
    await prisma.platform.update({
      where: { id },
      data: { isVisible }
    });
    revalidatePath("/admin/platforms");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update visibility" };
  }
}

export async function deletePlatform(id: number) {
  try {
    await prisma.platform.delete({
      where: { id }
    });
    revalidatePath("/admin/platforms");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete platform" };
  }
}

export async function syncPlatforms() {
  try {
    // Get all unique platforms from Offer table with their logos and links
    const offers = await prisma.offer.findMany({
      select: { platform: true, logo: true, affiliateLink: true }
    });
    
    // Create a map of platform name to its data (logo and a representative link)
    const platformMap = new Map();
    offers.forEach(o => {
      if (o.platform && !platformMap.has(o.platform)) {
        // Try to get a clean homepage link from the affiliate link
        let baseLink = o.affiliateLink;
        try {
          if (o.affiliateLink) {
            const url = new URL(o.affiliateLink);
            baseLink = `${url.protocol}//${url.hostname}`;
          }
        } catch (e) {
          baseLink = o.affiliateLink;
        }
        
        platformMap.set(o.platform, { logo: o.logo, link: baseLink });
      }
    });
    
    let addedCount = 0;
    for (const [name, data] of platformMap.entries()) {
      const exists = await prisma.platform.findUnique({ where: { name } });
      
      if (!exists) {
        await prisma.platform.create({
          data: { 
            name, 
            logo: data.logo || null,
            defaultLink: data.link || null,
            isVisible: true 
          }
        });
        addedCount++;
      } else {
        // Update missing fields for existing platforms
        const updateData: any = {};
        if (!exists.logo && data.logo) updateData.logo = data.logo;
        if (!exists.defaultLink && data.link) updateData.defaultLink = data.link;
        
        if (Object.keys(updateData).length > 0) {
          await prisma.platform.update({
            where: { id: exists.id },
            data: updateData
          });
        }
      }
    }
    
    revalidatePath("/admin/platforms");
    return { success: true, addedCount };
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, error: "Failed to sync platforms" };
  }
}