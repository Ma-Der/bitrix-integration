export type BitrixResponse<T> = {
  message: string;
  data: T;
};

export type BitrixAuthorization = {
  access_token: string;
  expires: number;
  expires_in: number;
  scope: string;
  domain: string;
  server_endpoint: string;
  status: string;
  client_endpoint: string;
  member_id: string;
  user_id: number;
  refresh_token: string;
};

export type BitrixGetUser = {
  ACTIVE: boolean;
  DATE_REGISTER: string;
  EMAIL: string;
  ID: string;
  IS_ONLINE: string;
  LAST_ACTIVITY_DATE: {};
  LAST_LOGIN: string;
  LAST_NAME: string;
  NAME: string;
  PERSONAL_BIRTHDAY: string;
  PERSONAL_GENDER: string;
  TIMESTAMP_X: {};
  TIME_ZONE_OFFSET: string;
  UF_DEPARTMENT: number[];
  UF_EMPLOYMENT_DATE: string;
  USER_TYPE: string;
  WORK_POSITION: string;
  XML_ID: string;
};
