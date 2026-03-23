import { getDateFromString } from "@/helpers/getDateFromString";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";
import { getShortenName } from "@/helpers/getShortenName";
import { useRequest } from "@/hooks/useRequest";
import groupsService from "@/services/groupsService";
import {
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC } from "react";

interface Props {
  groupId: number;
  monthPeriod: number;
}

const GroupAttendanceHistory: FC<Props> = ({ groupId, monthPeriod }) => {
  const {
    data: groupAttendanceHistory,
    isLoading: isGroupAttendanceHistoryLoading,
    error: GroupAttendanceHistoryError,
  } = useRequest(
    () =>
      groupsService.getGroupAttendanceHistory(
        Number(groupId) || 0,
        monthPeriod
      ),
    { dates: [], history: {}, participants: [] },
    [monthPeriod],
    () => !Number(groupId)
  );

  const { dates, history, participants } = groupAttendanceHistory;

  return (
    <TableContainer sx={{ height: "100%", width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                position: "sticky",
                left: 0,
                top: 0,
                backgroundColor: "#FFF",
                borderLeft: "none",
                zIndex: 11,
              }}
            />
            {dates.map((date) => {
              const dateObject = getDateFromString(date);

              return (
                <TableCell key={date} sx={{ textAlign: "center" }}>
                  <Typography fontSize={12}>{dateObject.getDate()}</Typography>
                  <Typography fontSize={12}>
                    {getShortenMonthName(dateObject.getMonth())}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant) => {
            const participantHistory = history[participant.id];

            return (
              <TableRow key={participant.id} sx={{ width: "100%" }}>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: "#FFF",
                    borderLeft: "none",
                    zIndex: 10,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                      {getShortenName(participant.name)}
                    </Typography>
                    <Typography
                      color={
                        participant.trainingsLeft === 0
                          ? ""
                          : participant.trainingsLeft > 0
                          ? "typography.main"
                          : "error"
                      }
                    >
                      {participant.trainingsLeft}
                    </Typography>
                  </Stack>
                </TableCell>
                {participantHistory.length > 0
                  ? participantHistory.map((subscription, iSubscription) =>
                      subscription.map((attendanceItem, iAttendanceItem) => {
                        const isApplyBackground =
                          participantHistory.length % 2 === 0
                            ? iSubscription % 2 === 0
                            : iSubscription % 2 === 1;

                        return (
                          <TableCell
                            key={attendanceItem?.id || Math.random()}
                            sx={[
                              // comment if background highlighting is not nessesary
                              isApplyBackground && { backgroundColor: "#EEE" },
                              iAttendanceItem === 0 &&
                                iSubscription !== 0 && {
                                  borderLeft: "2px solid #999",
                                },
                              iAttendanceItem === subscription.length - 1 &&
                                iSubscription !==
                                  participantHistory.length - 1 && {
                                  borderRight: "2px solid #999",
                                },
                            ]}
                          >
                            {attendanceItem && (
                              <Typography
                                textAlign="center"
                                color={
                                  attendanceItem.isAccountable
                                    ? "typography.main"
                                    : "typography.dark"
                                }
                              >
                                {attendanceItem?.attendance}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })
                    )
                  : dates.map((date) => <TableCell key={date} />)}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupAttendanceHistory;
