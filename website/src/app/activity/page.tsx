'use client';

import {useState} from 'react';
import React from 'react';
import {
    FaSwimmer,
    FaFireExtinguisher,
    FaBiking,
    FaSolarPanel,
    FaHandHoldingHeart,
} from 'react-icons/fa';
import {Activity} from "@/types";

const activities: Activity[] = [
    {
        icon: <FaSwimmer className="text-blue-500 group-hover:text-white" size={20}/>,
        title: "Surf en zone inondée",
        description: "Activité encadrée pour décompresser tout en explorant les zones aquatiques urbaines.",
        badge: "Fun"
    },
    {
        icon: <FaFireExtinguisher className="text-red-500 group-hover:text-white" size={20}/>,
        title: "Atelier extincteurs & premiers gestes",
        description: "Apprenez à réagir efficacement en cas de départ de feu ou de blessure légère.",
        badge: "Éducatif"
    },
    {
        icon: <FaBiking className="text-orange-500 group-hover:text-white" size={20}/>,
        title: "Randonnée post-urgence",
        description: "Partez en groupe dans des zones sûres pour vous ressourcer physiquement et mentalement.",
        badge: "Bien-être"
    },
    {
        icon: <FaSolarPanel className="text-green-600 group-hover:text-white" size={20}/>,
        title: "Atelier d'énergie autonome",
        description: "Découvrez comment utiliser panneaux solaires, générateurs manuels et batteries portables.",
        badge: "Survie Tech"
    },
    {
        icon: <FaHandHoldingHeart className="text-purple-500 group-hover:text-white" size={20}/>,
        title: "Rencontres solidaires",
        description: "Événements pour créer du lien, échanger du matériel ou des infos avec vos voisins.",
        badge: "Communautaire"
    },
];

const categories = ['Tous', ...new Set(activities.map(a => a.badge))];

export default function ActivitiesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

    const filteredActivities = selectedCategory === 'Tous'
        ? activities
        : activities.filter(a => a.badge === selectedCategory);

    return (
        <main className="min-h-screen py-10 px-4 md:px-10 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-1 mb-8">Activités</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                selectedCategory === cat
                                    ? 'bg-blue opacity-80 text-white'
                                    : 'bg-gray-200 text-gray-1'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredActivities.map((activity, index) => (
                        <div
                            key={index}
                            className="bg-blue opacity-80 shadow-md rounded-xl p-6 hover:cursor-pointer hover:bg-white hover:border-4 hover:border-blue group box-border hover:p-[calc(1.5rem-4px)]"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="p-2 bg-gray-100 group-hover:bg-gray-1 rounded-full">{activity.icon}</div>
                                <h2 className="text-xl font-semibold text-white group-hover:text-gray-1">{activity.title}</h2>
                            </div>
                            <p className="text-white group-hover:text-gray-1">{activity.description}</p>
                            <span
                                className="inline-block mt-4 text-sm font-medium px-3 py-1 rounded-full bg-white group-hover:bg-gray-1 text-gray-1 group-hover:text-white">
                {activity.badge}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}