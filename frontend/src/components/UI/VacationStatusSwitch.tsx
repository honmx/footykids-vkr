import { AuthContext } from "@/contexts/authContext";
import { GroupContext } from "@/contexts/groupContext";
import { UsersContext } from "@/contexts/usersContext";
import { useDebounce } from "@/hooks/useDebounce";
import usersService from "@/services/usersService";
import { IChild } from "@/types/IChild";
import { Switch } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";

interface Props {
  user: IChild;
  open: boolean;
}

const VacationStatusSwitch: FC<Props> = ({ user, open }) => {

  const { user: userFromContext, setUser } = useContext(AuthContext);
  const { users, setUsers } = useContext(UsersContext);
  const { group, setGroup } = useContext(GroupContext);

  const [checked, setChecked] = useState<boolean>(user.isVacation);

  const debouncedChecked = useDebounce(checked, 3000);

  useEffect(() => {
    if (user.isVacation !== debouncedChecked) {
      (async () => {
        const userWithNewStatus = await usersService.changeVacationStatus(user.id, debouncedChecked);

        if (userFromContext?.id === user.id) {
          setUser(userWithNewStatus);
        }

        setGroup(() => ({
          ...group,
          participants: group.participants.map(participant => participant.id === userWithNewStatus.id
            ? userWithNewStatus
            : participant
          )
        }));
        setUsers(users.map(user => user.id === userWithNewStatus.id
          ? userWithNewStatus
          : user
        ))
      })();
    }

    return () => {
      if (user.isVacation !== checked && checked !== debouncedChecked) {
        (async () => {
          const userWithNewStatus = await usersService.changeVacationStatus(user.id, checked);

          if (userFromContext?.id === user.id) {
            setUser(userWithNewStatus);
          }

          setGroup(() => ({
            ...group,
            participants: group.participants.map(participant => participant.id === userWithNewStatus.id
              ? userWithNewStatus
              : participant
            )
          }));
          setUsers(users.map(user => user.id === userWithNewStatus.id
            ? userWithNewStatus
            : user
          ))
        })();
      };
    }
  }, [debouncedChecked, checked, user.isVacation]);


  const handleVacationStatusChange = () => {
    setChecked(prev => !prev);
  }

  return (
    <Switch checked={checked} onChange={handleVacationStatusChange} />
  )
};

export default VacationStatusSwitch;