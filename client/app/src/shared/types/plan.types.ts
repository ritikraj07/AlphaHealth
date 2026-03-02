// types/plan.types.ts

export type PlanStatus = "planned" | "completed" | "missed";

export interface Plan {
  _id: string;
  employee: string;
  doctorChemist?: string;
  date?: string;
  productFocus?: string[];
  jointEmployees?: string[];
  status?: PlanStatus;
  remark?: string;
  createdAt?: string;
    updatedAt?: string;
    employeeModel?: string;
    isJointPlan?: boolean;
}

export interface PlanResponses{
    data: Plan[],
    count: number,
    success: boolean
}

export interface CreatePlanPayload {
  doctorChemist: string;
  date: string;
  productFocus?: string[];
  jointEmployees?: string[];
  remark?: string;
  employeeModel: string;
    isJointPlan?: boolean;
    
}

export interface UpdatePlanStatusPayload {
  id: string;
  status: PlanStatus;
}