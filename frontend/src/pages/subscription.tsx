"use client";

import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import BackButton from "@/components/UI/BackButton";
import { incline } from "@/helpers/incline";
import PersonTrainingsHistoryGroup from "@/components/Widgets/PersonTrainingsHistoryGroup";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import { GetServerSideProps } from "next";
import usersService from "@/services/usersService";
import { IChild } from "@/types/IChild";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IChild;
}

const SubscriptionPage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  if (!authUser) return;

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <Container sx={{ height: "100%", position: "relative" }}>
        <Stack spacing={3}>
          <Box>
            <BackButton />
          </Box>
          <Stack spacing={3}>
            <Paper sx={{ padding: 2 }}>
              <Typography>
                <Typography
                  component="span"
                  fontSize={24}
                  color={authUser.trainingsLeft === 0 ? "" : authUser.trainingsLeft > 0 ? "typography.main" : "error"}
                >
                  {authUser.trainingsLeft}
                </Typography>
                {" "}
                <Typography
                  component="span"
                  fontSize={20}
                >
                  {incline(authUser.trainingsLeft, "занятие", "занятия", "занятий")} осталось
                </Typography>
              </Typography>
            </Paper>
            <Paper>
              <Stack spacing={3}>
                <Typography fontSize={{ smallPhone: 22, smallTablet: 28 }} sx={{ padding: 2, paddingBottom: 0 }}>История посещений</Typography>
                <PersonTrainingsHistoryGroup />
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Container>
    </>
  )
};

SubscriptionPage.getLayout = (page) => {
  return (
    <Layout
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderSidebar={() => <Sidebar />}
    >
      <Box sx={{ paddingTop: 3, paddingBottom: 3, height: "100%" }}>
        {page}
      </Box>
    </Layout >
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

export default SubscriptionPage;