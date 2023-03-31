"use client";
import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import { Box, Text } from "@chakra-ui/react";
import { app } from "../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useAuthContext } from "@/provider/AuthProvider";
import { TaskType } from "@/types/api/schedule_kind";

const Newtask = () => {
  const auth = getAuth(app);
  const [newTask, setNewTask] = useState<TaskType>({
    name: "",
    color: "",
  });
  const { loginUser, loading } = useAuthContext();
  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewTask({ ...newTask, [name]: value });
    },
    [newTask, setNewTask]
  );

  const handleonSubmit = () => {
    const createScheduleKind = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            schedule_kind: { name: newTask.name, color: newTask.color },
            user_id: loginUser.id,
          };
          const props: BaseClientWithAuthType = {
            method: "post",
            url: "/schedule_kinds/",
            token: token!,
            data: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    createScheduleKind();
  };

  const { handleSubmit } = useFormContext();
  return (
    <>
      {!loading && loginUser && loginUser!.role === "admin" ? (
        <>
          <Box>New ScheduleKind</Box>
          <form onSubmit={handleSubmit(handleonSubmit)}>
            <InputForm
              title="ジャンル名"
              name="name"
              type="text"
              handleChange={handleonChange}
              message="スケジュールのジャンル名を入力してください"
            />
            <InputForm
              title="カラー"
              name="color"
              type="text"
              handleChange={handleonChange}
              message="カラーを入力してください"
            />
            <FormButton type="submit" color="cyan" size="md">
              Save
            </FormButton>
          </form>
        </>
      ) : (
        <Text>アクセス権限がありません。ホーム画面の遷移します。</Text>
      )}
    </>
  );
};

export default Newtask;
