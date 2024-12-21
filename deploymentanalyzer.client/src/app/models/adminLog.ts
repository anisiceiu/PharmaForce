export interface AdminLog {
  adminLogId: number;
  logInTime: Date;
  logOutTime: Date;
  category: string;
  item: string;
  notes: string;
  userID: number;
  reviewed: boolean;
  lastUpdated: Date;
  userFullName: string;
  userName: string;
  email: string;
}
