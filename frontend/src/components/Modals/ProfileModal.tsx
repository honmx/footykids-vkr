import { IModalProps } from "@/types/IModalProps";
import { UserType } from "@/types/UserType";
import { FC, useContext, useEffect, useState } from "react";
import ModalWrapper from "../Wrappers/ModalWrapper";
import defaultUserPhoto from "@/assets/user.jpg";
import Image from "next/image";
import { Box, Container, IconButton, Stack, Switch, Tooltip, Typography } from "@mui/material";
import ModalItemHeightDeterminantWrapper from "../Wrappers/ModalItemHeightDeterminantWrapper";
import OpenOrUploadUserImageWrapper from "../Wrappers/OpenOrUploadUserImageWrapper";
import { AuthContext } from "@/contexts/authContext";
import usersService from "@/services/usersService";
import { incline } from "@/helpers/incline";
import userPhoto from "@/assets/user.jpg";
import DocumentWithExpireDate from "../Widgets/DocumentWithExpireDate";
import penIcon from "@/assets/pen icon.svg";
import { createPortal } from "react-dom";
import SetTrainingsLeftModal from "./SetTrainingsLeftModal";
import { useResize } from "@/hooks/useResize";
import check from "@/assets/check.svg";
import VacationStatusSwitch from "../UI/VacationStatusSwitch";
import CustomLink from "../UI/CustomLink";
import ChangeUserNameModal from "./ChangeUserNameModal";
import ChangeParentNameModal from "./ChangeParentNameModal";
import { useRequest } from "@/hooks/useRequest";

interface Props extends IModalProps {
  user: UserType;
}

