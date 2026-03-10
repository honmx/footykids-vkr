import { IsNumber, IsString } from "class-validator";

export class ChangeNameDto {
  @IsString()
  name: string;
}