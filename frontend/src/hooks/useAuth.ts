import { AuthContext } from "@/contexts/authContext";
import { UserType } from "@/types/UserType";
import { useContext, useEffect } from "react";

export const useAuth = <T extends UserType>(user?: T) => {
  const { user: userFromContext, setUser: setUserFromContext } = useContext(AuthContext);

  useEffect(() => {
    if (user === undefined) return;

    setUserFromContext(user);
  }, [JSON.stringify(user)]);

  return { user: userFromContext as T, setUser: setUserFromContext };
}