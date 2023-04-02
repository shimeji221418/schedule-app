"use client";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { InputGroup } from "@chakra-ui/react";
import PrimaryButton from "@/components/atoms/PrimaryButton";

import { TeamType } from "@/types/api/team";

import { useGetTeams } from "@/hooks/useGetTeams";
import SelectForm from "@/components/atoms/SelectForm";
import { useGetSchedules } from "@/hooks/useGetSchedules";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";

import InputForm from "@/components/atoms/InputForm";
import ScheduleKinds from "@/components/molecules/ScheduleKinds";
import { useGetTasks } from "@/hooks/useGetTasks";
import DailySchedule from "@/components/templates/DailySchedule";
import WeeklySchedule from "@/components/templates/WeeklySchedule";

export type TargetUserType = {
  id: number;
  name: string;
};

export default function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const today: Date = new Date();
  const [isDailyCalendar, setIsDailyCalendar] = useState(false);
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
    console.log(auth.currentUser);
  };

  const { loginUser, loading } = useAuthContext();
  const { teams, getTeamsWithAuth } = useGetTeams();
  const [targetTeam, setTargetTeam] = useState<TeamType>({
    id: 0,
    name: "",
  });
  const { teamUser } = useGetTeamUsers(targetTeam.id);
  const { teamSchedules, dailySchedules, date, setDate } = useGetSchedules(
    targetTeam.id
  );

  const { tasks, getTask } = useGetTasks({ auth, loginUser });

  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setTargetTeam({ ...targetTeam, [name]: value });
      console.log(targetTeam.id);
    },
    [targetTeam]
  );

  const ChangeDaily = async () => {
    setIsDailyCalendar(true);
    setDate(today);
  };

  const ChangeWeekly = () => {
    setIsDailyCalendar(false);
  };

  useEffect(() => {
    if (loginUser) {
      getTask();
      getTeamsWithAuth({ auth });
      setTargetTeam({ ...targetTeam, id: loginUser.teamId });
    }
  }, []);

  return (
    <>
      {!loading && loginUser && (
        <>
          <PrimaryButton size="xs" color="cyan" onClick={ChangeWeekly}>
            Weekly
          </PrimaryButton>
          <PrimaryButton size="xs" color="cyan" onClick={ChangeDaily}>
            Daily
          </PrimaryButton>

          <PrimaryButton size="xs" color="cyan" onClick={handleLogout}>
            logout
          </PrimaryButton>

          <InputGroup>
            <SelectForm
              teams={teams}
              title="team"
              name="id"
              value={targetTeam.id}
              message="チームが選択されていません"
              handleonChange={handleSelectChange}
            />
          </InputGroup>
          <InputGroup>
            <InputForm
              type="date"
              name="date"
              title="date"
              value={format(date, "yyyy-MM-dd")}
              handleChange={(e) => {
                setDate(new Date(e.target.value));
              }}
              message="日付を入力してください"
            />
          </InputGroup>
          <ScheduleKinds tasks={tasks} />

          <>
            {!isDailyCalendar && (
              <WeeklySchedule
                targetTeam={targetTeam}
                teamSchedules={teamSchedules}
                today={today}
                date={date}
                setDate={setDate}
                teamUser={teamUser}
                tasks={tasks}
              />
            )}
          </>
          {isDailyCalendar && dailySchedules && (
            <DailySchedule
              targetTeam={targetTeam}
              dailySchedules={dailySchedules}
              today={today}
              date={date}
              setDate={setDate}
              teamUser={teamUser}
              tasks={tasks}
            />
          )}
        </>
      )}
    </>
  );
}
