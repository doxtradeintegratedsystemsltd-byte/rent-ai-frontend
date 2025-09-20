export interface CreateNotificationRequest {
  leaseId: string;
  notificationTitle: string;
  notificationContent: string;
}

export interface CreateNotificationResponse {
  statusCode: number;
  status: string;
  message: string;
  data: null;
}

export interface Property {
  id: string;
  propertyName: string;
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  createdById: string;
  rentAmount: string;
  leaseYears: number;
  currentLeaseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  location: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface Lease {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  leaseStatus: string;
  leaseYears: number;
  leaseCycles: number;
  rentAmount: number;
  rentStatus: string;
  createdById: string;
  paymentId: string;
  nextLeaseId: string | null;
  previousLeaseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

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

export interface NotificationItem {
  id: string;
  userType: string;
  notificationType: string;
  notificationChannel: string;
  status: string;
  seen: boolean;
  data: any;
  adminId: string | null;
  userId: string | null;
  propertyId: string;
  leaseId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  admin: any;
  property: Property;
  lease: Lease;
  tenant: Tenant;
}

export interface NotificationsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    totalItems: number;
    data: NotificationItem[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

export interface MarkNotificationAsReadResponse {
  statusCode: number;
  status: string;
  message: string;
  data: NotificationItem;
}
