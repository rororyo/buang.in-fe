"use client";
import { useMemo } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon, UserIcon, BellIcon, LockIcon, MailIcon, ShieldIcon,
  ChevronRightIcon, ChevronLeftIcon, Edit2, Camera, Save
} from 'lucide-react';
import Footer from '@/components/footer';
import { useUser } from '@/lib/context/UserContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

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
  const router = useRouter();
  const { user, loading } = useUser();
  
  // Initialize with default values
  const defaultProfile: ProfileType = {
    username: user?.username || 'User',
    email: user?.email || 'Email',
    createdAt: user?.created_at ? user.created_at.split('T')[0] : '1970-01-01',
    gender: user?.gender || 'Belum mengisi jenis kelamin',
    birthday: user?.birthday || 'Belum mengisi tanggal lahir',
    phone_Number: user?.phone_number || 'Belum mengisi nomor telepon',
    jumlahPenukaran: 5,
    photoUrl: "https://via.placeholder.com/150",
    role: user?.role || 'user',
    alamat: user?.address || 'Belum ada alamat'
  };

  const profile: ProfileType = useMemo(() => {
    if (
      user &&
      'createdAt' in user &&
      'jumlahPenukaran' in user &&
      'gender' in user &&
      'birthday' in user &&
      'phone_Number' in user &&
      'photoUrl' in user &&
      'role' in user &&
      'alamat' in user
    ) {
      return {
        ...user,
        createdAt: user.created_at.split('T')[0]
      } as ProfileType;
    }
    return defaultProfile;
  }, [user]);

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValues, setFieldValues] = useState({
    username: profile.username,
    email: profile.email,
    phone_Number: profile.phone_Number,
    gender: profile.gender,
    birthday: profile.birthday,
    alamat: profile.alamat
  });

  // Update fieldValues when profile changes
  useEffect(() => {
    setFieldValues({
      username: profile.username,
      email: profile.email,
      phone_Number: profile.phone_Number,
      gender: profile.gender,
      birthday: profile.birthday,
      alamat: profile.alamat
    });
  }, [profile]);

  const updateProfile = async (data: Partial<{
    address: string;
    avatar_url: string | null;
    gender: string | null;
    birthday: string | null;
    phone_number: string | null;
    location: string | null;
    username: string;
    email: string;
  }>) => {
    try {
      await api.put('/api/user', data);
      toast.success('Profil berhasil diperbarui!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui profil.');
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, fieldName: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: e.target.value
    }));
  };

  const handleSaveChanges = () => {
    const changedFields: Record<string, string> = {};
    
    Object.keys(fieldValues).forEach(key => {
      if (fieldValues[key as keyof typeof fieldValues] !== profile[key as keyof ProfileType]) {
        changedFields[key] = fieldValues[key as keyof typeof fieldValues];
      }
    });

    if (Object.keys(changedFields).length > 0) {
      // Map field names to match backend expectations if needed
      const backendData = {
        username: changedFields.username,
        email: changedFields.email,
        phone_number: changedFields.phone_Number,
        gender: changedFields.gender,
        birthday: changedFields.birthday,
        address: changedFields.alamat
      };
      
      updateProfile(backendData);
    } else {
      setIsEditing(false);
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        await updateProfile({ avatar_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordClick = () => router.push('/change-password');

  const isAdmin = profile?.role === 'trash_bank';

  const handleAdminLogin = () => {
    if (isAdmin) {
      router.push('/admin');
    } else {
      toast.error('Anda tidak memiliki akses ke halaman bank sampah.');
    }
  };

  const InfoItem = React.memo(({ label, fieldName, value }: {
    label: string;
    fieldName: string;
    value: string;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        {isEditing ? (
          fieldName === 'gender' ? (
            <select
              value={fieldValues[fieldName as keyof typeof fieldValues] || ''}
              onChange={(e) => handleFieldChange(e, fieldName)}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            >
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
            </select>
          ) : (
            <input
              type={fieldName === 'birthday' ? 'date' : 'text'}
              value={fieldValues[fieldName as keyof typeof fieldValues] || ''}
              onChange={(e) => handleFieldChange(e, fieldName)}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            />
          )
        ) : (
          <p className="text-gray-900 font-medium">{value}</p>
        )}
      </div>
    </div>
  ));

  const MenuSection = ({ title, children, showEditButton = false }: {
    title: string;
    children: React.ReactNode;
    showEditButton?: boolean;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 relative">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {showEditButton && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Profil"
          >
            <Edit2 size={16} />
          </button>
        )}
        {showEditButton && isEditing && (
          <button
            onClick={handleSaveChanges}
            className="p-1 bg-green-500 text-white rounded-lg transition-colors flex items-center gap-1 text-sm px-2"
            title="Simpan Perubahan"
          >
            <Save size={16} />
            <span>Simpan</span>
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  const MenuItem = React.memo(({
    icon: Icon,
    title,
    onClick,
    rightElement
  }: {
    icon: React.ElementType;
    title: string;
    onClick?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <div
      className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-green-600" />
        </div>
        <span className="text-gray-700 font-medium">{title}</span>
      </div>
      {rightElement || <ChevronRightIcon size={16} className="text-gray-400" />}
    </div>
  ));

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Profil Saya</h1>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              <img
                src={photoPreview || profile.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handlePhotoClick}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              type="button"
              aria-label="Edit Foto"
            >
              <Camera size={14} className="text-gray-600" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">{profile.username}</h2>
            <p className="text-white/80 text-sm mt-1">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <MenuSection title="Informasi Akun" showEditButton>
          <div className="space-y-0">
            <InfoItem label="Username" fieldName="username" value={profile.username} />
            <InfoItem label="Email" fieldName="email" value={profile.email} />
            <InfoItem label="Nomor Telepon" fieldName="phone_Number" value={profile.phone_Number} />
            <InfoItem label="Jenis Kelamin" fieldName="gender" value={profile.gender} />
            <InfoItem label="Tanggal Lahir" fieldName="birthday" value={profile.birthday} />
            <InfoItem label="Alamat" fieldName="alamat" value={profile.alamat} />
          </div>
        </MenuSection>

        <MenuSection title="Notifikasi">
          <MenuItem
            icon={BellIcon}
            title="Notifikasi Email"
            rightElement={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationEnabled(!isNotificationEnabled);
                }}
                className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${isNotificationEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isNotificationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </div>
            }
          />
        </MenuSection>

        <MenuSection title="Keamanan">
          <div className="space-y-1">
            <MenuItem
              icon={LockIcon}
              title="Ubah Password"
              onClick={handlePasswordClick}
            />
            <MenuItem
              icon={MailIcon}
              title="Ubah Email"
              onClick={() => router.push('/change-email')}
            />
          </div>
        </MenuSection>

        {isAdmin && (
          <MenuSection title="Admin">
            <MenuItem
              icon={ShieldIcon}
              title="Masuk ke Halaman Admin"
              onClick={handleAdminLogin}
            />
          </MenuSection>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfilPage;