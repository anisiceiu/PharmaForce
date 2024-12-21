export interface UserRight {
  id: number;
  userID: number;
  reportAccess: boolean;
  countries: string;
  companies: string;
  therapeuticCategories: string;
  searches: string;
  linkedAccounts: string;
  periods: string;
  currentPeriodAccess: boolean;
  saveSearchAccess: boolean;
  excelDownloadRights: boolean;
  pDFDownloadRights: boolean;
  printDataRights: boolean;
  dataVisualRights: boolean;
}
