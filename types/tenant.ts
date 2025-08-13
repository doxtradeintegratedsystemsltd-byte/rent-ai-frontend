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
