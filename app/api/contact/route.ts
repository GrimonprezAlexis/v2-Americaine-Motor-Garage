import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create SMTP transporter for OVH
const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: 587, // Ensure that port 587 is used for STARTTLS
  secure: false, // Use STARTTLS, not SSL
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER,
    pass: process.env.NEXT_PUBLIC_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Optional to bypass SSL issues if OVH has strict settings
  },
});

function generateEmailTemplate(data: any, isAdmin: boolean = false) {
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
          <h1>Nouveau message de contact</h1>
          <p>${
            isAdmin ? "Nouvelle demande reçue" : "Confirmation de votre message"
          }</p>
        </div>

        <div class="section">
          <h2>Informations du contact</h2>
          <p>Nom: ${data.name}</p>
          <p>Email: ${data.email}</p>
          <p>Téléphone: ${data.phone}</p>
        </div>

        <div class="section">
          <h2>Message</h2>
          <p><strong>Sujet:</strong> ${data.subject}</p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        </div>

        ${
          data.selectedVehicle
            ? `
            <div class="section">
              <h2>Véhicule concerné</h2>
              <p>Modèle: ${data.selectedVehicle.title}</p>
              <p>Année: ${data.selectedVehicle.year}</p>
              <p>Prix: ${data.selectedVehicle.price}</p>
            </div>
          `
            : ""
        }

        <div class="footer">
          <p>Americaine Motor - Spécialiste Véhicules Américains</p>
          <p>850A, Route De Lyon - 73160 Saint-Cassin, France</p>
          <a href="++33 4 13 33 39 84" type="tel" id="phone" name="phone">Tél: +33 4 13 33 39 84</p>
          <a href="www.americaineimport.fr" id="link">www.AmericaineImport.fr</p>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verify SMTP configuration
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
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

    // Send admin email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO_ADMIN,
      subject: `Nouveau message - ${data.subject}`,
      html: generateEmailTemplate(data, true),
    });

    // Send client confirmation email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.email,
      subject: "Confirmation de votre message - Americaine Motor",
      html: generateEmailTemplate(data, false),
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
