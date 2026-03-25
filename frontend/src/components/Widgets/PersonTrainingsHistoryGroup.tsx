import { AuthContext } from "@/contexts/authContext";
import { useLazyPersonTrainingsHistory } from "@/hooks/useLazyPersonTrainingsHistory";
import { useRequest } from "@/hooks/useRequest";
import usersService from "@/services/usersService";
import { Box, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { FC, useContext } from "react";
import { useInView } from "react-intersection-observer";
import DarkForeground from "../UI/DarkForeground";
import { getDateFromString } from "@/helpers/getDateFromString";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";
import { AttendanceType } from "@/types/AttendanceType";
import { useResize } from "@/hooks/useResize";
import PersonTrainingsHistoryItem from "../Items/PersonTrainingHistoryItem";

type attendanceMarksFullNameType = {
  [k in AttendanceType]: string
}

interface Props {

}

const PersonTrainingsHistoryGroup: FC<Props> = ({ }) => {

  const [ref, inView, entry] = useInView({ threshold: 0.1, triggerOnce: true });

  const {
    trainings,
    isFirstBunchOfTrainingsLoading,
    isNewBunchOfTrainingsLoading
  } = useLazyPersonTrainingsHistory(inView);


  if (isFirstBunchOfTrainingsLoading) {
    return <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  }

  const attendanceMarksFullName: attendanceMarksFullNameType = {
    "П": "Присутствовал",
    "НП": "Не присутствовал",
    "УП": "Уважительная причина",
    "Б": "Болел",
    "ОТ": "Отпуск"
  }

  return (
    <Box>
      {trainings.map((training, i) => (
        <PersonTrainingsHistoryItem
          key={training.id}
          ref={i === trainings.length - 1 ? ref : null}
          training={training}
          attendanceMarkFullName={attendanceMarksFullName[training.attendance]}
          sx={{ borderBottom: i !== trainings.length - 1 ? "1px solid #DDD" : 0 }}
        />
      ))}
      {
        isNewBunchOfTrainingsLoading && <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress size={15} />
        </Box>
      }
    </Box>
  )
};

export default PersonTrainingsHistoryGroup;