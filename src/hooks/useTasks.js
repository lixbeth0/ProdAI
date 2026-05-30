import {

  useEffect,
  useState

} from "react";

import { auth } from "../firebase/firebase";

import {
  subscribeToTasks
} from "../services/taskService";

export const useTasks = () => {

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!auth.currentUser)
      return;

    const unsubscribe =
      subscribeToTasks(

        auth.currentUser.uid,

        (tasksData) => {

          setTasks(tasksData);

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  return {

    tasks,

    loading
  };
};