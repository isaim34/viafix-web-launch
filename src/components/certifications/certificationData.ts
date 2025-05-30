
// Empty certification data for production
export const sampleCertifications: Certification[] = [];

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  description: string;
}

export const emptyCertification = {
  name: '',
  issuer: '',
  issueDate: '',
  expirationDate: '',
  description: ''
};
