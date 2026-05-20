import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const CITY_COORDS: Record<string, [number, number]> = {
  'São Paulo, SP': [-46.6333, -23.5505],
  'Rio de Janeiro, RJ': [-43.1729, -22.9068],
  'Belo Horizonte, MG': [-43.9378, -19.9217],
  'Curitiba, PR': [-49.2733, -25.4284],
  'Porto Alegre, RS': [-51.2177, -30.0346],
  'Salvador, BA': [-38.5016, -12.9777],
  'Brasília, DF': [-47.8825, -15.7942],
  'Fortaleza, CE': [-38.5267, -3.7319],
};

interface MapComponentProps {
  location?: string;
  zoom?: number;
  className?: string;
}

export function MapComponent({ location, zoom = 12, className = "h-64 w-full" }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  const center: [number, number] = (location && CITY_COORDS[location]) || [-46.6333, -23.5505];

  useEffect(() => {
    const updateLocation = async () => {
      if (!location) return;
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Brasil')}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const newCenter: [number, number] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
          
          if (map.current) {
            map.current.flyTo({ center: newCenter, zoom: zoom, speed: 0.8 });
            if (marker.current) {
              marker.current.setLngLat(newCenter);
            }
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      }
    };

    if (map.current) {
      updateLocation();
    }
  }, [location, zoom]);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: center,
        zoom: zoom,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.AttributionControl({ compact: true }));

      marker.current = new maplibregl.Marker({ color: '#FB923C' })
        .setLngLat(center)
        .addTo(map.current);
    }
  }, [center, zoom]);

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className={`rounded-3xl overflow-hidden border border-brand-primary/10 shadow-lg ${className}`} />
  );
}
