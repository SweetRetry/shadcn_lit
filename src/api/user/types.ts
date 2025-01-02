export interface PostUserLoginParams {
  email: string;
  password: string;
}

export interface PostResetPwdParams {
  email: string;
  password: string;
  confirm: string;
}
