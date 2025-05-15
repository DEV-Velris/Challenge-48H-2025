import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {FooterLink} from "@/types";

const footerLinks: FooterLink[] = [
    {
        links: [
            {label: 'Accueil', href: '/'},
            {label: 'En Direct', href: '/event'},
            {label: 'Chat en direct', href: '/chat'},
            {label: 'Activités', href: '/activity'},
        ]
    },
    {
        links: [
            {label: 'Mentions légales', href: '/legal'},
            {label: 'Politique de confidentialité', href: '/privacy'},
            {label: 'Conditions d\'utilisation', href: '/terms'},
        ]
    },
];

export const Footer: React.FC = () => {
    return (
        <footer className="bg-blue shadow-md mt-auto relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                    <Link href="/">
                        <Image
                            src="/logo/Coat_of_Arms_of_Lyon.svg"
                            alt="Logo"
                            width={150}
                            height={150}
                        />
                    </Link>
                    <div className="hidden md:block border-l border-white h-24"></div>
                    <div className="flex flex-col md:ml-0 items-center">
                        <div className={"flex flex-col md:flex-row justify-center items-center gap-2 mb-4"}>
                            <span className="font-title text-lg text-white">SentiLyon <span className={"hidden md:inline"}>-</span></span>
                            <p className="font-title text-white text-center !italic">
                                Protégeant Lyon contre les menaces du futur, une ligne de code à la fois.
                            </p>
                        </div>

                        {footerLinks.map((column, idx) => (
                            <div key={idx} className={"flex flex-col items-center md:flex-row md:gap-2 not-last:mb-4"}>
                                {column.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="text-white text-sm hover:underline"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        ))}

                        <p className="text-white text-sm mt-4">
                            © {new Date().getFullYear()} SentiLyon. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;