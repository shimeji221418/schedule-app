"use client";
import { getAuth, getIdToken, signOut } from "firebase/auth";
import { app } from "../../firebase";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  addDays,
  differenceInHours,
  differenceInMinutes,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { Box, Button, Flex, InputGroup, useDisclosure } from "@chakra-ui/react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { scheduleType } from "@/types/api/schedule";
import NewScheduleModal from "@/components/organisms/NewScheduleModal";
import { TeamType } from "@/types/api/team";
import { GetTaskType } from "@/types/api/schedule_kind";
import EditScheduleModal from "@/components/organisms/EditScheduleModal";
import { useGetTeams } from "@/hooks/useGetTeams";
import SelectForm from "@/components/atoms/SelectForm";
import { useGetSchedules } from "@/hooks/useGetSchedules";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";

import { hours, times } from "../components/atoms";
import InputForm from "@/components/atoms/InputForm";
import FormButton from "@/components/atoms/FormButton";
import { GetUserType } from "@/types/api/user";
import ScheduleKinds from "@/components/molecules/ScheduleKinds";

export type TargetUserType = {
  id: number;
  name: string;
};

export default function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const today: Date = new Date();
  const [date, setDate] = useState<Date>(new Date());
  const startDate = () => format(startOfWeek(date), "yyyy-MM-dd");
  const [targetSchedule, setTargetSchedule] = useState<scheduleType | null>(
    null
  );
  const [tasks, setTasks] = useState<Array<GetTaskType>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const { getTeamUsers, teamUser, setTeamUser } = useGetTeamUsers(
    targetTeam.id
  );
  const { getSchedules, teamSchedules, getDailySchedules, dailySchedules } =
    useGetSchedules(targetTeam.id, date);
  const [targetDate, setTargetDate] = useState<string>("");
  const [targetUser, setTargetUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });

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

  const nextWeek = useCallback(async () => {
    try {
      // const day = addDays(date, 7);
      // const nextDate = format(startOfWeek(day), "yyyy-MM-dd");
      // getSchedules({ team_id: targetTeam.id, date: nextDate });
      setDate(addDays(date, 7));
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam, date]);

  const prevWeek = useCallback(async () => {
    try {
      // const day = subDays(date, 7);
      // const prevDate = format(startOfWeek(day), "yyyy-MM-dd");
      // getSchedules({ team_id: targetTeam.id, date: prevDate });
      setDate(subDays(date, 7));
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam, date]);

  const thisWeek = useCallback(async () => {
    try {
      // const day = today;
      // const thisDate = format(startOfWeek(day), "yyyy-MM-dd");
      // getSchedules({ team_id: targetTeam.id, date: thisDate });
      setDate(today);
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam, date]);

  const ChangeDate = useCallback(async () => {
    try {
      const selectDay = format(startOfWeek(date), "yyyy-MM-dd");
      getSchedules({ team_id: targetTeam.id, date: selectDay });
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam]);

  const nextDay = useCallback(async () => {
    try {
      // const day = addDays(date, 1);
      // const nextDate = format(day, "yyyy-MM-dd");
      // await getDailySchedules({ team_id: targetTeam.id, date: nextDate });
      setDate(addDays(date, 1));
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam, date]);

  const prevDay = useCallback(async () => {
    try {
      // const day = subDays(date, 1);
      // const prevDate = format(day, "yyyy-MM-dd");
      // await getDailySchedules({ team_id: targetTeam.id, date: prevDate });
      setDate(subDays(date, 1));
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam, date]);

  const toToday = useCallback(async () => {
    try {
      // if (loginUser) {
      //   const day = format(today, "yyyy-MM-dd");
      //   await getDailySchedules({ team_id: targetTeam.id, date: day });
      setDate(today);
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam, date]);

  // const ChangeDate2 = useCallback(async () => {
  //   try {
  //     if (loginUser) {
  //       const selectDay = format(date, "yyyy-MM-dd");
  //       setDate(selectDay);
  //       // getDailySchedules({ team_id: targetTeam.id, date: selectDay });
  //     }
  //   } catch (e: any) {
  //     console.log(e);
  //   }
  // }, [targetTeam, date]);

  const dates = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  const openSchedule = (day: Date, user: GetUserType) => {
    setTargetDate(format(day, "yyyy-MM-dd"));
    setTargetUser(user);
    onOpen();
  };

  const openSchedule2 = (day: Date) => {
    setTargetDate(format(day, "yyyy-MM-dd"));
    onOpen();
  };

  const openEditSchedule = (schedule: scheduleType) => {
    setTargetSchedule(schedule);
    setIsModalOpen(true);
  };
  const closeEditSchedule = () => {
    setIsModalOpen(false);
  };

  const ChangeDaily = async () => {
    try {
      if (loginUser) {
        setIsDailyCalendar(true);
        // await getDailySchedules({
        //   team_id: loginUser.teamId,
        //   date: format(today, "yyyy-MM-dd"),
        // });
        setDate(today);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const ChangeWeekly = () => {
    setIsDailyCalendar(false);
  };

  const handleTeamChange = useCallback(async () => {
    try {
      getTeamUsers({ team_id: targetTeam.id });
      getSchedules({ team_id: targetTeam.id, date: startDate() });
    } catch (e: any) {
      console.log(e);
    }
  }, [targetTeam]);

  useEffect(() => {
    const getTask = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (loginUser) {
          const data = { user_id: loginUser.id };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: `/schedule_kinds`,
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          setTasks(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getTask();

    if (loginUser) {
      getTeamUsers({ team_id: loginUser.teamId });
      getTeamsWithAuth({ auth });
      setTargetTeam({ ...targetTeam, id: loginUser.teamId });
    }
  }, []);

  return (
    <>
      {!loading && loginUser && (
        <>
          {/* {teamSchedules.map((schedule) => (
            <Box key={schedule.id}>
              {format(new Date(schedule.startAt), "yyyy-MM-dd")}
            </Box>
          ))} */}
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
            <PrimaryButton onClick={handleTeamChange} size="md" color="cyan">
              更新
            </PrimaryButton>
          </InputGroup>
          <ScheduleKinds tasks={tasks} />
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
            <PrimaryButton onClick={ChangeDate} color="cyan" size="md">
              表示
            </PrimaryButton>
          </InputGroup>

          <>
            {!isDailyCalendar && (
              <>
                <PrimaryButton size="xs" color="yellow" onClick={prevWeek}>
                  prevWeek
                </PrimaryButton>
                <PrimaryButton size="xs" color="pink" onClick={nextWeek}>
                  NextWeek
                </PrimaryButton>
                <PrimaryButton size="xs" color="green" onClick={thisWeek}>
                  ThisWeek
                </PrimaryButton>

                {teamUser.map((user) => (
                  <Flex key={user.id}>
                    <>{user.name}</>
                    <Box key={user.id} border="1px" marginBottom={1}>
                      <Flex>
                        {dates.map((day, i) => (
                          <Box key={i} borderRight="1px">
                            <Box
                              marginRight={2}
                              onClick={() => openSchedule(day, user)}
                              cursor="pointer"
                            >
                              {format(day, "M/d")}
                            </Box>
                            {teamSchedules.map(
                              (schedule) =>
                                format(day, "yyyy-MM-dd") ===
                                  format(
                                    new Date(schedule.startAt),
                                    "yyyy-MM-dd"
                                  ) &&
                                user.id === schedule.userId && (
                                  <Box
                                    key={schedule.id}
                                    cursor="pointer"
                                    onClick={() => {
                                      openEditSchedule(schedule);
                                    }}
                                  >
                                    {format(new Date(schedule.startAt), "k:mm")}{" "}
                                    - {format(new Date(schedule.endAt), "k:mm")}
                                    {schedule.description}
                                  </Box>
                                )
                            )}
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  </Flex>
                ))}
                <NewScheduleModal
                  isOpen={isOpen}
                  onClose={onClose}
                  date={targetDate}
                  tasks={tasks}
                  targetUser={targetUser}
                  teamUser={teamUser}
                />
                <EditScheduleModal
                  isOpen={isModalOpen}
                  onClose={closeEditSchedule}
                  schedule={targetSchedule}
                  tasks={tasks}
                  teamUser={teamUser}
                />
              </>
            )}
          </>
          {isDailyCalendar && dailySchedules && (
            <>
              <PrimaryButton size="xs" color="pink" onClick={nextDay}>
                NextDay
              </PrimaryButton>
              <PrimaryButton size="xs" color="yellow" onClick={prevDay}>
                prevDay
              </PrimaryButton>
              <PrimaryButton size="xs" color="green" onClick={toToday}>
                today
              </PrimaryButton>
              {/* <InputGroup>
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
                <PrimaryButton onClick={ChangeDate2} color="cyan" size="md">
                  表示
                </PrimaryButton>
              </InputGroup> */}

              <PrimaryButton
                size="xs"
                color="green"
                onClick={() => openSchedule2(date)}
              >
                新規作成
              </PrimaryButton>
              {format(date, "yyyy-MM-dd")}
              <Flex
                width="100%"
                justifyContent="flex-start"
                marginLeft="20px"
                marginTop="20px"
              >
                <Box marginTop="50px" padding={0} marginRight="20px">
                  {times.map((hour, i) => (
                    <Box key={i} marginBottom="56px">
                      {hour}
                    </Box>
                  ))}
                </Box>
                <Flex>
                  {teamUser.map((user) => (
                    <Box key={user.id} marginRight="50px" position="relative">
                      <Box
                        onClick={() => openSchedule(date, user)}
                        cursor="pointer"
                      >
                        {user.name}
                      </Box>
                      <Box zIndex="-1" position="absolute">
                        {[...Array(11)].map((_, i) => (
                          <Box
                            height="40px"
                            width="100px"
                            borderTop="1px dashed"
                            borderBottom="1px solid"
                            marginBottom="40px"
                            boxSizing="border-box"
                            key={i}
                          ></Box>
                        ))}
                      </Box>
                      {dailySchedules.map(
                        (schedule) =>
                          user.id === schedule.userId && (
                            <Box
                              key={schedule.id}
                              backgroundColor={schedule.scheduleKind?.color}
                              position="absolute"
                              width="100px"
                              marginTop={`${
                                ((differenceInMinutes(
                                  new Date(schedule.startAt),
                                  startOfDay(new Date(schedule.startAt))
                                ) -
                                  480) *
                                  80) /
                                  60 +
                                40
                              }px`}
                              height={`${
                                (differenceInMinutes(
                                  new Date(schedule.endAt),
                                  new Date(schedule.startAt)
                                ) *
                                  80) /
                                60
                              }px`}
                              onClick={() => {
                                openEditSchedule(schedule);
                              }}
                            >
                              {schedule.description}
                            </Box>
                          )
                      )}
                    </Box>
                  ))}
                </Flex>
              </Flex>
              <NewScheduleModal
                isOpen={isOpen}
                onClose={onClose}
                date={targetDate}
                tasks={tasks}
                targetUser={targetUser}
                teamUser={teamUser}
              />
              <EditScheduleModal
                isOpen={isModalOpen}
                onClose={closeEditSchedule}
                schedule={targetSchedule}
                tasks={tasks}
                teamUser={teamUser}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
