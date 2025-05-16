'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { FaWater, FaMountain } from 'react-icons/fa';

const MapComponent = dynamic(() => import('../../components/Map/Map'), { ssr: false });

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

export default function DashboardPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const options = {
      clientId: 'website_' + Math.random().toString(16).substring(2, 8),
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 2000,
    };

    if (!process.env.NEXT_PUBLIC_MQTT_BROKER_URL) {
      setConfigError('URL du broker MQTT non configurée');
    } else {
      const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL, options);

      client.on('connect', () => {
        setConnectionStatus('connected');
        client.subscribe('lyon/#');
      });

      client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          setMessages((prev) => [{ topic, payload }, ...prev]);
        } catch (err) {
          console.error('❌ Erreur de parsing JSON:', err);
        }
      });

      client.on('error', () => setConnectionStatus('disconnected'));
      client.on('disconnect', () => setConnectionStatus('disconnected'));
      client.on('reconnect', () => setConnectionStatus('connecting'));
      client.on('offline', () => setConnectionStatus('disconnected'));

      return () => {
        client.end();
      };
    }
  }, []);

  const getIcon = (topic: string) => {
    if (topic.includes('flood')) return <FaWater className="text-blue-500" size={16} />;
    if (topic.includes('earthquake')) return <FaMountain className="text-red-500" size={16} />;
    return null;
  };

  const getType = (topic: string) => {
    if (topic.includes('flood')) return 'Inondation';
    if (topic.includes('earthquake')) return 'Séisme';
    return 'Aucun';
  };

  const arrondissements = order;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* 🗺️ Map */}
      <div className="h-[50vh] lg:h-screen">
        <MapComponent />
      </div>

      {/* 📋 Info + Cards */}
      <div className="overflow-y-auto bg-gray-50 p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">INFOS 🚨</h1>

        {configError && (
          <div className="p-4 mb-4 rounded-lg bg-red-100 border-l-4 border-red-500">
            <p className="text-red-700 font-medium">⚠️ {configError}</p>
          </div>
        )}

        {connectionStatus !== 'connected' && (
          <div className={`p-4 mb-4 rounded-lg ${connectionStatus === 'connecting' ? 'bg-yellow-100' : 'bg-red-100'}`}>
            <p className="font-medium">
              {connectionStatus === 'connecting' ? 'Connexion en cours...' : 'Non connecté au serveur MQTT'}
            </p>
          </div>
        )}

        {/* 🧊 Arrondissement Cards */}
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
                      if (key === 'timestamp') {
                        const hour = new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <li key={key}>
                            <strong>Heure:</strong> <span className="font-mono">{hour}</span>
                          </li>
                        );
                      }
                      return (
                        <li key={key}>
                          <strong className="capitalize">{key}:</strong>{' '}
                          <span className="font-mono">{String(value)}</span>
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

        {/* 📜 Event Log */}
        <h2 className="text-2xl font-semibold mb-4">Derniers événements</h2>
        <div className="overflow-y-auto max-h-64 pr-1">
          <ul className="space-y-3">
            {messages.map((msg, i) => {
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
                        if (key === 'timestamp') {
                          const hour = new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <li key={key}>
                              <strong>Heure:</strong> <span className="font-mono">{hour}</span>
                            </li>
                          );
                        }
                        return (
                          <li key={key}>
                            <strong className="capitalize">{key}:</strong>{' '}
                            <span className="font-mono">{String(value)}</span>
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
  );
}