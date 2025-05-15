'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { FaWater, FaMountain } from 'react-icons/fa';

type MessageType = {
  topic: string;
  payload: any;
};

export default function InfoPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001');

    client.on('connect', () => {
      console.log('✅ Connecté au broker MQTT via WebSocket');
      client.subscribe('lyon/#', (err) => {
        if (err) console.error('❌ Erreur subscription', err);
        else console.log('📡 Abonné au topic lyon/#');
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log(`📨 Message reçu sur ${topic}:`, payload);
        // Ajoute en début de liste
        setMessages((prev) => [{ topic, payload }, ...prev]);
      } catch (err) {
        console.error('❌ Erreur de parsing JSON:', err);
      }
    });

    client.on('error', (error) => {
      console.error('❌ MQTT error:', error);
    });

    return () => {
      client.end();
    };
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages MQTT reçus</h1>

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
                      {msg.topic}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-0.5">
                    {Object.entries(msg.payload).map(([key, value]) => (
                      <li key={key}>
                        <strong className="capitalize">{key}:</strong>{' '}
                        <span className="font-mono">{value.toString()}</span>
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