const ProfileModal: FC<Props> = ({ open, handleCloseClick, user }) => {

  const isTablet = useResize("largeTablet");

  const { user: authUser } = useContext(AuthContext);

  const [isChangeNameModalActive, setIsChangeNameModalActive] = useState<boolean>(false);
  const [isChangeParentNameModalActive, setIsChangeParentNameModalActive] = useState<boolean>(false);
  const [isSetTrainingsLeftModalActive, setIsSetTrainingsLeftModalActive] = useState<boolean>(false);

  const handleOpenChangeNameModal = () => {
    setIsChangeNameModalActive(prev => !prev);
  }

  const handleOpenChangeParentNameModal = () => {
    setIsChangeParentNameModalActive(prev => !prev);
  }

  const handleOpenSetTrainingsLeftModal = () => {
    setIsSetTrainingsLeftModalActive(prev => !prev);
  }

  return (
    <>
      <ModalWrapper open={open} handleCloseClick={handleCloseClick} maxWidth={user.type === "coach" || isTablet ? "400px" : "800px"}>
        <>
          <Stack
            direction={{
              smallPhone: "column",
              tablet: user.type === "coach" ? "column" : "row"
            }}
          >
            <Box sx={{ width: { smallPhone: "100%", tablet: user.type === "coach" ? "100%" : "50%" } }}>
              <OpenOrUploadUserImageWrapper
                image={user.photo || userPhoto}
                userId={user.id}
                upload={
                  authUser?.id === user.id
                  || (authUser?.role?.value !== "ADMIN" && user.role?.value !== "GENERAL_SUPER_ADMIN")
                }
                requestFn={(userId: number, photo: File) => usersService.uploadAvatar(userId, photo)}
                closeOuterModal={handleCloseClick}
              >
                <Image
                  src={user.photo || defaultUserPhoto}
                  alt="user photo"
                  width={500}
                  height={500}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </OpenOrUploadUserImageWrapper>
            </Box>
            <Box sx={{
              width: { smallPhone: "100%", tablet: user.type === "coach" ? "100%" : "50%" },
              position: "relative"
            }}>
              {
                user.type === "coach" &&
                <Stack spacing={1} sx={{ padding: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <Typography fontSize={20} sx={{ wordBreak: "break-word" }}>{user.name}</Typography>
                    {
                      (authUser?.id === user.id ||
                        (authUser?.role?.value !== "ADMIN" && user.role?.value !== "GENERAL_SUPER_ADMIN")) &&
                      <Tooltip title="Изменить имя">
                        <IconButton color="black" onClick={handleOpenChangeNameModal}>
                          <Image src={penIcon} alt="pen" width={13} height={13} />
                        </IconButton>
                      </Tooltip>
                    }
                  </Stack>
                  <Typography>{user.email}</Typography>
                  {user.role?.value === "GENERAL_SUPER_ADMIN" && <Typography fontSize={13}>Руководитель</Typography>}
                  {user.role?.value === "SUPER_ADMIN" && <Typography>Главный тренер</Typography>}
                  {user.role?.value === "ADMIN" && <Typography>Тренер</Typography>}
                  {user.role === null && <Typography>Тренер (без роли)</Typography>}
                </Stack>
              }
              {
                user.type === "user" &&
                <Stack spacing={2} sx={{ padding: 2, height: "100%" }}>
                  <Stack direction="row" spacing={3} sx={{ alignItems: "flex-start" }}>
                    <Typography fontSize={20} sx={{ wordBreak: "break-word" }}>{user.name}</Typography>
                    {
                      authUser?.role?.value !== "ADMIN" &&
                      <Tooltip title="Изменить имя">
                        <IconButton color="black" onClick={handleOpenChangeNameModal}>
                          <Image src={penIcon} alt="pen" width={13} height={13} />
                        </IconButton>
                      </Tooltip>
                    }
                  </Stack>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={3} sx={{ alignItems: "flex-start" }}>
                      <Typography><span style={{ fontSize: 14 }}>Родитель:</span> {user.parentName}</Typography>
                      {
                        authUser?.role?.value !== "ADMIN" &&
                        <Tooltip title="Изменить имя родителя">
                          <IconButton color="black" onClick={handleOpenChangeParentNameModal}>
                            <Image src={penIcon} alt="pen" width={13} height={13} />
                          </IconButton>
                        </Tooltip>
                      }
                    </Stack>
                    <Typography><span style={{ fontSize: 14 }}>Дата рождения:</span> {user.birth}</Typography>
                    <Typography><span style={{ fontSize: 14 }}>Почта:</span> {user.email}</Typography>
                    <Box>
                      <Stack spacing={0.5} direction="row" sx={{ alignItems: "center" }}>
                        <Typography fontSize={14}>Абонемент:</Typography>
                        <Typography color={user.trainingsLeft === 0 ? "" : user.trainingsLeft > 0 ? "typography.main" : "error"}>
                          {user.trainingsLeft}
                        </Typography>
                        <Typography>{incline(user.trainingsLeft, "занятие", "занятия", "занятий")}</Typography>
                        {
                          authUser?.role?.value !== "ADMIN" && authUser?.type !== "user" &&
                          <IconButton color="black" onClick={handleOpenSetTrainingsLeftModal}>
                            <Image src={penIcon} alt="pen" width={13} height={13} />
                          </IconButton>
                        }
                      </Stack>
                      <Stack direction="row" sx={{ alignItems: "center" }}>
                        <Typography fontSize={14}>Отпуск</Typography>
                        <VacationStatusSwitch user={user} open={open} />
                      </Stack>
                      {/* {
                        authUser?.type === "coach" &&
                        <Stack direction="row" spacing={0.5}>
                          <Typography fontSize={14}>История:</Typography>
                          <Stack direction="row" spacing={0.5}>
                            <Typography>П</Typography>
                            <Typography>УП</Typography>
                            <Typography>НП</Typography>
                            <Typography>П</Typography>
                            <Typography>П</Typography>
                            <Typography>УП</Typography>
                            <Typography>Б</Typography>
                            <Typography>ОТ</Typography>
                          </Stack>
                        </Stack>
                      } */}
                    </Box>
                  </Stack>
                  <Stack spacing={1}>
                    {
                      user.groups?.length
                        ? <Stack sx={{ alignItems: "center" }}>
                          {
                            user.groups.map(group => (
                              authUser?.type === "coach"
                                ? <CustomLink
                                  key={group.id}
                                  onClick={(e) => e.stopPropagation()}
                                  href={`/groups/${group.id}`}
                                >
                                  <Typography>{group.name}</Typography>
                                </CustomLink>
                                : <Typography key={group.id}>{group.name}</Typography>
                            ))
                          }
                        </Stack>
                        : <Typography textAlign="center">Без группы</Typography>
                    }
                  </Stack>
                  {
                    !isTablet &&
                    <Stack spacing={3} direction="row" sx={{ flex: "1 1 0" }}>
                      <DocumentWithExpireDate
                        user={user}
                        title="Мед. справка:"
                        image={user.medicalDocument?.photo}
                        expireDate={user.medicalDocument?.expires}
                        requestFn={(userId: number, photo: File) => usersService.uploadMedicalDocumentPhoto(userId, photo)}
                      />
                      <DocumentWithExpireDate
                        user={user}
                        title="Страховка:"
                        image={user.insurance?.photo}
                        expireDate={user.insurance?.expires}
                        requestFn={(userId: number, photo: File) => usersService.uploadInsurancePhoto(userId, photo)}
                      />
                    </Stack>
                  }
                </Stack>
              }
            </Box>
          </Stack>
          {
            isTablet && user.type === "user" &&
            <Stack spacing={3} direction="row" sx={{ padding: 2, gap: 2 }}>
              <DocumentWithExpireDate
                user={user}
                title="Мед. справка:"
                image={user.medicalDocument?.photo}
                expireDate={user.medicalDocument?.expires}
                requestFn={(userId: number, photo: File) => usersService.uploadMedicalDocumentPhoto(userId, photo)}
              />
              <DocumentWithExpireDate
                user={user}
                title="Страховка:"
                image={user.insurance?.photo}
                expireDate={user.insurance?.expires}
                requestFn={(userId: number, photo: File) => usersService.uploadInsurancePhoto(userId, photo)}
              />
            </Stack>
          }
        </>
      </ModalWrapper>
      {
        typeof document !== "undefined" && user.type === "user" &&
        createPortal(
          <SetTrainingsLeftModal open={isSetTrainingsLeftModalActive} handleCloseClick={handleOpenSetTrainingsLeftModal} user={user} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
      {
        typeof document !== "undefined" &&
        createPortal(
          <ChangeUserNameModal open={isChangeNameModalActive} handleCloseClick={handleOpenChangeNameModal} user={user} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
      {
        typeof document !== "undefined" && user.type === "user" &&
        createPortal(
          <ChangeParentNameModal open={isChangeParentNameModalActive} handleCloseClick={handleOpenChangeParentNameModal} user={user} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default ProfileModal;