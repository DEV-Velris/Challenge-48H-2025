import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {FooterLink} from "@/types";

const footerLinks: FooterLink[] = [
    {
        heading: 'Navigation',
        links: [
            {label: 'Accueil', href: '/'},
            {label: 'En Direct', href: '/event'},
            {label: 'Chat en direct', href: '/chat'},
            {label: 'Activités', href: '/activity'},
        ]
    },
    {
        heading: 'Informations',
        links: [
            {label: 'À propos', href: '/about'},
            {label: 'Notre mission', href: '/mission'},
            {label: "L'équipe", href: '/team'},
            {label: 'Contact', href: '/contact'},
        ]
    },
    {
        heading: 'Légal',
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo/Coat_of_Arms_of_Lyon.svg"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="mr-2"
                            />
                            <span className="font-title text-lg text-white">SentiLyon</span>
                        </Link>
                        <p className="text-white text-sm">
                            Protégeant Lyon contre les menaces du futur, une ligne de code à la fois.
                        </p>
                    </div>

                    {footerLinks.map((column, idx) => (
                        <div key={idx}>
                            <h3 className="font-title text-red underline mb-4">{column.heading}</h3>
                            <ul className="space-y-2">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-white hover:underline transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                    <p className="text-white text-sm">
                        © {new Date().getFullYear()} SentiLyon. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;