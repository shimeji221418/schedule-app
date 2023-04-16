import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import {
  addDays,
  differenceInMinutes,
  format,
  startOfDay,
  subDays,
} from "date-fns";

import React, { Dispatch, FC, memo, SetStateAction, useCallback } from "react";
import { times } from "../atoms";
import PrimaryButton from "../atoms/PrimaryButton";
import EditScheduleModal from "../organisms/modal/EditScheduleModal";
import NewScheduleModal from "../organisms/modal/NewScheduleModal";
import { TeamType } from "@/types/api/team";
import { scheduleType } from "@/types/api/schedule";
import { GetUserType } from "@/types/api/user";
import { GetTaskType } from "@/types/api/schedule_kind";

type Props = {
  userIds: Array<number>;
  targetTeam: TeamType;
  dailySchedules: Array<scheduleType>;
  weeklySchedules: Array<scheduleType>;
  today: Date;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  selectUsers: Array<GetUserType>;
  tasks: Array<GetTaskType>;
};

const DailySchedule: FC<Props> = memo((props) => {
  const {
    userIds,
    targetTeam,
    dailySchedules,
    weeklySchedules,
    today,
    date,
    setDate,
    selectUsers,
    tasks,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { targetDate, targetUser, openSchedule, openSchedule2 } =
    useOpenSchedule({ onOpen });
  const { targetSchedule, isModalOpen, openEditSchedule, closeEditSchedule } =
    useOpenEditSchedule();

  const nextDay = useCallback(() => {
    setDate(addDays(date, 1));
  }, [targetTeam, date]);

  const prevDay = useCallback(() => {
    setDate(subDays(date, 1));
  }, [targetTeam, date]);

  const toToday = useCallback(() => {
    setDate(today);
  }, [targetTeam, date]);

  return (
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
        {userIds.length !== 0 && (
          <Box marginTop="50px" padding={0} marginRight="20px">
            {times.map((hour, i) => (
              <Box key={i} marginBottom="56px">
                {hour}
              </Box>
            ))}
          </Box>
        )}

        <Flex>
          {selectUsers.map((user) => (
            <Box key={user.id} marginRight="50px" position="relative">
              <Box onClick={() => openSchedule(date, user)} cursor="pointer">
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
                          60 -
                        1
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
        teamUser={selectUsers}
        weeklySchedules={weeklySchedules}
      />
      <EditScheduleModal
        isOpen={isModalOpen}
        onClose={closeEditSchedule}
        schedule={targetSchedule}
        tasks={tasks}
        teamUser={selectUsers}
        weeklySchedules={weeklySchedules}
      />
    </>
  );
});

export default DailySchedule;
