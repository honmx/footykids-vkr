import { ChangeEvent, FC, MouseEvent, memo, useContext, useEffect, useState } from "react";
import { IChild } from "@/types/IChild";
import { Box, FormControlLabel, Radio, RadioGroup, Stack, StackProps, Typography } from "@mui/material";
import Image from "next/image";
import userPhoto from "@/assets/user.jpg";
import { AttendanceType } from "@/types/AttendanceType";
import { arrayOfAttendanceVariants } from "@/helpers/arrayOfAttendanceVariants";
import Avatar from "../UI/Avatar";
import { getNameAndSurname } from "@/helpers/getNameAndSurname";
import { getSurname } from "@/helpers/getSurname";
import { getName } from "@/helpers/getName";
import { useResize } from "@/hooks/useResize";
import { getShortenName } from "@/helpers/getShortenName";
import { getJoinedByCommaUserGroups } from "@/helpers/getJoinedByCommaUserGroups";
import { IHistoryItem } from "@/types/IHistoryItem";
import { GroupContext } from "@/contexts/groupContext";
import { getDateFromString } from "@/helpers/getDateFromString";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";

interface Props extends StackProps {
  user: IChild;
  history: IHistoryItem[] | undefined;
  attendance: AttendanceType | null;
  handleMarkAttendanceItemChange: (id: number, attendance: AttendanceType) => void;
}

const UserMarkAttendanceItem: FC<Props> = ({ user, history, attendance, handleMarkAttendanceItemChange, sx, ...restProps }) => {

  const { group } = useContext(GroupContext);

  const isMobile = useResize("smallTablet");

  const [value, setValue] = useState<AttendanceType | null>(attendance);

  const attendanceVariants = arrayOfAttendanceVariants(["П", "УП", "НП", "Б", "ОТ"]);

  useEffect(() => {
    if (!value) return;

    handleMarkAttendanceItemChange(user.id, value);
  }, [value]);

  const handleRadioClick = (e: any) => {
    const value = e?.target?.value;

    if (!value) return;

    handleMarkAttendanceItemChange(user.id, value);
  }

  return (
    <Stack
      sx={{
        paddingTop: 1,
        paddingBottom: 1,
        ...sx
      }}
      {...restProps}
    >
      <Stack
        direction="row"
        spacing={{ smallPhone: 0, smallTablet: 1 }}
        sx={{
          position: "relative",
          display: { smallPhone: "grid", smallTablet: "flex" },
          gridTemplateAreas: `
            "a c"
            "b b"
          `,
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 0.5,
        }}
      >
        <Avatar photo={user.photo} style={{ gridArea: "a" }} />
        <Stack sx={{
          maxWidth: { smallPhone: "auto", smallTablet: "130px" },
          gridArea: "b",
          marginTop: { smallPhone: "4px !important", smallTablet: 0 },
        }}>
          {
            isMobile
              ? <>
                <Typography>{getShortenName(user.name)}</Typography>
                <Typography fontSize={14}>{getJoinedByCommaUserGroups(user.groups)}</Typography>
              </> : <>
                <Typography>{getSurname(user.name)}</Typography>
                <Typography>{getName(user.name)}</Typography>
                <Typography fontSize={14}>{getJoinedByCommaUserGroups(user.groups)}</Typography>
              </>
          }
          <Typography fontSize={12}>{user.birth}</Typography>
        </Stack>
        <Box sx={{ gridArea: "c", marginLeft: { smallPhone: "0px !important", smallTablet: "15px !important" } }}>
          <RadioGroup row>
            {
              attendanceVariants.map(attendanceVariant => (
                <FormControlLabel
                  key={attendanceVariant}
                  value={attendanceVariant}
                  control={
                    <Radio
                      size="small"
                      checked={attendance === attendanceVariant}
                      onClick={handleRadioClick}
                    />
                  }
                  label={attendanceVariant}
                  labelPlacement="top"
                  sx={{
                    marginInline: { smallPhone: 0.25 }
                  }}
                />
              ))
            }
          </RadioGroup>
        </Box>
        {
          user.isVacation &&
          <Typography
            fontSize={12}
            fontWeight={500}
            color="typography.main"
            sx={{ position: "absolute", bottom: 4, right: 2 }}
          >
            В отпуске
          </Typography>
        }
      </Stack>
      {
        history && history.length > 0 &&
        <Stack
          sx={{
            marginLeft: { smallPhone: 0, smallTablet: 8.5 },
            paddingTop: 0.5
          }}
        >
          <Stack direction="row" spacing={1}>
            {history.map(item => {
              const trainingDate = getDateFromString(item.training.date);
              return (
                <Box key={item.id}>
                  <Stack sx={{ alignItems: "center" }}>
                    <Typography fontSize={12}>{trainingDate.getDate()}</Typography>
                    <Typography fontSize={12}>{getShortenMonthName(trainingDate.getMonth())}</Typography>
                  </Stack>
                  <Stack sx={{
                    alignItems: "center",
                    padding: 0.5,
                    borderRadius: 1,
                    border: "1px solid #AAA",
                  }}>
                    <Typography fontSize={14}>{item.attendance}</Typography>
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        </Stack>
      }
    </Stack>
  )
};

export default UserMarkAttendanceItem;