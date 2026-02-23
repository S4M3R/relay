import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NextProvider } from "fumadocs-core/framework/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const baseUrl = "https://relay-agent.agustin.build";

export const metadata: Metadata = {
  title: {
    default: "relay — the agent your agent sends to talk to people",
    template: "%s | relay",
  },
  description:
    "A second agent that talks to people while yours keeps working. WhatsApp messaging, automatic follow-ups, objective-locked conversations — isolated from your system.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AI agent",
    "WhatsApp automation",
    "conversational AI",
    "agent-to-human",
    "autonomous messaging",
    "LLM agent",
    "relay agent",
  ],
  authors: [{ name: "relay" }],
  creator: "relay",
  openGraph: {
    title: "relay — your agent's brother for human conversations",
    description:
      "A second agent that talks to people while yours keeps working. WhatsApp messaging, automatic follow-ups, objective-locked conversations — isolated from your system.",
    url: baseUrl,
    siteName: "relay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "relay — the agent your agent sends to talk to people",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "relay — your agent's brother for human conversations",
    description:
      "A second agent that talks to people while yours keeps working. WhatsApp messaging, automatic follow-ups, objective-locked conversations — isolated from your system.",
    images: ["/opengraph-image"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "relay",
  description:
    "A second agent that talks to people while yours keeps working. WhatsApp messaging, automatic follow-ups, objective-locked conversations.",
  url: baseUrl,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <NextProvider>{children}</NextProvider>
      </body>
    </html>
  );
}
