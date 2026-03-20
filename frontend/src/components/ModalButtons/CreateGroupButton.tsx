import { FC, useState } from "react";
import { Button, ButtonProps, IconButton } from "@mui/material";
import Image from "next/image";
import smallPlusIcon from "@/assets/small plus icon.svg";
import { createPortal } from "react-dom";
import CreateGroupModal from "../Modals/CreateGroupModal";
import { useResize } from "@/hooks/useResize";

interface Props extends ButtonProps {

}

const CreateGroupButton: FC<Props> = ({ sx, ...restProps }) => {

  const isLargeTablet = useResize("laptop");

  const [isCreateGroupModalActive, setIsCreateGroupModalActive] = useState<boolean>(false);

  const handleOpenCreateGroupModal = () => {
    setIsCreateGroupModalActive(prev => !prev);
  }

  return (
    <>
      {
        isLargeTablet
          ? <IconButton
            onClick={handleOpenCreateGroupModal}
            color="black"
          >
            <Image src={smallPlusIcon} alt="change icon" width={15} height={15} />
          </IconButton>
          : <Button onClick={handleOpenCreateGroupModal} sx={{ ...sx }} {...restProps}>
            <Image src={smallPlusIcon} alt="change icon" width={12} height={12} style={{ marginRight: 5 }} />
            Создать
          </Button>
      }
      {
        typeof document !== "undefined" &&
        createPortal(
          <CreateGroupModal open={isCreateGroupModalActive} handleCloseClick={handleOpenCreateGroupModal} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default CreateGroupButton;