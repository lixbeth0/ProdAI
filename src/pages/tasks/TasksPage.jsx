import { useState } from "react";

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
  const { tasks, loading } = useTasks();

  // 🔥 subjects únicos
  const subjects = [
    ...new Set(tasks.map(t => t.subject).filter(Boolean))
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
  // CREATE TASK
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

      // reset form
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
  // TOGGLE TASK
  // =========================
  const handleToggleTask = async (taskId, completed) => {
    await toggleTask(taskId, completed);
  };

  // =========================
  // DELETE TASK
  // =========================
  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
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
            FORM
        ========================= */}
        <div className="task-form">

          <div className="task-form-header">
            <h2>Nueva Actividades</h2>
            <p>Organiza tus actividades académicas</p>
          </div>

          {/* TITLE */}
          <div className="task-input-group">
            <label>Título</label>
            <input
              type="text"
              placeholder="Ej. Resolver ejercicios de álgebra"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* PRIORITY */}
          <div className="task-input-group">
            <label>Prioridad</label>
            <select
            className="task-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
            </select>
          </div>

          {/* DATE */}
          <div className="task-input-group">
            <label>Fecha límite</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* TIME */}
          <div className="task-input-group">
            <label>Hora límite</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="task-input-group">
            <label>Descripción</label>
            <textarea
              placeholder="Describe los detalles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* SUBJECT */}
          <div className="task-input-group">
            <label>Materia</label>
            <input
              type="text"
              list="subjects-list"
              placeholder="Ej. Matemáticas"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <datalist id="subjects-list">
              {subjects.map((subj, i) => (
                <option key={i} value={subj} />
              ))}
            </datalist>
          </div>

          {/* ERROR */}
          {error && (
            <p style={{ color: "#f87171", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            className="create-task-btn"
            onClick={handleCreateTask}
            disabled={creating}
          >
            {creating ? "Creando..." : "Crear actividad"}
          </button>

        </div>

        {/* =========================
            TASKS LIST
        ========================= */}
        <div className="tasks-section">

          <div className="tasks-header">

            <div>
              <h2>Mis Actividades</h2>
              <p>Seguimiento de actividades académicas</p>
            </div>

            <div className="tasks-count">
              {tasks.length} tareas
            </div>

          </div>

          {tasks.length === 0 ? (
            <div className="empty-tasks">
              <h3>No hay tareas todavía</h3>
              <p>Crea tu primera tarea para comenzar.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
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