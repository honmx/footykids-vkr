import { IsNumber, IsString } from "class-validator";

export class GetAttendanceAndHistoryDto {
  @IsNumber()
  id: number;
  
  @IsString()
  date: string;
}