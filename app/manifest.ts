import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ashofah World",
    short_name: "Ashofah",
    description: "Novian Affan Ashofah's interactive developer portfolio.",
    start_url: "/",
    display: "browser",
    background_color: "#0c0f20",
    theme_color: "#0c0f20",
    icons: [
      {
        src: "/images/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
