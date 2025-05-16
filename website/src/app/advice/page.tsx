'use client';

import { useState } from 'react';
import {
  FaWifi,
  FaMapMarkedAlt,
  FaTools,
  FaBrain,
  FaHiking
} from 'react-icons/fa';

const conseils = [
  {
    icon: <FaTools className="text-blue-500 group-hover:text-white" size={20} />,
    title: "Kit de Survie Numérique",
    description:
      "Préparez un kit avec power bank solaire, carte satellite, app d'urgence, documents scannés et tuto de chiffrement.",
    badge: "Essentiel"
  },
  {
    icon: <FaMapMarkedAlt className="text-red-500 group-hover:text-white" size={20} />,
    title: "Réagir par type de catastrophe",
    description:
      "Inondation : fuyez les zones basses. Séisme : coupez gaz/élec. Cyberattaque : déconnectez vos appareils.",
    badge: "Urgence"
  },
  {
    icon: <FaHiking className="text-orange-500 group-hover:text-white" size={20} />,
    title: "Check-list d'évacuation rapide",
    description:
      "Appli hors-ligne, filtre à eau, gants, casque, liste de contacts, QR codes de secours.",
    badge: "Prêt à partir"
  },
  {
    icon: <FaBrain className="text-purple-500 group-hover:text-white" size={20} />,
    title: "Gérer son stress",
    description:
      "Respiration, podcast de crise, activités détente comme le surf urbain ou karaoké post-sismique.",
    badge: "Bien-être"
  },
  {
    icon: <FaWifi className="text-green-500 group-hover:text-white" size={20} />,
    title: "Tech & réseaux d'urgence",
    description:
      "Générateur manuel, réseau Mesh local, relais Wi-Fi avec drone, données en mode économie.",
    badge: "Innovant"
  }
];

const categories = ['Tous', ...new Set(conseils.map(c => c.badge))];

export default function ConseilsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const filteredConseils =
    selectedCategory === 'Tous'
      ? conseils
      : conseils.filter(c => c.badge === selectedCategory);

  return (
    <main className="min-h-screen py-10 px-4 md:px-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Conseils de survie</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue opacity-80 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredConseils.map((conseil, index) => (
            <div
              key={index}
              className="bg-blue opacity-80 shadow-md rounded-xl p-6 hover:cursor-pointer hover:bg-white hover:border-4 hover:border-blue group box-border hover:p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 group-hover:bg-gray-800 rounded-full">
                  {conseil.icon}
                </div>
                <h2 className="text-xl font-semibold text-white group-hover:text-gray-800">
                  {conseil.title}
                </h2>
              </div>
              <p className="text-white group-hover:text-gray-800">
                {conseil.description}
              </p>
              <span className="inline-block mt-4 text-sm font-medium px-3 py-1 rounded-full bg-white group-hover:bg-gray-800 text-gray-800 group-hover:text-white">
                {conseil.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}