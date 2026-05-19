'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const path = join(uploadDir, filename);
    
    await writeFile(path, buffer);
    const url = `/uploads/${filename}`;

    return { success: true, url };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}
