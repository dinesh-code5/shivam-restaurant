import fs from 'fs';
import path from 'path';

/**
 * Saves a base64 image string to the local disk and returns the relative path.
 * If the image string is already a URL or a relative path, it returns it as-is.
 * 
 * @param {string} base64Str - The base64 data URI string or URL
 * @param {string} folder - The destination folder (relative to process.cwd())
 * @returns {string} - The relative URL path to the saved file
 */
export const saveBase64Image = (base64Str, folder = 'uploads') => {
  if (!base64Str) return null;

  // If it's already a URL or relative path, return it as-is
  if (base64Str.startsWith('http') || base64Str.startsWith('/uploads')) {
    return base64Str;
  }

  // Match mime type and base64 data
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Determine file extension based on mime type
  let extension = 'png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    extension = 'jpg';
  } else if (mimeType.includes('webp')) {
    extension = 'webp';
  } else if (mimeType.includes('gif')) {
    extension = 'gif';
  }

  // Ensure target folder exists
  const targetDir = path.join(process.cwd(), folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Create unique filename
  const filename = `room-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
  const filePath = path.join(targetDir, filename);

  fs.writeFileSync(filePath, buffer);

  // Return the relative URL path starting with /uploads
  return `/${folder}/${filename}`;
};
