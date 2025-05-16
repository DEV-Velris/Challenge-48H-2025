import { Roboto } from "next/font/google";

import type { Metadata } from "next";
import { Footer, Navbar } from "@/components";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { useNotification } from "./notifications";
import { NotificationProvider, NotificationAuto } from "./notifications";

const roboto = Roboto({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "SentiLyon",
  description: "Protéger et aider les Lyonnais face aux inondations et autres catastrophes naturelles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`antialiased flex flex-col min-h-screen ${roboto.className}`}>
        <SessionProvider>
          <NotificationProvider>
            <NotificationAuto message="test" />
            <Navbar />
            {children}
            <Footer />
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

