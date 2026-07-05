// ======================================
// IMPORTACIONES
// ======================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import {
  getCourseWork,
  getStudentSubmissions
} from "../api/classroom";

// ======================================
// SINCRONIZAR TAREAS DE UN CURSO
// ======================================

export const syncCourseTasks = async (
  course,
  token,
  userId,
  selectedCourses
) => {

  // ======================================
  // FILTRAR CURSOS SELECCIONADOS
  // ======================================

  if (
    selectedCourses.length > 0 &&
    !selectedCourses.includes(course.id)
  ) {
    return;
  }

  // ======================================
  // OBTENER TAREAS DEL CURSO
  // ======================================

  const works = await getCourseWork(
    course.id,
    token
  );

  if (!works || works.length === 0) {
    return;
  }

  // ======================================
  // RECORRER TAREAS
  // ======================================

  for (const work of works) {

    try {

      // ======================================
      // OBTENER ENTREGAS DEL ESTUDIANTE
      // ======================================

      let submissions = [];

      try {

        submissions =
          await getStudentSubmissions(
            course.id,
            work.id,
            token
          );

      } catch (error) {

        console.error(
          "Error obteniendo entregas:",
          error
        );

      }

      // ======================================
      // VERIFICAR SI LA TAREA ESTÁ ENTREGADA
      // ======================================

      const isCompleted =
        submissions?.some(
          submission =>
            submission.state === "TURNED_IN" ||
            submission.state === "RETURNED"
        ) || false;


        console.log(
          "TAREA:",
          work.title,
          submissions
        );

      // ======================================
      // BUSCAR SI YA EXISTE
      // ======================================

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

      // ======================================
      // FORMATEAR FECHA
      // ======================================

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

      // ======================================
      // SI YA EXISTE -> ACTUALIZAR
      // ======================================

      if (!existing.empty) {

        const taskDoc =
          existing.docs[0];

        await updateDoc(
          doc(
            db,
            "tasks",
            taskDoc.id
          ),
          {
            title:
              work.title || "",

            description:
              work.description || "",

            dueDate,

            completed:
              isCompleted,

            courseName:
              course.name
          }
        );

        continue;
      }

      // ======================================
      // SI NO EXISTE -> CREAR
      // ======================================

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

          completed:
            isCompleted,

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

    } catch (error) {

      console.error(
        `Error sincronizando ${work.title}`,
        error
      );

    }

  }

};