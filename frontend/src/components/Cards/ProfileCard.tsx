import { FC, useState } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import defaultUserPhoto from "@/assets/user.jpg";
import { UserType } from "@/types/UserType";
import { createPortal } from "react-dom";
import ProfileModal from "../Modals/ProfileModal";
import { useResize } from "@/hooks/useResize";
import { getNameAndSurname } from "@/helpers/getNameAndSurname";

interface Props {
  user: UserType;
}

const ProfileCard: FC<Props> = ({ user }) => {

  const isMobile = useResize("smallTablet");

  const [isModalActive, setIsModalActive] = useState(false);

  const handleOpenModalClick = () => {
    setIsModalActive(prev => !prev);
  }

  return (
    <>
      {
        isMobile
          ? (
            <Paper
              onClick={handleOpenModalClick}
              sx={{
                padding: 2,
                transition: "all 0.15s ease",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#F5F5F5" }
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Image
                  src={user.photo || defaultUserPhoto}
                  alt="user photo"
                  width={1000}
                  height={1000}
                  style={{ width: 60, height: 60, borderRadius: "100vw", objectFit: "cover" }}
                />
                <Box>
                  <Typography>{getNameAndSurname(user.name)}</Typography>
                  {user.type === "coach" && user.role?.value === "GENERAL_SUPER_ADMIN" && <Typography fontSize={13}>Руководитель</Typography>}
                  {user.type === "coach" && user.role?.value === "SUPER_ADMIN" && <Typography fontSize={13}>Главный тренер</Typography>}
                  {user.type === "coach" && user.role?.value === "ADMIN" && <Typography fontSize={13}>Тренер</Typography>}
                  {user.type === "coach" && user.role === null && <Typography fontSize={13}>Тренер (без роли)</Typography>}
                  {
                    user.type === "user" && (
                      user.groups?.length
                        ? <Typography fontSize={13}>{user.groups.map(group => group.name).join(", ")}</Typography>
                        : <Typography>Без группы</Typography>
                    )
                  }
                </Box>
              </Stack>
            </Paper>
          ) : (
            <Paper
              sx={{
                height: "100%",
                transition: "all 0.15s ease",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#F5F5F5" }
              }}
              onClick={handleOpenModalClick}
            >
              <Image src={user.photo || defaultUserPhoto} alt="user photo" width={1000} height={1000} style={{ aspectRatio: 1, objectFit: "cover" }} />
              <Box sx={{ padding: 2 }}>
                <Typography>{getNameAndSurname(user.name)}</Typography>
                <Box>
                  {user.type === "coach" && user.role?.value === "GENERAL_SUPER_ADMIN" && <Typography fontSize={13}>Руководитель</Typography>}
                  {user.type === "coach" && user.role?.value === "SUPER_ADMIN" && <Typography fontSize={13}>Главный тренер</Typography>}
                  {user.type === "coach" && user.role?.value === "ADMIN" && <Typography fontSize={13}>Тренер</Typography>}
                  {user.type === "coach" && user.role === null && <Typography fontSize={13}>Тренер (без роли)</Typography>}
                  {
                    user.type === "user" && (
                      user.groups?.length
                        ? <Typography fontSize={13}>{user.groups.map(group => group.name).join(", ")}</Typography>
                        : <Typography>Без группы</Typography>
                    )
                  }
                </Box>
              </Box>
            </Paper>
          )
      }
      {
        typeof document !== "undefined" &&
        createPortal(
          <ProfileModal open={isModalActive} handleCloseClick={handleOpenModalClick} user={user} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default ProfileCard;