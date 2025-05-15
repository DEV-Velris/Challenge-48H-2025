'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {NavbarItem} from "@/types";

const navItems: NavbarItem[] = [
    {label: 'Accueil', href: '/'},
    {label: 'En Direct', href: '/event'},
    {label: "Chat en direct", href: '/chat'},
    {label: 'Activités', href: '/activity'},
];

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('/');

    useEffect(() => {
        // Empêcher le défilement du body quand le menu est ouvert
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        setActiveItem(window.location.pathname);

        // Nettoyage au démontage du composant
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-blue shadow-md fixed top-0 left-0 right-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
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
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-md ${
                                    activeItem === item.href
                                        ? 'bg-red text-white'
                                        : 'hover:bg-red text-white'
                                } transition-colors duration-200`}
                                onClick={() => setActiveItem(item.href)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none z-50"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Ouvrir le menu</span>
                            {!isMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-blue z-40 flex flex-col pt-16">
                    <div className="px-4 py-6 flex flex-col justify-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-3 text-xl rounded-md mb-4 ${
                                    activeItem === item.href
                                        ? 'bg-red text-white'
                                        : 'text-white'
                                }`}
                                onClick={() => {
                                    setActiveItem(item.href);
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;