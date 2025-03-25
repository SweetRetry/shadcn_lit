export interface PostUserLoginParams {
  email: string;
  password: string;
}

export interface PostResetPwdParams {
  email: string;
  password: string;
  confirm: string;
}

export interface PostUserRegisterParams {
  email: string;
  password: string;
  confirm: string;
  submit: boolean;

}
