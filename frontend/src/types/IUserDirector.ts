import { ICommonUserProps } from "./ICommonUserProps";
import { IRole } from "./IRole";

export interface IUserDirector extends ICommonUserProps {
  type: "coach";
  role: IRole<"GENERAL_SUPER_ADMIN"> | null;
}