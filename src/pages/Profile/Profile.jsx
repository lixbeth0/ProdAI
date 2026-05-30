import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Profile() {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;

      if (user) {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setNombre(snap.data().nombre);
        }
      }
    };

    loadUser();
  }, []);

  const handleUpdate = async () => {
    const user = auth.currentUser;

    if (user) {
      const ref = doc(db, "usuarios", user.uid);

      await updateDoc(ref, {
        nombre: nombre,
      });

      alert("Perfil actualizado ✔");
    }
  };

  return (
    <div className="profile">
      <h2>👤 Mi Perfil</h2>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />

      <button onClick={handleUpdate}>
        Guardar cambios
      </button>
    </div>
  );
}

export default Profile;