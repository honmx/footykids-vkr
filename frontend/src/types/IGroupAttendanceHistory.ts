import { AttendanceType } from "./AttendanceType";
import { IChild } from "./IChild";

interface IGroupParticipantHistoryItem {
  id: number;
  attendance: AttendanceType;
  isAccountable: boolean;
  training: {
    id: number;
    date: string;
  }
}

export interface IGroupAttendanceHistory {
  dates: string[];
  participants: Pick<IChild, "id" | "name" | "trainingsLeft">[];
  history: {
    [userId in string]: (IGroupParticipantHistoryItem | null)[][];
  }
}