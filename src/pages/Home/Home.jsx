import "./Home.css";

import { useState, useMemo, useEffect } from "react";

import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { generatePlan } from "../../components/ai/prodaiAssistant";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCard from "../../components/StatsCard/StatsCard";

import { useUserData } from "../../hooks/useUserData";
import { useTasks } from "../../hooks/useTasks";

import { syncClassroom } from "../../services/syncClassroomService";

function Home() {
const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
const { tasks } = useTasks();
const { userData } = useUserData();

const [selectedCourses, setSelectedCourses] =
  useState([]);

useEffect(() => {
  document.title = "Inicio | ProdAI";
}, []);

useEffect(() => {

  if (!userData) return;

  setSelectedCourses(
    userData.selectedCourses || []
  );

}, [userData]);

const filteredTasks = tasks.filter(task => {

  if (task.source !== "classroom") {
    return true;
  }

  if (selectedCourses.length === 0) {
    return true;
  }

  return selectedCourses.includes(
    task.courseId
  );

});

// DESPUÉS activeTasks
const activeTasks = filteredTasks.filter(task => {

  if (task.completed) return true;

  if (!task.dueDate) return true;

  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);

  if (
    task.source === "classroom" &&
    taskDate < todayDate
  ) {
    return false;
  }

  return true;

});

  const navigate = useNavigate();

  // =========================================
  // MENÚ PERFIL
  // =========================================

  const [menuOpen, setMenuOpen] =
    useState(false);

  // =========================================
  // FECHA DE HOY
  // =========================================

  const today =
    new Date().toISOString().split("T")[0];

 // =========================================
// ESTADÍSTICAS
// =========================================

// Tareas completadas
const completedTasks = useMemo(
  () =>
    activeTasks.filter(
      task => task.completed
    ).length,
  [activeTasks]
);

// Tareas pendientes
const pendingTasks = useMemo(
  () =>
    activeTasks.filter(
      task => !task.completed
    ).length,
  [activeTasks]
);

// Tareas de alta prioridad pendientes
const highPriorityTasks = useMemo(
  () =>
    activeTasks.filter(
      task =>
        task.priority === "Alta" &&
        !task.completed
    ).length,
  [activeTasks]
);

// =========================================
// MATERIAS ACTIVAS
// =========================================
//
// Se obtienen directamente de las materias
// seleccionadas por el usuario en Classroom.
//
// Esto evita depender de las tareas,
// ya que puede haber materias sin tareas.
//
const subjectsCount = useMemo(() => {

  return (
    userData?.selectedCourses?.length || 0
  );

}, [userData]);

// =========================================
// DEBUG CLASSROOM
// =========================================

useEffect(() => {

  console.log(
    "USER DATA:",
    userData
  );

  console.log(
    "SELECTED COURSES:",
    userData?.selectedCourses
  );

  console.log(
    "TOTAL MATERIAS:",
    userData?.selectedCourses?.length || 0
  );

}, [userData]);

  // =========================================
  // TAREAS DE HOY
  // =========================================

  const todayTasks = useMemo(
    () =>
      activeTasks.filter(
        task =>
          task.dueDate === today &&
          !task.completed
      ),
    [activeTasks, today]
  );

  // =========================================
  // TAREAS URGENTES
  // =========================================

  const urgentTasks = useMemo(
    () =>
      activeTasks.filter(
        task =>
          task.priority === "Alta" &&
          !task.completed
      ),
    [activeTasks]
  );

  // =========================================
  // PRÓXIMA TAREA
  // =========================================

  const nextTask = useMemo(() => {

    return activeTasks
      .filter(
        task =>
          !task.completed &&
          task.dueDate
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      )[0];

  }, [activeTasks]);

  // =========================================
  // ACTIVIDAD RECIENTE
  // =========================================

  const recentTasks = useMemo(() => {

    return activeTasks
      .slice()
      .sort(
        (a, b) =>
          (b.createdAt || 0) -
          (a.createdAt || 0)
      )
      .slice(0, 5);

  }, [activeTasks]);

  // =========================================
  // IA
  // =========================================

  const aiPlan = useMemo(() => {

    return generatePlan(activeTasks);

  }, [activeTasks]);

  // =========================================
  // CERRAR SESIÓN
  // =========================================

  const logout = async () => {

    await signOut(auth);

    navigate("/");

  };

  return (

    <DashboardLayout>

      <div className="home">

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="top-header">

          <div className="top-header-left">

            <h1>

              Hola,{" "}

              {userData?.nombre ||
                auth.currentUser?.displayName ||
                "Usuario"}

            </h1>

            <p>
              Organiza tus tareas y mejora tu
              productividad académica.
            </p>

          </div>

          <div className="top-header-right">

            <button
              className="profile-button"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
            >

              <img
                src={
                  userData?.photo ||
                  auth.currentUser?.photoURL ||
                  `https://ui-avatars.com/api/?name=${
                    userData?.nombre ||
                    "User"
                  }`
                }
                alt="user"
              />

              <div>

                <h4>

                  {userData?.nombre ||
                    auth.currentUser
                      ?.displayName ||
                    "Usuario"}

                </h4>

                <span>
                  {auth.currentUser?.email}
                </span>

              </div>

            </button>

            {menuOpen && (

              <div className="dropdown-menu">

                <p
                  className="dropdown-item"
                  onClick={() =>
                    navigate("/profile")
                  }
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

        {/* ===================================== */}
        {/* STATS */}
        {/* ===================================== */}

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

        {/* ===================================== */}
        {/* DASHBOARD */}
        {/* ===================================== */}

        <div className="dashboard-grid">

          {/* IA */}

          <div className="dashboard-card">

            <h2>
              🤖 Asistente ProdAI
            </h2>

            <p>
              {aiPlan.suggestion}
            </p>

            <div className="dashboard-stats">

              <span>
                Hoy: {todayTasks.length}
              </span>

              <span>
                Urgentes: {urgentTasks.length}
              </span>

            </div>

          </div>

          {/* PRÓXIMAS TAREAS */}

          <div className="dashboard-card">

            <h2>
              📋 Próximas tareas
            </h2>

            <div className="dashboard-list">

              {activeTasks
                .filter(
                  task =>
                    !task.completed
                )
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

          {/* PRÓXIMA ENTREGA */}

          <div className="dashboard-card">

            <h2>
              ⏰ Próxima entrega
            </h2>

            {nextTask ? (

              <>
                <p>
                  {nextTask.title}
                </p>

                <small>
                  {nextTask.dueDate}
                </small>
              </>

            ) : (

              <p>
                No hay tareas próximas.
              </p>

            )}

          </div>

          {/* ACTIVIDAD RECIENTE */}

          <div className="dashboard-card">

            <h2>
              ⚡ Actividad reciente
            </h2>

            {recentTasks.length === 0 ? (

              <p>
                Sin actividad reciente.
              </p>

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