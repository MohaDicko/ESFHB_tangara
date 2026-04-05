import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html
      lang="fr"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-inter min-h-full flex flex-col">{children}</body>
    </html>
  );
}
