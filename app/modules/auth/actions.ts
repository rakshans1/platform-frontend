import { EUserType } from "../../lib/api/users/interfaces";
import {IUserState} from "./interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  setUser: (user: IUserState) => createAction("AUTH_SET_USER", { user }),
  logout: (userType?: EUserType) => createAction("AUTH_LOGOUT", { userType }),
  verifyEmail: () => createSimpleAction("AUTH_VERIFY_EMAIL"),
};
