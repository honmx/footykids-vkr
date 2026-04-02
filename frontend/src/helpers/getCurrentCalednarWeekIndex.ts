export const getCurrentCalednarWeekIndex = (currentCalendarDates: Date[], currentDate: Date) => {

  for (let i = 0; i < currentCalendarDates.length; i++) {
    if (currentCalendarDates[i].getDate() === currentDate.getDate()) {
      return Math.floor(i / 7);
    }
  }

  return 1000;
}