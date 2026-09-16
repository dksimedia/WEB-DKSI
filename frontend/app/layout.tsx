import type { Metadata } from "next";
import { getCMS } from "@/lib/cms";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DKSI - Enterprise IT Solutions",
  description:
    "Digital transformation solutions for government, education, and enterprise sectors in Indonesia.",
  keywords: "IT solutions, cloud, security, digital transformation, Indonesia",
  metadataBase: new URL("https://dksi.co.id"),
  openGraph: {
    title: "DKSI - Enterprise IT Solutions",
    description: "Your partner in digital excellence",
    type: "website",
    locale: "id_ID",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cms = await getCMS();

  return (
    <html
      lang="id"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* Import fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* RemixIcon */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />

        {/* Theme color */}
        <meta name="theme-color" content="#1a365d" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#070707" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <Navbar branding={cms.branding} />
        <main className="pt-[72px]">{children}</main>
        <Footer company={cms.company} social={cms.social} branding={cms.branding} />
      </body>
    </html>
  );
}
