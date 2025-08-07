import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase";

export interface Card {
  userId: string;
  name: string;
  vote: string;
  isHost: boolean;
  status: string;
}

export function useRealtimeData(path: string) {
  const [data, setData] = useState<Array<Card>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const dbRef = ref(database, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const obj = snapshot.val();
          setData(
            Object.entries(obj).map(([key, value]) => ({
              userId: key,
              ...(value as {
                name: string;
                vote: string;
                isHost: boolean;
                status: string;
              }),
            }))
          );
        } else {
          setData([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, [path]);

  return { data, loading, error };
}
