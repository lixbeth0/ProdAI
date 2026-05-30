import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export const useActivities = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "activities"),
          orderBy("timestamp", "desc")
        );

        const snapshot = await onSnapshot(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setActivities(data);

      } catch (error) {
        console.error("Error actividades:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  return { activities, loading };
};