import {
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  auth
} from "../firebase/firebase";

import {
  subscribeToTasks
} from "../services/taskService";

export const useTasks = () => {

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let unsubscribeTasks = null;

    const unsubscribeAuth =
      onAuthStateChanged(

        auth,

        (user) => {

          if (!user) {

            setTasks([]);
            setLoading(false);

            if (
              unsubscribeTasks
            ) {
              unsubscribeTasks();
            }

            return;
          }

          setLoading(true);

          unsubscribeTasks =
            subscribeToTasks(

              user.uid,

              (tasksData) => {

                setTasks(
                  tasksData
                );

                setLoading(false);
              }
            );
        }
      );

    return () => {

      unsubscribeAuth();

      if (
        unsubscribeTasks
      ) {
        unsubscribeTasks();
      }
    };

  }, []);

  return {

    tasks,

    loading

  };
};