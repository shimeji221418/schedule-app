import InputForm from "@/components/atoms/InputForm";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { GetUserType } from "@/types/api/user";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FC, memo, useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  targetUser: GetUserType;
};

const UserDetailModal: FC<Props> = memo((props) => {
  const { isOpen, onClose, targetUser } = props;
  const [editUser, setEditUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });

  useEffect(() => {
    setEditUser({
      ...editUser,
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      uid: targetUser.uid,
      role: targetUser.role,
      teamId: targetUser.teamId,
    });
  }, [targetUser]);

  const handleChange = () => {};
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputForm
              title="name"
              name="name"
              value={editUser.name}
              type="text"
              handleChange={handleChange}
              message="nameを入力してください"
            />
          </ModalBody>
          <ModalFooter>
            <PrimaryButton onClick={onClose} color="cyan" size="md">
              Close
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default UserDetailModal;
