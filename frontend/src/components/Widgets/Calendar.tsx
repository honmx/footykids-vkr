import { FC, useContext, useEffect, useState } from "react";
import { DateContext } from "@/contexts/dateContext";
import { GroupContext } from "@/contexts/groupContext";
import { daysOfTheWeek } from "@/data/daysOfTheWeek";
import { getCurrentCalendarDates } from "@/helpers/getCurrentCalendarDates";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import CalendarGridCell from "./CalendarGridCell";
import { useResize } from "@/hooks/useResize";
import { getCurrentCalednarWeekIndex } from "@/helpers/getCurrentCalednarWeekIndex";
import arrowLeft from "@/assets/left arrow.svg";
import arrowRight from "@/assets/right arrow.svg";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";
import PickCalendarWeek from "./PickCalendarWeek";
import CalendarTrainingItem from "../Items/CalendarTrainingItem";
import { createPortal } from "react-dom";
import CreateTrainingModal from "../Modals/CreateTrainingModal";
import ChangeTrainingModal from "../Modals/ChangeTrainingModal";
import DeleteTrainingModal from "../Modals/DeleteTrainingModal";
import MarkAttendanceModal from "../Modals/MarkAttendanceModal";
import { IGroup } from "@/types/IGroup";

interface Props {
  group: IGroup | null;
}

const Calendar: FC<Props> = ({ group }) => {

  const { monthIndex, year } = useContext(DateContext);

  const isTablet = useResize("laptop");

  const [currentCalendarDates, setCurrentCalendarDates] = useState<Date[]>([]);

  useEffect(() => {
    setCurrentCalendarDates(getCurrentCalendarDates(year, monthIndex));
  }, [year, monthIndex]);

  const currentDate = new Date();

  if (currentCalendarDates.length === 0) return;

  return (
    isTablet
      ? <MobileCalendar group={group} currentCalendarDates={currentCalendarDates} currentDate={currentDate} />
      : <DesktopCalendar group={group} currentCalendarDates={currentCalendarDates} currentDate={currentDate} />
  )
};

interface DesktopCalendarProps {
  group: IGroup | null;
  currentCalendarDates: Date[];
  currentDate: Date;
}

const DesktopCalendar: FC<DesktopCalendarProps> = ({ group, currentCalendarDates, currentDate }) => {
  return (
    <Paper sx={{ overflow: "visible" }}>
      <Grid container>
        {
          daysOfTheWeek.map(day => (
            <Grid key={day.dayIndex} item xs={12 / 7} sx={{ textAlign: "center", padding: 0.5, fontWeight: 300, borderBottom: "1px solid #CCC" }}>
              <Typography>{day.value}</Typography>
            </Grid>
          ))
        }
        {
          currentCalendarDates.map((date, i) => (
            <CalendarGridCell
              key={date.toLocaleDateString()}
              group={group}
              date={date}
              currentLocaleStringDate={currentDate.toLocaleDateString()}
              sx={{
                borderBottom: currentCalendarDates.length - i > 7 ? "1px solid #CCC" : 0,
                borderRight: (i + 1) % 7 !== 0 || i === 0 ? "1px solid #CCC" : 0
              }}
            />
          ))
        }
      </Grid>
    </Paper>
  )
};

interface MobileCalendarProps {
  group: IGroup | null;
  currentCalendarDates: Date[];
  currentDate: Date;
}

const MobileCalendar: FC<MobileCalendarProps> = ({ group, currentCalendarDates, currentDate }) => {

  const [currentCalednarWeekIndex, setCurrentCalednarWeekIndex] = useState<number>(
    getCurrentCalednarWeekIndex(currentCalendarDates, currentDate)
  );

  const firstDateIndexOfCurrentWeek = 7 * currentCalednarWeekIndex;
  const lastDateIndexOfCurrentWeek = 7 * (currentCalednarWeekIndex + 1) - 1;

  return (
    <>
      <Stack spacing={3}>
        <PickCalendarWeek
          currentCalendarDates={currentCalendarDates}
          currentDate={currentDate}
          currentCalendarWeekIndex={currentCalednarWeekIndex}
          setCurrentCalendarWeekIndex={setCurrentCalednarWeekIndex}
        />
        <Paper>
          {
            currentCalendarDates
              .slice(firstDateIndexOfCurrentWeek, lastDateIndexOfCurrentWeek + 1)
              .map((date, i) => (
                <CalendarTrainingItem
                  key={date.getDate()}
                  group={group}
                  date={date}
                  currentLocaleStringDate={currentDate.toLocaleDateString()}
                  sx={{
                    borderBottom: i !== 6 ? "1px solid #DDD" : ""
                  }}
                />
              ))
          }
        </Paper>
      </Stack>
    </>
  )
};

export default Calendar;