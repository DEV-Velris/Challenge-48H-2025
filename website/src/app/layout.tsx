import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./layout/footer";
import { Navbar } from "./layout/navbar";

export const metadata: Metadata = {
  title: "Challenge 48H",
  description: "Challenge 48H",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
