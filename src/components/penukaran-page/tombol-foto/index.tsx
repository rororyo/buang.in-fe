"use client";

import React from "react";
import { FaCamera } from "react-icons/fa";

const TombolFoto = () => {
  const handleFotoClick = () => {
    console.log("Tombol Foto diklik");
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleFotoClick}
        className="w-full mt-7 p-2 text-black rounded-md hover:bg-opacity-90 items-center flex justify-center"
        style={{ backgroundColor: "#569490" }}
      >
        <FaCamera size={25} className="mr-2" />
        Input Foto Sampah
      </button>
    </div>
  );
};

export default TombolFoto;