import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialiser le client S3 avec les informations d'identification
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME =
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "americaine-motor-documents";

/**
 * Télécharge un fichier vers S3 et retourne l'URL publique
 * @param file Fichier à télécharger
 * @param path Chemin dans le bucket S3 (sans le nom du fichier)
 * @returns URL publique du fichier téléchargé
 */
export async function uploadToS3(file: File, path: string): Promise<string> {
  try {
    // Valider le fichier
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    // Valider la taille du fichier (limite de 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error("La taille du fichier dépasse la limite de 5MB");
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const key = `${path}/${timestamp}-${randomId}-${safeFileName}`;

    // Convertir le fichier en ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Créer et envoyer la commande d'upload
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      // Ajouter des en-têtes de cache
      CacheControl: "max-age=31536000", // 1 an
    });

    // Upload avec gestion des erreurs
    try {
      await s3Client.send(command);
    } catch (uploadError: any) {
      console.error("Erreur S3 upload:", uploadError);
      throw new Error(
        uploadError.message ||
          "Erreur lors du téléchargement du fichier vers S3"
      );
    }

    // Retourner l'URL publique
    return `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Erreur lors du téléchargement vers S3:", error);
    throw error;
  }
}

/**
 * Génère une URL signée pour un objet S3
 * @param key Clé de l'objet dans S3
 * @param expiresIn Durée de validité de l'URL en secondes (défaut: 3600s = 1h)
 * @returns URL signée
 */
export async function getSignedS3Url(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL signée:", error);
    throw error;
  }
}

/**
 * Extrait la clé S3 à partir d'une URL S3 complète
 * @param url URL S3 complète
 * @returns Clé S3
 */
export function getS3KeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Supprimer le premier slash pour obtenir la clé
    return urlObj.pathname.substring(1);
  } catch (error) {
    console.error("Erreur lors de l'extraction de la clé S3:", error);
    throw error;
  }
}
