"use client";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { GetUserType, LoginUserType } from "@/types/api/user";
import { Box, Stack, Text } from "@chakra-ui/react";
import React, { FC, memo } from "react";

type Props = {
  user: GetUserType;
  loginUser: LoginUserType;
  onClick?: (user: GetUserType) => void;
  title?: string;
};

const UserCard: FC<Props> = memo((props) => {
  const { user, loginUser, onClick, title } = props;
  return (
    <>
      {loginUser && user && (
        <Box h="240px" w="240px" bg="white" shadow="md" borderRadius="md" p={4}>
          <Stack spacing={5}>
            <Text as="h1" fontSize="2xl" fontWeight="bold" textAlign="center">
              {user.name}
            </Text>
            <Text as="h1" fontSize="lg" textAlign="center">
              {user.email}
            </Text>
            <Text as="h1" fontSize="lg" textAlign="center">
              {`team: ${user.team?.name}`}
            </Text>
            {onClick && (
              <PrimaryButton
                size="md"
                color="red"
                onClick={() => {
                  onClick(user);
                }}
              >
                {title}
              </PrimaryButton>
            )}
          </Stack>
        </Box>
      )}
    </>
  );
});

export default UserCard;
