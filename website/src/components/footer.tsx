import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-700 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">Titre</span>
                        </div>
                        <p className="text-gray-200">
                            Protégeant Lyon contre les menaces du futur, une ligne de code à la fois.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-red-500">Navigation</h3>
                        <ul className="space-y-2">
                            {['Accueil', 'Notre Mission', "L'équipe", 'Technologies', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white hover:text-red-500 transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-8 pt-8 text-center">
                    <p className="text-white">
                        © {new Date().getFullYear()} Titre. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};