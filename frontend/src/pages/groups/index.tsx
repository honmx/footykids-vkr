import { FC, useContext, useState } from "react";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import groupsService from "@/services/groupsService";
import { IGroup } from "@/types/IGroup";
import Link from "next/link";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import CreateGroupButton from "@/components/ModalButtons/CreateGroupButton";
import { GroupsContext } from "@/contexts/groupsContext";
import GroupCard from "@/components/Cards/GroupCard";
import BackButton from "@/components/UI/BackButton";
import { useRequest } from "@/hooks/useRequest";
import GroupsGroup from "@/components/Widgets/GroupsGroup";
import { useResize } from "@/hooks/useResize";
import { AuthContext } from "@/contexts/authContext";
import usersService from "@/services/usersService";
import { IUserCoach } from "@/types/IUserCoach";
import { IUserGeneralCoach } from "@/types/IUserGeneralCoach";
import { IUserDirector } from "@/types/IUserDirector";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IUserCoach | IUserGeneralCoach | IUserDirector;
}

const GroupsPage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  const { data: groups, setData: setGroups, isLoading: isGroupsLoading, error } = useRequest(
    () => groupsService.getGroups(),
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
      <GroupsContext.Provider value={{ groups, setGroups }}>
        <Box>
          <Container>
            <Stack direction="row" spacing={5} sx={{ justifyContent: "space-between", marginBottom: 2 }}>
              <BackButton />
              {
                authUser.role?.value !== "ADMIN" &&
                <CreateGroupButton />
              }
            </Stack>
            <GroupsGroup groups={groups} />
          </Container>
        </Box>
      </GroupsContext.Provider>
    </>
  )
};

GroupsPage.getLayout = (page) => {
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

export default GroupsPage;