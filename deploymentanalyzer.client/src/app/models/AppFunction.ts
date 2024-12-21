export interface AppFunction {
  adminFunctionId: number;
  functionName: string;
  parentMenu: string;
}

export interface UserPermissionModel {
  canExportExcel: boolean;
  canAccessReport: boolean;
  canSaveSearch: boolean;
}
