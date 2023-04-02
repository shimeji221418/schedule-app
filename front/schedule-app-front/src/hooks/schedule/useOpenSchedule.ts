import { GetUserType } from "@/types/api/user";
import { useDisclosure } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useState } from "react";

type Props = {
  onOpen: () => void;
};

export const useOpenSchedule = (props: Props) => {
  const { onOpen } = props;
  const [targetDate, setTargetDate] = useState<string>("");
  const [targetUser, setTargetUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });

  const openSchedule = useCallback(
    (day: Date, user: GetUserType) => {
      setTargetDate(format(day, "yyyy-MM-dd"));
      setTargetUser(user);
      onOpen();
    },
    [targetUser, targetDate]
  );
  const openSchedule2 = useCallback(
    (day: Date) => {
      setTargetDate(format(day, "yyyy-MM-dd"));
      onOpen();
    },
    [targetUser, targetDate]
  );
  return { targetDate, targetUser, openSchedule, openSchedule2 };
};
