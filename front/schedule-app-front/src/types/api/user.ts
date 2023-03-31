export type GetUserType = {
  id: number;
  name: string;
  email: string;
  uid: string;
  role: string;
  teamId: number;
  team?: {
    id: number;
    name: string;
  };
};

export type LoginUserType = GetUserType | null;
