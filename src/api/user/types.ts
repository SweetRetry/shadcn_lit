export enum ExIdentityStatus {
  // 未填写
  Draft = 0,
  // 成功
  Success = 1,
  // 拒绝
  Rejected = 2,
  // 审核中
  Pending = 3,
  // 待更新
  ToBeUpdated = 4,
  // 更新提交
  Updating = 5,
  //更新驳回
  UpdateRejected,
  // 过期
  Expired,
}

export interface ExUserInfoModel {
  uuid: string;
  identity: {
    user: {
      status: ExIdentityStatus;
      message: string;
      statusTip: string;
    };
    investor: {
      status: number;
      type: number;
    };
    aml: boolean;
    qualify: boolean;
    hasAml: boolean;
    hasQualify: boolean;
  };
  sex: "MALE" | "FEMALE";
  address: string;
  postcode: string;
  fullName: string;
  firstName: string;
  lastName: string;
  cnFirstName: string;
  cnLastName: string;
  isSetSecurityPassword: boolean;
  email: string;
  mobile: string;
  createTime: string;
  status: number;
  mobileCountry: string;
  mobileCode: string;
  nowCountry: string;
  NowCountryName: string;
  countryName: string;
  country: string;
  province: string;
  birthday: string;
  city: string;
  idCard: string;
  backImg: string;
  otherImg: string;
  idCardExpiryDate: string;
}
