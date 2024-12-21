export interface UserClient {
  clientID: number;
  userID: number;
  status: number;
  emailID: string;
  clientStatus: string;
  activationCode: string;
  dateCreated: Date;
  lastLogin: Date;
  verificationDate: Date;
  lockTime: Date;
  isActive: boolean;
  unsubscribe: Boolean;
  isLocked: boolean;
  waiveActivation: boolean;
  otp: string;
}
