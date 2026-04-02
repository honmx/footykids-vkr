import { months } from "@/data/months"

export const getShortenMonthName = (monthIndex: number) => {
  return months.find(month => month.monthIndex === monthIndex)?.value.slice(0, 3);
}