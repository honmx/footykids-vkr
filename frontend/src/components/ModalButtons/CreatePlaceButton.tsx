import { FC, useState } from "react";
import { Button, ButtonProps, IconButton } from "@mui/material";
import Image from "next/image";
import smallPlusIcon from "@/assets/small plus icon.svg";
import { createPortal } from "react-dom";
import CreatePlaceModal from "../Modals/CreatePlaceModal";
import { useResize } from "@/hooks/useResize";

interface Props extends ButtonProps {

}

const CreatePlaceButton: FC<Props> = ({ sx, ...restProps }) => {

  const isTablet = useResize("laptop");

  const [isCreatePlaceModalActive, setIsCreatePlaceModalActive] = useState<boolean>(false);

  const handleOpenCreatePlaceModal = () => {
    setIsCreatePlaceModalActive(prev => !prev);
  }

  return (
    <>
      {
        isTablet
          ? <IconButton
            onClick={handleOpenCreatePlaceModal}
            color="black"
          >
            <Image src={smallPlusIcon} alt="plus icon" width={15} height={15} />
          </IconButton>
          :
          <Button onClick={handleOpenCreatePlaceModal} sx={{ ...sx }} {...restProps}>
            <Image src={smallPlusIcon} alt="change icon" width={12} height={12} style={{ marginRight: 5 }} />
            Создать
          </Button>
      }
      {
        typeof document !== "undefined" &&
        createPortal(
          <CreatePlaceModal open={isCreatePlaceModalActive} handleCloseClick={handleOpenCreatePlaceModal} />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

export default CreatePlaceButton;