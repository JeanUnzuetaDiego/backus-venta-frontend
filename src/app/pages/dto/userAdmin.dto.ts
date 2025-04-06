export interface IUserAdminDto {
    user_id?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    userAgent?: string;
    platform?:string;
    activate?: boolean;
  }