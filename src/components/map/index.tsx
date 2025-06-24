// components/map/MapPickupLocation.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

interface Props {
  lat: number;
  lon: number;
}

const MapComponent: React.FC<Props> = ({ lat, lon }) => {
  const [mapComponents, setMapComponents] = React.useState<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadMap = async () => {
      await import("leaflet-defaulticon-compatibility");
      const leaflet = await import("react-leaflet");
      setMapComponents(leaflet);
      setIsLoaded(true);
    };
    loadMap();
  }, []);

  const isReady = isLoaded && mapComponents;

  return (
    <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
      <h2 className="text-lg font-bold mb-4 text-center text-emerald-700">
        Lokasi Penjemputan Sampah
      </h2>
      <div className="w-full h-80 border border-gray-300 rounded-md overflow-hidden z-0">
        {isReady ? (
          <mapComponents.MapContainer
            center={[lat, lon]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <mapComponents.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <mapComponents.Marker position={[lat, lon]}>
              <mapComponents.Popup>Lokasi penjemputan</mapComponents.Popup>
            </mapComponents.Marker>
          </mapComponents.MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading map...
          </div>
        )}
      </div>
    </div>
  );
};

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-lg font-bold mb-4 text-center text-emerald-700">
        Lokasi Penjemputan Sampah
      </h2>
      <div className="w-full h-40 border border-gray-300 rounded-md flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    </div>
  ),
});

export default DynamicMap;
