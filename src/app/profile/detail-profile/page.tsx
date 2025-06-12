"use client";
import React, { useEffect, useRef, useState } from "react";

interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
  jumlahPenukaran: number;
  photoUrl: string;
}

const DetailProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile({
      username: "adity123111111111111111",
      email: "adity@example.com",
      createdAt: "2024-06-01",
      jumlahPenukaran: 5,
      photoUrl: "https://via.placeholder.com/150",
    });
    setNewUsername("");
  }, []);

  if (!profile) return <div>Loading...</div>;

  const handleUsernameEdit = () => setEditUsername(true);

  const handleUsernameSave = () => {
    setProfile({ ...profile, username: newUsername });
    setEditUsername(false);
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
        setProfile({ ...profile, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#569490" }}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Detail Profil</h2>
        <div className="flex flex-col items-center mb-6">
            <div className="relative">
                <img
                src={photoPreview || profile.photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"/>
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
            </div>
            <div className="mb-2 flex items-center justify-between">
            <div>
                <span className="font-semibold text-black mr-2">Username:</span>
                {editUsername ? (
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                ) : (
                <span>{profile.username}</span>
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
        <div className="mb-2">
          <span className="font-semibold text-black">Email:</span> {profile.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-black">Tanggal Pembuatan:</span> {profile.createdAt}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-black">Jumlah Penukaran:</span> {profile.jumlahPenukaran}
        </div>
      </div>
    </div>
  );
};

export default DetailProfile;