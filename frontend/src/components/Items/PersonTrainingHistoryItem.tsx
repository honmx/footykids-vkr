import { AuthContext } from "@/contexts/authContext";
import { useLazyPersonTrainingsHistory } from "@/hooks/useLazyPersonTrainingsHistory";
import { useRequest } from "@/hooks/useRequest";
import usersService from "@/services/usersService";
import { Box, BoxProps, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { FC, forwardRef, useContext } from "react";
import { useInView } from "react-intersection-observer";
import DarkForeground from "../UI/DarkForeground";
import { getDateFromString } from "@/helpers/getDateFromString";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";
import { AttendanceType } from "@/types/AttendanceType";
import { useResize } from "@/hooks/useResize";
import { IHistoryItem } from "@/types/IHistoryItem";

interface Props extends BoxProps {
  training: IHistoryItem;
  attendanceMarkFullName: string;
}

const PersonTrainingsHistoryItem: FC<Props> = forwardRef(({ training, attendanceMarkFullName, sx, ...props }, ref) => {

  const isMobile = useResize("smallTablet");

  return (
    <Box ref={ref} sx={{ ...sx }} {...props}>
      <Grid
        container
        key={training.id}
        sx={{ height: { smallPhone: "150px", smallTablet: "130px" } }}
      >
        <Grid item xs={isMobile && 12} sx={{ height: "100%", position: "relative" }}>
          <DarkForeground color="#00000088">
            <Image
              src={training.training.place.photo}
              alt={training.training.place.name}
              width={750}
              height={500}
              style={{ height: "100%", width: isMobile ? "100%" : "200px", objectFit: "cover" }}
            />
          </DarkForeground>
          {/* for mobiles */}
          {
            isMobile && <>
              <Stack sx={{ position: "absolute", top: 5, left: 5 }}>
                <Typography fontSize={30} fontWeight={400} color="typography.light">
                  {getDateFromString(training.training.date).getDate()}<span style={{ fontSize: 18 }}>{getShortenMonthName(getDateFromString(training.training.date).getMonth())}</span>
                </Typography>
                <Typography color="typography.light">{training.training.time}</Typography>
              </Stack>
              <Typography fontSize={14} color="typography.light" sx={{ position: "absolute", top: 5, right: 5 }}>{training.training.place.name}</Typography>
              <Stack sx={{ position: "absolute", bottom: 5, right: 5 }}>
                <Typography textAlign="end" color="typography.light" sx={{ flex: "1 1 0", alignSelf: "center" }}>{attendanceMarkFullName}</Typography>
              </Stack>
            </>
          }
        </Grid>
        {/* desktop / tablets */}
        {
          !isMobile &&
          <Grid item sx={{
            display: "flex",
            alignItems: { smallPhone: "flex-start", largeTablet: "center" },
            flexDirection: { smallPhone: "column", largeTablet: "row" },
            gap: { smallPhone: 0, largeTablet: 5 },
            margin: 1
          }}>
            <Box>
              <Typography>{training.training.date}</Typography>
              <Typography fontSize={14}>{training.training.time}</Typography>
            </Box>
            <Box sx={{ display: { smallPhone: "block", largeTablet: "none" }, flex: "1 1 0" }} />
            <Typography fontSize={14}>{training.training.place.name}</Typography>
          </Grid>
        }
        {
          !isMobile &&
          <Typography textAlign="end" sx={{ flex: "1 1 0", alignSelf: "center", marginRight: 1 }}>{attendanceMarkFullName}</Typography>
        }
      </Grid>
    </Box>
  )
});

export default PersonTrainingsHistoryItem;