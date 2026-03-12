import { IsNumber, IsString } from "class-validator";

export class ChangeNameDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}