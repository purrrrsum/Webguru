import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// File storage for Hostinger (local file system)
// Files are stored in public/uploads directory

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveFile(file: File, filename: string): Promise<string> {
  await ensureUploadDir();
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFilename = `${timestamp}_${sanitizedFilename}`;
  const filePath = join(UPLOAD_DIR, uniqueFilename);

  // Convert File to Buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await writeFile(filePath, buffer);

  // Return public URL
  return `/uploads/${uniqueFilename}`;
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    // Extract filename from URL
    const filename = url.split('/uploads/')[1];
    if (!filename) {
      return false;
    }

    const filePath = join(UPLOAD_DIR, filename);
    
    // Check if file exists before deleting
    if (existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export function getFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}

