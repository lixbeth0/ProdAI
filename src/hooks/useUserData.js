import { useEffect, useState } from "react";

import { useAuth }
from "../contexts/AuthContext";

import {
  getUserData
}
from "../services/userService";

export const useUserData = () => {

  const { user } = useAuth();

  const [userData, setUserData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadUser = async () => {

      if (!user) {
        setLoading(false);
        return;
      }

      const data =
        await getUserData();

      setUserData(data);

      setLoading(false);
    };

    loadUser();

  }, [user]);

  return {
    userData,
    loading
  };
};