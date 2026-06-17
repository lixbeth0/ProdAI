import "./TaskCard.css";

import {
  Trash2,
  CalendarDays,
  Pencil
} from "lucide-react";

function TaskCard({

  task,
  onToggle,
  onDelete

}) {

  return (

    <div
      className={
        task.completed
          ? "task-card completed"
          : "task-card"
      }
    >

      {/* =========================
          CABECERA
      ========================= */}

      <div className="task-top">

        <div className="task-status">

          <input
            type="checkbox"
            checked={task.completed}
            onChange={() =>
              onToggle(
                task.id,
                task.completed
              )
            }
          />

          <h3>{task.title}</h3>

        </div>

        <div className="task-actions">

          <button className="edit-btn">

            <Pencil size={18} />

          </button>

          <button
            className="delete-btn"
            onClick={() =>
              onDelete(task.id)
            }
          >

            <Trash2 size={18} />

          </button>

        </div>

      </div>

      {/* =========================
          MATERIA
      ========================= */}

      {(task.subject || task.courseName) && (

        <div className="task-subject">

          📚 {task.subject || task.courseName}

        </div>

      )}

      {/* =========================
          DESCRIPCIÓN
      ========================= */}

      <p className="task-description">

        {task.description || "Sin descripción"}

      </p>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="task-footer">

        <span
          className={`priority ${task.priority}`}
        >

          {task.priority || "Media"}

        </span>

      </div>

      {/* =========================
          FECHA
      ========================= */}

      <div className="task-date">

        <CalendarDays size={16} />

        <span>

          {task.dueDate || "Sin fecha"}

          {task.dueTime &&
            ` • ${task.dueTime}`}

        </span>

      </div>

    </div>

  );
}

export default TaskCard;