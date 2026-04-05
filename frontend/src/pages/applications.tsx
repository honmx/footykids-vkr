import { Box, Container, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import BackButton from "@/components/UI/BackButton";
import { selectApplicationsFilterValues } from "@/data/selectApplicationsFilterValues";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { IApplication } from "@/types/IApplication";
import { ApplicationsContext } from "@/contexts/ApplicationsContext";
import ApplicationsGroup from "@/components/Widgets/ApplicationsGroup";
import { AuthContext } from "@/contexts/authContext";
import { GetServerSideProps } from "next";
import usersService from "@/services/usersService";
import { IUserGeneralCoach } from "@/types/IUserGeneralCoach";
import { IUserDirector } from "@/types/IUserDirector";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IUserGeneralCoach | IUserDirector;
}

const ApplicationsPage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  const [applications, setApplications] = useState<IApplication[]>([]);
  const [name, setName] = useState<string>("");
  const [selectValueId, setSelectValueId] = useState<number>(selectApplicationsFilterValues[0].id);

  const debouncedName = useDebounce(name, 500);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setSelectValueId(Number(e.target.value));
  }

  // if (!user) return null;

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <ApplicationsContext.Provider value={{ applications, setApplications }}>
        <Container maxWidth="tablet" sx={{ height: "100%" }}>
          <BackButton sx={{ marginBottom: 2 }} />
          <Paper sx={{ padding: 2, overflow: "visible" }}>
            <Stack spacing={3}>
              <Stack spacing={5} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontSize={{ smallPhone: 22, smallTablet: 28 }}>Заявки</Typography>
                <Select value={selectValueId} onChange={handleSelectChange}>
                  {
                    selectApplicationsFilterValues.map(filterValue => (
                      <MenuItem key={filterValue.id} value={filterValue.id}>{filterValue.text}</MenuItem>
                    ))
                  }
                </Select>
              </Stack>
              <TextField
                variant="standard"
                placeholder="Имя/фамилия"
                value={name}
                onChange={handleNameChange}
                sx={{ width: { smallPhone: "100%", largeTablet: "250px" } }}
              />
              <ApplicationsGroup debouncedName={debouncedName} selectValueId={selectValueId} />
            </Stack>
          </Paper>
        </Container>
      </ApplicationsContext.Provider>
    </>
  )
};

ApplicationsPage.getLayout = (page) => {
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

export default ApplicationsPage;