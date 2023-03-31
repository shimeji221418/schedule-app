import { useAuthContext } from "@/provider/AuthProvider";
import { TeamType } from "@/types/api/team";
import { Auth } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import {
  BaseClientWithoutAuthType,
  BaseClientWithoutAuth,
  BaseClientWithAuthType,
  BaseClientWithAuth,
} from "../lib/api/client";

type Props = {
  auth: Auth;
};

export const useGetTeams = () => {
  const [teams, setTeams] = useState<Array<TeamType>>([]);
  const getTeamsWithoutAuth = useCallback(async () => {
    try {
      const params: BaseClientWithoutAuthType = {
        method: "get",
        url: "/teams",
      };
      const res = await BaseClientWithoutAuth(params);
      setTeams(res.data);
    } catch (e: any) {
      console.log(e);
    }
  }, [teams]);

  const getTeamsWithAuth = useCallback(
    async (props: Props) => {
      const { auth } = props;
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const params: BaseClientWithAuthType = {
          method: "get",
          url: "/teams",
          token: token!,
        };
        const res = await BaseClientWithAuth(params);
        setTeams(res.data);
      } catch (e: any) {
        console.log(e);
      }
    },
    [teams]
  );

  return { teams, getTeamsWithoutAuth, getTeamsWithAuth };
};
