import { IsEmail, IsString, Matches } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  childName: string;

  @IsString()
  parentName: string;

  @IsString()
  @Matches(/^\d\d.\d\d.\d\d\d\d$/)
  dateOfBirth: string;
  
  @IsString()
  phone: string;
  
  @IsString()
  branch: "Автозавод" | "Машгородок";
}