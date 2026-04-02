import usersService from "@/services/usersService";
import { useRequest } from "./useRequest";
import { useContext, useEffect, useState } from "react";
import { UsersContext } from "@/contexts/usersContext";
import { UserType } from "@/types/UserType";
import { GroupContext } from "@/contexts/groupContext";
import { IChild } from "@/types/IChild";
import { IHistoryItem } from "@/types/IHistoryItem";
import { AuthContext } from "@/contexts/authContext";

export const useLazyPersonTrainingsHistory = (inView: boolean) => {

  const { user } = useContext(AuthContext);

  const [trainings, setTrainings] = useState<IHistoryItem[]>([]);

  // to get first bunch of trainings
  const {
    data: firstBunchOfTrainings,
    setData: setFirstBunchOfTrainings,
    isLoading: isFirstBunchOfTrainingsLoading,
    error: firstBunchOfTrainingsError
  } = useRequest(() => usersService.getPersonTrainingsHistoryLazy(user?.id || 0, trainings.length), [], [], () => !user?.id);

  // to continue loading
  const {
    data: newBunchOfTrainings,
    setData: setNewBunchOfTrainings,
    isLoading: isNewBunchOfTrainingsLoading,
    error: newBunchOfTrainingsError
  } = useRequest(() => usersService.getPersonTrainingsHistoryLazy(user?.id || 0, trainings.length), [], [inView], () => !inView);

  useEffect(() => {
    setTrainings(firstBunchOfTrainings);
  }, [firstBunchOfTrainings]);

  useEffect(() => {
    setTrainings([...trainings, ...newBunchOfTrainings]);
  }, [newBunchOfTrainings]);

  return { trainings, isFirstBunchOfTrainingsLoading, isNewBunchOfTrainingsLoading };
}