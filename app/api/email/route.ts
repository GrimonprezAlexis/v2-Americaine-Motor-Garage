import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { RegistrationDocument } from "@/types/registration";
import { formatPrice } from "@/lib/utils/format";

// Create SMTP transporter for OVH
const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: 587, // Assure-toi que c'est bien 587 pour STARTTLS
  secure: false, // `false` pour STARTTLS, `true` pour SSL (port 465)
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER,
    pass: process.env.NEXT_PUBLIC_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Ajoute ceci si OVH bloque encore
  },
});

interface EmailAttachment {
  filename: string;
  path: string;
}

/**
 * Generate email template HTML
 */
function generateEmailTemplate(
  registration: RegistrationDocument,
  isAdmin: boolean = false
) {
  const totalAmount = registration.price + registration.serviceFee;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(to right, #2563eb, #7c3aed);
            color: white;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .total {
            font-size: 1.2em;
            font-weight: bold;
            color: #2563eb;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Demande de Carte Grise</h1>
          <p>${
            isAdmin ? "Nouvelle demande reçue" : "Confirmation de votre demande"
          }</p>
        </div>

        <div class="section">
          <h2>Informations du véhicule</h2>
          <p>Marque: ${registration.vehicleInfo.AWN_marque}</p>
          <p>Modèle: ${registration.vehicleInfo.AWN_modele}</p>
          <p>Immatriculation: ${registration.vehicleInfo.AWN_immat}</p>
          <p>Date de mise en circulation: ${
            registration.vehicleInfo.AWN_date_mise_en_circulation
          }</p>
        </div>

        <div class="section">
          <h2>Service demandé</h2>
          <p>${registration.service}</p>
          <p>Code postal: ${registration.postalCode}</p>
        </div>

        <div class="section">
          <h2>Détails du paiement</h2>
          <div class="price-row">
            <span>Taxes et redevances:</span>
            <span>${formatPrice(registration.price)}</span>
          </div>
          <div class="price-row">
            <span>Frais de service:</span>
            <span>${formatPrice(registration.serviceFee)}</span>
          </div>
          <div class="total">
            <span>Total TTC:</span>
            <span>${formatPrice(totalAmount)}</span>
          </div>
        </div>

        <div class="section">
          <h2>Contact</h2>
          <p>Email: ${registration.email}</p>
          <p>Téléphone: ${registration.phone}</p>
        </div>

        ${
          isAdmin
            ? `
          <div class="section">
            <h2>Documents fournis</h2>
            <p>Les documents sont joints à cet email.</p>
          </div>
        `
            : `
          <div class="section">
            <h2>Prochaines étapes</h2>
            <p>Notre équipe va examiner votre demande et vous contactera rapidement pour la suite des démarches.</p>
          </div>
        `
        }

        <div class="footer">
          <p>Americaine Motor - Spécialiste Véhicules Américains</p>
          <p>850A, Route De Lyon - 73160 Saint-Cassin, France</p>
          <p>Tél: +33 4 13 33 39 84</p>
          <a href="www.americaineimport.fr">www.AmericaineImport.fr</p>

        </div>
      </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const registration = (await request.json()) as RegistrationDocument;

    // Verify SMTP configuration
    if (
      !process.env.NEXT_PUBLIC_SMTP_HOST ||
      !process.env.NEXT_PUBLIC_SMTP_USER ||
      !process.env.NEXT_PUBLIC_SMTP_PASS
    ) {
      throw new Error("SMTP configuration is missing");
    }

    // Verify transporter connection
    try {
      await transporter.verify();
      console.log("✅ SMTP connecté !");
    } catch (error) {
      console.error("SMTP Connection Error:", error);
      throw new Error("Failed to connect to SMTP server");
    }

    // Prepare attachments
    const attachments: EmailAttachment[] = Object.entries(
      registration.documents
    ).flatMap(([type, urls]) => {
      if (!Array.isArray(urls)) {
        console.error(`⚠️ Document "${type}" n'est pas un tableau:`, urls);
        return [];
      }

      return urls
        .map((url, index) => {
          // Vérifiez si l'URL est valide avant de l'ajouter en pièce jointe
          if (url && url.startsWith("https://")) {
            return {
              filename: `${type}_${index + 1}.pdf`, // Gère plusieurs fichiers
              path: url,
            };
          } else {
            console.error(`⚠️ URL invalide pour le document "${type}":`, url);
            return null; // Ignore les URLs invalides
          }
        })
        .filter(
          (attachment): attachment is EmailAttachment => attachment !== null
        ); // Filtrer les valeurs nulles
    });

    console.log("📎 Attachments à envoyer:", attachments);

    // Send admin email
    await transporter.sendMail({
      from: `Americaine Motor Garage <${process.env.NEXT_PUBLIC_SMTP_FROM}>`,
      to: process.env.SMTP_TO_ADMIN,
      subject: `Nouvelle demande carte grise - ${registration.vehicleInfo.AWN_marque} ${registration.vehicleInfo.AWN_modele}`,
      html: generateEmailTemplate(registration, true),
      attachments,
    });

    // Send client email
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_FROM,
      to: registration.email,
      subject: "Confirmation de votre demande de carte grise",
      html: generateEmailTemplate(registration, false),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send emails",
      },
      { status: 500 }
    );
  }
}
