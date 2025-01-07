import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client with proper configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "eu-west-3",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToS3(file: File, path: string): Promise<string> {
  try {
    const key = `${path}/${Date.now()}_${encodeURIComponent(file.name)}`;

    // Get a presigned URL from your server
    const res = await fetch("/api/generatePresignedUrl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, contentType: file.type }),
    });

    const { url } = await res.json();

    // Upload the file using the presigned URL
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Upload failed");
    }

    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
