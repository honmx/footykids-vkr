import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { DateContext } from "@/contexts/dateContext";
import { getCurrentCalendarDates } from "@/helpers/getCurrentCalendarDates";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { getCurrentCalednarWeekIndex } from "@/helpers/getCurrentCalednarWeekIndex";
import arrowLeft from "@/assets/left arrow.svg";
import arrowRight from "@/assets/right arrow.svg";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";

interface Props {
  currentCalendarDates: Date[];
  currentDate: Date;
  currentCalendarWeekIndex: number;
  setCurrentCalendarWeekIndex: Dispatch<SetStateAction<number>>;
}

const PickCalendarWeek: FC<Props> = ({ currentCalendarDates, currentDate, currentCalendarWeekIndex, setCurrentCalendarWeekIndex }) => {

  const { monthIndex, year, decrementMonth, incrementMonth } = useContext(DateContext);

  const handleDecrementWeekClick = () => {
    const previousCalendarWeekIndex = currentCalendarWeekIndex - 1;
    const isPreviousMonth = previousCalendarWeekIndex < 0;

    if (isPreviousMonth) {
      decrementMonth();

      const previousMonthCalendarDates = getCurrentCalendarDates(
        monthIndex - 1 < 0 ? year - 1 : year,
        monthIndex - 1 < 0 ? 11 : monthIndex - 1
      );

      const firstDay = currentCalendarDates[0];

      setCurrentCalendarWeekIndex(firstDay.getMonth() === monthIndex ? previousMonthCalendarDates.length / 7 - 1 : previousMonthCalendarDates.length / 7 - 2);
    } else {
      setCurrentCalendarWeekIndex(prev => prev - 1);
    }
  }

  const handleIncrementWeekClick = () => {
    const nextCalendarWeekIndex = currentCalendarWeekIndex + 1;
    const isNextMonth = nextCalendarWeekIndex > currentCalendarDates.length / 7 - 1;

    if (isNextMonth) {
      incrementMonth();

      const lastDay = currentCalendarDates[currentCalendarDates.length - 1];

      setCurrentCalendarWeekIndex(lastDay.getMonth() === monthIndex ? 0 : 1);
    } else {
      setCurrentCalendarWeekIndex(prev => prev + 1);
    }
  }

  const firstDateIndexOfCurrentWeek = 7 * currentCalendarWeekIndex;
  const lastDateIndexOfCurrentWeek = 7 * (currentCalendarWeekIndex + 1) - 1;

  const firstDateOfTheWeek = currentCalendarDates[firstDateIndexOfCurrentWeek];
  const lastDateOfTheWeek = currentCalendarDates[lastDateIndexOfCurrentWeek];

  return (
    <Paper>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Button
          color="typography"
          onClick={handleDecrementWeekClick}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 1.5,
            minWidth: 35,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }}
        >
          <Image src={arrowLeft} alt="arrow left" width={7} height={7} style={{ filter: "brightness(0%) invert(0.3)" }} />
        </Button>
        <Typography>
          <span>{firstDateOfTheWeek.getDate()} </span>
          <span style={{ fontSize: 12 }}>{getShortenMonthName(firstDateOfTheWeek.getMonth())}</span>
          <span style={{ marginInline: 9 }}>-</span>
          <span>{lastDateOfTheWeek.getDate()} </span>
          <span style={{ fontSize: 12 }}>{getShortenMonthName(lastDateOfTheWeek.getMonth())}</span>
        </Typography>
        <Button
          color="typography"
          onClick={handleIncrementWeekClick}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 1.5,
            minWidth: 35,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }}
        >
          <Image src={arrowRight} alt="arrow right" width={7} height={7} style={{ filter: "brightness(0%) invert(0.3)" }} />
        </Button>
      </Stack>
    </Paper>
  )
};

export default PickCalendarWeek;