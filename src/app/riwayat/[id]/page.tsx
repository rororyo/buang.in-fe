'use client';

import Footer from '@/components/footer';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

interface RiwayatDetail {
  id: string;
  img_url: string;
  status: string;
  phone_number?: string;
  created_at: string;
  pickup_time: string;
  user: {
    username: string;
    address?: string;
  };
  trashBank: {
    username: string;
    address?: string;
  };
}

export default function RiwayatDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Assume ID is passed as a query param like ?id=xxx

  const [data, setData] = useState<RiwayatDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/riwayat/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching riwayat detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center mt-20">Data not found</div>;
  }

  const { img_url, status, phone_number, created_at, pickup_time, user, trashBank } = data;

  return (
    <div className="flex flex-col mb-10 items-center min-h-screen" style={{ backgroundColor: '#569490' }}>
      <div className="fixed w-full z-50 items-center justify-between p-4 bg-white shadow-md">
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-3 left-4 flex items-center justify-center w-10 h-10 text-white rounded-full hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeftIcon size={20} stroke="black" />
        </button>
        <h1 className="text-2xl font-bold text-black-500 text-center w-full">Riwayat</h1>
      </div>

      <main className="p-4 mt-20 bg-white">
        <h1 className="text-lg font-semibold text-center mb-4">Detail Setoran</h1>

        <div className="flex justify-center mb-4">
          <div className="relative w-64 h-40 rounded-lg overflow-hidden">
            <Image src={img_url || '/images/bottles.jpg'} alt="Deposit" fill className="object-cover" />
          </div>
        </div>

        <div className="text-center text-cyan-700 font-semibold text-sm mb-4">
          Status
          <p className="text-xs mt-1 font-normal text-gray-600">{status}</p>
        </div>

        <div className="text-sm space-y-4">
          <div>
            <h2 className="font-semibold mb-1 text-black">Info Penyetor & Setoran:</h2>
            <p>Nama: {user.username}</p>
            <p>Alamat: {user.address || 'N/A'}</p>
            <p>Nomor Telepon: {phone_number || 'N/A'}</p>
            {/* <p>Jenis Sampah: Campuran</p> 
            <p>Berat: -</p> Add field if available */}
            <p>Tanggal: {new Date(created_at).toLocaleString('id-ID')}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-black">Info Bank Sampah:</h2>
            <p>Nama: {trashBank.username}</p>
            <p>Alamat: {trashBank.address || 'N/A'}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
