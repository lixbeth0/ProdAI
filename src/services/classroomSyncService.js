// ======================================
// IMPORTACIONES
// ======================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
}
from "firebase/firestore";

import { db } from "../firebase/firebase";

import {
  getCourseWork
}
from "./classroom";

// ======================================
// SINCRONIZAR CURSO
// ======================================

export const syncCourseTasks = async (

  course,
  token,
  userId

) => {

  // ==========================
  // OBTENER TAREAS
  // ==========================

  const works =
    await getCourseWork(
      course.id,
      token
    );

  // ==========================
  // RECORRER TAREAS
  // ==========================

  for (const work of works) {

    // ==========================
    // EVITAR DUPLICADOS
    // ==========================

    const q = query(

      collection(db, "tasks"),

      where(
        "classroomId",
        "==",
        work.id
      ),

      where(
        "userId",
        "==",
        userId
      )

    );

    const existing =
      await getDocs(q);

    if (!existing.empty) {
      continue;
    }

    // ==========================
    // FECHA
    // ==========================

    let dueDate = "";

    if (work.dueDate) {

      dueDate =
        `${work.dueDate.year}-${
          String(
            work.dueDate.month
          ).padStart(2, "0")
        }-${
          String(
            work.dueDate.day
          ).padStart(2, "0")
        }`;
    }

    // ==========================
    // GUARDAR EN TASKS
    // ==========================

    await addDoc(

      collection(
        db,
        "tasks"
      ),

      {

        title:
          work.title || "",

        description:
          work.description || "",

        dueDate,

        completed: false,

        userId,

        source:
          "classroom",

        courseId:
          course.id,

        courseName:
          course.name,

        classroomId:
          work.id,

        createdAt:
          serverTimestamp()

      }

    );
  }
};