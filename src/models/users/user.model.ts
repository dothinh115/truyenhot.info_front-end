export interface UserSuggesionInterface {
  _id: string;
  user_id: string;
}

export interface UserProfileInterface {
  email: string;
  gender: "male" | "female";
  activated: boolean;
  user_id: string;
  _id: string;
  permission_rules: PermissionRulesInterface;
  permission: number;
}

interface PermissionRulesInterface {
  _id: string;
  permission_id: number;
  permission_name: string;
}
