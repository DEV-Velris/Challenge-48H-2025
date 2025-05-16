'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import mqtt from 'mqtt';
import lyonGeoJson from './lyon.geo.json';
import 'leaflet/dist/leaflet.css';

type DisasterType = 'none' | 'flood' | 'earthquake';

type StatusMap = {
  [arr: string]: DisasterType;
};

// 🔧 Normalize text
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/ème/g, 'e')
    .replace(/[^\w]/g, '')
    .trim();

// 📡 Extract 'lyon/3e/flood' → '3e'
const extractArrondissement = (topic: string) => {
  const match = topic.match(/^lyon\/([^/]+)/);
  return match ? normalize(match[1]) : 'inconnu';
};

// 🗺️ Extract '3e', '1er' from full GeoJSON label
const extractArrFromFeatureName = (name: string): string => {
  const match = name.match(/(\d{1,2}(?:er|e))/i);
  return match ? normalize(match[1]) : normalize(name);
};

export default function MapPage() {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const geoJsonLayerRef = useRef<L.GeoJSON>(null);

  // ✅ MQTT setup
  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001');

    client.on('connect', () => {
      console.log('✅ Connecté au broker MQTT');
      client.subscribe('lyon/#');
    });

    client.on('message', (topic, message) => {
      const rawArr = extractArrondissement(topic);
      const arr = normalize(rawArr);
      console.log('📩 MQTT Message:', topic, rawArr, '→', arr, message.toString());

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

  // 🖌️ Update colors on statusMap change
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      const rawArr = feature.properties?.nom;
      const arr = extractArrFromFeatureName(rawArr);
      const color = getColor(arr);

      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.6,
        color: '#555',
        weight: 1,
      });

      layer.bindPopup(`<b>${rawArr}</b><br>Status: ${statusMap[arr] || 'none'}`);
    });
  }, [statusMap]);

  const getColor = (arr: string): string => {
    const status = statusMap[arr];
    console.log(`🎨 Status for ${arr}: ${status}`);
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