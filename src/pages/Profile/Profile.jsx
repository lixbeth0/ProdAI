import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./Profile.css";

function Profile() {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;

      if (user) {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setNombre(snap.data().nombre || "");
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
        nombre
      });

      alert("Perfil actualizado ✔");
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">
            {nombre?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2>Mi Perfil</h2>
            <p>Administra tu información personal</p>
          </div>
        </div>

        <div className="profile-form">

          <label>Nombre completo</label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
          />

          <button
            className="profile-save-btn"
            onClick={handleUpdate}
          >
            Guardar cambios
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;