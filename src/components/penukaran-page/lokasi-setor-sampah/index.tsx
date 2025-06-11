// Create this in your page component or wherever you're using the map
"use client";

import dynamic from "next/dynamic";
import React from "react";

interface Props {
  lat: number | null;
  lon: number | null;
}

// Create the map component as a separate component that will be dynamically imported
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

  const isReady = lat !== null && lon !== null && isLoaded && mapComponents;

  return (
    <div className="flex flex-col items-center p-6" style={ { backgroundColor: "#569490" }}>
      <div className="w-full bg-white p-6 rounded-lg">
        <h2
          className="text-lg font-bold mb-4 text-center"
          style={{ color: "#569490" }}
        >
          Lokasi Penjemputan Sampah
        </h2>
        <div className="w-full h-80 border border-gray-300 rounded-md" 
          style={ { 
            position: "relative",
            overflow: "hidden",
            maxHeight: "400px",
            zIndex: 0,}}>
          {isReady ? (
            <mapComponents.MapContainer
              center={[lat!, lon!]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <mapComponents.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <mapComponents.Marker position={[lat!, lon!]}>
                <mapComponents.Popup>You are here</mapComponents.Popup>
              </mapComponents.Marker>
            </mapComponents.MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {isLoaded ? "Mengambil lokasi..." : "Loading map..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center p-6">
      <div className="w-full bg-white p-6 rounded-lg">
        <h2
          className="text-lg font-bold mb-4 text-center"
          style={{ color: "#569490" }}
        >
          Lokasi Penjemputan Sampah
        </h2>
        <div className="flex w-full h-40 border border-gray-300 rounded-md overflow-hidden">
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading map...
          </div>
        </div>
      </div>
    </div>
  ),
});

export default DynamicMap;
