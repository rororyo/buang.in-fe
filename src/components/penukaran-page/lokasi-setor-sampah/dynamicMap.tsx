// Create a new file: components/DynamicMap.tsx
"use client";

import dynamic from 'next/dynamic';

const DynamicLokasiSetorSampah = dynamic(
  () => import('./index'), // adjust the path to your component
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center p-6">
        <div className="w-full bg-white p-6 rounded-lg">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: "#569490" }}>
            Lokasi Penjemputan Sampah
          </h2>
          <div className="w-full h-40 border border-gray-300 rounded-md overflow-hidden">
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading map...
            </div>
          </div>
        </div>
      </div>
    )
  }
);

export default DynamicLokasiSetorSampah;