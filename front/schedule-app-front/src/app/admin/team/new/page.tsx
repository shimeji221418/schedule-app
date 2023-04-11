"use client";
import { app } from "../../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewTeamType } from "@/types/api/team";
import { useAuthContext } from "@/provider/AuthProvider";
import { useGetTeams } from "@/hooks/useGetTeams";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useFormContext } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import InputForm from "@/components/atoms/InputForm";
import FormButton from "@/components/atoms/FormButton";
import PrimaryButton from "@/components/atoms/PrimaryButton";

const NewTeam = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [newTeam, setNewTeam] = useState<NewTeamType>({
    name: "",
  });
  const { loginUser, loading } = useAuthContext();
  const { teams, getTeamsWithAuth } = useGetTeams();

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewTeam({ ...newTeam, [name]: value });
    },
    [newTeam, setNewTeam]
  );

  useEffect(() => {
    getTeamsWithAuth({ auth });
  }, []);

  const handleonSubmit = () => {
    const createTeam = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team: { name: newTeam.name },
            user_id: loginUser.id,
          };
          const props: BaseClientWithAuthType = {
            method: "post",
            url: "/teams/",
            token: token!,
            data: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          location.reload();
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    createTeam();
  };

  const { handleSubmit } = useFormContext();
  return (
    <>
      {!loading && loginUser && loginUser!.role === "admin" ? (
        <>
          <Flex justify="center" mt={10}>
            <Box
              w="md"
              h="220px"
              bg="white"
              shadow="md"
              p={4}
              borderRadius="md"
              textAlign="center"
              mr={4}
            >
              <Heading as="h2">New Team</Heading>
              <Divider my={4} borderColor="gray.400" />
              <form onSubmit={handleSubmit(handleonSubmit)}>
                <Stack spacing={2}>
                  <InputForm
                    title="チーム名"
                    name="name"
                    type="text"
                    handleChange={handleonChange}
                    message="チーム名を入力してください"
                  />

                  <FormButton type="submit" color="cyan" size="md">
                    Save
                  </FormButton>
                </Stack>
              </form>
            </Box>

            <Box
              w="xs"
              bg="white"
              shadow="md"
              p={4}
              borderRadius="md"
              textAlign="center"
            >
              <Heading as="h2">チーム一覧</Heading>
              <Divider my={4} borderColor="gray.400" />
              <Stack spacing={3}>
                {teams.map((team) => (
                  <Flex
                    align="center"
                    bg="cyan.400"
                    justify="space-between"
                    px={2}
                    py={1}
                    borderRadius="md"
                    key={team.id}
                    height="auto"
                  >
                    <Text as="h2">{team.name}</Text>
                    <PrimaryButton
                      size="sm"
                      color="yellow"
                      fontColor="black"
                      onClick={() => router.push(`/admin/team/edit/${team.id}`)}
                    >
                      編集
                    </PrimaryButton>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Flex>
        </>
      ) : (
        <Text>アクセス権限がありません。ホーム画面の遷移します。</Text>
      )}
    </>
  );
};

export default NewTeam;
