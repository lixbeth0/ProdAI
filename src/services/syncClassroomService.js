// ======================================
// IMPORTACIONES
// ======================================

import { getCourses } from "../api/classroom";
import { syncCourseTasks } from "./classroomSyncService";

// ======================================
// SINCRONIZAR CLASSROOM
// ======================================

export const syncClassroom = async (
  token,
  userId,
  selectedCourses = []
) => {

  console.log("SINCRONIZANDO CLASSROOM");

  const courses = await getCourses(token);

  console.log("CURSOS:", courses);

  for (const course of courses) {

    await syncCourseTasks(
      course,
      token,
      userId,
      selectedCourses
    );

  }

  console.log("SINCRONIZACIÓN TERMINADA");

};