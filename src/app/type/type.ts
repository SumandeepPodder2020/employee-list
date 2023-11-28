export type UserType  = {
    slNo: number;
    name: string;
    jobTitle: string;
    age: Number;
    startDate: string;
    endDate: string;
}

export type FilterOperationType =  {
    key: string;
    value: string | Number;
  }