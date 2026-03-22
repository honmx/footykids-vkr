import { FC, useContext, useRef, useState } from "react";
import { DateContext } from "@/contexts/dateContext";
import { GroupContext } from "@/contexts/groupContext";
import { getScheduleIndex } from "@/helpers/getScheduleIndex";
import { Box, BoxProps, Grid, GridProps, IconButton, ListItemButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import DarkForeground from "../UI/DarkForeground";
import { useHover } from "@/hooks/useHover";
import Dropdown from "../UI/Dropdown";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { createPortal } from "react-dom";
import CreateTrainingModal from "../Modals/CreateTrainingModal";
import menuDropdownIcon from "@/assets/menu dropdown icon.svg";
import plusIcon from "@/assets/small plus icon.svg";
import ChangeTrainingModal from "../Modals/ChangeTrainingModal";
import DeleteTrainingModal from "../Modals/DeleteTrainingModal";
import MarkAttendanceModal from "../Modals/MarkAttendanceModal";
import { useResize } from "@/hooks/useResize";
import { getShortenMonthName } from "@/helpers/getShortenMonthName";
import { IGroup } from "@/types/IGroup";
import { AuthContext } from "@/contexts/authContext";

interface Props extends BoxProps {
  group: IGroup | null;
  date: Date;
  currentLocaleStringDate: string;
}

const CalendarTrainingItem: FC<Props> = ({ group, date, currentLocaleStringDate, sx, ...props }) => {

  const { user: authUser } = useContext(AuthContext);
  const { monthIndex, year } = useContext(DateContext);

  const isMobile = useResize("smallTablet");

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // separate modal logic
  const [isChangeTrainingModalActive, setIsChangeTrainingModalActive] = useState<boolean>(false);
  const [isCreateTrainingModalActive, setIsCreateTrainingModalActive] = useState<boolean>(false);
  const [isDeleteTrainingModalActive, setIsDeleteTrainingModalActive] = useState<boolean>(false);
  const [isMarkAttendanceModalActive, setIsMarkAttendanceModalActive] = useState<boolean>(false);

  const scheduleIndex = getScheduleIndex(date, group?.schedule || []) || 0;
  const training = group?.schedule?.[scheduleIndex]?.trainingsByDay.find(traning => traning.date === date.toLocaleDateString());

  const clearStates = () => {
    setIsMenuOpen(false);
  }

  const handleMenuClick = () => {
    setIsMenuOpen(prev => !prev);
  }

  const handleOpenCreateTrainingModal = () => {
    setIsCreateTrainingModalActive(prev => !prev);
    clearStates();
  }

  const handleOpenChangeTrainingModal = () => {
    setIsChangeTrainingModalActive(prev => !prev);
    clearStates();
  }

  const handleOpenDeleteTrainingModal = () => {
    setIsDeleteTrainingModalActive(prev => !prev);
    clearStates();
  }

  const handleOpenMarkAttendanceModal = () => {
    setIsMarkAttendanceModalActive(prev => !prev);
    clearStates();
  }

  const menuButtons = [
    {
      text: "Отметить",
      onClick: handleOpenMarkAttendanceModal,
      render: true,
    },
    {
      text: "Изменить",
      onClick: handleOpenChangeTrainingModal,
      render: authUser?.role?.value !== "ADMIN"
    },
    {
      text: "Удалить",
      onClick: handleOpenDeleteTrainingModal,
      render: authUser?.role?.value !== "ADMIN"
    },
  ]

  const isToday = date.toLocaleDateString() === currentLocaleStringDate;

  return (
    <>
      <Box
        sx={{ position: "relative", ...sx }}
        {...props}
      >
        <Stack
          direction="row"
          sx={{
            marginRight: { smallPhone: 0, smallTablet: 4 },
            height: 150
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { smallPhone: "100%", smallTablet: "auto" }
            }}
          >
            <DarkForeground color={training ? "#478DE088" : "#478DE0"} apply={isToday}>
              <DarkForeground color={training ? "#00000066" : "#00000011"} apply={!!training || !isMobile}>
                {
                  training
                    ? <Image
                      src={training.place.photo}
                      alt="place photo"
                      width={300}
                      height={300}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: isMobile ? "100%" : "min(35vw, 250px)",
                      }}
                    />
                    : <Box sx={{
                      height: "100%",
                      width: { smallPhone: "100%", smallTablet: "min(35vw, 250px)" },
                    }} />
                }
              </DarkForeground>
            </DarkForeground>
            <Typography
              fontSize={{ smallPhone: 35, smallTablet: 50 }}
              fontWeight={500}
              color={training || isToday ? "#FFF" : "#676767"}
              sx={{
                position: "absolute",
                top: { smallPhone: 5, smallTablet: "50%" },
                left: { smallPhone: 5, smallTablet: "50%" },
                transform: { smallPhone: "", smallTablet: "translate(-50%, -50%)" }
              }}
            >
              {date.getDate()}<span style={{ fontSize: 20 }}>{getShortenMonthName(date.getMonth())}</span>
            </Typography>
          </Box>
          {
            training &&
            <Stack
              direction={{ smallPhone: "column-reverse", smallTablet: "column" }}
              spacing={{ smallPhone: 0, smallTablet: 1 }}
              sx={{
                position: { smallPhone: "absolute", smallTablet: "static" },
                right: 0,
                bottom: 0,
                padding: 2
              }}
            >
              <Typography
                fontSize={{ smallPhone: 16, smallTablet: 22 }}
                textAlign={{ smallPhone: "end", smallTablet: "start" }}
                color={{ smallPhone: "typography.light", smallTablet: "typography.dark" }}
              >
                {training.place.name}
              </Typography>
              <Typography
                fontSize={{ smallPhone: 13, smallTablet: 16 }}
                textAlign={{ smallPhone: "end", smallTablet: "start" }}
                color={{ smallPhone: "typography.light", smallTablet: "typography.dark" }}
              >
                {training.time}
              </Typography>
            </Stack>
          }
        </Stack >
        <Box
          ref={ref}
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 100,
            backgroundColor: isToday && !training ? "" : "glassy.main",
            borderRadius: 1
          }}
        >
          {
            training && authUser?.type === "coach" && <>
              <IconButton
                color="black"
                onClick={handleMenuClick}
              >
                <Image src={menuDropdownIcon} alt="menu icon" width={4} height={10} />
              </IconButton>
              <Dropdown open={isMenuOpen} placement="left">
                {
                  menuButtons.map(button => (
                    button.render &&
                    <ListItemButton key={button.text} onClick={button.onClick} sx={{ paddingTop: 0.75, paddingBottom: 0.75 }}>
                      <Typography sx={{ margin: "0 auto" }}>{button.text}</Typography>
                    </ListItemButton>
                  ))
                }
              </Dropdown>
            </>
          }
          {
            !training && authUser?.type === "coach" && authUser.role?.value !== "ADMIN" && <>
              <IconButton
                color={isToday && isMobile ? "white" : "black"}
                onClick={handleOpenCreateTrainingModal}
              >
                <Image src={plusIcon} alt="plus icon" width={15} height={15} />
              </IconButton>
            </>
          }
        </Box>
      </Box>
      {
        typeof document !== "undefined" && !training && authUser?.type === "coach" &&
        createPortal(
          <CreateTrainingModal open={isCreateTrainingModalActive} handleCloseClick={handleOpenCreateTrainingModal} date={date.toLocaleDateString()} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
      {
        typeof document !== "undefined" && training && authUser?.type === "coach" &&
        createPortal(
          <ChangeTrainingModal open={isChangeTrainingModalActive} handleCloseClick={handleOpenChangeTrainingModal} training={training} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
      {
        typeof document !== "undefined" && training && authUser?.type === "coach" &&
        createPortal(
          <DeleteTrainingModal open={isDeleteTrainingModalActive} handleCloseClick={handleOpenDeleteTrainingModal} training={training} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
      {
        typeof document !== "undefined" && training && authUser?.type === "coach" &&
        createPortal(
          <MarkAttendanceModal open={isMarkAttendanceModalActive} handleCloseClick={handleOpenMarkAttendanceModal} training={training} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default CalendarTrainingItem;