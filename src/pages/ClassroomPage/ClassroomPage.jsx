import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
//import "./ClassroomPage.css";
import { getCourses, getCourseWork } from "../../api/classroom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
export default function ClassroomPage() {

  // 📚 Cursos encontrados
  const [courses, setCourses] = useState([]);

  // 📝 Tareas encontradas
  const [tasks, setTasks] = useState([]);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(true);

  // ❌ Errores
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchClassroomData = async () => {

      try {

        setLoading(true);

        // 🔑 Token guardado al iniciar sesión con Google
        const token = localStorage.getItem("googleToken");

        if (!token) {
          setError("No hay token de Google. Inicia sesión nuevamente.");
          return;
        }

        // =========================
        // OBTENER CURSOS
        // =========================
        const coursesData = await getCourses(token);

        setCourses(coursesData);

        // =========================
        // OBTENER TAREAS
        // =========================
        const allTasks = [];

        for (const course of coursesData) {

          try {

            const works = await getCourseWork(
              course.id,
              token
            );

            works.forEach((work) => {

            // =========================
            // FORMATEAR FECHA
            // =========================
            const formattedDate = work.dueDate
                ? `${work.dueDate.year}-${String(
                    work.dueDate.month
                ).padStart(2, "0")}-${String(
                    work.dueDate.day
                ).padStart(2, "0")}`
                : "Sin fecha";

            // =========================
            // CALCULAR PRIORIDAD
            // =========================
            let priority = "Baja";

            if (work.dueDate) {

                const dueDate = new Date(
                work.dueDate.year,
                work.dueDate.month - 1,
                work.dueDate.day
                );

                const today = new Date();

                const diffDays = Math.ceil(
                (dueDate - today) / (1000 * 60 * 60 * 24)
                );

                if (diffDays <= 1) {
                priority = "Alta";
                } else if (diffDays <= 3) {
                priority = "Media";
                } else {
                priority = "Baja";
                }
            }

            // =========================
            // AGREGAR TAREA
            // =========================
            allTasks.push({
                classroomId: work.id,
                title: work.title,
                description: work.description || "",
                subject: course.name,
                completed: false,
                source: "classroom",
                dueDate: formattedDate,
                priority
            });

            });

          } catch (err) {

            console.error(
              "Error obteniendo tareas del curso:",
              course.name,
              err
            );

          }

        }

        // =========================
// GUARDAR EN FIRESTORE
// =========================

for (const task of allTasks) {

  const q = query(
    collection(db, "activities"),
    where("classroomId", "==", task.classroomId)
  );

  const existing = await getDocs(q);

  if (existing.empty) {

    await addDoc(
      collection(db, "activities"),
      {
        ...task,
        createdAt: Date.now()
      }
    );

    console.log("✅ Guardada:", task.title);

  }
}

        console.log("📚 CURSOS:", coursesData);
        console.log("📝 TAREAS:", allTasks);

        setTasks(allTasks);

      } catch (err) {

        console.error(err);
        setError("Error al cargar Google Classroom");

      } finally {

        setLoading(false);

      }
    };

    fetchClassroomData();

  }, []);

  return (
    <DashboardLayout>
      <div className="home">

        {/* ================= HEADER ================= */}
        <div className="top-header">

          <div className="top-header-left">

            <h1>Google Classroom</h1>

            <p>
              Consulta tus clases y actividades sincronizadas desde Classroom.
            </p>

          </div>

        </div>

        {/* ================= RESUMEN ================= */}
        <div className="welcome-card">

          <h2>Resumen</h2>

          <p>
            Cursos encontrados: <b>{courses.length}</b>
          </p>

          <p>
            Actividades encontradas: <b>{tasks.length}</b>
          </p>

        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="welcome-card">
            <p>Cargando Classroom...</p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && (
          <div className="welcome-card">
            <p style={{ color: "red" }}>{error}</p>
          </div>
        )}

        {/* ================= CURSOS ================= */}
        {!loading && !error && (
          <>
            <div className="welcome-card">
              <h2>Mis Cursos</h2>
            </div>

            <div className="stats-container">

              {courses.map((course) => (

                <div
                  key={course.id}
                  className="welcome-card"
                >

                  <h2>{course.name}</h2>

                  <p>
                    <b>Sección:</b>{" "}
                    {course.section || "Sin sección"}
                  </p>

                  <p>
                    <b>Estado:</b>{" "}
                    {course.courseState || "Activo"}
                  </p>

                </div>

              ))}

            </div>
          </>
        )}

        {/* ================= TAREAS ================= */}
        {!loading && !error && (
          <>
            <div className="welcome-card">
              <h2>Actividades de Classroom</h2>
            </div>

            <div className="stats-container">

              {tasks.map((task) => (

                <div
                  key={task.classroomId}
                  className="welcome-card"
                >

                  <h2>{task.title}</h2>

                  <p>
                    <b>Materia:</b> {task.subject}
                  </p>

                  <p>
                    <b>Fecha:</b> {task.dueDate}
                  </p>

                  <p>
                    <b>Estado:</b> Pendiente
                  </p>

                </div>

              ))}

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}