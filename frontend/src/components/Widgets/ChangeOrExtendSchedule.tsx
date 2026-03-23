import { Button, Stack } from "@mui/material";
import { FC, useContext } from "react";
import ChangeScheduleButton from "../ModalButtons/ChangeScheduleButton";
import { GroupContext } from "@/contexts/groupContext";
import { getScheduleIndex } from "@/helpers/getScheduleIndex";
import { DateContext } from "@/contexts/dateContext";
import ExtendScheduleButton from "../ModalButtons/ExtendScheduleButton";
import { AuthContext } from "@/contexts/authContext";

interface Props {

}

const ChangeOrExtendSchedule: FC<Props> = ({ }) => {

  const { group } = useContext(GroupContext);
  const { monthIndex, year } = useContext(DateContext);

  const currentCalendarDate = new Date(year, monthIndex);

  const currentScheduleIndex = getScheduleIndex(currentCalendarDate, group.schedule);
  const previousScheduleIndex = getScheduleIndex(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1), group.schedule);

  const toProposeExtending = currentScheduleIndex === -1 && previousScheduleIndex !== -1;

  return (
    <Stack
      direction={{ smallPhone: "column", largePhone: "row" }}
      spacing={{ smallPhone: 0, laptop: 1 }}
      sx={{
        position: { smallPhone: "absolute", laptop: "static" },
        top: -5,
        right: 15,
      }}
    >
      <ChangeScheduleButton shortName={toProposeExtending} />
      {toProposeExtending && <ExtendScheduleButton initialSchedule={group.schedule[previousScheduleIndex]} />}
    </Stack>
  )
};

export default ChangeOrExtendSchedule;