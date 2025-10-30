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

interface UserInfo {
  name: string;
}

interface CustomerInfo {
  name: string;
}

export interface IProjects {
  _id?: string;
  userId: UserInfo;
  customerId?: CustomerInfo;
  name: string;
  isSystemCreated: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface IItem {
  _id?: string;
  label: string;
  shape: string;
  price: number;
  copies: number;
}

export interface IItemOnMap {
  _id?: string;
  itemId: string;
  mapId: string;
  userId: string;
  salePrice?: number;
  progress?: number;
  notes?: string;
  serial?: string;
  mac?: string;
  model?: string;
  location?: string;
  x: number;
  y: number;
}

export interface IMap {
  _id?: string;
  name: string;
  companyId: string;
  mapDesigner: string;
  assignedTo: string[];
  bgImageUrl: string;
  availableDevices: string[];
  isComplete: boolean;
  customerNotes?: string;
}

export interface ICompany {
  _id?: string;
  name: string;
  email?: string;
  website?: string;
  logo?: string;
  isDeleted: boolean;
}

export interface IDevice {
  _id?: string;
  label: string;
  shape: string;
  color: string;
  price: number;
  copies: number;
  createdAt?: string;
}
