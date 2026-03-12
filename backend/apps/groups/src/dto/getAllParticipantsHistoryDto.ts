import { IsNumber } from "class-validator";

export class GetAllParticipantsHistoryDto {
  @IsNumber()
  id: number;

  @IsNumber()
  monthPeriod: number;
}