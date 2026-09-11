import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "~/styles/globals.css";
import Providers from "@/components/Providers";
import InstallAppPrompt from "@/components/pwa.install.prompt";
import ServiceWorkerRegistration from "@/components/pwa.register";
import { TRPCReactProvider } from "~/trpc/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Property Monitoring System",
  description: "A system for monitoring and managing school property and equipment",
  applicationName: "SPMS",
  // Added to an iPhone's home screen, it opens full-screen like an app.
  appleWebApp: { capable: true, title: "SPMS", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#155dfc",
  // Lets the full-screen camera scanner reach the screen edges; it pads itself clear of notches.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <TRPCReactProvider>
          <Providers>
            {children}
          </Providers>
        </TRPCReactProvider>
        <ServiceWorkerRegistration />
        <InstallAppPrompt />
      </body>
    </html>
  );
}
