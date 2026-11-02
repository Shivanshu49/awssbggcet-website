// lib/registration/schema.ts
// Pure TypeScript types and validation without external runtime dependencies

export interface RegistrationFormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  collegeId?: string;
  college: string;
  collegeCity?: string;
  state: string;
  city: string;
  locality?: string;

  // Step 2: Academic & Additional Details
  degree: string;
  customDegree?: string;
  branch: string;
  customBranch?: string;
  academicYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Alumni';
  linkedinUrl?: string;
  githubUrl?: string;
  awsBuilderId?: string;
  areasOfInterest: string[];
  referralSource: string;

  // Consent
  privacyConsent: boolean;
  participationConsent: boolean;
  whatsappConsent: boolean;
}

export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

export function validateStep1(data: Partial<RegistrationFormData>): FormErrors {
  const errors: FormErrors = {};

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  const cleanPhone = (data.mobile || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.mobile = 'Enter a valid 10-digit mobile number';
  }

  if (!data.college || data.college.trim().length < 2) {
    errors.college = 'College/University name is required';
  }

  if (!data.state || !data.state.trim()) {
    errors.state = 'Please select a state';
  }

  if (!data.city || !data.city.trim()) {
    errors.city = 'Please select or enter your city/district';
  }

  return errors;
}

export function validateStep2(data: Partial<RegistrationFormData>): FormErrors {
  const errors: FormErrors = {};

  if (!data.degree || !data.degree.trim()) {
    errors.degree = 'Please select your degree/course';
  } else if (data.degree === 'Other' && (!data.customDegree || !data.customDegree.trim())) {
    errors.customDegree = 'Please specify your degree/course';
  }

  if (!data.branch || !data.branch.trim()) {
    errors.branch = 'Please select your branch / department';
  } else if (data.branch === 'Other' && (!data.customBranch || !data.customBranch.trim())) {
    errors.customBranch = 'Please specify your branch / department';
  }

  if (!data.academicYear) {
    errors.academicYear = 'Please select your current academic year';
  }

  if (!data.areasOfInterest || data.areasOfInterest.length === 0) {
    errors.areasOfInterest = 'Select at least one area of interest';
  }

  if (!data.referralSource || !data.referralSource.trim()) {
    errors.referralSource = 'Please tell us how you heard about this event';
  }

  if (!data.privacyConsent) {
    errors.privacyConsent = 'You must accept the privacy policy to proceed';
  }

  if (!data.participationConsent) {
    errors.participationConsent = 'You must agree to event terms and code of conduct';
  }

  return errors;
}

