import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME =
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "americaine-motor-documents";

export async function uploadToS3(file: File, path: string): Promise<string> {
  try {
    // Generate a unique key for the file
    const key = `${path}/${Date.now()}_${encodeURIComponent(file.name)}`;

    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Create and send upload command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      // Remove ACL parameter as it's not supported
    });

    await s3Client.send(command);

    // Return the public URL
    return `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
