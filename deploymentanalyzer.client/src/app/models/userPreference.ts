export interface UserPreference {
  id: number;
  userID: number;
  pageId: number;
  gridId: number;
  filterSettings: string;
  columnSettings: string;
  dataManagerFilter: string;
  columnSettingList: Array<string>;
}

export interface UserAnalyticFilters {
  id: number;
  userId: number;
  client_id: number;
  pageName: string;
  searchFilterName: string;
  reportId: number;
  filterSettings: string;
  createdDate: Date;
}
