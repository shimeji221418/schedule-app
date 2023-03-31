"use client";
import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import { LoginUserType } from "@/types";
import { Box } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { app } from "../../../firebase";

const Login = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [loginUser, setLoginUser] = useState<LoginUserType>({
    email: "",
    password: "",
  });
  const { handleSubmit } = useFormContext();
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setLoginUser({ ...loginUser, [name]: value });
    },
    [loginUser, setLoginUser]
  );

  const handleonSubmit = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginUser.email,
        loginUser.password
      );
      router.push("/");
      console.log(auth.currentUser);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <Box>Login</Box>
      <form onSubmit={handleSubmit(handleonSubmit)}>
        <InputForm
          name="email"
          title="email"
          type="email"
          handleChange={handleChange}
          message="emailが入力されていません"
        />
        <InputForm
          name="password"
          title="password"
          type="password"
          handleChange={handleChange}
          message="passwordが入力されていません"
        />
        <FormButton type="submit" color="cyan" size="md">
          Login
        </FormButton>
      </form>
    </>
  );
};

export default Login;
