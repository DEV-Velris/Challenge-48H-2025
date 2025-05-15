// src/components/MapComponent.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import mqtt from 'mqtt';
import lyonGeoJson from '../../app/map/lyon.geo.json'; // adjust path
import 'leaflet/dist/leaflet.css';

type DisasterType = 'none' | 'flood' | 'earthquake';

type StatusMap = {
  [arrondissement: string]: DisasterType;
};

const extractArrondissement = (topic: string) => {
  const match = topic.match(/^lyon\/([^/]+)/);
  return match ? match[1] : 'Inconnu';
};

export default function MapComponent() {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const geoJsonLayerRef = useRef<L.GeoJSON>(null);

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001');

    client.on('connect', () => {
      console.log('✅ Connecté au broker MQTT');
      client.subscribe('lyon/#');
    });

    client.on('message', (topic, message) => {
  const arr = extractArrondissement(topic);
  console.log('📩 MQTT Message:', topic, arr, message.toString()); // 👈 ADD THIS

  if (!arr) return;

  let disaster: DisasterType = 'none';
  if (topic.includes('flood')) disaster = 'flood';
  else if (topic.includes('earthquake')) disaster = 'earthquake';

  setStatusMap((prev) => ({
    ...prev,
    [arr]: disaster,
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
      const arr = feature.properties.nom;
      const color = getColor(arr);

      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.6,
        color: '#555',
        weight: 1,
      });

      layer.bindPopup(`<b>${arr}</b><br>Status: ${statusMap[arr] || 'none'}`);
    });
  }, [statusMap]);

  const getColor = (arr: string): string => {
    const status = statusMap[arr];
    switch (status) {
      case 'flood':
        return '#60A5FA';
      case 'earthquake':
        return '#F87171';
      default:
        return '#E5E7EB';
    }
  };

  return (
    <div className="h-screen w-full">
      <MapContainer center={[45.75, 4.85]} zoom={12} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={lyonGeoJson as any}
          ref={geoJsonLayerRef}
          style={(feature) => ({
            fillColor: getColor(feature?.properties?.nom),
            color: '#555',
            weight: 1,
            fillOpacity: 0.6,
          })}
        />
      </MapContainer>
    </div>
  );
}