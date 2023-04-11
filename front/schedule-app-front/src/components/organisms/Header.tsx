"use client";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { FC, memo, useCallback } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../../firebase";
import MenuDrawer from "../molecules/MenuDrawer";
import MenuIconButton from "../atoms/menuIconButton";
import { useAuthContext } from "@/provider/AuthProvider";

const Header: FC = memo(() => {
  const router = useRouter();
  const auth = getAuth(app);
  const { loginUser } = useAuthContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const admin: boolean = loginUser?.role === "admin";
  const handleLogout = useCallback(async () => {
    await signOut(auth);
    router.push("/login");
  }, [auth, router]);
  return (
    <>
      {loginUser && (
        <>
          <Flex
            bg="cyan.500"
            p={{ base: 1, md: 2 }}
            align="center"
            justify="space-between"
            width="100%"
          >
            <Heading
              as="h1"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color="white"
            >
              <Link href="/">Schedule-app</Link>
            </Heading>
            <Flex color="white" align="center">
              <HStack spacing={6} display={{ base: "none", md: "flex" }}>
                {admin && <Link href="/admin">管理者ページ</Link>}
                <Link href="/users">ユーザー一覧</Link>
                <Link href="/schedules">個人スケジュール</Link>
                <Link onClick={handleLogout}>ログアウト</Link>
              </HStack>
              <Box ml={4}>
                <MenuIconButton onOpen={onOpen} />
              </Box>
            </Flex>
          </Flex>
          <MenuDrawer
            isOpen={isOpen}
            onClose={onClose}
            handleLogout={handleLogout}
            loginUser={loginUser}
            admin={admin}
          />
        </>
      )}
    </>
  );
});

export default Header;
