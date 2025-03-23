
// Sample certification data
export const sampleCertifications = [
  {
    id: '1',
    name: 'ASE Master Automobile Technician',
    issuer: 'National Institute for Automotive Service Excellence',
    issueDate: '2018-05-15',
    expirationDate: '2023-05-15',
    description: 'Certification in all eight automotive service areas'
  },
  {
    id: '2',
    name: 'BMW Factory Training Certification',
    issuer: 'BMW North America',
    issueDate: '2019-10-22',
    expirationDate: '2024-10-22',
    description: 'Advanced diagnostic and repair procedures for BMW vehicles'
  }
];

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
