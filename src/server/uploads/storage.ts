import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

type StorageAdapter = {
  saveFile(buffer: Buffer, originalName: string): Promise<string>;
};

const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'public/uploads');

const localAdapter: StorageAdapter = {
  async saveFile(buffer, originalName) {
    await fs.mkdir(uploadDir, { recursive: true });
    const ext = path.extname(originalName) || '.dat';
    const filename = `${randomUUID()}${ext}`;
    const target = path.join(uploadDir, filename);
    await fs.writeFile(target, buffer);
    return `/uploads/${filename}`;
  }
};

function buildS3Adapter(): StorageAdapter {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    throw new Error('S3_BUCKET não configurado.');
  }

  const region = process.env.S3_REGION ?? 'us-east-1';
  const prefix = process.env.S3_PREFIX ?? 'uploads/';
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';
  const endpoint = process.env.S3_ENDPOINT;

  const client = new S3Client({
    region,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle,
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
          }
        : undefined
  });

  return {
    async saveFile(buffer, originalName) {
      const ext = path.extname(originalName) || '.dat';
      const key = `${prefix}${randomUUID()}${ext}`;

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: getContentType(ext),
          ACL: process.env.S3_ACL ?? 'private'
        })
      );

      if (publicBaseUrl) {
        return `${publicBaseUrl.replace(/\/$/, '')}/${key}`;
      }

      const base = forcePathStyle
        ? `${(endpoint ?? `https://s3.${region}.amazonaws.com`).replace(/\/$/, '')}/${bucket}/`
        : `https://${bucket}.s3.${region}.amazonaws.com/`;
      return `${base.replace(/\/$/, '')}/${key}`;
    }
  };
}

function getContentType(ext: string) {
  const normalized = ext.toLowerCase();
  switch (normalized) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

const driver = (process.env.STORAGE_DRIVER ?? 'local').toLowerCase();
const adapter: StorageAdapter = driver === 's3' ? buildS3Adapter() : localAdapter;

export async function saveFile(buffer: Buffer, originalName: string) {
  return adapter.saveFile(buffer, originalName);
}
