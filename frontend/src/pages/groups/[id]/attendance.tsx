import { FC, useContext, useEffect, useState } from "react";
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Box, ButtonGroup, Container, Grid, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
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
import GroupAttendanceHistory from "@/components/Widgets/GroupAttendanceHistory";
import { attendanceMonthPeriods } from "@/data/attendanceMonthPeriods";
import { AuthContext } from "@/contexts/authContext";
import { useAuth } from "@/hooks/useAuth";
import usersService from "@/services/usersService";
import { IUserCoach } from "@/types/IUserCoach";
import { IUserGeneralCoach } from "@/types/IUserGeneralCoach";
import { IUserDirector } from "@/types/IUserDirector";

interface Props {
  user: IUserCoach | IUserGeneralCoach | IUserDirector
}

const AttendancePage: INextPageWithLayout<Props> = ({ user }) => {

  const { query: { id } } = useRouter();

  const { user: authUser } = useAuth(user);

  const [monthPeriod, setMonthPeriod] = useState<number>(attendanceMonthPeriods[2].monthPeriod);

  const handleMonthPeriodChange = (e: SelectChangeEvent<number>) => {
    setMonthPeriod(Number(e.target.value));
  }

  if (!authUser) return null;

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <Container maxWidth="desktop" sx={{ maxHeight: "calc(100vh - 150px)", height: "100%", position: "relative" }}>
        <Stack spacing={3} sx={{ height: "100%" }}>
          <Stack direction="row" spacing={3} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <BackButton />
            <Select
              value={monthPeriod}
              onChange={handleMonthPeriodChange}
            >
              {attendanceMonthPeriods.map(period => (
                <MenuItem key={period.monthPeriod} value={period.monthPeriod}>{period.value}</MenuItem>
              ))}
            </Select>
          </Stack>
          <GroupAttendanceHistory groupId={Number(id)} monthPeriod={monthPeriod} />
        </Stack>
      </Container>
    </>
  )
};

AttendancePage.getLayout = (page) => {
  return (
    <Layout
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
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

export default AttendancePage;