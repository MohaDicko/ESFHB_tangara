import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://esfhb-alumni.vercel.app'

export const metadata: Metadata = {
  title: "ÉCOLE DE SANTÉ Félix Houphouët Boigny | Alumni Tracker",
  description: "La plateforme officielle d'insertion et de suivi des diplômés de l'École de Santé F. Houphouët Boigny (ESFHB). Réseautez et gérez votre carrière.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Réseau Alumni ESFHB",
    description: "Plateforme officielle de suivi des diplômés de l'École de Santé Félix Houphouët Boigny.",
    url: baseUrl,
    siteName: "Alumni ESFHB",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bannière Réseau Alumni ESFHB',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Réseau Alumni ESFHB",
    description: "Rejoignez le réseau officiel des diplômés de l'École de Santé F. Houphouët Boigny.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
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
