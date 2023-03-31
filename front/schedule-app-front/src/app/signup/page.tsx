"use client";
import {
  BaseClientWithoutAuth,
  BaseClientWithoutAuthType,
} from "@/lib/api/client";
import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import SelectForm from "@/components/atoms/SelectForm";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { TeamType } from "@/types/api/team";
import { Select } from "@chakra-ui/react";
import { app } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { NewUserType } from "@/types";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { useGetTeams } from "@/hooks/useGetTeams";

const SignUp = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [newUser, setNewUser] = useState<NewUserType>({
    name: "",
    email: "",
    password: "",
    role: "",
    team_id: 1,
  });
  const { loading, loginUser } = useAuthContext();
  const { teams, getTeamsWithoutAuth } = useGetTeams();
  const roles = ["general", "admin"];
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewUser({ ...newUser, [name]: value });
    },
    [newUser, setNewUser]
  );
  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewUser({ ...newUser, [name]: value });
    },
    [newUser, setNewUser]
  );
  const { handleSubmit } = useFormContext();

  const handleonSubmit = () => {
    const request = async () => {
      await handleSignUp();
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken(true);
          const data = { token, role: newUser.role, team_id: newUser.team_id };
          const params: BaseClientWithoutAuthType = {
            method: "post",
            url: "/auth/registrations/",
            data: data,
          };
          await BaseClientWithoutAuth(params);
          router.push("/");
          console.log(auth.currentUser);
        } catch (e: any) {
          console.log(e);
        }
      }
    };
    request();
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      await updateProfile(auth.currentUser!, {
        displayName: newUser.name,
      });
      console.log(auth.currentUser?.displayName);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTeamsWithoutAuth();
  }, []);

  return (
    <>
      {!loading && loginUser == null && (
        <>
          <div>SignUp</div>
          <form onSubmit={handleSubmit(handleonSubmit)}>
            <InputForm
              name="name"
              title="name"
              type="text"
              handleChange={handleChange}
              message="nameが入力されていません"
            />
            <InputForm
              name="email"
              title="email"
              type="email"
              handleChange={handleChange}
              message="emailが入力されていません"
            />
            <SelectForm
              teams={teams}
              title="select team"
              name="team_id"
              handleonChange={handleSelectChange}
              message="所属チームが入力されていません"
            />
            <SelectForm
              roles={roles}
              title="select role"
              name="role"
              handleonChange={handleSelectChange}
              message="ユーザー権限が入力されていません"
            ></SelectForm>
            <InputForm
              name="password"
              title="password"
              type="password"
              handleChange={handleChange}
              message="passwordが入力されていません"
            />
            <FormButton type="submit" color="cyan" size="md">
              SignUp
            </FormButton>
          </form>
        </>
      )}
    </>
  );
};

export default SignUp;
