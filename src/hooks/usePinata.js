import { useState, useEffect, useCallback } from "react";
import { PinataSDK } from 'pinata'

export function usePinata() {
  const [url, setUrl] = useState("");
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SERVER_URL = 'http://localhost:8787'

  const fetchPresignedUrl = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
        const res = await fetch(`${SERVER_URL}/presigned_url`, {
            method: "GET",
            headers: {
            }
          })

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      setUrl(data.url || null);
      setFields(data.fields || null);
    } catch (err) {
      setError(err.message || "Failed to fetch presigned URL");
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionally auto-fetch on mount
  useEffect(() => {
    fetchPresignedUrl();
  }, [fetchPresignedUrl]);

  return {
    url,
    fields,
    loading,
    error,
    refresh: fetchPresignedUrl,
  };
}
