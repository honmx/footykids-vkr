import { AuthContext } from "@/contexts/authContext";
import { Grid, Paper, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { FC, PropsWithChildren, ReactNode, useContext } from "react";

interface Props {
  text: string | ReactNode;
  href?: string;
  icon: StaticImageData;
  alt: string;
  onClick?: () => void;
}

const AccountNavigationCard: FC<Props> = ({ text, href, icon, alt, onClick }) => {
  const { user } = useContext(AuthContext);

  const isAdmin = user?.role?.value === "ADMIN";

  return (
    <Grid item xs={isAdmin ? 12 : 6} key={alt}>
      <LinkWrapper href={href}>
        <Paper
          onClick={onClick}
          sx={{
            position: "relative",
            padding: 2,
            height: "100%",
            minHeight: "150px",
            aspectRatio: isAdmin ? { smallPhone: 4, smallTablet: "auto" } : "auto",
            transition: "all 0.15s ease",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#F5F5F5" }
          }}
        >
          <Typography>{text}</Typography>
          <Image
            src={icon}
            alt={alt}
            style={{
              width: 40,
              height: 40,
              position: "absolute",
              bottom: 1,
              right: 1,
              filter: "grayscale(100%) invert(0.75)"
            }}
          />
        </Paper>
      </LinkWrapper>
    </Grid>
  )
};

interface LinkWrapperProps extends PropsWithChildren {
  href?: string;
}

const LinkWrapper: FC<LinkWrapperProps> = ({ href, children }) => {
  return href
    ? <Link href={href}>{children}</Link>
    : children
}

export default AccountNavigationCard;