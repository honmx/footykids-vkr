import { FC, useContext, useEffect, useState } from "react";
import PickDateSelectsGroup from "./PickDateSelectsGroup";
import { Box, Stack } from "@mui/material";
import Calendar from "./Calendar";
import { DateContext } from "@/contexts/dateContext";
import ChangeScheduleButton from "../ModalButtons/ChangeScheduleButton";
import { useResize } from "@/hooks/useResize";
import { GroupContext } from "@/contexts/groupContext";
import ChangeOrExtendSchedule from "./ChangeOrExtendSchedule";
import { AuthContext } from "@/contexts/authContext";

interface Props {

}

const Schedule: FC<Props> = ({ }) => {

  const { user: authUser } = useContext(AuthContext);
  const { group } = useContext(GroupContext);

  const isTablet = useResize("laptop");

  const [monthIndex, setMonthIndex] = useState<number>(Number(new Date().toLocaleDateString().slice(3, 5)) - 1);
  const [year, setYear] = useState<number>(Number(new Date().toLocaleDateString().slice(6)));

  const decrementMonth = () => {
    const newMonthIndex = monthIndex - 1 === -1 ? 11 : monthIndex - 1;
    const newYear = monthIndex - 1 === -1 ? year - 1 : year;

    setMonthIndex(newMonthIndex);
    setYear(newYear);
  }

  const incrementMonth = () => {
    const newMonthIndex = monthIndex + 1 === 12 ? 0 : monthIndex + 1;
    const newYear = monthIndex + 1 === 12 ? year + 1 : year;

    setMonthIndex(newMonthIndex);
    setYear(newYear);
  }

  return (
    <>
      <DateContext.Provider value={{ monthIndex, setMonthIndex, year, setYear, decrementMonth, incrementMonth }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: { smallPhone: 2, largePhone: 0 }
        }}>
          {
            !isTablet && <PickDateSelectsGroup />
          }
          {
            authUser?.role?.value !== "ADMIN" &&
            <ChangeOrExtendSchedule />
          }
        </Box>
        <Calendar group={group} />
      </DateContext.Provider>
    </>
  )
};

export default Schedule;