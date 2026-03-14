import { Group } from "apps/groups/src/models/group.model";
import { IsArray, IsNumber, IsObject, IsString } from "class-validator";

export class GetCurrentSubscriptionTrainingsHistoryDto {
  @IsObject()
  group: Group;

  @IsString()
  date: string;
}