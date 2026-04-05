import { IHistoryItem } from "./IHistoryItem";
import { IMarkAttendanceItem } from "./IMarkAttendanceItem";

export interface IMarkAttendanceItemWithHistory {
  personTrainings: IMarkAttendanceItem[];
  history: {
    [id: string]: IHistoryItem[]
  }
}