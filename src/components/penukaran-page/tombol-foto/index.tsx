"use client";

import React, { useRef } from "react";
import { Camera, ImagePlus } from "lucide-react";

interface TombolFotoProps {
  onImageSelected: (file: File, previewUrl: string) => void;
}

const TombolFoto: React.FC<TombolFotoProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelected(file, imageUrl);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleFotoClick}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 group"
      >
        <div className="relative">
          <Camera size={24} className="transition-transform group-hover:scale-110" />
          <ImagePlus 
            size={12} 
            className="absolute -top-1 -right-1 bg-white text-emerald-600 rounded-full p-0.5" 
          />
        </div>
        <span className="text-lg">Ambil Foto Sampah</span>
      </button>
      
      <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
        <p className="text-xs text-emerald-700 text-center">
          📸 Pastikan foto sampah terlihat jelas untuk verifikasi yang akurat
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default TombolFoto;