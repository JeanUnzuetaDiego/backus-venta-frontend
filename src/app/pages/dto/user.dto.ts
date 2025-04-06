export interface UserDto {
  user_id: string;
  password: string;
  deviceInfo:{
    userAgent: string,
    platform: string,
    forceSession: boolean
  }
}
