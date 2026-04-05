import { ChangeEvent, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Head from "next/head";
import { AuthContext } from "@/contexts/authContext";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import Sidebar from "@/components/Layout/Sidebar";
import { coachLinks, generalCoachLinks } from "@/data/coachLinks";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import ProfileCard from "@/components/Cards/ProfileCard";
import { userLinks } from "@/data/userLinks";
import medicalDocument from "@/assets/medicalDocument.svg"
import insurance from "@/assets/insurance.svg"
import AccountNavigationCard from "@/components/Cards/AccountNavigationCard";
import { createPortal } from "react-dom";
import DocumentModal from "@/components/Modals/DocumentModal";
import usersService from "@/services/usersService";
import { getDateFromString } from "@/helpers/getDateFromString";
import { UserType } from "@/types/UserType";
import { GetServerSideProps } from "next";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user?: UserType;
}

const AccountPage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  const [isMedicalDocumentModalOpen, setIsMedicalDocumentModalOpen] = useState<boolean>(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState<boolean>(false);

  const handleOpenMedicalDocumentModal = () => {
    setIsMedicalDocumentModalOpen(prev => !prev);
  }

  const handleOpenInsuranceModal = () => {
    setIsInsuranceModalOpen(prev => !prev);
  }

  if (!authUser) return <Typography>no user</Typography>;

  const isDirector = authUser.role?.value === "GENERAL_SUPER_ADMIN";
  const isGeneralAdmin = authUser.role?.value === "SUPER_ADMIN";
  const isAdmin = authUser.role?.value === "ADMIN";
  const isUser = authUser.role?.value === "USER";

  const isWithoutRole = !isDirector && !isGeneralAdmin && !isAdmin && !isUser;

  const userModalCards = [
    {
      text: <>
        <Typography component="span">Мед. справка</Typography>
        {
          authUser.type === "user"
          && authUser.medicalDocument?.expires
          && <Typography fontSize={14} component="span">
            <br />
            До {" "}
            <Typography component="span" fontSize={14} color={new Date() > getDateFromString(authUser.medicalDocument.expires) ? "error" : "typography.main"}>
              {authUser.medicalDocument.expires}
            </Typography>
          </Typography>
        }
      </>,
      icon: medicalDocument,
      alt: "medical document",
      onClick: handleOpenMedicalDocumentModal,
    },
    {
      text: <>
        <Typography component="span">Страховка</Typography>
        <br />
        {
          authUser.type === "user"
          && authUser.insurance?.expires
          && <Typography fontSize={14} component="span">
            До {" "}
            <Typography component="span" fontSize={14} color={new Date() > getDateFromString(authUser.insurance.expires) ? "error" : "typography.main"}>
              {authUser.insurance.expires}
            </Typography>
          </Typography>
        }
      </>,
      icon: insurance,
      alt: "insurance",
      onClick: handleOpenInsuranceModal,
    },
  ]

  return (
    <>
      <Head>
        <title>Личный кабинет</title>
        <meta name="description" content="Личный кабинет" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <Container maxWidth={isWithoutRole ? "middlePhone" : isAdmin ? "smallTablet" : "tablet"} sx={{ height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} smallTablet={isWithoutRole ? 12 : isAdmin ? 8 : 5.5} sx={{ zIndex: 2 }}>
              <ProfileCard user={authUser} />
            </Grid>
            {
              !isWithoutRole &&
              <Grid item container xs={12} smallTablet={isAdmin ? 4 : 6.5} spacing={2}>
                {
                  authUser.type === "coach" &&
                  (
                    (isGeneralAdmin || isDirector)
                      ? generalCoachLinks
                      : isAdmin
                        ? coachLinks
                        : []
                  ).map(link => (
                    <AccountNavigationCard key={link.text} {...link} />
                  ))
                }
                {
                  authUser.type === "user" && [...userLinks, ...userModalCards].map(link => (
                    <AccountNavigationCard key={link.alt} {...link} />
                  ))
                }
              </Grid>
            }
          </Grid>
        </Box>
      </Container>
      {
        typeof document !== "undefined" && authUser.type === "user" &&
        createPortal(
          <DocumentModal
            open={isMedicalDocumentModalOpen}
            handleCloseClick={handleOpenMedicalDocumentModal}
            title="Мед. справка"
            userId={authUser.id}
            document={authUser.medicalDocument}
            requestFn={usersService.uploadMedicalDocumentPhoto}
          />,
          document.body.querySelector("#modal-container") as Element
        )
      }
      {
        typeof document !== "undefined" && authUser.type === "user" &&
        createPortal(
          <DocumentModal
            open={isInsuranceModalOpen}
            handleCloseClick={handleOpenInsuranceModal}
            title="Страховка"
            userId={authUser.id}
            document={authUser.insurance}
            requestFn={usersService.uploadInsurancePhoto}
          />,
          document.body.querySelector("#modal-container") as Element
        )
      }
    </>
  )
};

AccountPage.getLayout = (page) => {
  return (
    <Layout
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderSidebar={() => <Sidebar />}
    >
      <Box sx={{ paddingTop: 3, paddingBottom: 3, height: "100%" }}>
        {page}
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const userId = Number(context.req.headers['x-header-user']);

  if (!userId) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      }
    }
  }

  try {
    const user = await usersService.getUserById(userId);

    return {
      props: {
        user
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      }
    }
  }
}

export default AccountPage;