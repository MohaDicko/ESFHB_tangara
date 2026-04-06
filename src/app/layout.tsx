import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ÉCOLE DE SANTÉ Félix Houphouët Boigny | Alumni Tracker",
  description: "La plateforme officielle d'insertion et de suivi des diplômés de l'École de Santé F. Houphouët Boigny (ESFé Mali). Réseautez et gérez votre carrière.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
