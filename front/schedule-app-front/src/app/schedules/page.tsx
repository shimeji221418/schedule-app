"use client";
import { app } from "../../../firebase";
import { getAuth } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { Alert, Box, Flex, InputGroup, useDisclosure } from "@chakra-ui/react";
import ja from "date-fns/locale/ja";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { times } from "@/components/atoms";
import { scheduleType } from "@/types/api/schedule";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import InputForm from "@/components/atoms/InputForm";
import NewScheduleModal from "@/components/organisms/NewScheduleModal";
import { GetTaskType } from "@/types/api/schedule_kind";
import { GetUserType, LoginUserType } from "@/types/api/user";
import { Console } from "console";
import EditScheduleModal from "@/components/organisms/EditScheduleModal";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";
import ScheduleKinds from "@/components/molecules/ScheduleKinds";

const MySchedule = () => {
  const auth = getAuth(app);
  const { loginUser, loading, setLoading } = useAuthContext();
  const { getTeamUsers, teamUser } = useGetTeamUsers();
  const [tasks, setTasks] = useState<Array<GetTaskType>>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const today: Date = new Date();
  const [date, setDate] = useState<Date>(today);
  const [mySchedules, setMySchedules] = useState<Array<scheduleType>>([]);
  const dates = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });
  const [targetDate, setTargetDate] = useState<string>("");
  const [targetUser, setTargetUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });
  const [targetSchedule, setTargetSchedule] = useState<scheduleType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextWeek = useCallback(async () => {
    try {
      if (loginUser) {
        const day = addDays(date, 7);
        const nextDate = format(startOfWeek(day), "yyyy-MM-dd");
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id, date: nextDate };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/schedules/my_schedules",
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        setMySchedules(res.data);
        setDate(addDays(date, 7));
      }
    } catch (e: any) {
      console.log(e);
    }
  }, [mySchedules, date]);

  const prevWeek = useCallback(async () => {
    try {
      if (loginUser) {
        const day = subDays(date, 7);
        const prevDate = format(startOfWeek(day), "yyyy-MM-dd");
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id, date: prevDate };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/schedules/my_schedules",
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        setMySchedules(res.data);
        setDate(subDays(date, 7));
      }
    } catch (e: any) {
      console.log(e);
    }
  }, [mySchedules, date]);

  const changeDate = useCallback(async () => {
    try {
      if (loginUser) {
        const selectDate = format(startOfWeek(date), "yyyy-MM-dd");
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id, date: selectDate };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/schedules/my_schedules",
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        setMySchedules(res.data);
      }
    } catch (e: any) {
      console.log(e);
    }
  }, [mySchedules, date]);

  const openSchedule = (day: Date) => {
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
  useEffect(() => {
    const getMySchedule = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = { user_id: loginUser.id, date: date };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: "/schedules/my_schedules",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          setMySchedules(res.data);
          setTargetUser(loginUser);
          console.log(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    };

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
    getMySchedule();
    if (loginUser) {
      getTeamUsers({ team_id: loginUser?.teamId });
    }
  }, []);

  return (
    <>
      {!loading && (
        <>
          <ScheduleKinds tasks={tasks} />
          <Flex justifyContent="center" textAlign="center">
            <Box marginRight="400px">
              <PrimaryButton size="md" color="cyan" onClick={prevWeek}>
                ＜先週
              </PrimaryButton>
              <PrimaryButton size="md" color="cyan" onClick={nextWeek}>
                来週＞
              </PrimaryButton>
            </Box>
            <InputGroup width="280px">
              <InputForm
                type="date"
                name="date"
                title="date"
                value={format(date, "yyyy-MM-dd")}
                handleChange={(e) => {
                  setDate(new Date(e.target.value));
                }}
                width="auto"
                message="日付を入力してください"
              />

              <PrimaryButton onClick={changeDate} color="cyan" size="md">
                表示
              </PrimaryButton>
            </InputGroup>
          </Flex>

          <Box textAlign="center" fontSize="2xl">
            {loginUser?.name}
          </Box>

          <Flex justifyContent="center" position="relative" width="100%">
            <Box marginTop="114px">
              {times.map((time, i) => (
                <Box key={i} marginBottom="56px" marginRight="20px">
                  {time}
                </Box>
              ))}
            </Box>
            <Flex justifyContent="center" textAlign="center">
              {dates.map((day, i) => (
                <Box key={i} textAlign="center" width="100px">
                  <Box>{format(day, "E", { locale: ja })}</Box>
                  <Box>{format(day, "MM/dd")}</Box>
                  <Box position="absolute">
                    {[...Array(11)].map((_, i) => (
                      <Box
                        as="div"
                        height="80px"
                        width="100px"
                        borderRight="1px solid"
                        borderBottom="1px dashed"
                        boxSizing="border-box"
                        key={i}
                        backgroundColor="white"
                        zIndex="-1"
                        cursor="pointer"
                        onClick={() => {
                          openSchedule(day);
                        }}
                      ></Box>
                    ))}
                  </Box>
                  <Box>
                    {mySchedules.map(
                      (schedule) =>
                        format(day, "yyyy-MM-dd") ===
                          format(new Date(schedule.startAt), "yyyy-MM-dd") && (
                          <Box
                            onClick={() => {
                              openEditSchedule(schedule);
                            }}
                            cursor="pointer"
                            key={schedule.id}
                            position="absolute"
                            backgroundColor={schedule.scheduleKind?.color}
                            width="99px"
                            marginTop={`${
                              ((differenceInMinutes(
                                new Date(schedule.startAt),
                                startOfDay(new Date(schedule.startAt))
                              ) -
                                480) *
                                80) /
                                60 +
                              80
                            }px`}
                            height={`${
                              (differenceInMinutes(
                                new Date(schedule.endAt),
                                new Date(schedule.startAt)
                              ) *
                                80) /
                                60 -
                              1
                            }px`}
                            boxShadow="md"
                          >
                            {schedule.description}
                          </Box>
                        )
                    )}
                  </Box>
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
          />
          <EditScheduleModal
            isOpen={isModalOpen}
            onClose={closeEditSchedule}
            tasks={tasks}
            schedule={targetSchedule}
            teamUser={teamUser}
          />
        </>
      )}
    </>
  );
};

export default MySchedule;
