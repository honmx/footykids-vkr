import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CreateUserDto } from './dto/createUserDto';
import { GetUserByEmailDto } from './dto/getUserByEmailDto';
import { GetUserByIdDto } from './dto/getUserByIdDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { CreateCoachDto } from './dto/createCoachDto';
import { GetUsersByIdDto } from './dto/getUsersByIdDto';
import { UploadMedicalDocumentPhotoDto } from './dto/uploadMedicalDocumentPhotoDto';
import { SetMedicalDocumentExpirationDto } from './dto/setMedicalDocumentExpirationDto';
import { UploadInsurancePhotoDto } from './dto/uploadInsurancePhotoDto';
import { SetInsuranceExpirationDto } from './dto/setInsuranceExpirationDto';
import { GetUsersByGroupIdDto } from './dto/getUsersByGroupIdDto';
import { RemoveGroupDto } from './dto/removeGroupDto';
import { ChangeGroupDto } from './dto/changeGroupDto';
import { ChangeRoleDto } from './dto/changeRoleDto';
import { MarkAttendanceDto } from './dto/markAttendanceDto';
import { GetUsersAbleToHaveGroupDto } from './dto/getUsersAbleToHaveGroupDto';
import { GetUsersLazyDto } from './dto/getUsersLazyDto';
import { GetUsersAbleToHaveGroupLazyDto } from './dto/getUsersAbleToHaveGroupLazyDto';
import { ClearHistoryOnGroupDeleteDto } from './dto/clearHistoryOnGroupDeleteDto';
import { UploadAvatarDto } from './dto/uploadAvatarDto';
import { ChangeTrainingsLeftDto } from './dto/changeTrainingsLeftDto';
import { GetUserTrainingsHistoryLazyDto } from './dto/getUserTrainingsHistoryLazyDto';
import { ChangeVacationStatusDto } from './dto/changeVacationStatusDto';
import { GetCurrentSubscriptionTrainingsHistoryDto } from './dto/getCurrentSubscriptionTrainingsHistoryDto';
import { GetUsersTrainingsSeparatedBySubscriptionsDto } from './dto/getUsersTrainingsSeparatedBySubscriptionsDto';
import { ChangeNameDto } from './dto/changeNameDto';
import { ChangeParentNameDto } from './dto/changeParentNameDto';
// import { createRoleDto } from 'apps/backend/src/users/dto/createRoleDto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService
  ) { }

  @MessagePattern("get-users")
  getUsers(@Ctx() context: RmqContext) {
    const response = this.usersService.getUsers();
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-lazy")
  getUsersLazy(@Payload() dto: GetUsersLazyDto, @Ctx() context: RmqContext) {
    const response = this.usersService.getUsersLazy(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-able-to-have-group-lazy")
  getUsersAbleToHaveGroupLazyDto(@Payload() dto: GetUsersAbleToHaveGroupLazyDto, @Ctx() context: RmqContext) {
    const response = this.usersService.getUsersAbleToHaveGroupLazy(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-without-group")
  getUsersWithoutGroup(@Ctx() context: RmqContext) {
    const response = this.usersService.getUsersWithoutGroup();
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-able-to-have-group")
  getUsersAbleToHaveGroup(@Payload() dto: GetUsersAbleToHaveGroupDto, @Ctx() context: RmqContext) {
    const response = this.usersService.getUsersAbleToHaveGroup(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("create-user")
  async createUser(@Payload() dto: CreateUserDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.createUser(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("remove-group")
  async removeGroup(@Payload() dto: RemoveGroupDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.removeGroup(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-group")
  async changeGroup(@Payload() dto: ChangeGroupDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changeGroup(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("create-coach")
  async createCoach(@Payload() dto: CreateCoachDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.createCoach(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-user-by-email")
  async getUserByEmail(@Payload() dto: GetUserByEmailDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getUserByEmail(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-user-by-id")
  async getUserById(@Payload() dto: GetUserByIdDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getUserById(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-user-trainings-history-lazy")
  async getUserTrainingsHistoryLazy(@Payload() dto: GetUserTrainingsHistoryLazyDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getUserTrainingsHistoryLazy(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-by-id")
  async getUsersById(@Payload() dto: GetUsersByIdDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getUsersById(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-by-group-id")
  async getUsersByGroupId(@Payload() dto: GetUsersByGroupIdDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getUsersByGroupId(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-user-password")
  async changeUserPassword(@Payload() dto: ChangePasswordDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changePassword(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-role")
  async changeRole(@Payload() dto: ChangeRoleDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changeRole(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("delete-role")
  async deleteRole(@Payload() dto: ChangeRoleDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.deleteRole(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-current-subscription-trainings-history")
  async getCurrentSubscriptionTrainingsHistory(@Payload() dto: GetCurrentSubscriptionTrainingsHistoryDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getCurrentSubscriptionTrainingsHistory(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("mark-attendance")
  async markAttendance(@Payload() dto: MarkAttendanceDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.markAttendance(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("clear-history-on-group-delete")
  async clearHistoryOnGroupDelete(@Payload() dto: ClearHistoryOnGroupDeleteDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.clearHistoryOnGroupDelete(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-trainings-left")
  async changeTrainingsLeft(@Payload() dto: ChangeTrainingsLeftDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changeTrainingsLeft(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-name")
  async changeName(@Payload() dto: ChangeNameDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changeName(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-parent-name")
  async changeParentName(@Payload() dto: ChangeParentNameDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changeParentName(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("change-vacation-status")
  async changeVacationStatus(@Payload() dto: ChangeVacationStatusDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.changeVacationStaus(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("upload-avatar")
  async uploadAvatar(@Payload() dto: UploadAvatarDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.uploadAvatar(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("upload-medical-document-photo")
  async uploadMedicalDocumentPhoto(@Payload() dto: UploadMedicalDocumentPhotoDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.uploadMedicalDocumentPhoto(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("set-medical-document-expiration")
  async setMedicalDocumentExpiration(@Payload() dto: SetMedicalDocumentExpirationDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.setMedicalDocumentExpiration(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("upload-insurance-photo")
  async uploadInsurancePhoto(@Payload() dto: UploadInsurancePhotoDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.uploadInsurancePhoto(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("set-insurance-expiration")
  async setInsuranceExpiration(@Payload() dto: SetInsuranceExpirationDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.setInsuranceExpiration(dto);
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-coach-roles")
  async getCoachRoles(@Ctx() context: RmqContext) {
    const response = await this.usersService.getCoachRoles();
    this.rmqService.ack(context);
    return response;
  }

  @MessagePattern("get-users-trainings-separated-by-subscriptions")
  async getUsersTrainingsSeparatedBySubscriptions(@Payload() dto: GetUsersTrainingsSeparatedBySubscriptionsDto, @Ctx() context: RmqContext) {
    const response = await this.usersService.getUsersTrainingsSeparatedBySubscriptions(dto);
    this.rmqService.ack(context);
    return response;
  }

  // @MessagePattern("create-role")
  // createRoles(@Payload() dto: createRoleDto, @Ctx() context: RmqContext) {
  //   const response = this.usersService.createRole(dto);
  //   this.rmqService.ack(context);
  //   return response;
  // }
}
