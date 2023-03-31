"use client";
import { GetUserType } from "@/types/api/user";
import { app } from "../../../firebase";
import { Auth, getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import UserCard from "@/components/organisms/users/UserCard";
import { useAuthContext } from "@/provider/AuthProvider";
import {
  Box,
  InputGroup,
  InputLeftAddon,
  Select,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useGetTeams } from "@/hooks/useGetTeams";
import SelectForm from "@/components/atoms/SelectForm";
import { TeamType } from "@/types/api/team";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import UserDetailModal from "@/components/organisms/users/UserDetailModal";

const Users = () => {
  const auth = getAuth(app);
  const { loading, setLoading } = useAuthContext();
  const [users, setUsers] = useState<Array<GetUserType>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<GetUserType>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { teams, getTeamsWithAuth } = useGetTeams();
  const [targetTeam, setTargetTeam] = useState<TeamType>({
    id: 0,
    name: "",
  });
  const [targetUser, setTargetUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });

  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setTargetTeam({ ...targetTeam, [name]: value });
    },
    [targetTeam]
  );

  const handleTeamFilter = () => {
    if (targetTeam.id == 0) {
      setFilteredUsers(users);
    } else {
      const selectUsers = users.filter((user) => user.teamId == targetTeam.id);
      setFilteredUsers(selectUsers);
    }
  };

  const onClickOpen = useCallback(
    (user: GetUserType) => {
      setTargetUser(user);
      console.log(targetUser);
      onOpen();
    },
    [targetUser, onOpen]
  );

  useEffect(() => {
    const GetAllUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/users",
          token: token!,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    GetAllUsers();
    getTeamsWithAuth({ auth });
  }, []);
  return (
    <>
      {!loading && (
        <>
          <InputGroup>
            <InputLeftAddon children="team" bg="cyan.600" color="white" />
            <Select name="id" onChange={handleSelectChange}>
              <option key={0} value={0}>
                ALL
              </option>
              {teams && (
                <>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </>
              )}
            </Select>
            <PrimaryButton onClick={handleTeamFilter} size="md" color="cyan">
              表示
            </PrimaryButton>
          </InputGroup>
          <Wrap spacing={6} m={6}>
            {filteredUsers.map((user) => (
              <WrapItem key={user.id}>
                <Box onClick={() => onClickOpen(user)} cursor="pointer">
                  <UserCard user={user} />
                </Box>
              </WrapItem>
            ))}
          </Wrap>
          <UserDetailModal
            isOpen={isOpen}
            onClose={onClose}
            targetUser={targetUser}
          />
        </>
      )}
    </>
  );
};

export default Users;
