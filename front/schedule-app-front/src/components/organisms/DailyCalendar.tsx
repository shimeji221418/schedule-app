import { app } from "../../../firebase";
import { getAuth } from "firebase/auth";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useGetSchedules } from "@/hooks/useGetSchedules";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";
import { GetUserType } from "@/types/api/user";
import { scheduleType } from "@/types/api/schedule";
import { Box } from "@chakra-ui/react";
import { addDays, format, subDays } from "date-fns";
import PrimaryButton from "../atoms/PrimaryButton";
import { TeamType } from "@/types/api/team";

type Props = {
  teamUser: Array<GetUserType>;
  dailySchedule: Array<scheduleType>;
  targetTeam: TeamType;
  setDailySchedules: Dispatch<SetStateAction<scheduleType[]>>;
};

const DailyCalendar: FC<Props> = (props) => {
  const { teamUser, dailySchedule, targetTeam, setDailySchedules } = props;
  const { dailySchedules } = useGetSchedules();
  const [todaySchedules, setTodaySchedules] = useState<Array<scheduleType>>([]);
  const { getDailySchedules } = useGetSchedules();
  const auth = getAuth(app);
  const today: Date = new Date();
  const [day, setDay] = useState<Date>(today);
  const { loginUser, setLoading, loading } = useAuthContext();

  const nextDay = async () => {
    try {
      if (loginUser) {
        const date = addDays(day, 1);
        const nextDate = format(date, "yyyy-MM-dd");
        // await getDailySchedules({ team_id: targetTeam.id, date: nextDate });
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team_id: targetTeam.id,
            date: nextDate,
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
          setDay(addDays(day, 1));
          setTodaySchedules(res.data);
        }
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    setTodaySchedules(dailySchedules);
  }, [dailySchedules, setDailySchedules]);

  const prevDay = () => {
    try {
      if (loginUser) {
        const date = subDays(day, 1);
        const prevDate = format(date, "yyyy-MM-dd");
        getDailySchedules({ team_id: targetTeam.id, date: prevDate });
        setDay(subDays(day, 1));
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    setTodaySchedules(dailySchedule);
  }, [dailySchedule]);

  const now = () => {
    try {
      if (loginUser) {
        const date = today;
        const thisDate = format(date, "yyyy-MM-dd");
        getDailySchedules({ team_id: targetTeam.id, date: thisDate });
        setDay(today);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <PrimaryButton size="xs" color="yellow" onClick={prevDay}>
        prevDay
      </PrimaryButton>
      <PrimaryButton size="xs" color="pink" onClick={nextDay}>
        NextDay
      </PrimaryButton>
      <PrimaryButton size="xs" color="green" onClick={now}>
        today
      </PrimaryButton>
      {format(day, "yyyy-MM-dd")}
      {teamUser.map((user) => (
        <p key={user.name}>{user.name}</p>
      ))}

      {todaySchedules.map((schedule) => (
        <Box key={schedule.id}>{schedule.description}</Box>
      ))}
    </>
  );
};

export default DailyCalendar;
