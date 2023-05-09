export interface LoginPayloadInterface {
  email: string;
  password: string;
}

export interface LoginResponseInterface {
  _id: string;
  user_id: number;
  user_name: string;
  email: string;
  avatar: string;
  permission: number;
  accessToken: string;
  permission_rules: PermissionRulesInterface;
}

export interface PermissionRulesInterface {
  _id: string;
  permission_id: number;
  permission_name: string;
}
