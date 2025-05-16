'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import mqtt from 'mqtt';
import lyonGeoJson from './lyon.geo.json';
import 'leaflet/dist/leaflet.css';

const DisasterEnum: Record<'flood' | 'earthquake', string> = {
  flood: 'Inondation',
  earthquake: 'Séisme',
};

type DisasterType = keyof typeof DisasterEnum | 'none';

type StatusMap = {
  [arr: string]: {
    type: DisasterType;
    data: any;
    timestamp?: string;
  };
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/ème/g, 'e')
    .replace(/[^\w]/g, '')
    .trim();

const extractArrondissement = (topic: string) => {
  const match = topic.match(/^lyon\/([^/]+)/);
  return match ? normalize(match[1]) : 'inconnu';
};

const extractArrFromFeatureName = (name: string): string => {
  const match = name.match(/(\d{1,2}(?:er|e))/i);
  return match ? normalize(match[1]) : normalize(name);
};

export default function MapPage() {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const geoJsonLayerRef = useRef<L.GeoJSON>(null);

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001');

    client.on('connect', () => {
      console.log('✅ Connecté au broker MQTT');
      client.subscribe('lyon/#');
    });

    client.on('message', (topic, message) => {
      const rawArr = extractArrondissement(topic);
      const arr = normalize(rawArr);
      if (!arr) return;

      let disaster: DisasterType = 'none';
      if (topic.includes('flood')) disaster = 'flood';
      else if (topic.includes('earthquake')) disaster = 'earthquake';
      else if (topic.includes('none')) disaster = 'none';

      const payload = JSON.parse(message.toString());

      setStatusMap((prev) => ({
        ...prev,
        [arr]: {
          type: disaster,
          data: payload,
          timestamp: payload.timestamp ?? new Date().toISOString(),
        },
      }));
    });

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      const rawArr = feature.properties?.nom;
      const arr = extractArrFromFeatureName(rawArr);
      const statusInfo = statusMap[arr];
      const type = statusInfo?.type ?? 'none';
      const data = statusInfo?.data ?? {};
      const timestamp = statusInfo?.timestamp
        ? new Date(statusInfo.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      layer.setStyle({
        fillColor: getColor(arr),
        fillOpacity: 0.6,
        color: '#555',
        weight: 1,
      });

      let popupContent = `<b>Arr. ${rawArr.toUpperCase()}</b><br><strong>Statut :</strong> `;

      if (type === 'flood') {
        popupContent += `Inondation<br><br>Niveau de l'eau: ${data.waterLevel ?? '?'} m<br>Durée: ${data.duration ?? '?'} h`;
        if (timestamp) popupContent += `<br>Heure: ${timestamp}`;
      } else if (type === 'earthquake') {
        popupContent += `Séisme<br><br>Magnitude: ${data.magnitude ?? '?'}<br>Profondeur: ${data.depth ?? '?'} km`;
        if (timestamp) popupContent += `<br>Heure: ${timestamp}`;
      } else {
        // For 'none' status: fixed message without timestamp
        popupContent += `Aucun<br><br>Aucun événement signalé.`;
      }

      layer.bindPopup(popupContent);
    });
  }, [statusMap]);

  const getColor = (arr: string): string => {
    const status = statusMap[arr]?.type;
    switch (status) {
      case 'flood':
        return '#60A5FA'; // Blue
      case 'earthquake':
        return '#F87171'; // Red
      default:
        return '#E5E7EB'; // Gray
    }
  };

  return (
    <div className="h-screen w-full p-4 sm:mb-124">
      <MapContainer
        center={[45.75, 4.85]}
        zoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={lyonGeoJson as any}
          ref={geoJsonLayerRef}
          style={(feature) => {
            const rawArr = feature?.properties?.nom;
            const arr = extractArrFromFeatureName(rawArr);
            return {
              fillColor: getColor(arr),
              color: '#555',
              weight: 1,
              fillOpacity: 0.6,
            };
          }}
        />
      </MapContainer>
    </div>
  );
}