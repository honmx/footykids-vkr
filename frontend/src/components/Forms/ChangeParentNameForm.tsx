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
import { IChild } from "@/types/IChild";
import { AuthContext } from "@/contexts/authContext";
import { UsersContext } from "@/contexts/usersContext";

const applicationSchema = yup
  .object({
    parentName: yup.string().required()
  })
  .required();

interface IFormInput extends InferType<typeof applicationSchema> { }

interface Props {
  user: IChild;
  handleCloseClick: () => void;
}

const ChangeParentNameForm: FC<Props> = ({ user, handleCloseClick }) => {

  const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);
  const { users, setUsers } = useContext(UsersContext);
  const { group, setGroup } = useContext(GroupContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      parentName: user.parentName
    },
    resolver: yupResolver(applicationSchema)
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.parentName !== user.parentName) {
      setIsLoading(true);

      try {
        const userWithNewParentName = await usersService.changeParentName(user.id, data.parentName);

        if (!userWithNewParentName) return;

        if (authUser?.id === userWithNewParentName.id) {
          setAuthUser(userWithNewParentName);
        }

        setGroup({
          ...group,
          participants: group.participants?.map(participant =>
            participant.id === userWithNewParentName.id
              ? userWithNewParentName
              : participant
          )
        });
        setUsers(users.map(user => user.id === userWithNewParentName.id ? userWithNewParentName : user));

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
          name="parentName"
        />
        {
          error && <Typography color="error">{error}</Typography>
        }
        <Button type="submit" disabled={isLoading}>Применить</Button>
      </Stack>
    </form>
  )
};

export default ChangeParentNameForm;