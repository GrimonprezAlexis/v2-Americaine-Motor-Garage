import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AMERICAINE MOTOR GARAGE - Spécialiste Véhicules Américains",
  description:
    "Garage automobile multimarques spécialisé véhicules américains en Savoie. Importation, entretien, réparation et services carte grise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
