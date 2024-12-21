export interface keyUpdate{
    id: number,
    keyUpdate_Id: number,
    companyCountry_Id: number | null,
    company_Name: string | null,
    country_Name: string | null,
    country_Id: number | null,
    company_Id: number | null,
    therapeuticCategory_Id:number | null,
    note: string | null,
    description: string | null;
    period_Id: number | null;
    updateTag: string | null;
    period_Name: string | null;
}

export interface keyUpdateTag {
  tag_Id: number;
  tagName: string;
}
