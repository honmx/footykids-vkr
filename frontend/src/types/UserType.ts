import { IChild } from "./IChild";
import { IUserCoach } from "./IUserCoach";
import { IUserDirector } from "./IUserDirector";
import { IUserGeneralCoach } from "./IUserGeneralCoach";

export type UserType = IChild | IUserCoach | IUserGeneralCoach | IUserDirector;