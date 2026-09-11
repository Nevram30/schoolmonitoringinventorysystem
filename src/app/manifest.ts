import type { MetadataRoute } from "next";

/**
 * Web app manifest (served at /manifest.webmanifest): lets phones install the system to the home
 * screen and open it full-screen, like an app — handy for scanning inventory labels.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "School Property Monitoring System",
    short_name: "SPMS",
    description:
      "Monitor, lend and count school property — scan barcode labels right from your phone.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    // Tailwind blue-600, the header colour.
    theme_color: "#155dfc",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Scan inventory",
        short_name: "Scan",
        url: "/admin/inventory",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
