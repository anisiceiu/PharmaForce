import { ProductFTEsByTCAndSalesForceUsingBrandNameChartData } from "./AnalyticsDataModels";

export interface ChartOneDataset {
  countrylabels: string[];
  PCFTEvalues: number[];
  SPFTEvalues: number[];
  countrylabelsRepeated: string[];
  companyNames: string[];
}

export interface ChartTwoDataset {
  TClabels: string[];
  PCFTEvalues: number[];
  SPFTEvalues: number[];
  countrylabels: string[];
  companylabelsRepeated: string[];
}

export interface ChartThreeDataset {
  TClabels: string[];
  PCFTEvalues: number[];
  SPFTEvalues: number[];
  countrylabels: string[];
  companylabelsRepeated: string[];
}

export interface ChartSevenDataset {
  salesforcelabels: string[];
  reachValues: number[];
  frequencyValues: number[];
}

export interface ChartSixDataset {
  companySalesforceProductComposedLabels: string[];
  bonusValues: number[];
  highSalaryValues: number[];
  lowSalaryValues: number[];
}

export interface ChartFourDataset {
  uniqlabels: string[];
  globalDataSet: any;
}

export interface ChartFiveDataset {
  uniqlabels: string[];
  globalDataSet: any;
}
