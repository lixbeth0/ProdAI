import { useState, useEffect } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./TasksPage.css";

import {
  createTask,
  toggleTask,
  deleteTask
} from "../../services/taskService";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import { useTasks } from "../../hooks/useTasks";
import { auth } from "../../firebase/firebase";

import TaskCard from "../../components/tasks/TaskCard";


function TasksPage() {

useEffect(() => {
  document.title = "Tareas | ProdAI";
}, []);

// =========================
// TAREAS
// =========================

const { tasks } = useTasks();

// =========================
// MATERIAS SELECCIONADAS
// =========================

const [selectedCourses, setSelectedCourses] =
  useState([]);

// =========================
// FORM STATE
// =========================

const [title, setTitle] = useState("");
const [description, setDescription] =
  useState("");
const [subject, setSubject] = useState("");
const [priority, setPriority] =
  useState("Media");
const [dueDate, setDueDate] =
  useState("");
const [dueTime, setDueTime] =
  useState("");

const [creating, setCreating] =
  useState(false);

const [error, setError] =
  useState("");

// =========================
// CARGAR CONFIGURACIÓN
// =========================

useEffect(() => {

  const loadSettings = async () => {

    if (!auth.currentUser) return;

    try {

      const snap = await getDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid
        )
      );

      if (!snap.exists()) return;

      const data = snap.data();

      setSelectedCourses(
        data.selectedCourses || []
      );

    } catch (error) {

      console.error(
        "Error cargando configuración:",
        error
      );

    }

  };

  loadSettings();

}, []);

// =========================
// FILTRAR TAREAS
// =========================

const allTasks = tasks.filter(task => {

  // tareas manuales
  if (task.source !== "classroom") {
    return true;
  }

  // mostrar todas si no hay filtro
  if (selectedCourses.length === 0) {
    return true;
  }

  // mostrar solo cursos elegidos
  return selectedCourses.includes(
    task.courseId
  );

});

// =========================
// MATERIAS DISPONIBLES
// =========================

const subjects = [
  ...new Set(
    allTasks
      .map(task => task.subject)
      .filter(Boolean)
  )
];

// =========================
// CREAR TAREA
// =========================

const handleCreateTask = async () => {

  setError("");

  if (!title.trim()) {

    setError(
      "El título es obligatorio"
    );

    return;
  }

  if (!auth.currentUser) {

    setError(
      "Debes iniciar sesión"
    );

    return;
  }

  try {

    setCreating(true);

    await createTask({

      title,
      description,
      subject,
      priority,
      dueDate,
      dueTime,

      userId:
        auth.currentUser.uid

    });

    // limpiar formulario

    setTitle("");
    setDescription("");
    setSubject("");
    setPriority("Media");
    setDueDate("");
    setDueTime("");

  } catch (error) {

    console.error(error);

    setError(
      "Error al crear la tarea"
    );

  } finally {

    setCreating(false);

  }

};

// =========================
// COMPLETAR TAREA
// =========================
//
// Classroom se sincroniza
// automáticamente.
// Solo permitimos marcar
// tareas manuales.
//

const handleToggleTask = async (
  taskId,
  completed
) => {

  const task =
    tasks.find(
      t => t.id === taskId
    );

  if (
    task?.source === "classroom"
  ) {

    console.log(
      "Las tareas de Classroom se actualizan automáticamente"
    );

    return;
  }

  await toggleTask(
    taskId,
    completed
  );

};

// =========================
// ELIMINAR TAREA
// =========================

const handleDeleteTask = async (
  taskId
) => {

  await deleteTask(taskId);

};

// =========================
// FECHA ACTUAL
// =========================

const today = new Date();

today.setHours(
  0,
  0,
  0,
  0
);

// =========================
// PENDIENTES
// =========================

const pendingTasks =
  allTasks.filter(task => {

    if (task.completed)
      return false;

    if (!task.dueDate)
      return true;

    const taskDate =
      new Date(task.dueDate);

    taskDate.setHours(
      0,
      0,
      0,
      0
    );

    return taskDate >= today;

  });

// =========================
// VENCIDAS
// =========================

const expiredTasks =
  allTasks.filter(task => {

    if (task.completed)
      return false;

    if (!task.dueDate)
      return false;

    const taskDate =
      new Date(task.dueDate);

    taskDate.setHours(
      0,
      0,
      0,
      0
    );

    return taskDate < today;

  });

// =========================
// COMPLETADAS
// =========================

const completedTasks =
  allTasks.filter(
    task => task.completed
  );

// =========================
// MANUALES
// =========================

const manualTasks =
  allTasks.filter(
    task =>
      task.source !==
      "classroom"
  );

// =========================
// DEBUG
// =========================

