"use client";

import { Box, Container, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { useContext, useEffect, useState } from "react";
import BackButton from "@/components/UI/BackButton";
import Calendar from "@/components/Widgets/Calendar";
import { DateContext } from "@/contexts/dateContext";
import { useRequest } from "@/hooks/useRequest";
import groupsService from "@/services/groupsService";
import { IGroup } from "@/types/IGroup";
import PickDateSelectsGroup from "@/components/Widgets/PickDateSelectsGroup";
import { useResize } from "@/hooks/useResize";
import { AuthContext } from "@/contexts/authContext";
import { GetServerSideProps } from "next";
import usersService from "@/services/usersService";
import { UserType } from "@/types/UserType";
import { IChild } from "@/types/IChild";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IChild;
}

const SchedulePage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  const isTablet = useResize("laptop");

  const [groupId, setGroupId] = useState<number>(authUser?.type === "user" && authUser.groups?.[0]?.id || 0);
  const [monthIndex, setMonthIndex] = useState<number>(Number(new Date().toLocaleDateString().slice(3, 5)) - 1);
  const [year, setYear] = useState<number>(Number(new Date().toLocaleDateString().slice(6)));

  const { data: group, isLoading: isGroupLoading, error } = useRequest(
    () => groupsService.getGroupById(groupId),
    {} as IGroup,
    [groupId],
    () => groupId <= 0 || !groupId
  )

  useEffect(() => {
    setGroupId(authUser?.groups?.[0]?.id || 0);
  }, [authUser]);

  const handleGroupChange = (e: SelectChangeEvent<number>) => {
    setGroupId(Number(e.target.value));
  }

  const decrementMonth = () => {
    const newMonthIndex = monthIndex - 1 === -1 ? 11 : monthIndex - 1;
    const newYear = monthIndex - 1 === -1 ? year - 1 : year;

    setMonthIndex(newMonthIndex);
    setYear(newYear);
  }

  const incrementMonth = () => {
    const newMonthIndex = monthIndex + 1 === 12 ? 0 : monthIndex + 1;
    const newYear = monthIndex + 1 === 12 ? year + 1 : year;

    setMonthIndex(newMonthIndex);
    setYear(newYear);
  }

  // console.log(isGroupLoading);

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <DateContext.Provider value={{ monthIndex, setMonthIndex, year, setYear, decrementMonth, incrementMonth }}>
        <Container sx={{ height: "100%", position: "relative" }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={3} sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <BackButton />
              {
                authUser.groups && (
                  authUser.groups.length === 1
                    ? <Typography
                      fontSize={20}
                      color="#555"
                      sx={{
                        position: "absolute",
                        right: { smallPhone: "15px", smallTablet: "50%" },
                        transform: { smallPhone: 0, smallTablet: "translateX(50%)" },
                      }}
                    >
                      {authUser.groups[0].name}
                    </Typography>
                    : authUser.groups?.length > 1
                      ? <Select
                        value={groupId}
                        onChange={handleGroupChange}
                        sx={{ width: "140px" }}
                      >
                        {
                          authUser.groups.map(group => (
                            <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                          ))
                        }
                      </Select>
                      : null
                )
              }
            </Stack>
            {
              !isTablet && <PickDateSelectsGroup />
            }
            <Calendar group={group} />
          </Stack>
        </Container>
      </DateContext.Provider>
    </>
  )
};

SchedulePage.getLayout = (page) => {
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

export default SchedulePage;