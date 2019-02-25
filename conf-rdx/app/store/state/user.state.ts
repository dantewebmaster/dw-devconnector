import { IUser } from '../../models/user.interface';

export interface IUserState {
  users: IUser[];
}

export const initialUserState: IUserState = {
  users: [
    {
      id: 1,
      name: "Dante",
    },
    {
      id: 2,
      name: "Ivone",
    },
    {
      id: 3,
      name: "Ju",
    },
    {
      id: 4,
      name: "Diego",
    },
  ],
}
