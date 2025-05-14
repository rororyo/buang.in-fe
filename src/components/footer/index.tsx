import React, { useEffect, useState } from 'react';
import { FaHome, FaRecycle, FaHistory, FaUser } from 'react-icons/fa';

const Footer = () => {
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isActivePage = (path: string) => currentPath === path;

  const navigate = (path: string) => {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md">
      <div className="flex justify-around py-2">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex flex-col items-center ${
            isActivePage("/dashboard") ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <FaHome size={24} />
          <span className="text-xs">Dashboard</span>
        </button>

        {/* Penukaran */}
        <button
          onClick={() => navigate("/penukaran")}
          className={`flex flex-col items-center ${
            isActivePage("/penukaran") ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <FaRecycle size={24} />
          <span className="text-xs">Penukaran</span>
        </button>

        {/* Riwayat */}
        <button
          onClick={() => navigate("/riwayat")}
          className={`flex flex-col items-center ${
            isActivePage("/riwayat") ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <FaHistory size={24} />
          <span className="text-xs">Riwayat</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center ${
            isActivePage("/profile") ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <FaUser size={24} />
          <span className="text-xs">Profil</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;