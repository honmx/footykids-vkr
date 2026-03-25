import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { Box, IconButton, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { months } from "@/data/months";
import Dropdown from "../UI/Dropdown";
import { years } from "@/data/years";
import arrowDown from "@/assets/arrow down.svg";
import Image from "next/image";
import { DateContext } from "@/contexts/dateContext";
import groupsService from "@/services/groupsService";
import { GroupContext } from "@/contexts/groupContext";
import arrowLeft from "@/assets/left arrow.svg";
import arrowRight from "@/assets/right arrow.svg";
import { useResize } from "@/hooks/useResize";

interface Props {

}

const PickDateSelectsGroup: FC<Props> = ({ }) => {

  const { group, setGroup } = useContext(GroupContext);
  const { monthIndex, setMonthIndex, year, setYear, decrementMonth, incrementMonth } = useContext(DateContext);

  const handleMonthChange = (e: SelectChangeEvent<number>) => {
    setMonthIndex(Number(e.target.value));
  }

  const handleYearChange = (e: SelectChangeEvent<number>) => {
    setYear(Number(e.target.value));
  }

  useEffect(() => {
    (async () => {
      if (!group?.id) return;

      const newSchedule = await groupsService.getCurrentSchedule(group.id, monthIndex + 1, year);

      if (!newSchedule) return;

      setGroup({ ...group, schedule: newSchedule });
    })()
  }, [year, monthIndex]);

  return (
    <Box sx={{ position: "relative", alignSelf: "flex-start" }}>
      <IconButton
        color="black"
        onClick={decrementMonth}
        sx={{
          position: "absolute",
          left: "-35px",
          top: "50%",
          transform: "translateY(-50%)",
          filter: "grayscale(100%) invert(0.6)"
        }}
      >
        <Image src={arrowLeft} alt="" width={10} height={10} />
      </IconButton>
      <Stack spacing={1} direction="row">
        <Select
          value={monthIndex}
          onChange={handleMonthChange}
          sx={{ width: "140px" }}
        >
          {
            months.map(month => (
              <MenuItem key={month.monthIndex} value={month.monthIndex}>{month.value}</MenuItem>
            ))
          }
        </Select>
        <Select
          value={year}
          onChange={handleYearChange}
          sx={{ width: "140px" }}
        >
          {
            years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))
          }
        </Select>
      </Stack>
      <IconButton
        color="black"
        onClick={incrementMonth}
        sx={{
          position: "absolute",
          right: "-35px",
          top: "50%",
          transform: "translateY(-50%)",
          filter: "grayscale(100%) invert(0.6)"
        }}
      >
        <Image src={arrowRight} alt="" width={10} height={10} />
      </IconButton>
    </Box>
  )
};

export default PickDateSelectsGroup;