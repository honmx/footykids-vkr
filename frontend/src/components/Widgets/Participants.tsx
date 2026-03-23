import { FC, useContext } from "react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { GroupContext } from "@/contexts/groupContext";
import UserItem from "../Items/UserItem";
import AddChildrenModalButton from "../ModalButtons/AddChildrenModalButton";
import { useResize } from "@/hooks/useResize";
import { AuthContext } from "@/contexts/authContext";
import CustomLink from "../UI/CustomLink";

interface Props {

}

const Participants: FC<Props> = ({ }) => {

  const { user: authUser } = useContext(AuthContext);
  const { group } = useContext(GroupContext);

  return (
    <>
      <Paper sx={{ padding: 3, overflow: "visible" }}>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Stack spacing={0.5}>
              <Typography fontSize={{ smallPhone: 22, smallTablet: 28 }}>Участники</Typography>
              <CustomLink
                href={`/groups/${group.id}/attendance`}
                style={{ fontSize: 13, textDecoration: "underline" }}
              >
                Общие посещения
              </CustomLink>
            </Stack>
            {
              authUser?.role?.value !== "ADMIN" &&
              <AddChildrenModalButton />
            }
          </Stack>
          <Box>
            {
              group.participants
                .map((participant, i) => (
                  <UserItem
                    key={participant.id}
                    user={participant}
                    renderExpelButton
                    sx={{ borderBottom: i !== group.participants.length - 1 ? "1px solid #DDD" : 0 }}
                  />
                ))
            }
          </Box>
        </Stack>
      </Paper>
    </>
  )
};

export default Participants;