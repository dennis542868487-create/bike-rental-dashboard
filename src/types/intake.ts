export type IntakeFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  idType: 'drivers_licence' | 'passport' | 'bcid' | 'other_gov_id';
  idNumber: string;
  signatureDataUrl: string;
  waiverAccepted: boolean;
};
