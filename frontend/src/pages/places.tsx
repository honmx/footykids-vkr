import { Box, Button, Container, Stack } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import { IGroup } from "@/types/IGroup";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import BackButton from "@/components/UI/BackButton";
import CreatePlaceButton from "@/components/ModalButtons/CreatePlaceButton";
import PlacesGroup from "@/components/Widgets/PlacesGroup";
import { PlacesContext } from "@/contexts/placesContext";
import { useContext, useState } from "react";
import { IPlace } from "@/types/IPlace";
import { useRequest } from "@/hooks/useRequest";
import placesService from "@/services/placesService";
import { AuthContext } from "@/contexts/authContext";
import { GetServerSideProps } from "next";
import usersService from "@/services/usersService";
import { IUserGeneralCoach } from "@/types/IUserGeneralCoach";
import { IUserDirector } from "@/types/IUserDirector";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IUserGeneralCoach | IUserDirector;
}

const PlacesPage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  const { data: places, setData: setPlaces, isLoading: isPlacesLoading, error } = useRequest(
    () => placesService.getPlaces(),
    [],
    []
  );

  if (!authUser) return null;

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <PlacesContext.Provider value={{ places, setPlaces }}>
        <Container maxWidth="tablet" sx={{ height: "100%" }}>
          <Stack spacing={3}>
            <Stack spacing={5} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <BackButton />
              <CreatePlaceButton />
            </Stack>
            <PlacesGroup places={places} />
          </Stack>
        </Container>
      </PlacesContext.Provider>
    </>
  )
};

PlacesPage.getLayout = (page) => {
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

export default PlacesPage;