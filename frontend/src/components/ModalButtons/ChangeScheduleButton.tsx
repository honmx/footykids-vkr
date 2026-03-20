import { Button, ButtonProps, IconButton } from "@mui/material";
import Image from "next/image";
import { FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import ChangeScheduleModal from "../Modals/ChangeScheduleModal";
import changeIcon from "@/assets/change icon.svg";
import { useResize } from "@/hooks/useResize";
import { GroupContext } from "@/contexts/groupContext";

interface Props extends ButtonProps {
  shortName?: boolean;
}

const ChangeScheduleButton: FC<Props> = ({ shortName = false, sx, ...props }) => {

  const isTablet = useResize("laptop");

  const [isChangeScheduleModalActive, setIsChangeScheduleModalActive] = useState<boolean>(false);

  const handleOpenChangeScheduleModal = () => {
    setIsChangeScheduleModalActive(prev => !prev);
  }

  return (
    <>
      {
        isTablet
          ? <IconButton
            onClick={handleOpenChangeScheduleModal}
            color="black"
            sx={sx}
          >
            <Image src={changeIcon} alt="change icon" width={25} height={25} style={{ marginRight: 5 }} />
          </IconButton>
          : <Button
            onClick={handleOpenChangeScheduleModal}
            sx={sx}
            {...props}
          >
            <Image src={changeIcon} alt="change icon" width={15} height={15} style={{ marginRight: 5 }} />
            {
              shortName
                ? "Изменить"
                : "Изменить расписание"
            }
          </Button>
      }
      {
        typeof document !== "undefined" &&
        createPortal(
          <ChangeScheduleModal open={isChangeScheduleModalActive} handleCloseClick={handleOpenChangeScheduleModal} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default ChangeScheduleButton;