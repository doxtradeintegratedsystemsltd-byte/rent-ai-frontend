export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  levelOfEducation: string;
  createdById: string;
  currentLeaseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AddTenantToPropertyRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  levelOfEducation: string;
  startDate: string;
  propertyId: string;
  leaseCycles: number;
  paymentReceipt: string | null;
  paymentDate: string;
}

export interface AddTenantToPropertyResponse {
  tenant: Tenant;
  lease: {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    rentAmount: string;
    rentStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  payment?: {
    id: string;
    amount: string;
    paymentDate: string;
    paymentReceipt: string;
    leaseId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface EditTenantRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  levelOfEducation: string;
}

export interface EditTenantResponse {
  tenant: Tenant;
}
