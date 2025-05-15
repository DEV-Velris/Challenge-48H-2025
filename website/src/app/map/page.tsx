'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../../components/Map/Map'), {
  ssr: false,  // disable server-side rendering for this component
});

export default function MapPage() {
  return <MapComponent />;
}