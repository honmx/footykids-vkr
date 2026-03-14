import { IsBoolean, IsNumber } from "class-validator";

export class ChangeVacationStatusDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  status: boolean;
}