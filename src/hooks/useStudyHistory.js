// =========================================
// IMPORTACIONES
// =========================================

import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

import {
  useEffect,
  useState
} from "react";

import {
  auth,
  db
} from "../firebase/firebase";


// =========================================
// HOOK
// =========================================

export function useStudyHistory() {

  // =========================================
  // ESTADOS
  // =========================================

  const [sessions, setSessions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =========================================
  // CARGAR HISTORIAL
  // =========================================

  useEffect(() => {

    const loadHistory =
      async () => {

        try {

          const user =
            auth.currentUser;

          if (!user) {

            setLoading(false);

            return;
          }

          const sessionsRef =
            collection(
              db,
              "users",
              user.uid,
              "studySessions"
            );

          const q = query(
            sessionsRef,
            orderBy(
              "createdAt",
              "desc"
            )
          );

          const snapshot =
            await getDocs(q);

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data()
              })
            );

          setSessions(data);

        } catch (error) {

          console.error(
            "Error cargando historial:",
            error
          );

        } finally {

          setLoading(false);

        }

      };

    loadHistory();

  }, []);


  // =========================================
  // RETORNO
  // =========================================

  return {

    sessions,

    loading

  };

}