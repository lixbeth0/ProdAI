import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";


import {
  sendPasswordResetEmail
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import {
  db, 
  auth,
  getGoogleProvider
} from "../../firebase/firebase";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./SettingsPage.css";

export default function SettingsPage() {
const { user } = useAuth();

const [section, setSection] = useState("perfil");

const [tema, setTema] = useState("dark");

const [notificaciones, setNotificaciones] = useState({
  tareas: true,
  recordatorios: true,
  resumenDiario: false
});

const [profile, setProfile] = useState({
  nombre: "",
  correo: "",
  carrera: "",
  semestre: "",
  universidad: ""
});

const [classroomConnected, setClassroomConnected] =
  useState(false);

const [classroomEmail, setClassroomEmail] =
  useState("");

const [lastSync, setLastSync] =
  useState("");

const [coursesCount, setCoursesCount] =
  useState(0);

useEffect(() => {

  const cargarUsuario = async () => {

    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const snap = await getDoc(ref);

    if (snap.exists()) {

      const data = snap.data();

      setProfile({
        nombre: data.nombre || "",
        correo: data.correo || "",
        carrera: data.carrera || "",
        semestre: data.semestre || "",
        universidad: data.universidad || ""
      });
      
      setNotificaciones(
        data.notificaciones || {
          tareas: true,
          recordatorios: true,
          resumenDiario: false
        }
      );

      setTema(
        data.tema || "light"
      );

      if ((data.tema || "light") === "dark") {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }

      setClassroomConnected(
        !!data.classroomToken
      );

      setClassroomEmail(
        data.classroomEmail || ""
      );

      setLastSync(
        data.lastSync || ""
      );

      setCoursesCount(
        data.coursesCount || 0
      );
    }

  };

  cargarUsuario();

}, [user]);

const guardarPerfil = async () => {

  await updateDoc(
    doc(db, "users", user.uid),
    {
      carrera: profile.carrera,
      semestre: profile.semestre,
      universidad: profile.universidad
    }
  );

  alert("Perfil actualizado");
};

const guardarTema = async () => {

  await updateDoc(
    doc(db, "users", user.uid),
    {
      tema
    }
  );

  if (tema === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  alert("Tema actualizado");
};

const conectarClassroom = async () => {
  try {

    const provider = getGoogleProvider();

    const result = await signInWithPopup(
      auth,
      provider
    );

    const credential =
      GoogleAuthProvider.credentialFromResult(result);

    const token = credential?.accessToken;

    const email = result.user.email;

    await updateDoc(
      doc(db, "users", user.uid),
      {
        classroomToken: token,
        classroomEmail: email
      }
    );

    setClassroomConnected(true);
    setClassroomEmail(email);

    alert("Classroom conectado correctamente");

  } catch (error) {
    console.error(error);
    alert("Error al conectar Classroom");
  }
};

const guardarNotificaciones = async () => {

  await updateDoc(
    doc(db, "users", user.uid),
    {
      notificaciones
    }
  );

  alert("Preferencias actualizadas");
};

const cambiarPassword = async () => {

  await sendPasswordResetEmail(
    auth,
    profile.correo
  );

  alert(
    "Se envió un correo para cambiar tu contraseña"
  );
}; 

const desconectarClassroom = async () => {

  await updateDoc(
    doc(db, "users", user.uid),
    {
      classroomToken: null,
      classroomEmail: null,
      coursesCount: 0
    }
  );

  setClassroomConnected(false);
  setClassroomEmail("");

  alert("Classroom desconectado");
};

const sincronizarClassroom = async () => {

  const fecha = new Date().toLocaleString();

  await updateDoc(
    doc(db, "users", user.uid),
    {
      lastSync: fecha
    }
  );

  setLastSync(fecha);

  alert("Sincronización completada");
};



  return (
    <DashboardLayout>
      <div className="settings-container">
        <aside className="settings-sidebar">

          <button
            className={section === "perfil" ? "active" : ""}
            onClick={() => setSection("perfil")}
          >
            Perfil
          </button>

          <button
            className={section === "apariencia" ? "active" : ""}
            onClick={() => setSection("apariencia")}
          >
            Apariencia
          </button>

          <button
            className={section === "notificaciones" ? "active" : ""}
            onClick={() => setSection("notificaciones")}
          >
            Notificaciones
          </button>

          <button
            className={section === "classroom" ? "active" : ""}
            onClick={() => setSection("classroom")}
          >
            Classroom
          </button>

        </aside>

        <main className="settings-content">
          {section === "perfil" && (
            <>
              <h2>Perfil</h2>

              <input
                type="text"
                value={profile.nombre}
                disabled
              />

              <input
                type="email"
                value={profile.correo}
                disabled
              />

              <input
                type="text"
                placeholder="Carrera"
                value={profile.carrera}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    carrera: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Semestre"
                value={profile.semestre}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    semestre: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Universidad"
                value={profile.universidad}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    universidad: e.target.value
                  })
                }
              />

              <div className="settings-actions">
                <button
                  className="secondary-btn"
                  onClick={cambiarPassword}
                >
                  Cambiar contraseña
                </button>

                <button
                  className="primary-btn"
                  onClick={guardarPerfil}
                >
                  Guardar cambios
                </button>
              </div>
            </>
            )}

          {section === "classroom" && (
            <>
              <h2>Google Classroom</h2>

              <div className="classroom-card">

                <div className="classroom-header">
                  <h3>Integración Classroom</h3>

                  <span
                    className={
                      classroomConnected
                        ? "status-badge connected"
                        : "status-badge disconnected"
                    }
                  >
                    {classroomConnected
                      ? "Conectado"
                      : "No conectado"}
                  </span>
                </div>

                {classroomConnected ? (
                  <>
                    <div className="classroom-info">

                      <div>
                        <span>Cuenta vinculada</span>
                        <strong>
                          {classroomEmail || "No disponible"}
                        </strong>
                      </div>

                      <div>
                        <span>Cursos encontrados</span>
                        <strong>{coursesCount}</strong>
                      </div>

                      <div>
                        <span>Última sincronización</span>
                        <strong>
                          {lastSync || "Nunca"}
                        </strong>
                      </div>

                    </div>

                    <div className="settings-actions">

                      <button
                        className="primary-btn"
                        onClick={sincronizarClassroom}
                      >
                        Sincronizar
                      </button>

                      <button
                        className="secondary-btn"
                      >
                        Cambiar cuenta
                      </button>

                      <button
                        className="danger-btn"
                        onClick={desconectarClassroom}
                      >
                        Desconectar
                      </button>

                    </div>
                  </>
                ) : (
                  <>
                    <p className="classroom-empty">
                      No hay ninguna cuenta de Google
                      Classroom conectada.
                    </p>
                    
                      {!classroomConnected && (
                        <div className="settings-actions">

                          <button
                            className="primary-btn"
                            onClick={conectarClassroom}
                          >
                            Conectar Classroom
                          </button>

                        </div>
                      )}
                  </>
                )}

              </div>
            </>
          )}

          {section === "apariencia" && (
            <>
              <h2>Apariencia</h2>

              <label>Tema</label>

              <select
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>

              <button
                className="primary-btn"
                onClick={guardarTema}
              >
                Guardar tema
              </button>
            </>
          )}

          {section === "notificaciones" && (
            <>
              <h2>Notificaciones</h2>

              <label>
                <input
                  type="checkbox"
                  checked={notificaciones.tareas}
                  onChange={() =>
                    setNotificaciones({
                      ...notificaciones,
                      tareas:
                        !notificaciones.tareas
                    })
                  }
                />

                Nuevas tareas
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={
                    notificaciones.recordatorios
                  }
                  onChange={() =>
                    setNotificaciones({
                      ...notificaciones,
                      recordatorios:
                        !notificaciones.recordatorios
                    })
                  }
                />

                Recordatorios
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={
                    notificaciones.resumenDiario
                  }
                  onChange={() =>
                    setNotificaciones({
                      ...notificaciones,
                      resumenDiario:
                        !notificaciones.resumenDiario
                    })
                  }
                />

                Resumen diario
              </label>

              <button
                className="primary-btn"
                onClick={guardarNotificaciones}
              >
                Guardar
              </button>
            </>
          )}
          </main>
      </div>
    </DashboardLayout>
  );
}