import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kelvor.co.in"),
  title: "Kelvor — Product Design & Development Studio",
  description: "Kelvor is an independent product studio helping ambitious ideas become thoughtful digital products through strategy, design, web development, and engineering.",
  authors: [{ name: "Kelvor Studio" }],
  creator: "Kelvor Studio",
  openGraph: {
    type: "website",
    url: "https://kelvor.co.in",
    title: "Kelvor — Product Design & Development Studio",
    description: "Kelvor is an independent product studio helping ambitious ideas become thoughtful digital products through strategy, design, web development, and engineering.",
    siteName: "Kelvor",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Kelvor — Product Design & Development Studio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kelvor — Product Design & Development Studio",
    description: "Kelvor is an independent product studio helping ambitious ideas become thoughtful digital products through strategy, design, web development, and engineering.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Kelvor",
              "url": "https://kelvor.co.in"
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
