import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize, compress, convert images — 100% client-side",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
