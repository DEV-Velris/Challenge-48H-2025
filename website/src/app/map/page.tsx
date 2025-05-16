'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import mqtt from 'mqtt';
import {FaWater, FaMountain} from 'react-icons/fa';

const MapComponent = dynamic(() => import('@/_components/Map/Map'), {ssr: false});

type EarthquakePayload = {
    magnitude: number;
    depth: number;
    timestamp: string;
};

type FloodPayload = {
    waterLevel: number;
    duration: number;
    timestamp: string;
};

type EventPayload = EarthquakePayload | FloodPayload;

type MessageType = {
    topic: string;
    payload: EventPayload;
};

const extractArrondissement = (topic: string) => {
    const match = topic.match(/^lyon\/([^/]+)/);
    return match ? match[1].toLowerCase() : 'inconnu';
};

const normalize = (s: string) =>
    s
        .toLowerCase()
        .replace(/ème/g, 'e')
        .replace(/[^\w]/g, '')
        .trim();

const order = ['1er', '2e', '3e', '4e', '5e', '6e', '7e', '8e', '9e'].map(normalize);

const formatKeyValue = (key: string, value: any): { label: string; displayValue: string } => {
    switch (key) {
        case 'waterLevel':
            return {label: "Niveau de l'eau", displayValue: `${value} m`};
        case 'duration':
            return {label: 'Durée', displayValue: `${value} h`};
        case 'depth':
            return {label: 'Profondeur', displayValue: `${value} km`};
        case 'magnitude':
            return {label: 'Magnitude', displayValue: `${value}`};
        case 'timestamp':
            const hour = new Date(value).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            return {label: 'Heure', displayValue: hour};
        default:
            return {label: key, displayValue: String(value)};
    }
};

