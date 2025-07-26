export interface IRole {
  ADMIN: "ADMIN";
  ASSISTANT: "ASSISTANT";
  SALES_TECHNICIAN: "SALES_TECHNICIAN";
  SALES_SPECIALIST: "SALES_SPECIALIST";
  PROJECT_DESIGNER: "PROJECT_DESIGNER";
  COLLABORATOR: "COLLABORATOR";
  INSTALLER: "INSTALLER";
  TECHNICIAN: "TECHNICIAN";
  CUSTOMER: "CUSTOMER";
}

// Types

export type Role =
  | "ADMIN"
  | "ASSISTANT"
  | "SALES_TECHNICIAN"
  | "SALES_SPECIALIST"
  | "PROJECT_DESIGNER"
  | "COLLABORATOR"
  | "INSTALLER"
  | "TECHNICIAN"
  | "CUSTOMER";
export interface Employee {
  _id: string;
  name: string;
  email: string;
  password: string;
  picture?: string;
  isDeleted?: boolean;
  role: Role;
  companyId?: string;
  createdAt: string;
}
