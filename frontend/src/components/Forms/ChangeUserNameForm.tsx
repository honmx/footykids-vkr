import { FC, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { InferType } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledTextField from "../UI/ControlledTextField";
import { Button, Stack, Typography } from "@mui/material";
import groupsService from "@/services/groupsService";
import { GroupContext } from "@/contexts/groupContext";
import { GroupsContext } from "@/contexts/groupsContext";
import { UserType } from "@/types/UserType";
import usersService from "@/services/usersService";
import { UsersContext } from "@/contexts/usersContext";
import { AuthContext } from "@/contexts/authContext";

const applicationSchema = yup
  .object({
    name: yup.string().required()
  })
  .required();

interface IFormInput extends InferType<typeof applicationSchema> { }

interface Props {
  user: UserType;
  handleCloseClick: () => void;
}

const ChangeUserNameForm: FC<Props> = ({ user, handleCloseClick }) => {

  const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);
  const { users, setUsers } = useContext(UsersContext);
  const { group, setGroup } = useContext(GroupContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      name: user.name
    },
    resolver: yupResolver(applicationSchema)
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.name !== user.name) {
      setIsLoading(true);

      try {
        const userWithNewName = await usersService.changeName(user.id, data.name);

        if (!userWithNewName) return;

        if (authUser?.id === userWithNewName.id) {
          setAuthUser(userWithNewName);
        }

        if (userWithNewName.type === "user") {
          setGroup({
            ...group,
            participants: group.participants?.map(participant =>
              participant.id === userWithNewName.id
                ? userWithNewName
                : participant
            )
          });
          setUsers(users.map(user => user.id === userWithNewName.id ? userWithNewName : user));
        }

      } catch (error: any) {
        setError(error.response.data.message);
        return;

      } finally {
        setIsLoading(false);
      }
    }

    handleCloseClick();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>
      <Stack spacing={2}>
        <ControlledTextField
          control={control}
          name="name"
        />
        {
          error && <Typography color="error">{error}</Typography>
        }
        <Button type="submit" disabled={isLoading}>Применить</Button>
      </Stack>
    </form>
  )
};

export default ChangeUserNameForm;