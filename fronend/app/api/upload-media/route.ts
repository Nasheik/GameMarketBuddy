import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Validate environment variables
const requiredEnvVars = [
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_ACCESS_KEY_ID',
  'CLOUDFLARE_SECRET_ACCESS_KEY',
  'CLOUDFLARE_BUCKET_NAME',
  'CLOUDFLARE_PUBLIC_DOMAIN'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    console.log('Received upload request');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      console.error('Missing required fields:', { fileName, fileType });
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }

    // Generate a unique file name
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const key = `post-media/${uniqueFileName}`;
    console.log('Generated file key:', key);

    // Create a presigned URL for direct upload
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    console.log('Creating presigned URL with command:', {
      bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      key,
      contentType: fileType
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated presigned URL');

    const fileUrl = `https://${process.env.CLOUDFLARE_PUBLIC_DOMAIN}/${key}`;
    console.log('Generated file URL:', fileUrl);

    // Return the presigned URL and the final file URL
    return NextResponse.json({
      presignedUrl,
      fileUrl,
    });
  } catch (error) {
    console.error('Error in upload-media endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate upload URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 