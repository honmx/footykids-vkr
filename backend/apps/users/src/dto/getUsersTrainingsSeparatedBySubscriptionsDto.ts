import { IsArray, IsDate, IsNumber } from "class-validator";

export class GetUsersTrainingsSeparatedBySubscriptionsDto {
  @IsArray()
  usersId: number[]

  @IsNumber()
  amountOfTrainingsInSubscription: number;

  @IsDate()
  thresholdDate: Date;
}