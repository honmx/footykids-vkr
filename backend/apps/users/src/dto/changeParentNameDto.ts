import { IsNumber, IsString } from "class-validator";

export class ChangeParentNameDto {
  @IsNumber()
  id: number;

  @IsString()
  parentName: string;
}