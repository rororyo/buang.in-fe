

import api from "../api";


export async function fetchRiwayat(page = 1, limit = 10) {
  const response = await api.get('/api/riwayat', {
    params: { page, limit },
  });
  return response.data.data;
}
