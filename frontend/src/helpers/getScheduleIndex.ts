import { ISchedule } from "@/types/ISchedule";

export const getScheduleIndex = (date: Date, schedule: ISchedule[]) => {
  return schedule.findIndex(scheduleItem => scheduleItem.date === date.toLocaleDateString().slice(3));
}