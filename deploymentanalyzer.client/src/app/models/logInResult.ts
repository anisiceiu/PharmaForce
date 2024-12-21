import { User } from "./user";

export interface LogInResult {
  user: User;
  token: string;
}

export interface ClientLoginFirstStepResult{
  clientId: number;
  companyUserId: number;
  emailAddress: string;
  companyCode: string;
  oTP: string;
}
