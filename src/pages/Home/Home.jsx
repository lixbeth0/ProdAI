import "./Home.css";
import { generatePlan } from "../../components/ai/prodaiAssistant";
import { useState, useMemo } from "react";
import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AIChat from "../../components/ai/AIChat";
import { useUserData } from "../../hooks/useUserData";
import { useTasks } from "../../hooks/useTasks";
import { useEffect } from "react";

import {
  getCourses,
  getCourseWork
} from "../../api/classroom";

import StatsCard from "../../components/StatsCard/StatsCard";
import DashboardLayout from "../../layouts/DashboardLayout";


function Home() {

  const navigate = useNavigate();

  // 🔥 DATA REAL
  const { tasks } = useTasks();
  const [courses, setCourses] = useState([]);
  const [classroomTasks, setClassroomTasks] = useState([]); 

  const { userData, loading } = useUserData();

  // DEBUG
useEffect(() => {
  console.log("USER DATA:", userData);
  console.log("TOKEN:", userData?.classroomToken);
}, [userData]);

// CLASSROOM
useEffect(() => {

  const loadClassroom = async () => {

    if (!userData?.classroomToken) return;

    try {

      const coursesData = await getCourses(
        userData.classroomToken
      );

      setCourses(coursesData);

      let allTasks = [];

      for (const course of coursesData) {

        const works = await getCourseWork(
          course.id,
          userData.classroomToken
        );

        allTasks.push(
          ...works.map(work => ({
            ...work,
            courseName: course.name
          }))
        );
      }

      setClassroomTasks(allTasks);

    } catch (error) {
      console.error(
        "Error cargando Classroom:",
        error
      );
    }
  };

  loadClassroom();

}, [userData]);

  // 🔥 DROPDOWN
  const [menuOpen, setMenuOpen] = useState(false);

  // 📅 HOY
  const today = new Date().toISOString().split("T")[0];

  // 🧠 DATOS INTELIGENTES
  const completedTasks = useMemo(
    () => tasks.filter(t => t.completed).length,
    [tasks]
  );

  const pendingTasks = useMemo(
    () => tasks.filter(t => !t.completed).length,
    [tasks]
  );

  const highPriorityTasks = useMemo(
    () => tasks.filter(t => t.priority === "Alta" && !t.completed).length,
    [tasks]
  );

  const subjectsCount = useMemo(
    () => new Set(tasks.map(t => t.subject)).size,
    [tasks]
  );

  // 📅 TAREAS DE HOY
  const todayTasks = useMemo(
    () => tasks.filter(t => t.dueDate === today && !t.completed),
    [tasks]
  );

  // ⚠ URGENTES
  const urgentTasks = useMemo(
    () => tasks.filter(t => t.priority === "Alta" && !t.completed),
    [tasks]
  );

  // 🧭 PRÓXIMA TAREA
  const nextTask = useMemo(() => {
    return tasks
      .filter(t => !t.completed && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
  }, [tasks]);

  // ⚡ ACTIVIDAD RECIENTE
  const recentTasks = useMemo(() => {
    return tasks
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 5);
  }, [tasks]);

  // 🔥 LOGOUT
  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const aiPlan = useMemo(() => {
  return generatePlan(tasks);
  }, [tasks]);

  // ⏳ LOADING
  if (loading) return <h2>Cargando...</h2>;

  return (
    <DashboardLayout>

      <div className="home">

        {/* ================= HEADER ================= */}
        <div className="top-header">

          <div className="top-header-left">

            <h1>
              Hola,{" "}
              {userData?.nombre ||
                auth.currentUser?.displayName ||
                "Usuario"}
            </h1>

            <p>
              Organiza tus tareas y mejora tu productividad académica.
            </p>

          </div>

          <div className="top-header-right">

            <button
              className="profile-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >

              <img
                src={
                  userData?.photo ||
                  auth.currentUser?.photoURL ||
                  `https://ui-avatars.com/api/?name=${userData?.nombre || "User"}`
                }
                alt="user"
              />

              <div>
                <h4>
                  {userData?.nombre ||
                    auth.currentUser?.displayName ||
                    "Usuario"}
                </h4>

                <span>{auth.currentUser?.email}</span>
              </div>

            </button>

            {menuOpen && (
              <div className="dropdown-menu">

                <p
                  className="dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  Perfil
                </p>

                <hr />

                <p
                  className="dropdown-item logout"
                  onClick={logout}
                >
                  Cerrar sesión
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ================= WELCOME ================= */}


        <div className="stats-container">

          <StatsCard
            title="Pendientes"
            value={pendingTasks}
          />

          <StatsCard
            title="Completadas"
            value={completedTasks}
          />

          <StatsCard
            title="Alta prioridad"
            value={highPriorityTasks}
          />

          <StatsCard
            title="Materias activas"
            value={subjectsCount}
          />

        </div>

        {/* ================= DASHBOARD ================= */}

        <div className="dashboard-grid">

          {/* IA */}

          <div className="dashboard-card">

            <h2>🤖 Asistente ProdAI</h2>

            <p>{aiPlan.suggestion}</p>

            <div className="dashboard-stats">

              <span>
                Hoy: {aiPlan.today.length}
              </span>

              <p> </p>

              <span>
                Urgentes: {aiPlan.urgent.length}
              </span>

            </div>

          </div>

          {/* TAREAS */}

          <div className="dashboard-card">

            <h2>📋 Próximas tareas</h2>

            <div className="dashboard-list">

              {tasks
                .filter(t => !t.completed)
                .slice(0, 5)
                .map(task => (

                  <div
                    key={task.id}
                    className="dashboard-item"
                  >
                    {task.title}
                  </div>

                ))}

            </div>

          </div>

          {/* CLASSROOM */}
          <div className="dashboard-card">

            <h2>📚 Classroom</h2>

            {courses.length === 0 ? (

              <p>No hay cursos conectados.</p>

            ) : (

              <div className="classroom-scroll">

                {courses.map(course => (

                  <div
                    key={course.id}
                    className="dashboard-item"
                  >
                    {course.name}
                  </div>

                ))}

              </div>

            )}

          </div>

          {/* ACTIVIDAD */}

          <div className="dashboard-card">

            <h2>⚡ Actividad reciente</h2>

            {recentTasks.length === 0 ? (

              <p>Sin actividad reciente.</p>

            ) : (

              recentTasks.map(task => (

                <div
                  key={task.id}
                  className="dashboard-item"
                >
                  {task.title}
                </div>

              ))

            )}

          </div>

        </div>

        </div>
        
    </DashboardLayout>
  );
}

export default Home;