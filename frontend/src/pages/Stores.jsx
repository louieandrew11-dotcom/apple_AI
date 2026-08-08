import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Phone, Navigation, Globe, ChevronRight, Sparkles, Building2, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchStoreLocations } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Stores = () => {
  const [stores, setStores] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStore, setSelectedStore] = useState(null);
  const [loadingStores, setLoadingStores] = useState(true);
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch store locations from backend API
  useEffect(() => {
    let isMounted = true;
    const loadStores = async () => {
      setLoadingStores(true);
      try {
        const data = await fetchStoreLocations(selectedRegion);
        if (isMounted) {
          setStores(data);
          if (data.length > 0 && !selectedStore) {
            setSelectedStore(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load stores:', err);
      } finally {
        if (isMounted) setLoadingStores(false);
      }
    };
    loadStores();
    return () => { isMounted = false; };
  }, [selectedRegion]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    let timer = setTimeout(() => {
      if (window.L && mapRef.current) {
        if (!mapInstanceRef.current) {
          const initialLat = selectedStore ? selectedStore.lat : 19.0653;
          const initialLng = selectedStore ? selectedStore.lng : 72.8687;

          const map = window.L.map(mapRef.current, {
            center: [initialLat, initialLng],
            zoom: 13,
            zoomControl: false,
            preferCanvas: true
          });

          window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(map);

          window.L.control.zoom({ position: 'bottomright' }).addTo(map);
          mapInstanceRef.current = map;
        }

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // Render store markers on Leaflet map
        stores.forEach(store => {
          const customIcon = window.L.divIcon({
            className: 'custom-apple-pin',
            html: `<div class="w-8 h-8 rounded-full bg-apple-accent text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white"></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });

          const marker = window.L.marker([store.lat, store.lng], { icon: customIcon }).addTo(mapInstanceRef.current);
          
          marker.bindPopup(`
            <div class="p-2 space-y-2 text-white min-w-[200px]">
              <img src="${store.image}" alt="${store.name}" loading="lazy" class="w-full h-24 object-cover rounded-lg" />
              <h4 class="font-bold text-sm text-cyan-400">${store.name}</h4>
              <p class="text-xs text-gray-300">${store.address}</p>
              <p class="text-[10px] text-green-400 font-semibold">${store.status}</p>
              <p class="text-[11px] text-gray-400">${store.phone}</p>
            </div>
          `);

          marker.on('click', () => {
            setSelectedStore(store);
            mapInstanceRef.current?.flyTo([store.lat, store.lng], 15, { duration: 1.2 });
          });

          markersRef.current.push(marker);
        });

        if (selectedStore && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([selectedStore.lat, selectedStore.lng], 14, { duration: 1.0 });
        }
      }
    }, 100);

    return () => { clearTimeout(timer); };
  }, [stores, selectedStore]);

  // Cleanup Leaflet map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-semibold"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Global Apple Flagships & Retail Experience</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-apple-text-light dark:text-apple-text-dark">
          Find an Apple Store
        </h1>
        <p className="text-sm sm:text-base text-apple-text-subtleLight dark:text-apple-text-subtleDark">
          Experience Apple BKC Mumbai, Apple Saket Delhi, and iconic stores worldwide. Walk in for Genius Bar advice or order online for store pickup.
        </p>
      </div>

      {/* Region Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 glass-card p-4 rounded-2xl border border-black/5 dark:border-white/10">
        <div className="flex items-center space-x-2 text-xs font-bold text-apple-text-light dark:text-apple-text-dark">
          <Globe className="w-4 h-4 text-apple-accent" />
          <span>Filter Stores by Region:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'India', 'USA', 'UK', 'Asia Pacific'].map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedRegion === region
                  ? 'bg-apple-accent text-white shadow-md scale-105'
                  : 'bg-black/5 dark:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:bg-black/10'
              }`}
            >
              {region === 'all' ? 'All Global Flagships' : region}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Store List & Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Store Cards Column */}
        <div className="lg:col-span-5 space-y-4 max-h-[620px] overflow-y-auto pr-1">
          {loadingStores ? (
            <div className="text-center py-16 text-gray-400">Loading Apple Store Locations...</div>
          ) : (
            stores.map(store => (
              <motion.div
                key={store.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedStore(store);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([store.lat, store.lng], 15, { duration: 1.2 });
                  }
                }}
                className={`glass-card p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedStore?.id === store.id
                    ? 'border-apple-accent ring-2 ring-apple-accent/40 bg-apple-accent/5 dark:bg-apple-accent/10 shadow-lg'
                    : 'border-black/5 dark:border-white/10 hover:border-apple-accent/50'
                }`}
              >
                <div className="flex space-x-4">
                  <img
                    src={store.image}
                    alt={store.name}
                    loading="lazy"
                    className="w-28 h-28 rounded-xl object-cover shadow-md"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark flex items-center gap-1.5">
                        {store.name}
                        {store.country === 'India' && (
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-500/30">🇮🇳 Flagship</span>
                        )}
                      </h3>
                    </div>
                    <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark line-clamp-2">
                      {store.address}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-green-500 font-semibold mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{store.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {store.features.slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="text-[9px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-apple-text-subtleLight dark:text-apple-text-subtleDark flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {store.phone}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/support');
                    }}
                    className="text-apple-accent hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    Book Genius Bar <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Leaflet Interactive Map */}
        <div className="lg:col-span-7 h-[620px] rounded-3xl overflow-hidden shadow-2xl relative border border-white/20 dark:border-white/10">
          <div id="apple-store-map" ref={mapRef} className="w-full h-full z-10" />

          {selectedStore && (
            <div className="absolute bottom-6 left-6 right-6 z-20 glass-card p-5 rounded-2xl border border-white/20 dark:border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-apple-accent" />
                  {selectedStore.name} ({selectedStore.city}, {selectedStore.country})
                </h4>
                <p className="text-xs text-gray-300 mt-1">{selectedStore.hours}</p>
                <p className="text-[11px] text-green-400 font-semibold mt-0.5">{selectedStore.status}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedStore.lat},${selectedStore.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Directions</span>
              </a>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