export default function DashboardPage() {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
    const [configError, setConfigError] = useState<string | null>(null);

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_MQTT_BROKER_URL) {
            setConfigError("URL du broker MQTT non configurée. Veuillez configurer NEXT_PUBLIC_MQTT_BROKER_URL dans votre fichier .env");
            setConnectionStatus('disconnected');
            return;
        }

        const options = {
            clientId: 'website_' + Math.random().toString(16).substring(2, 8) + '_' + new Date().getTime(),
            clean: true,
            connectTimeout: 8000,
            reconnectPeriod: 3000,
            keepalive: 60,
            rejectUnauthorized: false,
        };

        let client;
        try {
            client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL, options);
        } catch (error) {
            console.error("❌ Erreur lors de la création du client MQTT:", error);
            setConfigError(`Erreur de connexion au broker MQTT: ${error}`);
            setConnectionStatus('disconnected');
            return;
        }

        client.on('connect', () => {
            setConnectionStatus('connected');
            setConfigError(null);
            client.subscribe('lyon/#', (err) => {
                if (err) console.error('❌ Erreur subscription:', err);
            });
        });

        client.on('message', (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                setMessages((prev) => {
                    const newMsg = {topic, payload};
                    const exists = prev.some(
                        (msg) => msg.topic === newMsg.topic && msg.payload.timestamp === newMsg.payload.timestamp
                    );

                    if (!exists) {
                        const type = getType(topic);
                        const arrondissement = extractArrondissement(topic);

                        // Exécuter dans un setTimeout pour éviter les problèmes de contexte
                        setTimeout(() => {
                            try {
                                if (Notification.permission === 'granted') {
                                    let notificationBody = "";
                                    if (type === 'Inondation') {
                                        notificationBody = `Niveau d'eau: ${payload.waterLevel}m, Durée: ${payload.duration}h`;
                                    } else if (type === 'Séisme') {
                                        notificationBody = `Magnitude: ${payload.magnitude}, Profondeur: ${payload.depth}km`;
                                    }

                                    new Notification(`${type} - Arrondissement ${arrondissement}`, {
                                        body: notificationBody,
                                        icon: '/favicon.ico',
                                        requireInteraction: true
                                    });
                                } else {
                                    Notification.requestPermission();
                                }
                            } catch (err) {
                                console.error('Erreur notification:', err);
                            }
                        }, 100);
                    }

                    return exists ? prev : [newMsg, ...prev];
                });
            } catch (err) {
                console.error('❌ Erreur de parsing JSON:', err);
            }
        });

        client.on('error', (error) => {
            console.error('❌ MQTT error:', error);
            setConnectionStatus('disconnected');
            setConfigError(`Erreur MQTT: ${error.message}`);
        });

        return () => {
            if (client && client.connected) {
                client.end(true);
            }
        };
    }, []);

    const getIcon = (topic: string) => {
        if (topic.includes('flood')) return <FaWater className="text-blue-500" size={16}/>;
        if (topic.includes('earthquake')) return <FaMountain className="text-red-500" size={16}/>;
        return null;
    };

    const getType = (topic: string) => {
        if (topic.includes('flood')) return 'Inondation';
        if (topic.includes('earthquake')) return 'Séisme';
        return 'Aucun';
    };

    const arrondissements = order;

    return (
        <div className="min-h-screen">
            {/* 💻 Desktop: two-column layout */}
            <div className="hidden lg:grid grid-cols-2 min-h-screen">
                <div className="h-screen">
                    <MapComponent/>
                </div>
                <div className="overflow-y-auto bg-gray-50 p-6 flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">INFOS 🚨</h1>

                    {configError && (
                        <div className="p-4 mb-4 rounded-lg bg-red-100 border-l-4 border-red-500">
                            <p className="text-red-700 font-medium">⚠️ {configError}</p>
                        </div>
                    )}

                    {connectionStatus !== 'connected' && (
                        <div
                            className={`p-4 mb-4 rounded-lg ${connectionStatus === 'connecting' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                            <p className="font-medium">
                                {connectionStatus === 'connecting' ? 'Connexion en cours...' : 'Non connecté au serveur MQTT'}
                            </p>
                        </div>
                    )}

                    <h2 className="text-2xl font-semibold mb-4">Arrondissements</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {arrondissements.map((arr, i) => {
                            const status = messages.find((msg) => normalize(msg.topic).includes(arr));
                            const type = status ? getType(status.topic) : 'Aucun';
                            const icon = status ? getIcon(status.topic) : null;
                            const statusColor =
                                type === 'Inondation'
                                    ? 'bg-blue-100 text-blue-600'
                                    : type === 'Séisme'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600';

                            return (
                                <div
                                    key={i}
                                    className={`border rounded-xl p-4 shadow-sm bg-white ${statusColor}`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {icon}
                                        <span className="font-semibold text-lg">Arr. {arr.toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm mb-2">
                                        Statut : <span className="font-mono font-medium">{type}</span>
                                    </p>
                                    {status?.payload ? (
                                        <ul className="text-sm text-gray-700 space-y-0.5">
                                            {Object.entries(status.payload).map(([key, value]) => {
                                                const {label, displayValue} = formatKeyValue(key, value);
                                                return (
                                                    <li key={key}>
                                                        <strong>{label}:</strong>{' '}
                                                        <span className="font-mono">{displayValue}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Aucun événement signalé.</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <h2 className="text-2xl font-semibold mb-4">Derniers événements</h2>
                    <div className="overflow-y-auto max-h-64 pr-1">
                        <ul className="space-y-3">
                            {messages
                                .filter((msg) => msg.payload && Object.keys(msg.payload).length > 0)
                                .map((msg, i) => {
                                    const type = getType(msg.topic);
                                    const icon = getIcon(msg.topic);
                                    const badgeColor =
                                        type === 'Inondation'
                                            ? 'bg-blue-100 text-blue-600'
                                            : type === 'Séisme'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-gray-200 text-gray-600';

                                    return (
                                        <li
                                            key={i}
                                            className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 flex items-start justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {icon}
                                                    <span className="font-semibold text-gray-800">{type}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                            {extractArrondissement(msg.topic)}
                          </span>
                                                </div>
                                                <ul className="text-sm text-gray-600 space-y-0.5">
                                                    {Object.entries(msg.payload).map(([key, value]) => {
                                                        const {label, displayValue} = formatKeyValue(key, value);
                                                        return (
                                                            <li key={key}>
                                                                <strong>{label}:</strong>{' '}
                                                                <span className="font-mono">{displayValue}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 📱 Mobile layout */}
            <div className="lg:hidden flex flex-col p-4 space-y-6 bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-800">INFOS 🚨</h1>

                <h2 className="text-2xl font-semibold">Arrondissements</h2>
                <div className="grid grid-cols-2 gap-4">
                    {arrondissements.map((arr, i) => {
                        const status = messages.find((msg) => normalize(msg.topic).includes(arr));
                        const type = status ? getType(status.topic) : 'Aucun';
                        const icon = status ? getIcon(status.topic) : null;
                        const statusColor =
                            type === 'Inondation'
                                ? 'bg-blue-100 text-blue-600'
                                : type === 'Séisme'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600';

                        return (
                            <div
                                key={i}
                                className={`border rounded-xl p-3 shadow-sm bg-white ${statusColor}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {icon}
                                    <span className="font-semibold text-sm">Arr. {arr.toUpperCase()}</span>
                                </div>
                                <p className="text-xs mb-1">
                                    Statut : <span className="font-mono font-medium">{type}</span>
                                </p>
                                {status?.payload ? (
                                    <ul className="text-xs text-gray-700 space-y-0.5">
                                        {Object.entries(status.payload).map(([key, value]) => {
                                            const {label, displayValue} = formatKeyValue(key, value);
                                            return (
                                                <li key={key}>
                                                    <strong>{label}:</strong>{' '}
                                                    <span className="font-mono">{displayValue}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">Aucun événement.</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ✅ MAP SECTION */}
                <div className="h-[40vh]">
                    <MapComponent/>
                </div>

                {/* ✅ "Derniers événements" now clearly below the map */}
                {/* Derniers événements scrollable container */}
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-2">Derniers événements</h2>
                    <div
                        className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <ul className="space-y-3">
                            {messages
                                .filter((msg) => msg.payload && Object.keys(msg.payload).length > 0)
                                .map((msg, i) => {
                                    const type = getType(msg.topic);
                                    const icon = getIcon(msg.topic);
                                    const badgeColor =
                                        type === 'Inondation'
                                            ? 'bg-blue-100 text-blue-600'
                                            : type === 'Séisme'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-gray-200 text-gray-600';

                                    return (
                                        <li
                                            key={i}
                                            className="bg-white shadow-sm rounded-lg p-3 border border-gray-200"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {icon}
                                                <span className="font-semibold text-gray-800">{type}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {extractArrondissement(msg.topic)}
                        </span>
                                            </div>
                                            <ul className="text-xs text-gray-600 space-y-0.5">
                                                {Object.entries(msg.payload).map(([key, value]) => {
                                                    const {label, displayValue} = formatKeyValue(key, value);
                                                    return (
                                                        <li key={key}>
                                                            <strong>{label}:</strong>{' '}
                                                            <span className="font-mono">{displayValue}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}