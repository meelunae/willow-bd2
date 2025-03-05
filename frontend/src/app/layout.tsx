import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Willow",
  description:
    "A journey in the Taylor Swift discography from the eyes of the Spotify API.",
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
