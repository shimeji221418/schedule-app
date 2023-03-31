"use client";
import { Box, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import InputForm from "@/components/atoms/InputForm";
import { TaskType } from "@/types/api/schedule_kind";
import FormButton from "@/components/atoms/FormButton";
import { useFormContext } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { app } from "../../../../../firebase";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import DeleteModal from "@/components/organisms/deleteModal";

const EditTask = ({ params }: { params: { id: number } }) => {
  const auth = getAuth(app);
  const router = useRouter();
  const { loginUser, loading, setLoading } = useAuthContext();
  const [editTask, setEditTask] = useState<TaskType>({
    name: "",
    color: "",
  });
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { handleSubmit } = useFormContext();

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setEditTask({ ...editTask, [name]: value });
    },
    [editTask, setEditTask]
  );
  const handleonSubmit = () => {
    const editScheduleKind = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = {
          schedule_kind: { name: editTask.name, color: editTask.color },
          user_id: loginUser?.id,
        };
        const props: BaseClientWithAuthType = {
          method: "patch",
          url: `/schedule_kinds/${params.id}`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    editScheduleKind();
  };

  const handleDelete = async () => {
    try {
      if (loginUser) {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id };
        const props: BaseClientWithAuthType = {
          method: "delete",
          url: `/schedule_kinds/${params.id}`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
        CloseDeleteModal();
        router.push("/");
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const OpenDeleteModal = useCallback(() => {
    setIsDeleteModal(true);
  }, []);

  const CloseDeleteModal = useCallback(() => {
    setIsDeleteModal(false);
  }, []);

  useEffect(() => {
    const getTask = async () => {
      try {
        if (loginUser && params) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = { user_id: loginUser.id };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: `/schedule_kinds/${params.id}`,
            token: token!,
            params: data,
          };
          if (loginUser.role === "admin") {
            const res = await BaseClientWithAuth(props);
            setEditTask(res.data);
          } else {
            console.log("権限がありません");
          }
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getTask();
  }, []);

  return (
    <>
      {!loading && loginUser!.role === "admin" ? (
        <>
          <Box>EditTask</Box>
          <form onSubmit={handleSubmit(handleonSubmit)}>
            <InputForm
              title="ジャンル名"
              name="name"
              type="text"
              handleChange={handleonChange}
              value={editTask.name}
              message="スケジュールのジャンル名を入力してください"
            />
            <InputForm
              title="カラー"
              name="color"
              type="text"
              handleChange={handleonChange}
              value={editTask.color}
              message="カラーを入力してください"
            />
            <FormButton type="submit" color="cyan" size="md">
              Edit
            </FormButton>
          </form>
          <PrimaryButton onClick={OpenDeleteModal} size="md" color="red">
            Delete
          </PrimaryButton>
          <DeleteModal
            isOpen={isDeleteModal}
            onClose={CloseDeleteModal}
            handleDelete={handleDelete}
          />
        </>
      ) : (
        <>
          <Text>アクセス権限がありません。ホーム画面の遷移します。</Text>
        </>
      )}
    </>
  );
};

export default EditTask;
