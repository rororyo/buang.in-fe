"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, UserIcon, BellIcon, LockIcon, MailIcon, ShieldIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import Footer from '@/components/footer';
import { useUser } from '@/lib/context/UserContext';
import { toast } from 'react-toastify';

type ProfileType = {
  username: string;
  email: string;
  createdAt: string;
  gender: string;
  birthday: string;
  phone_Number: string;
  jumlahPenukaran: number;
  photoUrl: string;
  role: string;
  alamat: string;
};

const ProfilPage = () => {
  const { user, loading } = useUser();
  const username = user?.username || 'User';
  const email = user?.email || 'Email';
  const createdAt = user?.created_at || '1970-01-01';
  const gender = user?.gender || 'Belum mengisi jenis kelamin';
  const birthday = user?.birthday || 'Belum mengisi tanggal lahir';
  const phone_Number = user?.phone_number || 'Belum mengisi nomor telepon';
  const dateOnly = createdAt.split('T')[0]; // "2025-06-11"
  const role = user?.role || 'user';
  const alamat = user?.address || 'Belum ada alamat';

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  // Untuk edit username & foto profil
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dummy data jika user belum ada
// const defaultProfile: ProfileType = {
//   username: "adity123",
//   email: "adity@example.com",
//   createdAt: "2024-06-01",
//   jumlahPenukaran: 5,
//   photoUrl: "https://via.placeholder.com/150",
//   role: "user",
//   alamat: "Jl. Contoh Alamat No. 123, Jakarta"
// };

const defaultProfile: ProfileType = {
  username: username,
  email: email,
  createdAt: dateOnly,
  gender: gender,
  birthday: birthday,
  phone_Number: phone_Number,
  jumlahPenukaran: 5,
  photoUrl: "https://via.placeholder.com/150",
  role: role,
  alamat: alamat
};

  const profile: ProfileType = user &&
  'createdAt' in user &&
  'jumlahPenukaran' in user &&
  'gender' in user &&
  'birthday' in user &&
  'phone_Number' in user &&
  'photoUrl' in user &&
  'role' in user &&
  'alamat' in user
  ? user as ProfileType
  : defaultProfile;

  useEffect(() => {
    setNewUsername(profile.username);
  }, [profile.username]);

  const handleUsernameEdit = () => setEditUsername(true);

  const handleUsernameSave = () => {
    // Simulasi update username
    // Lakukan update ke backend di sini jika perlu
    setEditUsername(false);
    toast.success("Username berhasil diubah!");
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        toast.success("Foto profil berhasil diubah!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordClick = () => {
    window.location.href = '/change-password';
  };

  const isAdmin = profile?.role === 'admin';

  const handleAdminLogin = () => {
    if (isAdmin) {
      window.location.href = '/admin';
    } else {
      toast.error('Anda tidak memiliki akses ke halaman admin.');
    }
  }

  return (
    <div className="flex flex-col mb-10 items-center min-h-screen" style={{ backgroundColor: '#569490' }}>
      {/* Tombol Back dan Judul */}
      <div className="fixed w-full z-50 items-center justify-between p-4 bg-white shadow-md" style={{ backgroundColor: "#FFFFFF" }}>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="absolute top-3 left-4 flex items-center justify-center w-10 h-10 text-white rounded-full hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeftIcon size={20} stroke='black' />
        </button>
        <h1 className="text-2xl font-bold text-black-500 text-center w-full">Profil</h1>
      </div>

      {/* Foto Profil */}
      <div className="mt-20 z-20 relative">
        <img
          src={photoPreview || profile.photoUrl}
          alt="Profile"
          className="w-36 h-36 rounded-full border-4 border-white object-cover"
        />
        <button
          onClick={handlePhotoClick}
          className="absolute bottom-2 right-2 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-blue-600"
          type="button"
          aria-label="Edit Foto"
        >
          {/* SVG Plus Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/>
          </svg>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </div>

      {/* Konten Profil */}
      <div className="w-full max-w-2xl p-12 mt-10 bg-white rounded-lg shadow-md">
        {/* Profile Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-600">Detail Akun</h3>
          <div className="flex items-center justify-between mt-2 pl-2 text-gray-700">
            <div>
              <span className="mr-2"></span>
              {editUsername ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              ) : (
                <div className="pl-2 text-gray-600">
                  <span className="font-semibold text-black">Username: </span> {profile.username}
                </div>
              )}
            </div>
            {editUsername ? (
              <button
                onClick={handleUsernameSave}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:opacity-90 ml-2"
              >
                Simpan
              </button>
            ) : (
              <button
                onClick={handleUsernameEdit}
                className="text-blue-500 text-xs font-medium hover:underline bg-white px-2 py-1 rounded"
                style={{ boxShadow: "none" }}
              >
                Ubah
              </button>
            )}
          </div>
          <div className="mt-2 pl-4 text-gray-600">
            <span className="font-semibold text-black">Email: </span> {profile.email}
          </div>
          <div className="mt-2 pl-4 text-gray-600">
            <span className="font-semibold text-black">Nomor Telepon: </span> {profile.phone_Number}
          </div>
          <div className="mt-2 pl-4 text-gray-600">
            <span className="font-semibold text-black">Jenis Kelamin: </span> {profile.gender}
          </div>
          <div className='mt-2 pl-4 text-gray-600'>
            <span className="font-semibold text-black">Alamat: </span> {profile.alamat}
          </div>
          <div className="mt-2 pl-4 text-gray-600">
            <span className="font-semibold text-black">Tanggal Lahir: </span> {profile.birthday}
          </div>
        </div>
        <hr className="my-8 border-t-2 border-gray-300" />
        {/* Notifications Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Notifikasi</h3>
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
        <hr className="my-8 border-t-2 border-gray-300" />
        {/* Security Section */}
        <div className='mb-6'>
          <h3 className="text-lg font-semibold text-gray-700">Keamanan</h3>
          <div
            className="flex items-center justify-between mt-2 cursor-pointer"
            onClick={handlePasswordClick}
          >
            <div className="flex items-center space-x-2">
              <LockIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Ubah Password Saya</h4>
            </div>
            <ChevronRightIcon size={16} className="text-gray-500" />
          </div>
          <div
            className="flex items-center justify-between mt-2 cursor-pointer"
            onClick={() => window.location.href = '/change-email'}
          >
            <div className="flex items-center space-x-2">
              <MailIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Ubah Email Saya</h4>
            </div>
            <ChevronRightIcon size={16} className="text-gray-500" />
          </div>
        </div>
        <hr className="my-8 border-t-2 border-gray-300" />
        {/* Admin Section */}
        <div>
          <h3 className='text-lg font-semibold text-gray-700'>Masuk Sebagai Admin</h3>
          <div
            className='flex items-center justify-between mt-2 cursor-pointer'
            onClick={handleAdminLogin}
          >
            <div className="flex items-center space-x-2">
              <ShieldIcon size={16} className="text-gray-500" />
              <h4 className="text-sm font-medium text-gray-600">Masuk ke Halaman Admin</h4>
            </div>
            <ChevronRightIcon size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilPage;