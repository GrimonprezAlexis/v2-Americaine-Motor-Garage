import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "AMERICAINE MOTOR GARAGE - Spécialiste Véhicules Américains",
  description:
    "Garage automobile multimarques spécialisé en véhicules américains en Savoie. Importation, entretien, réparation et services carte grise.",
  keywords: [
    "importation voitures américaines",
    "garage véhicules américains Savoie",
    "réparation voitures américaines",
    "entretien muscle cars",
    "immatriculation carte grise US",
    "achat et vente véhicules américains",
    "Ford Mustang",
    "Chevrolet Camaro",
    "Dodge Charger",
    "Pick-up américain France",
  ].join(", "), // Meta keywords (not used by Google but might be useful for other engines)
  authors: [{ name: "AMERICAINE MOTOR GARAGE" }],
  openGraph: {
    title:
      "AMERICAINE MOTOR GARAGE - Importation et Réparation de Véhicules Américains",
    description:
      "Spécialiste des véhicules américains en Savoie : importation, entretien, réparation et homologation. Contactez-nous pour votre voiture américaine.",
    url: "https://www.americaineimport.fr/",
    type: "website",
    locale: "fr_FR",
    siteName: "AMERICAINE MOTOR GARAGE",
    images: [
      {
        url: "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Images-services/Vente_bg.jpg",
        width: 1200,
        height: 630,
        alt: "Garage spécialisé en voitures américaines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@americaineimport",
    title: "AMERICAINE MOTOR GARAGE - Spécialiste Véhicules Américains",
    description:
      "Garage automobile spécialisé en véhicules américains en Savoie. Importation, réparation et entretien des voitures américaines.",
    images:
      "https://americaine-motor-documents.s3.us-east-1.amazonaws.com/Images-services/Vente_bg.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AMERICAINE MOTOR GARAGE" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Analytics />

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
