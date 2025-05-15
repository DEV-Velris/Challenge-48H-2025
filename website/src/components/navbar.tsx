'use client';

import React, {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {NavbarItem} from "@/types";
import {usePathname} from "next/navigation";
import {signIn, signOut, useSession} from "next-auth/react";
import {LuUser} from "react-icons/lu";

const navItems: NavbarItem[] = [
    {label: 'Accueil', href: '/'},
    {label: 'En Direct', href: '/event'},
    {label: "Chat en direct", href: '/chat'},
    {label: 'Activités', href: '/activity'},
];

export const Navbar: React.FC = () => {
    const {data: session} = useSession();
    const currentPath = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedInDropdownOpen, setIsLoggedInDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('button[data-auth-action]')) {
                setIsLoggedInDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsLoggedInDropdownOpen(!isLoggedInDropdownOpen);
    };

    const handleAuthClick = async (event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        console.log('isSessionPresent', session !== null);
        if (!session) {
            signIn("google", {redirectTo: currentPath});
        } else {
            console.log('signOut');
            signOut({redirectTo: currentPath});
        }
    };

    return (
        <nav className="bg-white shadow-md shadow-blue fixed top-0 left-0 right-0 w-full z-50">
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
                            <span className="font-title text-lg text-gray-1">SentiLyon</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-md ${
                                    currentPath === item.href
                                        ? 'bg-blue opacity-80 text-white'
                                        : 'hover:bg-blue opacity-80 hover:text-white text-gray-1'
                                } transition-colors duration-200`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center" ref={dropdownRef}>
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center justify-center ml-4 rounded-full bg-blue text-white w-10 h-10 hover:bg-blue-600 transition-colors duration-200"
                            >
                                {session ? (
                                    <Image
                                        src={session.user?.image || ''}
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <LuUser className="h-6 w-6"/>
                                )}
                            </button>
                            {isLoggedInDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <button
                                        data-auth-action="true"
                                        onClick={(e) => handleAuthClick(e)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {session ? 'Se déconnecter' : 'Se connecter'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center justify-center rounded-full bg-blue text-white w-10 h-10 mr-2"
                            >
                                {session ? (
                                    <Image
                                        src={session.user?.image || ''}
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <LuUser className="h-6 w-6"/>
                                )}
                            </button>
                            {isLoggedInDropdownOpen && !isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <button
                                        data-auth-action="true"
                                        onClick={(e) => handleAuthClick(e)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {session ? 'Se déconnecter' : 'Se connecter'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-1 focus:outline-none z-50"
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
                <div className="md:hidden fixed inset-0 bg-white z-40 flex flex-col pt-16">
                    <div className="px-4 py-6 flex flex-col justify-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-3 text-xl rounded-md mb-4 ${
                                    currentPath === item.href
                                        ? 'bg-blue opacity-80 text-white'
                                        : 'text-gray-1'
                                }`}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <button
                            data-auth-action="true"
                            onClick={(e) => {
                                handleAuthClick(e);
                                setIsMenuOpen(false);
                            }}
                            className="block px-4 py-3 text-xl rounded-md mb-4 text-gray-1"
                        >
                            {session ? 'Se déconnecter' : 'Se connecter'}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;