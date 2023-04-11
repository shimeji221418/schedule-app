"use client";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Checkbox,
  CheckboxGroup,
  InputGroup,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
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
import { useGetAllUsers } from "@/hooks/useAllUsers";

export type TargetUserType = {
  id: number;
  name: string;
};

export default function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const today: Date = new Date();
  const [isDailyCalendar, setIsDailyCalendar] = useState(false);

  const { loginUser, loading } = useAuthContext();
  const { teams, getTeamsWithAuth } = useGetTeams();
  const [targetTeam, setTargetTeam] = useState<TeamType>({
    id: 0,
    name: "",
  });
  const [mode, setMode] = useState<"team" | "custom">("team");
  const { teamUser } = useGetTeamUsers(targetTeam.id);
  const { teamSchedules, dailySchedules, date, setDate, userIds, onClickUser } =
    useGetSchedules(targetTeam.id);
  const { tasks, getTask } = useGetTasks({ auth, loginUser });
  const { allUsers, getAllUsers2 } = useGetAllUsers({ auth });
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
      getAllUsers2();
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

          <RadioGroup
            onChange={(value: "team" | "custom") => setMode(value)}
            value={mode}
          >
            <Radio value="team">チーム</Radio>
            <Radio value="custom">ユーザー選択</Radio>
          </RadioGroup>

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
          <CheckboxGroup colorScheme="green">
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              {allUsers.map((user) => (
                <Checkbox
                  key={user.id}
                  onChange={() => onClickUser(user.id)}
                  isChecked={userIds.includes(user.id)}
                >
                  {user.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          <ScheduleKinds tasks={tasks} />

          <>
            {console.log({ mode })}
            {console.log({ allUsers })}
            {console.log({ targetTeam })}
            {!isDailyCalendar && (
              <WeeklySchedule
                mode={mode}
                targetTeam={targetTeam}
                teamSchedules={teamSchedules}
                today={today}
                date={date}
                setDate={setDate}
                userIds={userIds}
                allUser={allUsers}
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
