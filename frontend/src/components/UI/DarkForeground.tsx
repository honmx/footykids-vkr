import { FC, ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

interface Props extends BoxProps {
  color?: string;
  apply?: boolean;
  children: ReactNode;
}

const DarkForeground: FC<Props> = ({ color, apply = true, children, sx, ...props }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "block",
        height: "100%",
        ...sx
      }}
      {...props}
    >
      {children}
      {
        apply &&
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: color ? color : "#000000AA",
        }} />
      }
    </Box>
  )
};

export default DarkForeground;
