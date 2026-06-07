import { useState } from "react";
import { useActivities } from "../../hooks/useActivities";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./TasksPage.css";

import {
  createTask,
  toggleTask,
  deleteTask
} from "../../services/taskService";

import { useTasks } from "../../hooks/useTasks";
import { auth } from "../../firebase/firebase";

import TaskCard from "../../components/tasks/TaskCard";

function TasksPage() {

  // =========================
  // TAREAS MANUALES
  // =========================
  const { tasks, loading } = useTasks();

  // =========================
  // TAREAS DE CLASSROOM
  // =========================
  const {
    activities,
    loading: loadingActivities
  } = useActivities();

  // =========================
  // UNIR TODAS LAS TAREAS
  // =========================
  const allTasks = [
    ...tasks,
    ...activities
  ];

  // =========================
  // MATERIAS ÚNICAS
  // (manuales + classroom)
  // =========================
  const subjects = [
    ...new Set(
      allTasks
        .map(t => t.subject)
        .filter(Boolean)
    )
  ];

  // =========================
  // FORM STATE
  // =========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Media");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // CREAR TAREA
  // =========================
  const handleCreateTask = async () => {

    setError("");

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (!auth.currentUser) {
      setError("Debes iniciar sesión");
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
        userId: auth.currentUser.uid
      });

      // limpiar formulario
      setTitle("");
      setDescription("");
      setSubject("");
      setPriority("Media");
      setDueDate("");
      setDueTime("");

    } catch (err) {

      console.error(err);
      setError("Error al crear la tarea");

    } finally {

      setCreating(false);

    }
  };

  // =========================
  // COMPLETAR TAREA
  // =========================
  const handleToggleTask = async (
    taskId,
    completed
  ) => {

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
  // LOADING
  // =========================
  if (
    loading ||
    loadingActivities
  ) {

    return (
      <DashboardLayout>
        <h2 style={{ color: "white" }}>
          Cargando tareas...
        </h2>
      </DashboardLayout>
    );

  }

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
        <div className="tasks-section">

          <div className="tasks-header">

              <div>
                <h1>Mis Actividades</h1>

                <p>
                  Gestiona tus tareas manuales y sincronizadas desde Classroom
                </p>
              </div>

              <div className="tasks-stats">

                <div className="stat-card">
                  <span>{allTasks.length}</span>
                  <p>Total</p>
                </div>

                <div className="stat-card">
                  <span>
                    {
                      allTasks.filter(
                        task => !task.completed
                      ).length
                    }
                  </span>

                  <p>Pendientes</p>
                </div>

              </div>

          </div>

          {allTasks.length === 0 ? (

            <div className="empty-tasks">

              <h3>
                No hay tareas todavía
              </h3>

              <p>
                Crea tu primera tarea para comenzar.
              </p>

            </div>

          ) : (

            <div className="tasks-grid">

              {allTasks.map(task => (

                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />

              ))}

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );
}

export default TasksPage;