// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import { callPostRoomAndUserIdApi } from '../services/api'; // Import your API function

export const UseFetchEnterRoom = (enterRoomRequest) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null);    // Clear any previous errors
        const result = await callPostRoomAndUserIdApi(enterRoomRequest);
        setResponse(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    getData(); // Call the async function

    // Optional: add a cleanup function if you need to cancel requests
    // return () => { /* cleanup logic, e.g., abortController.abort() */ };
  }, []); // Empty dependency array means this runs once on mount

  return { response, loading, error };
};

export default UseFetchEnterRoom;
