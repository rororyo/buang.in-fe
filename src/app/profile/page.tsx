"use client";

import React, { useState } from 'react';
import { ArrowLeftIcon, UserIcon, BellIcon, LockIcon, ShieldIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';

const ProfilPage = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const handleBackClick = () => {
    window.location.href = '/dashboard';
  };

  const handleProfileClick = () => {
    window.location.href = '/profile-edit';
  };

  const handlePasswordClick = () => {
    window.location.href = '/change-password';
  };

  const handlePrivacyClick = () => {
    window.location.href = '/privacy-settings';
  };

  return (
    <div className="flex flex-col items-center min-h-screen" style={{ backgroundColor: '#235C58' }}>
      {/* Tombol Back */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 text-white bg-black rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ChevronLeftIcon size={20} />
      </button>

      {/* Foto Profil */}
      <div className="mt-20">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-36 h-36 rounded-full border-4 border-white"
        />
      </div>

      {/* Konten Profil */}
      <div className="w-full max-w-md p-6 mt-10 bg-white rounded-lg shadow-md">
        {/* Profile Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Account</h3>
          <div
            className="flex items-center justify-between mt-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="flex items-center space-x-2">
              <UserIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Profile</h4>
            </div>
            <ChevronRightIcon size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <BellIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Notifikasi Email</h4>
            </div>
            {/* Toggle Slide Bar */}
            <div
              onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
              className={`w-12 h-6 flex items-center rounded-full cursor-pointer ${
                isNotificationEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  isNotificationEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Security</h3>
          <div
            className="flex items-center justify-between mt-2 cursor-pointer"
            onClick={handlePasswordClick}
          >
            <div className="flex items-center space-x-2">
              <LockIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Ubah Password</h4>
            </div>
            <ChevronRightIcon size={16} className="text-gray-500" />
          </div>
          <div
            className="flex items-center justify-between mt-2 cursor-pointer"
            onClick={handlePrivacyClick}
          >
            <div className="flex items-center space-x-2">
              <ShieldIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Privacy</h4>
            </div>
            <ChevronRightIcon size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;