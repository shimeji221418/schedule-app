import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { scheduleType } from "@/types/api/schedule";
import { GetTaskType } from "@/types/api/schedule_kind";
import { TeamType } from "@/types/api/team";
import { GetUserType } from "@/types/api/user";
import { Box, Flex, Stack, Text, useDisclosure } from "@chakra-ui/react";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
} from "date-fns";
import { ja } from "date-fns/locale";
import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import EditScheduleModal from "../organisms/modal/EditScheduleModal";
import NewScheduleModal from "../organisms/modal/NewScheduleModal";

type Props = {
  mode: "team" | "custom";
  targetTeam: TeamType;
  teamSchedules: Array<scheduleType>;
  today: Date;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  allUser: Array<GetUserType>;
  userIds: Array<number>;
  tasks: Array<GetTaskType>;
};

const WeeklySchedule: FC<Props> = (props) => {
  const {
    mode,
    targetTeam,
    teamSchedules,
    today,
    date,
    setDate,
    allUser,
    tasks,
    userIds,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nextWeek = useCallback(() => {
    setDate(addDays(date, 7));
  }, [targetTeam, date]);

  const prevWeek = useCallback(() => {
    setDate(subDays(date, 7));
  }, [targetTeam, date]);

  const thisWeek = useCallback(() => {
    setDate(today);
  }, [targetTeam, date]);

  const dates = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  const teamUser = () =>
    mode === "team"
      ? allUser.filter((user) => user.teamId === targetTeam.id)
      : allUser.filter((user) => userIds.includes(user.id));
  const { targetDate, targetUser, openSchedule } = useOpenSchedule({ onOpen });
  const { targetSchedule, isModalOpen, openEditSchedule, closeEditSchedule } =
    useOpenEditSchedule();
  return (
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
      {console.log(mode)}

      {teamUser().map((user) => (
        <Flex key={user.id} width="100%" mb={3}>
          <Box display="grid" placeItems="center" width="100px">
            {user.name}
          </Box>
          <Flex width="100%" mr={2}>
            {dates.map((day, i) => (
              <Box
                key={i}
                border="1px solid"
                width={{ base: "100px", md: "100%" }}
              >
                <Box
                  textAlign="center"
                  borderTop="solid 1px"
                  borderBottom="dashed 1px"
                  onClick={() => openSchedule(day, user)}
                  cursor="pointer"
                >
                  <Box textAlign="center">
                    {format(day, "E", { locale: ja })}
                  </Box>
                  {format(day, "M/d")}
                </Box>

                {teamSchedules.map(
                  (schedule) =>
                    format(day, "yyyy-MM-dd") ===
                      format(new Date(schedule.startAt), "yyyy-MM-dd") &&
                    user.id === schedule.userId && (
                      <Box
                        key={schedule.id}
                        borderBottom="1px solid"
                        cursor="pointer"
                        onClick={() => {
                          openEditSchedule(schedule);
                        }}
                        bg={schedule.scheduleKind?.color}
                      >
                        <Text textAlign="center">
                          {format(new Date(schedule.startAt), "k:mm")} -
                          {format(new Date(schedule.endAt), "k:mm")}
                        </Text>
                        <Text textAlign="center">{schedule.description}</Text>
                      </Box>
                    )
                )}
              </Box>
            ))}
          </Flex>
        </Flex>
      ))}

      {/* {teamUser.map((user) => (
        <Flex key={user.id}>
          <Box key={user.id} border="1px" marginBottom={1}>
            <Flex>
              <>{user.name}</>
              {dates.map((day, i) => (
                <Box key={i}>
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
                        format(new Date(schedule.startAt), "yyyy-MM-dd") &&
                      user.id === schedule.userId && (
                        <Box
                          key={schedule.id}
                          cursor="pointer"
                          onClick={() => {
                            openEditSchedule(schedule);
                          }}
                        >
                          {format(new Date(schedule.startAt), "k:mm")} -{" "}
                          {format(new Date(schedule.endAt), "k:mm")}
                          {schedule.description}
                        </Box>
                      )
                  )}
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      ))} */}
      <NewScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        date={targetDate}
        tasks={tasks}
        targetUser={targetUser}
        teamUser={teamUser()}
      />
      <EditScheduleModal
        isOpen={isModalOpen}
        onClose={closeEditSchedule}
        schedule={targetSchedule}
        tasks={tasks}
        teamUser={teamUser()}
      />
    </>
  );
};

export default WeeklySchedule;
