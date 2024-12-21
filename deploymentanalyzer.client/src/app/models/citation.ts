export interface citation {
    id: number;
    daDatabase_Salesforce_Id: string;
    daDatabase_Product_Id: string;
    column_name: string;
    url: string;
    type: string;
    description: string;
    added_by: number;  // Assuming added_by is an integer based on the provided class
    added_dt: Date;
    interview_date?: Date | null;  // Nullable Date for interview_date
    source_function: string;
    source_type: string;
    company_overview: string;
    comments: string;
    analyst_comments: string;
    added_by_name:string;
}


export interface smallCitation {
  id: number;
  analyst_comments: string;
  added_by_name: string;
  description: string;
}
