import { IsString } from "class-validator";

export class ChangeParentNameDto {
  @IsString()
  parentName: string;
}