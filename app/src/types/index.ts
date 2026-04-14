// User Roles
export const UserRole = {
  CITIZEN: "citizen" as const,
  ADMIN: "admin" as const,
  OFFICER: "officer" as const,
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Report Statuses
export const ReportStatus = {
  PENDING: "pending" as const,
  APPROVED: "approved" as const,
  REJECTED: "rejected" as const,
  RESOLVED: "resolved" as const,
} as const;

export type ReportStatusType = typeof ReportStatus[keyof typeof ReportStatus];

// User Interface
export interface User {
  userid: number;      
  username: string;    
  email: string;
  role: UserRoleType | string;
  createdAt: Date | string;
}

// Incident Report Interface
export interface IncidentReport {
  id: string;
  reportid?: number;
  userid: number;      
  title: string;
  description: string;
  location: string;
  image_url?: string;
  crimedate?: string;
  reportdate?: string;
  crimetime?: string;
  regionid?: number;
  hadasid?: number;
  latitude?: number;
  longitude?: number;
  status: ReportStatusType;
  evidence?: string[]; 
  createdAt: Date | string;
  updatedAt: Date | string;
  adminNotes?: string;
  citizenId?: string;  // Optional legacy field
}

// Feedback Interface
export interface Feedback {
  id: string;
  userId: string;
  message: string;
  rating?: number; // 1-5 stars
  createdAt: Date;
}

// Participant Interface
export interface Participant {
  id: string;
  reportId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  createdAt: Date;
}
