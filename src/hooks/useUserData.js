import { useEffect, useState } from "react";

import {
  getUserData
} from "../services/userService";

export const useUserData = () => {

  const [userData, setUserData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadUser = async () => {

      const data =
        await getUserData();

      setUserData(data);

      setLoading(false);
    };

    loadUser();

  }, []);

  return {
    userData,
    loading
  };
};