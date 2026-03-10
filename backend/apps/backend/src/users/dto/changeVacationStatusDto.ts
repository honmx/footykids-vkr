import { IsBoolean } from "class-validator";

export class ChangeVacationStatusDto {
  @IsBoolean()
  status: boolean;
}