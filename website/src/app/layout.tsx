import {Roboto} from "next/font/google";

import type {Metadata} from "next";
import {Footer, Navbar} from "@/components";
import "./globals.css";

const roboto = Roboto({
    weight: ["300", "400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
})

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
        <body className={`antialiased flex flex-col min-h-screen ${roboto.className}`}>
        <Navbar/>
        {children}
        <Footer/>
        </body>
        </html>
    );
}
