import { scheduleType } from "@/types/api/schedule";
import { app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { format, startOfWeek } from "date-fns";

type Props = {
  team_id: number;
  date: string;
};

type PropsType = {
  startDate: string;
};

export const useGetSchedules = (id: number) => {
  const auth = getAuth(app);
  const [date, setDate] = useState<Date>(new Date());
  const { loginUser } = useAuthContext();
  const [reload, setReload] = useState<boolean>(true);
  const [teamSchedules, setTeamSchedules] = useState<Array<scheduleType>>([]);
  const [dailySchedules, setDailySchedules] = useState<Array<scheduleType>>([]);
  const getSchedules = useCallback(
    async (props: Props) => {
      const { team_id, date } = props;
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { team_id: team_id, date: date };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/schedules/team_schedules",
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        setTeamSchedules(res.data);
        console.log(res.data);
      } catch (e: any) {
        console.log(e);
      } finally {
        setReload(false);
      }
    },
    [teamSchedules]
  );

  const getDailySchedules = useCallback(
    async (props: Props) => {
      const { team_id, date } = props;
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team_id: team_id,
            date: date,
          };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: "/schedules/daily_schedules",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          setDailySchedules(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    },
    [dailySchedules]
  );

  useEffect(() => {
    if (loginUser && date && id) {
      const day = format(date, "yyyy-MM-dd");
      const startDate = format(startOfWeek(date), "yyyy-MM-dd");

      getSchedules({ team_id: id, date: startDate });
      getDailySchedules({ team_id: id, date: day });
    }
  }, [loginUser, date, id]);

  return {
    getSchedules,
    teamSchedules,
    setTeamSchedules,
    dailySchedules,
    setDailySchedules,
    date,
    setDate,
  };
};
