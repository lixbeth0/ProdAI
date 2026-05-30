import {

  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc

} from "firebase/firestore";

import { db } from "../firebase/firebase";

// 🔥 REALTIME TASKS
export const subscribeToTasks = (

  userId,

  callback

) => {

  const q = query(

    collection(db, "tasks"),

    where("userId", "==", userId),

    orderBy("createdAt", "desc")
  );

  return onSnapshot(

    q,

    (snapshot) => {

      const tasks =
        snapshot.docs.map(doc => ({

          id: doc.id,

          ...doc.data()
        }));

      callback(tasks);
    }
  );
};

// 🔥 CREATE
export const createTask = async (
  taskData
) => {

  try {

    await addDoc(

      collection(db, "tasks"),

      {

        ...taskData,

        completed: false,

        createdAt: serverTimestamp()
      }
    );

  } catch (error) {

    console.error(
      "Error creando tarea:",
      error
    );
  }
};

// 🔥 TOGGLE
export const toggleTask = async (

  taskId,

  completed

) => {

  try {

    const taskRef =
      doc(db, "tasks", taskId);

    await updateDoc(taskRef, {

      completed: !completed
    });

  } catch (error) {

    console.error(
      "Error actualizando tarea:",
      error
    );
  }
};

// 🔥 DELETE
export const deleteTask = async (
  taskId
) => {

  try {

    await deleteDoc(
      doc(db, "tasks", taskId)
    );

  } catch (error) {

    console.error(
      "Error eliminando tarea:",
      error
    );
  }
};