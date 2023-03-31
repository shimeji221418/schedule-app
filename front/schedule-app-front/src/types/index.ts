export type NewUserType = {
  name: string;
  email: string;
  password: string;
  role: string;
  team_id: number;
};

export type LoginUserType = Pick<NewUserType, "email" | "password">;

export type StartTimeType = {
  startHour: string;
  startMinutes: string;
};

export type EndTimeType = {
  endHour: string;
  endMinutes: string;
};
