import { ChangeEvent, FC, useEffect, useState } from "react";
import { IModalProps } from "@/types/IModalProps";
import ModalWrapper from "../Wrappers/ModalWrapper";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import ChangeGroupNameForm from "../Forms/ChangeGroupNameForm";
import { UserType } from "@/types/UserType";
import ChangeUserNameForm from "../Forms/ChangeUserNameForm";

interface Props extends IModalProps {
  user: UserType;
}

const ChangeUserNameModal: FC<Props> = ({ open, handleCloseClick, user }) => {
  return (
    <ModalWrapper open={open} handleCloseClick={handleCloseClick}>
      <Stack spacing={3} sx={{ padding: 2 }}>
        <Typography fontSize={{ smallPhone: 22, smallTablet: 28 }}>Изменить имя</Typography>
        <ChangeUserNameForm user={user} handleCloseClick={handleCloseClick} />
      </Stack>
    </ModalWrapper >
  )
};

export default ChangeUserNameModal;