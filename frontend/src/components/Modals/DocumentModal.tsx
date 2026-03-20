import { IModalProps } from "@/types/IModalProps";
import { FC, useContext, useEffect, useState } from "react";
import ModalWrapper from "../Wrappers/ModalWrapper";
import { IChild } from "@/types/IChild";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import OpenOrUploadUserImageWrapper from "../Wrappers/OpenOrUploadUserImageWrapper";
import photoHolder from "@/assets/photo holder.jpg";
import { GroupContext } from "@/contexts/groupContext";
import { UsersContext } from "@/contexts/usersContext";
import { UserType } from "@/types/UserType";
import { IMedicalDocument } from "@/types/IMedicalDocument";
import { IInsurance } from "@/types/IInsurance";
import { getDateFromString } from "@/helpers/getDateFromString";

interface Props extends IModalProps {
  userId: number;
  title: string;
  document: IMedicalDocument | IInsurance | null;
  requestFn: (id: number, photo: File) => Promise<UserType>;
}

const DocumentModal: FC<Props> = ({ open, handleCloseClick, userId, title, document, requestFn }) => {

  return (
    <ModalWrapper open={open} handleCloseClick={handleCloseClick} maxWidth="350px">
      <Stack spacing={3} sx={{ padding: 2 }}>
        <Typography fontSize={{ smallPhone: 22, smallTablet: 28 }}>{title}</Typography>
        <OpenOrUploadUserImageWrapper image={document?.photo || photoHolder} userId={userId} upload requestFn={requestFn}>
          <Image src={document?.photo || photoHolder} alt={title} width={500} height={500} style={{ aspectRatio: 1, objectFit: "cover", borderRadius: 5 }} />
        </OpenOrUploadUserImageWrapper>
        {
          document?.expires
            ? <Typography>
              До {" "}
              <Typography component="span" fontSize={14} color={new Date() > getDateFromString(document.expires) ? "error" : "typography.main"}>
                {document.expires}
              </Typography>
            </Typography>
            : <Typography fontSize={14}>(Дата будет установлена тренером)</Typography>
        }
      </Stack>
    </ModalWrapper>
  )
};

export default DocumentModal;