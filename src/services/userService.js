import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

// 🔥 Obtener datos del usuario actual
export const getUserData = async () => {

  try {

    // 🔒 Verificar usuario autenticado
    if (!auth.currentUser) {
      return null;
    }

    // 🔥 Referencia al documento
    const userRef = doc(
      db,
      "users",
      auth.currentUser.uid
    );

    // 🔥 Obtener documento
    const snapshot = await getDoc(userRef);

    // 🔥 Existe usuario
    if (snapshot.exists()) {

      return snapshot.data();
    }

    return null;

  } catch (error) {

    console.error(
      "Error obteniendo usuario:",
      error
    );

    return null;
  }
};