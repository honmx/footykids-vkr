import { FC, RefObject, useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, Tooltip, Typography } from "@mui/material";
import leftArrow from "../../assets/left arrow.svg";
import rightArrow from "../../assets/right arrow.svg";
import userPhoto from "../../assets/user.jpg";
import logout from "../../assets/logout icon.svg";
import Image from "next/image";
import { useHover } from "@/hooks/useHover";
import { AuthContext } from "@/contexts/authContext";
import CustomLink from "../UI/CustomLink";
import { userLinks } from "@/data/userLinks";
import { coachLinks, generalCoachLinks } from "@/data/coachLinks";
import { useResize } from "@/hooks/useResize";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import authService from "@/services/authService";
import Avatar from "../UI/Avatar";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { getNameAndSurname } from "@/helpers/getNameAndSurname";
import { getName } from "@/helpers/getName";
import { getSurname } from "@/helpers/getSurname";
import { useRouter } from "next/router";

interface Props {

}

const Sidebar: FC<Props> = ({ }) => {

  const router = useRouter();

  const { isLoading, user } = useCheckAuth({});

  const isTablet = useResize("tablet");
  const isLaptop = useResize("laptop");

  const ref = useRef<HTMLDivElement>(null);
  const { hoverRef, isHover } = useHover();

  useOutsideClick(ref, () => handleCloseClick());

  const { setUser } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenDrawerClick = () => {
    setIsOpen(prev => !prev);
  }

  const handleCloseClick = () => {
    setIsOpen(false);
  }

  const handleLogoutClick = async () => {
    try {
      await authService.logout();
      await router.push("/auth");
      setUser(null);

    } catch (error) {
      // console.log(error);
    }
  }

  if (isLoading || !user) return null;

  const isDirector = user.role?.value === "GENERAL_SUPER_ADMIN";
  const isGeneralAdmin = user.role?.value === "SUPER_ADMIN";
  const isAdmin = user.role?.value === "ADMIN";
  const isUser = user.role?.value === "USER";

  return (
    <Box ref={ref} sx={{ height: "calc(100% - 64px)", position: "relative" }}>
      <Box sx={{ position: "fixed !important", height: "calc(100% - 64px)", zIndex: 100 }}>
        <Drawer
          anchor="left"
          variant={isTablet ? "persistent" : "permanent"}
          open={isOpen}
          sx={{
            width: isTablet && !isOpen ? 0 : "auto",
            height: "100%",
            marginRight: "15px",
            transition: "all 0.15s ease",
            position: "static !important",
            "&>div": {
              position: "static !important"
            }
          }}
        >
          <Box sx={{ maxWidth: "300px", paddingRight: isOpen ? "15px" : "5px", height: "100%" }}>
            <List sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              "& .MuiListItem-root:not(:last-child)": {
                paddingBottom: "15px",
              }
            }}>
              <ListItem onClick={handleCloseClick}>
                <CustomLink href="/account" changeImgColorOnActiveLink={false}>
                  <Avatar
                    photo={user.photo}
                    width={50}
                    height={50}
                  />
                  <Box>
                    <Typography sx={{
                      fontSize: isOpen ? 16 : 0,
                      opacity: isOpen ? 1 : 0,
                      marginLeft: isOpen ? 1 : 0,
                      transition: "font-size 0.15s ease",
                    }}
                    >
                      {getSurname(user.name)}
                    </Typography>
                    <Typography sx={{
                      fontSize: isOpen ? 16 : 0,
                      opacity: isOpen ? 1 : 0,
                      marginLeft: isOpen ? 1 : 0,
                      transition: "font-size 0.15s ease",
                    }}
                    >
                      {getName(user.name)}
                    </Typography>
                  </Box>
                </CustomLink>
              </ListItem>
              {
                (
                  user.type === "coach"
                    ? (isGeneralAdmin || isDirector)
                      ? generalCoachLinks
                      : isAdmin
                        ? coachLinks
                        : []
                    : userLinks
                ).map(item => (
                  <Tooltip key={item.alt} title={item.text} placement="right">
                    <ListItem onClick={handleCloseClick}>
                      <CustomLink href={item.href} changeImgColorOnHover sx={{ width: "100%" }}>
                        <Box sx={{
                          width: "47px",
                          display: "flex",
                          justifyContent: "center",
                        }}>
                          <Image
                            src={item.icon}
                            alt={item.alt}
                            style={{
                              maxWidth: "30px",
                              width: "100%"
                            }}
                          />
                        </Box>
                        <Typography sx={{
                          fontSize: isOpen ? 16 : 0,
                          opacity: isOpen ? 1 : 0,
                          marginLeft: isOpen ? 1 : 0,
                          transition: "font-size 0.15s ease"
                        }}
                        >
                          {item.text}
                        </Typography>
                      </CustomLink>
                    </ListItem>
                  </Tooltip>
                ))
              }
              {
                isLaptop &&
                <ListItem sx={{ marginTop: 1.5, borderTop: "1px solid #EEE" }}>
                  <IconButton
                    color="black"
                    disableRipple
                    onClick={handleLogoutClick}
                    sx={{ aspectRatio: 0, padding: 0 }}
                  >
                    <Box sx={{
                      width: "47px",
                      display: "flex",
                      justifyContent: "center",
                    }}>
                      <Image
                        src={logout}
                        alt="logout"
                        style={{
                          maxWidth: "27px",
                          width: "100%"
                        }}
                      />
                    </Box>
                    <Typography sx={{
                      fontSize: isOpen ? 16 : 0,
                      opacity: isOpen ? 1 : 0,
                      marginLeft: isOpen ? 1 : 0,
                      transition: "font-size 0.15s ease",
                      color: "typography.dark"
                    }}
                    >
                      Выйти
                    </Typography>
                  </IconButton>
                </ListItem>
              }
            </List>
          </Box>
        </Drawer>
        <button
          ref={hoverRef as RefObject<HTMLButtonElement>}
          onClick={handleOpenDrawerClick}
          style={{
            position: isTablet && !isOpen ? "fixed" : "absolute",
            left: isTablet && !isOpen ? "9px" : "calc(100% - 15px)",
            top: isTablet && !isOpen ? "110px" : "40px",
            transform: "translate(-50%, -50%)",
            backgroundColor: isHover ? "#F8F8F8" : "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: isOpen ? "30px" : "40px",
            width: isOpen ? "30px" : "20px",
            border: "1px solid #DDD",
            borderRadius: "3px",
            transition: "width 0.15s ease",
            zIndex: 1000,
          }}
        >
          <Image
            src={isOpen ? leftArrow : rightArrow}
            alt="arrow"
            style={{
              filter: "invert(0.5)",
              width: "9px",
              height: "9px",
            }}
          />
        </button>
      </Box>
    </Box>
  )
};

export default Sidebar;