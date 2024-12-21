export interface Brand {
  id: number;
  usName: string;
  chemicalproductid: number;
}

export interface MyBrand {
  id: number;
  name: string;
  userId: number;
  brands: string;
  isChemicalGroup: boolean;
}
