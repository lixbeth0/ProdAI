import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export const useActivities = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {

        if (!user) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "activities"),
          orderBy("createdAt", "desc")
        );

        const unsubscribeActivities = onSnapshot(
          q,
          (snapshot) => {

            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            const today = new Date();

            const activeActivities =
              data.filter(activity => {

                if (
                  !activity.dueDate ||
                  activity.dueDate === "Sin fecha"
                ) {
                  return true;
                }

                const dueDate =
                  new Date(activity.dueDate);

                return dueDate >= today;
              });

            setActivities(activeActivities);
            setLoading(false);
          },
          (error) => {
            console.error(
              "Error actividades:",
              error
            );

            setLoading(false);
          }
        );

        return unsubscribeActivities;
      }
    );

    return unsubscribeAuth;

  }, []);

  return {
    activities,
    loading
  };
};