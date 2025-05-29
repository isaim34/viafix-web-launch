
export interface MechanicProgress {
  profileComplete: boolean;
  hasVerification: boolean;
  hasMaintenanceRecord: boolean;
  hasFiveStarReview: boolean;
}

export interface BasicProfileFields {
  firstName: string | undefined;
  lastName: string | undefined;
  phone: string | undefined;
  zipCode: string | undefined;
}

export interface MechanicProfileFields {
  about: string | undefined;
  specialties: string | undefined;
  hourlyRate: number | undefined;
  yearsExperience: number | undefined;
}
