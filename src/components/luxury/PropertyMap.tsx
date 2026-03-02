'use client';

import { useEffect, useRef, useState } from 'react';

interface MapLocation {
  lng: number;
  lat: number;
  zoom: number;
}

const LOCATIONS: Record<string, MapLocation> = {
  nairobi: { lng: 36.8219, lat: -1.2921, zoom: 11 },
  westlands: { lng: 36.8045, lat: -1.2645, zoom: 14 },
  lavington: { lng: 36.7725, lat: -1.2725, zoom: 14 },
  riverside: { lng: 36.7935, lat: -1.2685, zoom: 15 },
  karen: { lng: 36.7050, lat: -1.3200, zoom: 14 }
};

type LocationKey = keyof typeof LOCATIONS;

// Define the interface for the global window object safely
interface MapLibreWindow extends Window {
  maplibregl?: any;
}

export default function PropertyMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  // Using unknown and casting locally to avoid 'any' errors in global scope
  const mapInstance = useRef<null | { 
    remove: () => void; 
    flyTo: (options: object) => void;
    resize: () => void;
    on: (event: string, cb: () => void) => void;
  }>(null);
  
  const [activeFilter, setActiveFilter] = useState<LocationKey>('nairobi');

  useEffect(() => {
    if (!document.getElementById('maplibre-css')) {
      const link = document.createElement('link');
      link.id = 'maplibre-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('maplibre-js')) {
      const script = document.createElement('script');
      script.id = 'maplibre-js';
      script.src = 'https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.js';
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const win = window as unknown as MapLibreWindow;
      if (!mapContainer.current || mapInstance.current || !win.maplibregl) return;

      const map = new win.maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/positron',
        center: [LOCATIONS.nairobi.lng, LOCATIONS.nairobi.lat],
        zoom: LOCATIONS.nairobi.zoom,
        attributionControl: false
      });

      const addBrandedMarker = (lng: number, lat: number) => {
        const el = document.createElement('div');
        el.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 32px; height: 32px; background: #080D19; border: 2px solid #B89B5E; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5); overflow: hidden;">
              <img src="/ls-monogram.png" style="width: 70%; height: 70%; object-fit: contain;" />
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #B89B5E; margin-top: -2px;"></div>
          </div>
        `;
        new win.maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
      };

      map.on('load', () => {
        Object.keys(LOCATIONS).forEach(key => {
          if (key !== 'nairobi') {
            const l = LOCATIONS[key as LocationKey];
            addBrandedMarker(l.lng, l.lat);
          }
        });
        map.resize();
      });

      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      const loc = LOCATIONS[activeFilter];
      mapInstance.current.flyTo({
        center: [loc.lng, loc.lat],
        zoom: loc.zoom,
        speed: 1.2,
        essential: true
      });
    }
  }, [activeFilter]);

  return (
    <div className="w-full mb-12 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LOCATIONS) as LocationKey[]).map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveFilter(loc)}
            className={`px-4 py-2 text-[9px] uppercase tracking-widest font-mono transition-all border rounded-[2px] ${
              activeFilter === loc 
                ? 'bg-[#B89B5E] text-[#080D19] border-[#B89B5E]' 
                : 'bg-transparent text-[#94A3B8] border-[#1E293B] hover:border-[#B89B5E] hover:text-[#FDFBF7]'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
      <div className="relative w-full h-[500px] border border-[#1E293B] rounded-[2px] overflow-hidden bg-[#080D19]">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}