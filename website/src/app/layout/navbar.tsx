'use client';

import React, { useState, useEffect } from 'react';


const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Notre Mission', href: '#mission' },
    { label: "L'équipe", href: '#team' },
    { label: 'Technologies', href: '#tech' },
    { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-700 shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">Titre</span>
                    </div>

                    <div className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-white hover:text-red-500 font-medium transition-colors duration-200"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '×' : '☰'}
                    </button>
                </nav>

                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-blue-700">
                        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-white hover:text-red-500 py-2 font-medium transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
