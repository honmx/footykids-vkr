import { FC, useContext, useEffect, useState } from "react";
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Box, ButtonGroup, Container, Grid, IconButton, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import groupsService from "@/services/groupsService";
import { IGroup } from "@/types/IGroup";
import Link from "next/link";
import { GroupContext } from "@/contexts/groupContext";
import Image from "next/image";
import penIcon from "@/assets/pen icon.svg";
import { createPortal } from "react-dom";
import ChangeGroupNameModal from "@/components/Modals/ChangeGroupNameModal";
import Schedule from "@/components/Widgets/Schedule";
import { sortGroupSchedules } from "@/helpers/sortGroupSchedules";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import Participants from "@/components/Widgets/Participants";
import ChangeGroupNameButton from "@/components/ModalButtons/ChangeGroupNameButton";
import BackButton from "@/components/UI/BackButton";
import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/authContext";
import usersService from "@/services/usersService";
import { IUserCoach } from "@/types/IUserCoach";
import { IUserGeneralCoach } from "@/types/IUserGeneralCoach";
import { IUserDirector } from "@/types/IUserDirector";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IUserCoach | IUserGeneralCoach | IUserDirector;
}

const GroupPage: INextPageWithLayout<Props> = ({ user }) => {

  const { query: { id } } = useRouter();

  const { user: authUser } = useAuth(user);

  const { data: group, setData: setGroup, isLoading: isGroupLoading, error } = useRequest(
    () => groupsService.getGroupById(Number(id)),
    {} as IGroup,
    [id]
  );

  if (!authUser) return null;

  if (!group.name) return null;

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <GroupContext.Provider value={{ group, setGroup }}>
        <Container sx={{ height: "100%", position: "relative" }}>
          <Stack spacing={3}>
            <Stack
              spacing={{ smallPhone: 0.5, smallTablet: 2 }}
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: { smallPhone: 5, largePhone: 0 },
              }}
            >
              <BackButton
                sx={{
                  position: "absolute",
                  left: { smallPhone: 15, tablet: 0 },
                  aspectRatio: 0
                }}
              />
              <Typography
                fontSize={{ smallPhone: 20, smallTablet: 22 }}
              >
                {group.name}
              </Typography>
              {
                authUser.role?.value !== "ADMIN" &&
                <ChangeGroupNameButton />
              }
            </Stack>
            <Schedule />
            <Participants />
          </Stack>
        </Container>
      </GroupContext.Provider>
    </>
  )
};

GroupPage.getLayout = (page) => {
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

export default GroupPage;