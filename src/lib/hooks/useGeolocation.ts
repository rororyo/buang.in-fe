import { useEffect, useState } from "react";

export interface GeolocationData {
  lat: number | null;
  lon: number | null;
  error: string | null;
}

const useGeolocation = (): GeolocationData => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return { lat, lon, error };
};

export default useGeolocation;
