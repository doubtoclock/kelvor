import type { Metadata, Viewport } from "next";
import { Sora, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#102D25",
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
        className={`${sora.variable} ${manrope.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {/* Enforce reload always starts at the Hero section (top: 0) */}
        <script
          id="scroll-restoration-reset"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                  if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                  }
                  window.scrollTo(0, 0);
                  if (document.documentElement) document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                } catch (e) {}
              })();
            `,
          }}
        />
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
