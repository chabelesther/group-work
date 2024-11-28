import type { Metadata } from "next";
import { Zilla_Slab } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/authContext/auth";
import { ThemeProvider } from "@/components/providers/theme-provider";

const afacad = Zilla_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Tableau des poids supportés
});

export const metadata: Metadata = {
  title: "CollaboExpose - Plateforme Collaborative pour Exposés Étudiants",
  description:
    "Une solution web innovante pour la préparation et la réalisation collaborative d'exposés académiques. Synchronisez, révisez et présentez en temps réel avec nos outils avancés de collaboration.",
  keywords: [
    "exposé collaboratif",
    "présentation de groupe",
    "outils académiques",
    "collaboration étudiante",
    "préparation de présentation",
    "édition en temps réel",
    "plateforme éducative",
  ],
  openGraph: {
    title: "CollaboExpose - Collaboration Académique Simplifiée",
    description:
      "Transformez la préparation de vos exposés grâce à notre plateforme collaborative de pointe.",
    type: "website",
    locale: "fr_FR",
    siteName: "CollaboExpose",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Interface de CollaboExpose - Plateforme collaborative d'exposés",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollaboExpose - Révolutionnez vos Présentations de Groupe",
    description:
      "Collaborez efficacement sur vos exposés académiques avec nos outils innovants.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.collaboexpose.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${afacad.className} antialiased`}>
        {/* Gestion du thème et du contexte d'authentification */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
