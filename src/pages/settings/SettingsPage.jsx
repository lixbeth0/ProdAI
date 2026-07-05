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

/* =========================================================
   SETTINGS PAGE
   - Perfil
   - Apariencia
   - Notificaciones
   - Google Classroom + selección de materias
========================================================= */

export default function SettingsPage() {

useEffect(() => {
  document.title = "Configuración | ProdAI";
}, []);

  const { user } = useAuth();

  // =========================
  // UI SECTION STATE
  // =========================
  const [section, setSection] = useState("perfil");

  // =========================
  // PROFILE
  // =========================
  const [profile, setProfile] = useState({
    nombre: "",
    correo: "",
    carrera: "",
    semestre: "",
    universidad: ""
  });

  // =========================
  // THEME
  // =========================
  const [tema, setTema] = useState("");

  // =========================
  // NOTIFICATIONS
  // =========================
  const [notificaciones, setNotificaciones] = useState({
    tareas: true,
    recordatorios: true,
    resumenDiario: false
  });

  // =========================
  // CLASSROOM STATUS
  // =========================
  const [classroomConnected, setClassroomConnected] = useState(false);
  const [classroomEmail, setClassroomEmail] = useState("");
  const [lastSync, setLastSync] = useState("");
  const [coursesCount, setCoursesCount] = useState(0);

  // =========================
  // CLASSROOM DATA
  // =========================
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // =========================================================
  // CARGAR USUARIO DESDE FIRESTORE
  // =========================================================
  useEffect(() => {

    const cargarUsuario = async () => {

      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data();

      setProfile({
        nombre: data.nombre || "",
        correo: data.correo || "",
        carrera: data.carrera || "",
        semestre: data.semestre || "",
        universidad: data.universidad || ""
      });

      setNotificaciones(data.notificaciones || {
        tareas: true,
        recordatorios: true,
        resumenDiario: false
      });

      setTema(data.tema || "");

      setClassroomConnected(!!data.classroomToken);
      setClassroomEmail(data.classroomEmail || "");
      setLastSync(data.lastSync || "");
      setCoursesCount(data.coursesCount || 0);

      setSelectedCourses(data.selectedCourses || []);
    };

    cargarUsuario();
  }, [user]);

  // =========================================================
  // API GOOGLE CLASSROOM (TEMPORAL AQUÍ)
  // =========================================================
  const getCoursesFromClassroom = async (token) => {

    const res = await fetch(
      "https://classroom.googleapis.com/v1/courses",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    return (data.courses || []).map(course => ({
      id: course.id,
      name: course.name
    }));
  };

  // =========================================================
  // CARGAR CURSOS CLASSROOM
  // =========================================================
  const cargarCursos = async () => {

    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    if (!data.classroomToken) return;

    const cursos = await getCoursesFromClassroom(data.classroomToken);

    setCourses(cursos);
    setCoursesCount(cursos.length);
  };

  useEffect(() => {
    if (classroomConnected) {
      cargarCursos();
    }
  }, [classroomConnected]);

  // =========================================================
  // TOGGLE MATERIAS SELECCIONADAS
  // =========================================================
  const toggleCourse = (courseId) => {

    setSelectedCourses(prev => {

      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      }

      return [...prev, courseId];
    });

  };

  // =========================================================
  // GUARDAR MATERIAS SELECCIONADAS
  // =========================================================
  const guardarCursosSeleccionados = async () => {

    await updateDoc(doc(db, "users", user.uid), {
      selectedCourses
    });

    alert("Materias guardadas correctamente");
  };

  // =========================================================
  // SINCRONIZAR CLASSROOM
  // =========================================================
  const sincronizarClassroom = async () => {

    const fecha = new Date().toLocaleString();

    await updateDoc(doc(db, "users", user.uid), {
      lastSync: fecha
    });

    setLastSync(fecha);

    alert("Sincronización completada");
  };

  // =========================================================
  // PERFIL
  // =========================================================
  const guardarPerfil = async () => {

    await updateDoc(doc(db, "users", user.uid), {
      carrera: profile.carrera,
      semestre: profile.semestre,
      universidad: profile.universidad
    });

    alert("Perfil actualizado");
  };

  // =========================================================
  // TEMA
  // =========================================================
  const guardarTema = async () => {

    await updateDoc(doc(db, "users", user.uid), {
      tema
    });

    document.body.classList.toggle(
      "dark-theme",
      tema === "dark"
    );
  };

  // =========================================================
  // APLICAR TEMA AUTOMÁTICAMENTE
  // =========================================================

  useEffect(() => {

    if (!tema) return;

    document.body.classList.toggle(
      "dark-theme",
      tema === "dark"
    );

  }, [tema]);

  // =========================================================
  // NOTIFICACIONES
  // =========================================================
  const guardarNotificaciones = async () => {

    await updateDoc(doc(db, "users", user.uid), {
      notificaciones
    });

    alert("Notificaciones actualizadas");
  };

  // =========================================================
  // CAMBIAR PASSWORD
  // =========================================================
  const cambiarPassword = async () => {

    await sendPasswordResetEmail(
      auth,
      profile.correo
    );

    alert("Correo de recuperación enviado");
  };

  // =========================================================
  // CONECTAR CLASSROOM
  // =========================================================
  const conectarClassroom = async () => {

    try {

      const provider = getGoogleProvider();

      const result = await signInWithPopup(auth, provider);

      const credential =
        GoogleAuthProvider.credentialFromResult(result);

      const token = credential?.accessToken;
      const email = result.user.email;

      await updateDoc(doc(db, "users", user.uid), {
        classroomToken: token,
        classroomEmail: email
      });

      setClassroomConnected(true);
      setClassroomEmail(email);

      alert("Classroom conectado");

    } catch (err) {
      console.error(err);
      alert("Error conectando Classroom");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <DashboardLayout>
  <div className="settings-container">

    {/* =====================================
        SIDEBAR
    ===================================== */}
    <aside className="settings-sidebar">

      <button
        className={`settings-nav-btn ${
          section === "perfil" ? "active" : ""
        }`}
        onClick={() => setSection("perfil")}
      >
        👤 Perfil
      </button>

      <button
        className={`settings-nav-btn ${
          section === "apariencia" ? "active" : ""
        }`}
        onClick={() => setSection("apariencia")}
      >
        🎨 Apariencia
      </button>

      <button
        className={`settings-nav-btn ${
          section === "notificaciones" ? "active" : ""
        }`}
        onClick={() => setSection("notificaciones")}
      >
        🔔 Notificaciones
      </button>

      <button
        className={`settings-nav-btn ${
          section === "classroom" ? "active" : ""
        }`}
        onClick={() => setSection("classroom")}
      >
        📚 Classroom
      </button>

    </aside>

    {/* =====================================
        CONTENIDO
    ===================================== */}
    <main className="settings-content">

      {/* PERFIL */}
      {section === "perfil" && (
        <>
          <h2>👤 Perfil</h2>

          <input value={profile.nombre} disabled />
          <input value={profile.correo} disabled />

          <input
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
              className="prodai-btn"
              onClick={guardarPerfil}
            >
              💾 Guardar Perfil
            </button>

            <button
              className="prodai-btn-secondary"
              onClick={cambiarPassword}
            >
              🔑 Cambiar contraseña
            </button>

          </div>
        </>
      )}

      {/* CLASSROOM */}
      {section === "classroom" && (
        <>
          <h2>📚 Google Classroom</h2>

          <div className="classroom-info">

            <p>{classroomEmail}</p>
            <p>{coursesCount} cursos detectados</p>

          </div>

          <hr />

          <h3>Materias sincronizadas</h3>

          <div className="courses-list">

            {courses.map(course => (

              <label
                key={course.id}
                className="course-item"
              >

                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() =>
                    toggleCourse(course.id)
                  }
                />

                <span>{course.name}</span>

              </label>

            ))}

          </div>

          <div className="settings-actions">

            <button
              className="prodai-btn"
              onClick={guardarCursosSeleccionados}
            >
              💾 Guardar materias
            </button>

          </div>

        </>
      )}

      {/* APARIENCIA */}
      {section === "apariencia" && (
        <>
          <h2>🎨 Apariencia</h2>

          <select
            value={tema}
            onChange={(e) =>
              setTema(e.target.value)
            }
          >
            <option value="light">
              Claro
            </option>

            <option value="dark">
              Oscuro
            </option>
          </select>

          <button
            className="prodai-btn"
            onClick={guardarTema}
          >
            Guardar tema
          </button>
        </>
      )}

      {/* NOTIFICACIONES */}
      {section === "notificaciones" && (
        <>
          <h2>🔔 Notificaciones</h2>

          <label className="course-item">

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

            <span>
              Recordatorios de tareas
            </span>

          </label>

          <button
            className="prodai-btn"
            onClick={guardarNotificaciones}
          >
            Guardar preferencias
          </button>
        </>
      )}

    </main>

  </div>
</DashboardLayout>
  );
}