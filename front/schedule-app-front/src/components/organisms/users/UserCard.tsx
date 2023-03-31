"use client";
import { GetUserType } from "@/types/api/user";
import { Box, Stack, Text } from "@chakra-ui/react";
import React, { FC, memo } from "react";

type Props = {
  user: GetUserType;
};

const UserCard: FC<Props> = memo((props) => {
  const { user } = props;
  return (
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
      </Stack>
    </Box>
  );
});

export default UserCard;
