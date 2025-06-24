import { usePathname,useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaHome, FaRecycle, FaHistory, FaUser, FaCoins } from 'react-icons/fa';

const AdminFooter = () => {
  const router = useRouter();
  const pathname = usePathname();

  //const isActivePage = (path: string) => pathname === path;
  const isActivePage = (path: string) => pathname.includes(path);

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white [box-shadow:0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] z-10">
      <div className="flex justify-around py-2">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/admin/request_sampah")}
          className={`flex flex-col items-center ${
            isActivePage("/admin/request_sampah") ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <FaRecycle size={24} />
          <span className="text-xs">Dashboard</span>
        </button>

        {/* Penukaran */}
        <button
          onClick={() => navigate("/admin/request_penukaran")}
          className={`flex flex-col items-center ${
            isActivePage("/admin/request_penukaran") ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <FaCoins size={24} />
          <span className="text-xs">Penukaran</span>
        </button>
      </div>
    </div>
  );
};

export default AdminFooter;