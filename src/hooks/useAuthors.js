import { useEffect, useState } from "react";

const ETCHER_API_URL = process.env.REACT_APP_API_URL;

export function useAuthors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // prevents state updates if component unmounts

    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${ETCHER_API_URL}/api/v1/authors`);
        if (!res.ok) throw new Error("Failed to fetch posts");

        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  return { data, loading, error };
}
