export interface IVisit {
  _id: string;
  employee: string;
  plan?: string;
  doctorChemist: string;
  date: string;
  jointEmployees: string[];
  remark?: string;
  isOrderReceived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitPayload {
  plan?: string;
  doctorChemist: string;
  jointEmployees?: string[];
  remark?: string;
  isOrderReceived?: boolean;
  employee?: string;
}

export interface VisitsResponse {
  success: boolean;
  count: number;
  data: IVisit[];
}