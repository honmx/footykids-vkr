import { IsEmail, IsNumber, IsString } from "class-validator";

export class GetUserTrainingsHistoryLazyDto {
  @IsNumber()
  id: number;
  
  offset: number;
}