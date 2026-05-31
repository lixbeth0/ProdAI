import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const syncClassroomTasks = async (tasks) => {

  for (const task of tasks) {

    const q = query(
      collection(db, "activities"),
      where("classroomId", "==", task.classroomId)
    );

    const exists = await getDocs(q);

    if (exists.empty) {

      await addDoc(
        collection(db, "activities"),
        task
      );

    }
  }
};