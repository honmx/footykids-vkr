import { FC, useState } from "react";
import Image from "next/image";
import { useResize } from "@/hooks/useResize";
import { Button, ButtonProps, IconButton } from "@mui/material";
import extendIcon from "@/assets/extend icon.svg";
import { createPortal } from "react-dom";
import ChangeScheduleModal from "../Modals/ChangeScheduleModal";
import { ISchedule } from "@/types/ISchedule";

interface Props extends ButtonProps {
  initialSchedule: ISchedule;
}

const ExtendScheduleButton: FC<Props> = ({ initialSchedule, sx, ...props }) => {
  const isTablet = useResize("laptop");

  const [isExtendScheduleModalActive, setIsExtendScheduleModalActive] = useState<boolean>(false);

  const handleOpenExtendScheduleModal = () => {
    setIsExtendScheduleModalActive(prev => !prev);
  }

  return (
    <>
      {
        isTablet
          ? <IconButton
            onClick={handleOpenExtendScheduleModal}
            color="black"
            sx={sx}
          >
            <Image src={extendIcon} alt="change icon" width={25} height={25} style={{ marginRight: 5, transform: "rotate(90deg)" }} />
          </IconButton>
          : <Button
            onClick={handleOpenExtendScheduleModal}
            sx={sx}
            {...props}
          >
            <Image src={extendIcon} alt="change icon" width={15} height={15} style={{ marginRight: 5, transform: "rotate(90deg)" }} />
            Продлить
          </Button>
      }
      {
        typeof document !== "undefined" &&
        createPortal(
          <ChangeScheduleModal open={isExtendScheduleModalActive} handleCloseClick={handleOpenExtendScheduleModal} initialSchedule={initialSchedule} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default ExtendScheduleButton;