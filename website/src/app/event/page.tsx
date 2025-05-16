'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { FaWater, FaMountain } from 'react-icons/fa';

type EarthquakePayload = {
  magnitude: number;
  depth: number;
  timestamp: string;
}

type FloodPayload = {
  waterLevel: number;
  duration: number;
  timestamp: string;
}

type EventPayload = EarthquakePayload | FloodPayload;

type MessageType = {
  topic: string;
  payload: EventPayload;
};

const extractArrondissement = (topic: string) => {
  const match = topic.match(/^lyon\/([^/]+)/);
  return match ? match[1] : 'Inconnu';
};

export default function InfoPage() {
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
      setConfigError("URL du broker MQTT non configurée");
    } else {
      const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL, options);

      client.on('connect', () => {
        setConnectionStatus('connected');
        client.subscribe('lyon/#', (err) => {
          if (err) console.error('❌ Erreur subscription:', err);
        });
      });

      client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          setMessages((prev) => [{ topic, payload }, ...prev]);
        } catch (err) {
          console.error('❌ Erreur de parsing JSON:', err);
        }
      });

      client.on('error', (error) => {
        console.error('❌ MQTT error:', error);
        setConnectionStatus('disconnected');
      });

      client.on('disconnect', () => {
        setConnectionStatus('disconnected');
      });

      client.on('reconnect', () => {
        setConnectionStatus('connecting');
      });

      client.on('offline', () => {
        setConnectionStatus('disconnected');
      });

      return () => {
        client.end();
      };
    }
  }, []);

  const getIcon = (topic: string) => {
    if (topic.includes('flood')) {
      return <FaWater className="text-blue-500" size={16} />;
    } else if (topic.includes('earthquake')) {
      return <FaMountain className="text-red-500" size={16} />;
    }
    return null;
  };

  const getType = (topic: string) => {
    if (topic.includes('flood')) return 'Inondation';
    if (topic.includes('earthquake')) return 'Séisme';
    return 'Autre';
  };

  return (
      <main className="min-h-screen py-10 px-4 md:px-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">INFOS 🚨</h1>

          {configError && (
              <div className="p-4 mb-4 rounded-lg bg-red-100 border-l-4 border-red-500">
                <p className="text-red-700 font-medium">
                  <span className="mr-2">⚠️</span>
                  {configError}
                </p>
              </div>
          )}

          {connectionStatus !== 'connected' && (
              <div className={`p-4 mb-4 rounded-lg ${connectionStatus === 'connecting' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <p className="font-medium">
                  {connectionStatus === 'connecting' ? 'Connexion en cours...' : 'Non connecté au serveur MQTT'}
                </p>
              </div>
          )}

          <ul className="space-y-2">
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
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}
                        >
                      {extractArrondissement(msg.topic)}
                    </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-0.5">
                        {Object.entries(msg.payload).map(([key, value]) => (
                            <li key={key}>
                              <strong className="capitalize">{key}:</strong>{' '}
                              <span className="font-mono">{String(value)}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </li>
              );
            })}
          </ul>
        </div>
      </main>
  );
}