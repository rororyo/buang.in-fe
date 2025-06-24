'use client';

import api from '@/lib/api';
import { ChevronLeft, Calendar, MapPin, Phone, User, Building2, CheckCircle, XCircle, Clock, Package, Ruler, Weight, Map, ChevronLeftIcon, ChevronLeftCircleIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Add this import

interface RiwayatDetail {
  id: string;
  name: string;
  address: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  img_url: string;
  status: string;
  phone_number?: string;
  pickup_location: {
    type: string;
    coordinates: [number, number];
  };
  pickup_start_time: string;
  pickup_end_time: string;
  created_at: string;
  points?: number;
  user: {
    id: string;
    username: string;
    email: string;
    address?: string;
    points: number;
  };
  trashBank: {
    id: string;
    username: string;
    email: string;
    address?: string;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  };
}

export default function RiwayatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<RiwayatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID tidak ditemukan');
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/riwayat/${id}`);
        setData(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching riwayat detail:', err);
        setError('Gagal memuat detail riwayat');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'selesai':
        return {
          text: 'Selesai',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: <CheckCircle className="text-green-500" size={20} />
        };
      case 'rejected':
      case 'ditolak':
        return {
          text: 'Ditolak',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: <XCircle className="text-red-500" size={20} />
        };
      case 'pending':
        return {
          text: 'Menunggu Konfirmasi',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          icon: <Clock className="text-orange-500" size={20} />
        };
      default:
        return {
          text: 'Sedang Diproses',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          icon: <Clock className="text-blue-500" size={20} />
        };
    }
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ icon: Icon, label, value, unit }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    unit?: string;
  }) => (
    <div className="flex items-start gap-3 py-2">
      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={16} className="text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium break-words">
          {value}{unit && <span className="text-gray-500 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );

  const MapComponent = ({ coordinates }: { coordinates: [number, number] }) => {
    const [lng, lat] = coordinates;
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
    
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          title="Lokasi Penjemputan"
          className="w-full h-full"
        />
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow">
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Detail Riwayat</h1>
            <div className="w-10 h-10"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Memuat detail...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Detail Riwayat</h1>
            <div className="w-10 h-10"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <XCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">{error || 'Detail riwayat tidak dapat dimuat'}</p>
            <button 
              onClick={() => router.back()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(data.status);

  const formatTimeRange = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const dateStr = start.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const startTimeStr = start.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endTimeStr = end.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Detail Riwayat</h1>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        {/* Image Section */}
        <div className="aspect-[4/3] relative bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden mb-6">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${data.img_url}`}
            alt="Sampah yang disetor"
            width={100}
            height={100}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg'; // Fallback image
            }}
          />
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-center gap-3">
            {statusInfo.icon}
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                {statusInfo.text}
              </div>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <InfoCard title="Detail Permintaan">
          <div className="space-y-1">
            <InfoItem 
              icon={Package} 
              label="Nama Sampah" 
              value={data.name} 
            />
            <InfoItem 
              icon={Weight} 
              label="Perkiraan Berat" 
              value={data.weight}
              unit="kg"
            />
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Ruler size={16} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-500">Panjang</p>
                <p className="text-sm font-medium text-gray-900">{data.length} cm</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Ruler size={16} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-500">Lebar</p>
                <p className="text-sm font-medium text-gray-900">{data.width} cm</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Ruler size={16} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-500">Tinggi</p>
                <p className="text-sm font-medium text-gray-900">{data.height} cm</p>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Pickup Schedule */}
        <InfoCard title="Jadwal Penjemputan">
          <div className="space-y-1">
            <InfoItem 
              icon={Clock} 
              label="Waktu Janjian" 
              value={formatTimeRange(data.pickup_start_time, data.pickup_end_time)} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Alamat Penjemputan" 
              value={data.address} 
            />
          </div>
        </InfoCard>

        {/* Pickup Location Map */}
        <InfoCard title="Lokasi Penjemputan">
          <div className="relative">
            <MapComponent coordinates={data.pickup_location.coordinates} />
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Map size={16} />
              <span>Koordinat: {data.pickup_location.coordinates[1].toFixed(6)}, {data.pickup_location.coordinates[0].toFixed(6)}</span>
            </div>
          </div>
        </InfoCard>

        {/* Transaction Info */}
        <InfoCard title="Informasi Transaksi">
          <div className="space-y-1">
            <InfoItem 
              icon={Calendar} 
              label="ID Transaksi" 
              value={`#${data.id.slice(-8).toUpperCase()}`} 
            />
            <InfoItem 
              icon={Calendar} 
              label="Tanggal Dibuat" 
              value={new Date(data.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} 
            />
          </div>
        </InfoCard>

        {/* Customer Info */}
        <InfoCard title="Informasi Penyetor">
          <div className="space-y-1">
            <InfoItem 
              icon={User} 
              label="Nama Penyetor" 
              value={data.user.username} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Alamat" 
              value={data.user.address || 'Tidak tersedia'} 
            />
            <InfoItem 
              icon={Phone} 
              label="Nomor Telepon" 
              value={data.phone_number || 'Tidak tersedia'} 
            />
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Total Poin User</p>
                <p className="text-gray-900 font-medium">{data.user.points.toLocaleString('id-ID')} poin</p>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Bank Sampah Info */}
        <InfoCard title="Informasi Bank Sampah">
          <div className="space-y-1">
            <InfoItem 
              icon={Building2} 
              label="Nama Bank Sampah" 
              value={data.trashBank.username} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Alamat Bank Sampah" 
              value={data.trashBank.address || 'Tidak tersedia'} 
            />
            {data.trashBank.location && (
              <div className="flex items-start gap-3 py-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Map size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Koordinat Bank Sampah</p>
                  <p className="text-gray-900 font-medium text-sm">
                    {data.trashBank.location.coordinates[1].toFixed(6)}, {data.trashBank.location.coordinates[0].toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </InfoCard>
      </div>
    </div>
  );
}