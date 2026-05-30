import "./Home.css";
import { generatePlan } from "../../components/ai/prodaiAssistant";
import { useState, useMemo } from "react";
import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AIChat from "../../components/ai/AIChat";
import { useUserData } from "../../hooks/useUserData";
import { useTasks } from "../../hooks/useTasks";

import StatsCard from "../../components/StatsCard/StatsCard";
import DashboardLayout from "../../layouts/DashboardLayout";

function Home() {

  const navigate = useNavigate();

  // 🔥 DATA REAL
  const { tasks } = useTasks();

  const { userData, loading } = useUserData();

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
        <div className="welcome-card">

          <h2>Tu centro de productividad académica</h2>

          <p>
            Organiza, prioriza y completa tus tareas con ayuda de ProdAI.
          </p>

        </div>

        <div className="welcome-card">

        <h2>Asistente ProdAI</h2>

        <p><b>Recomendación:</b> {aiPlan.suggestion}</p>

        <hr style={{ opacity: 0.2 }} />

        <p>Hoy: {aiPlan.today.length}</p>
        <p>Urgentes: {aiPlan.urgent.length}</p>

        <p style={{ marginTop: "10px" }}>
          {aiPlan.message}
        </p>

      </div>

        {/* ================= STATS ================= */}
        <div className="stats-container">

          <StatsCard title="Pendientes" value={pendingTasks} />
          <StatsCard title="Completadas" value={completedTasks} />
          <StatsCard title="Alta prioridad" value={highPriorityTasks} />
          <StatsCard title="Materias activas" value={subjectsCount} />

        </div>

        {/* ================= HOY ================= */}
        <div className="welcome-card">

          <h2>Tareas de hoy</h2>

          {todayTasks.length === 0 ? (
            <p>No tienes tareas para hoy </p>
          ) : (
            todayTasks.map(t => (
              <p key={t.id}>• {t.title}</p>
            ))
          )}

        </div>

        {/* ================= URGENTES ================= */}
        <div className="welcome-card">

          <h2>Urgentes</h2>

          {urgentTasks.length === 0 ? (
            <p>No tienes tareas urgentes</p>
          ) : (
            urgentTasks.map(t => (
              <p key={t.id}>• {t.title}</p>
            ))
          )}

        </div>

        {/* ================= PRÓXIMA TAREA ================= */}
        <div className="welcome-card">

          <h2>Próxima tarea</h2>

          {nextTask ? (
            <>
              <p><b>{nextTask.title}</b></p>
              <p>{nextTask.dueDate}</p>
            </>
          ) : (
            <p>No hay tareas próximas</p>
          )}

        </div>

        {/* ================= ACTIVIDAD RECIENTE ================= */}
        <div className="welcome-card">

          <h2>Actividad reciente</h2>

          {recentTasks.length === 0 ? (
            <p>No hay actividad reciente</p>
          ) : (
            recentTasks.map(t => (
              <p key={t.id}>
                • {t.title} {t.completed ? "✅" : "⏳"}
              </p>
            ))
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Home;