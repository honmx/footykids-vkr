import { ChangeEvent, FC, memo, useContext, useEffect, useMemo, useState } from "react";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import { Box, Container, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography, debounce } from "@mui/material";
import Head from "next/head";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "@/types/INextPageWithLayout";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Sidebar from "@/components/Layout/Sidebar";
import usersService from "@/services/usersService";
import { UserType } from "@/types/UserType";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import UserItem from "@/components/Items/UserItem";
import { UsersContext } from "@/contexts/usersContext";
import { useFilteredUsers } from "@/hooks/useFilteredUsers";
import { selectUserFilterValues } from "@/data/selectUserFilterValues";
import { useRequest } from "@/hooks/useRequest";
import { useDebounce } from "@/hooks/useDebounce";
import UsersGroup from "@/components/Widgets/UsersGroup";
import { useInView } from "react-intersection-observer";
import { AuthContext } from "@/contexts/authContext";
import { IUserGeneralCoach } from "@/types/IUserGeneralCoach";
import { IUserDirector } from "@/types/IUserDirector";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  user: IUserGeneralCoach | IUserDirector;
}

const UsersPage: INextPageWithLayout<Props> = ({ user }) => {

  const { user: authUser } = useAuth(user);

  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectValueId, setSelectValueId] = useState<number>(selectUserFilterValues[0].id);

  const debouncedName = useDebounce(name, 500);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setSelectValueId(Number(e.target.value));
  }

  // console.log(users);

  // if (isLoading) return <Typography>Loading...</Typography>

  if (!authUser) return null;

  return (
    <>
      <Head>
        <title>FootyKids</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/footykids-icon.png" />
      </Head>
      <UsersContext.Provider value={{ users, setUsers }}>
        <Container sx={{ height: "100%" }}>
          <Paper sx={{ padding: 2, overflow: "visible" }}>
            <Stack spacing={3}>
              <Stack spacing={3} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontSize={{ smallPhone: 22, smallTablet: 28 }}>Пользователи</Typography>
                <Select value={selectValueId} onChange={handleSelectChange}>
                  {
                    selectUserFilterValues.map(filterValue => (
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
              <UsersGroup debouncedName={debouncedName} selectValueId={selectValueId} />
            </Stack>
          </Paper>
        </Container>
      </UsersContext.Provider>
    </>
  )
};

UsersPage.getLayout = (page) => {
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

export default UsersPage;