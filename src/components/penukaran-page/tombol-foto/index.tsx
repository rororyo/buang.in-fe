"use client";

import React, { useRef } from "react";
import { FaCamera } from "react-icons/fa";

interface TombolFotoProps {
  onImageSelected: (file: File, previewUrl: string) => void;
}


const TombolFoto: React.FC<TombolFotoProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFotoClick = () => {
    fileInputRef.current?.click(); // Trigger hidden file input
  };

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    onImageSelected(file, imageUrl); // ✅ Send File and preview URL
  }
};


  return (
    <div className="mb-4">
      <button
        onClick={handleFotoClick}
        className="w-full mt-7 p-2 text-white rounded-md hover:bg-opacity-90 items-center flex justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <FaCamera size={25} className="mr-2" />
        Input Foto Sampah
      </button>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default TombolFoto;
