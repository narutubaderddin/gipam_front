export interface User {
  id: string;
  username: string;
  email: string;
  activated?: boolean;
  roles?: string[];
}
