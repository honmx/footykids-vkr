import { FC } from "react";
import { IconButton, IconButtonProps, Typography } from "@mui/material";
import Image from "next/image";
import doubleArrowLeft from "@/assets/double arrow left.svg";
import { useRouter } from "next/router";
import { useResize } from "@/hooks/useResize";

interface Props extends IconButtonProps {

}

const BackButton: FC<Props> = ({ sx, ...restProps }) => {

  const isMobile = useResize("smallTablet");

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  }

  return (
    <IconButton
      color="black"
      onClick={handleBackClick}
      disableRipple
      sx={{ filter: "grayscale(100%) invert(0.6)", aspectRatio: "auto", ...sx }}
      {...restProps}
    >
      <Image src={doubleArrowLeft} alt="" width={isMobile ? 15 : 20} height={isMobile ? 15 : 20} />
      <Typography textTransform="uppercase" fontSize={{smallPhone: 16, smallTablet: 20}} sx={{ marginLeft: 1, color: "#000" }}>Назад</Typography>
    </IconButton>
  )
};

export default BackButton;