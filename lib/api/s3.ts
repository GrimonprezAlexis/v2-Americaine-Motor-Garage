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
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 5MB limit");
    }

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
      // Add caching headers
      CacheControl: "max-age=31536000",
    });

    // Upload with error handling
    try {
      await s3Client.send(command);
    } catch (uploadError: any) {
      console.error("S3 upload error:", uploadError);
      throw new Error(uploadError.message || "Error uploading file to S3");
    }

    // Return the public URL
    return `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
