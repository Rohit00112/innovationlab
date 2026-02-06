import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const KANIT = Kanit({ weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'] })

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://innovationlab.edu.np";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Innovation Lab | Itahari International College",
    template: "%s | Innovation Lab",
  },
  description:
    "Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation at Itahari International College.",
  keywords: [
    "innovation lab",
    "Itahari International College",
    "IIC",
    "technology",
    "student projects",
    "hackathon",
    "workshops",
    "Nepal",
    "education",
    "STEM",
  ],
  authors: [{ name: "Innovation Lab Team" }],
  creator: "Innovation Lab",
  publisher: "Itahari International College",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Innovation Lab",
    title: "Innovation Lab | Itahari International College",
    description:
      "Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Innovation Lab - Where Ideas Come Alive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Innovation Lab | Itahari International College",
    description:
      "Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation.",
    images: ["/og-image.png"],
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
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a22" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased ${KANIT.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
