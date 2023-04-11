"use client";
import { app } from "../../../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { NewTeamType } from "@/types/api/team";
import { useFormContext } from "react-hook-form";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import InputForm from "@/components/atoms/InputForm";
import FormButton from "@/components/atoms/FormButton";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import DeleteModal from "@/components/organisms/modal/deleteModal";
import { Text } from "@chakra-ui/react";

const EditTeam = ({ params }: { params: { id: number } }) => {
  const auth = getAuth(app);
  const router = useRouter();
  const { loginUser, loading, setLoading } = useAuthContext();
  const [editTeam, setEditTeam] = useState<NewTeamType>({
    name: "",
  });
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { handleSubmit } = useFormContext();

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setEditTeam({ ...editTeam, [name]: value });
    },
    [editTeam, setEditTeam]
  );

  useEffect(() => {
    const getTeam = async () => {
      try {
        if (loginUser && params) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = { user_id: loginUser.id };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: `/teams/${params.id}`,
            token: token!,
            params: data,
          };
          if (loginUser.role === "admin") {
            const res = await BaseClientWithAuth(props);
            setEditTeam(res.data);
          } else {
            console.log("権限がありません");
          }
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getTeam();
  }, []);
  const handleonSubmit = () => {
    const updateTeam = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team: { name: editTeam.name },
            user_id: loginUser.id,
          };
          const props: BaseClientWithAuthType = {
            method: "patch",
            url: `/teams/${params.id}`,
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          router.push("/admin/team/new");
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    updateTeam();
  };

  const handleDelete = async () => {
    try {
      if (loginUser) {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id };
        const props: BaseClientWithAuthType = {
          method: "delete",
          url: `/teams/${params.id}`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
        CloseDeleteModal();
        router.push("/admin/team/new");
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
  return (
    <>
      {!loading && loginUser!.role === "admin" ? (
        <>
          <form onSubmit={handleSubmit(handleonSubmit)}>
            <InputForm
              title="チーム名"
              name="name"
              type="text"
              handleChange={handleonChange}
              value={editTeam.name}
              message="チーム名を入力してください"
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

export default EditTeam;
