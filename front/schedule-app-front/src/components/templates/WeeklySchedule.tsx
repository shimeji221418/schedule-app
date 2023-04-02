import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { scheduleType } from "@/types/api/schedule";
import { GetTaskType } from "@/types/api/schedule_kind";
import { TeamType } from "@/types/api/team";
import { GetUserType } from "@/types/api/user";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
} from "date-fns";
import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import EditScheduleModal from "../organisms/EditScheduleModal";
import NewScheduleModal from "../organisms/NewScheduleModal";

type Props = {
  targetTeam: TeamType;
  teamSchedules: Array<scheduleType>;
  today: Date;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  teamUser: Array<GetUserType>;
  tasks: Array<GetTaskType>;
};

const WeeklySchedule: FC<Props> = (props) => {
  const { targetTeam, teamSchedules, today, date, setDate, teamUser, tasks } =
    props;
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
  );
};

export default WeeklySchedule;