useEffect(() => {

  console.log(
    "TOTAL TASKS:",
    allTasks.length
  );

  console.log(
    "PENDING:",
    pendingTasks
  );

  console.log(
    "EXPIRED:",
    expiredTasks
  );

  console.log(
    "COMPLETED:",
    completedTasks
  );

  console.log(
    "CLASSROOM COMPLETED:",
    tasks.filter(
      task =>
        task.source ===
          "classroom" &&
        task.completed
    )
  );

}, [tasks]);

console.log(
  tasks.map(task => ({
    title: task.title,
    completed: task.completed,
    source: task.source,
    dueDate: task.dueDate
  }))
);

  return (

    <DashboardLayout>

      <div className="tasks-page">

        {/* =========================
            FORMULARIO
        ========================= */}
        <div className="task-form">

          <div className="task-form-header">
            <h2>Nueva Actividad</h2>
            <p>
              Organiza tus actividades académicas
            </p>
          </div>

          {/* TÍTULO */}
          <div className="task-input-group">

            <label>Título</label>

            <input
              type="text"
              placeholder="Ej. Resolver ejercicios de álgebra"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>

          {/* PRIORIDAD */}
          <div className="task-input-group">

            <label>Prioridad</label>

            <select
              className="task-select"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value="Alta">
                Alta
              </option>

              <option value="Media">
                Media
              </option>

              <option value="Baja">
                Baja
              </option>

            </select>

          </div>

          {/* FECHA */}
          <div className="task-input-group">

            <label>Fecha límite</label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

          </div>

          {/* HORA */}
          <div className="task-input-group">

            <label>Hora límite</label>

            <input
              type="time"
              value={dueTime}
              onChange={(e) =>
                setDueTime(e.target.value)
              }
            />

          </div>

          {/* DESCRIPCIÓN */}
          <div className="task-input-group">

            <label>Descripción</label>

            <textarea
              placeholder="Describe los detalles..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>

          {/* MATERIA */}
          <div className="task-input-group">

            <label>Materia</label>

            <input
              type="text"
              list="subjects-list"
              placeholder="Ej. Matemáticas"
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
            />

            <datalist id="subjects-list">

              {subjects.map(
                (subj, i) => (

                  <option
                    key={i}
                    value={subj}
                  />

                )
              )}

            </datalist>

          </div>

          {/* ERROR */}
          {error && (

            <p
              style={{
                color: "#f87171",
                fontSize: "0.85rem"
              }}
            >
              {error}
            </p>

          )}

          {/* BOTÓN */}
          <button
            className="create-task-btn"
            onClick={handleCreateTask}
            disabled={creating}
          >

            {creating
              ? "Creando..."
              : "Crear actividad"}

          </button>

        </div>

        {/* =========================
            LISTA DE TAREAS
        ========================= */}
        {/* =========================
              PENDIENTES
          ========================= */}

          <div className="tasks-section">

            <div className="tasks-header">

              <div>

                <h1>📚 Pendientes</h1>

                <p>
                  Actividades por realizar
                </p>

              </div>

              <div className="tasks-stats">

                <div className="stat-card">

                  <span>{allTasks.length}</span>

                  <p>Total</p>

                </div>

                <div className="stat-card">

                  <span>{pendingTasks.length}</span>

                  <p>Pendientes</p>

                </div>

              </div>

            </div>

            {pendingTasks.length === 0 ? (

              <div className="empty-tasks">

                <h3>
                  No hay tareas pendientes
                </h3>

              </div>

            ) : (

              <div className="tasks-grid">

                {pendingTasks.map(task => (

                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />

                ))}

              </div>

            )}

            {/* =========================
                VENCIDAS
            ========================= */}

            {expiredTasks.length > 0 && (

              <div className="expired-section">

                <h2>
                  ⏰ Tareas pasadas ({expiredTasks.length})
                </h2>

                <div className="tasks-grid">

                  {expiredTasks.map(task => (

                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />

                  ))}

                </div>

              </div>

            )}

            {/* =========================
                COMPLETADAS
            ========================= */}

            {completedTasks.length > 0 && (

              <div className="expired-section">

                <h2>
                  ✅ Completadas ({completedTasks.length})
                </h2>

                <div className="tasks-grid">

                  {completedTasks.map(task => (

                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />

                  ))}

                </div>

              </div>

            )}

            {/* =========================
                MANUALES
            ========================= */}

            {manualTasks.length > 0 && (

              <div className="expired-section">

                <h2>
                  📝 Tareas manuales ({manualTasks.length})
                </h2>

                <div className="tasks-grid">

                  {manualTasks.map(task => (

                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />

                  ))}

                </div>

              </div>

            )}

          </div>

      </div>

    </DashboardLayout>

  );
}

export default TasksPage;