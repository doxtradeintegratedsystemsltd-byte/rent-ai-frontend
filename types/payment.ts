export interface NewPaymentRequest {
  leaseId: string;
  leaseCycles: number;
  paymentReceipt: string;
  paymentDate: string;
}

export interface NewPaymentResponse {
  statusCode: number;
  status: string;
  message: string;
  data: null;
}

export interface PaymentFetchParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface Payment {
  id: string;
  type: "manual" | "automated";
  amount: number;
  reference: string | null;
  status: "completed" | "pending" | "failed";
  receiptUrl: string | null;
  leaseId: string;
  createdById: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: "admin" | "tenant" | "superAdmin";
    photoUrl: string | null;
    phoneNumber: string | null;
    tenantId: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  lease: {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    leaseStatus: "active" | "in-active" | "expired";
    leaseYears: number;
    leaseCycles: number;
    rentAmount: number;
    rentStatus: "paid" | "unpaid" | "overdue";
    createdById: string;
    paymentId: string;
    nextLeaseId: string | null;
    previousLeaseId: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    property: {
      id: string;
      propertyName: string;
      propertyState: string;
      propertyArea: string;
      propertyAddress: string;
      propertyImage: string;
      createdById: string;
      rentAmount: string;
      leaseYears: number;
      currentLeaseId: string | null;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
    tenant: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      levelOfEducation: string;
      createdById: string;
      currentLeaseId: string | null;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
  };
}

export interface PaymentsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    totalItems: number;
    data: Payment[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

// Initiate (automated) payment - returns a checkout URL (e.g., Paystack link)
export interface InitiatePaymentRequest {
  leaseId: string;
  leaseCycles: number; // number of cycles (months) tenant wants to pay for now
}

export interface InitiatePaymentResponse {
  statusCode: number;
  status: string; // "success" | "error" (kept broad to mirror backend contract)
  message: string; // e.g. "Create Success"
  data: string; // checkout URL returned by the backend
}

// Payment status lookup by reference
export interface PaymentReferenceStatusResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    id: string;
    reference: string;
    status: "completed" | "pending" | "failed";
  } & Record<string, any>; // allow extra backend fields without strict typing
}
