'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Globe,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
  Download,
} from 'lucide-react';
import {
  RegistrationFormData,
  FormErrors,
  validateStep1,
  validateStep2,
} from '@/lib/registration/schema';
import { SearchableCombobox } from './SearchableCombobox';
import { CollegeAutocomplete } from './CollegeAutocomplete';
import {
  ACADEMIC_YEAR_OPTIONS,
  DEGREE_OPTIONS,
  BRANCH_OPTIONS,
} from '@/lib/registration/academic-data';
import {
  STATE_OPTIONS,
  UTTAR_PRADESH_NCR_OPTIONS,
  DELHI_OPTIONS,
  HARYANA_OPTIONS,
} from '@/lib/registration/geo-data';

interface TwoStepRegistrationFormProps {
  eventTitle: string;
  eventVenue: string;
  eventDate: string;
}

const INTEREST_AREAS = [
  'Cloud Architecture & DevOps',
  'Serverless & Containers',
  'Generative AI & Machine Learning',
  'Security & Identity (IAM)',
  'Data Analytics & Databases',
  'Competitive Programming / Web Development',
];

const REFERRAL_SOURCES = [
  'Campus Posters / Notice Board',
  'College WhatsApp / Telegram Groups',
  'LinkedIn / Social Media',
  'Friends & Classmates',
  'Faculty Mentors',
  'Other',
];

export function TwoStepRegistrationForm({
  eventTitle,
  eventVenue,
  eventDate,
}: TwoStepRegistrationFormProps) {
  // Stepper state: 1 (Personal), 2 (Academic & Details), 3 (Verification & Submission), 4 (Confirmed Pass)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('849201');

  // Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    collegeId: '',
    college: '',
    collegeCity: '',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    locality: '',
    degree: 'B.Tech / B.E.',
    customDegree: '',
    branch: 'Computer Science and Engineering (CSE)',
    customBranch: '',
    academicYear: '2nd Year',
    linkedinUrl: '',
    githubUrl: '',
    awsBuilderId: '',
    areasOfInterest: ['Cloud Architecture & DevOps'],
    referralSource: 'Campus Posters / Notice Board',
    privacyConsent: true,
    participationConsent: true,
    whatsappConsent: true,
  });

  // Success Pass Details
  const [passData, setPassData] = useState<{
    registrationId: string;
    qrUrl: string;
    registeredAt: string;
  } | null>(null);

  // Update field
  const updateField = <K extends keyof RegistrationFormData>(
    field: K,
    value: RegistrationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Toggle Interest
  const toggleInterest = (interest: string) => {
    const current = formData.areasOfInterest;
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    updateField('areasOfInterest', next);
  };

  // City options dependent on selected state
  const getCityOptions = () => {
    if (formData.state === 'Uttar Pradesh') return UTTAR_PRADESH_NCR_OPTIONS;
    if (formData.state === 'Delhi') return DELHI_OPTIONS;
    if (formData.state === 'Haryana') return HARYANA_OPTIONS;
    return [];
  };

  // Navigation handlers
  const handleProceedToStep2 = () => {
    const step1Errors = validateStep1(formData);
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }
    setErrors({});
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToVerification = () => {
    const step2Errors = validateStep2(formData);
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }
    setErrors({});
    // Simulate sending OTP
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockCode);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      setVerificationError('Please enter the 6-digit verification code.');
      return;
    }

    if (verificationCode.trim() !== generatedOtp && verificationCode.trim() !== '123456') {
      setVerificationError(`Invalid code. (For testing, enter ${generatedOtp} or 123456)`);
      return;
    }

    setIsSubmitting(true);
    setVerificationError('');

    setTimeout(() => {
      const regId = `SCD-${Date.now().toString().slice(-6)}`;
      setPassData({
        registrationId: regId,
        qrUrl: `/events/community-day-register-qr.png`,
        registeredAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
      setIsSubmitting(false);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Visual Stepper Bar */}
      {currentStep !== 4 && (
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {/* Step 1 Indicator */}
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                  currentStep >= 1
                    ? 'border-2 border-[#FBBF24] bg-[#FBBF24] text-[#090511] shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'border border-[#4C2A66] bg-[#140D22] text-[#CFC5DC]'
                }`}
              >
                1
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Personal Information</span>
                <span className="text-[10px] text-[#CFC5DC]">Name, Contact &amp; City</span>
              </div>
            </div>

            {/* Connecting Line */}
            <div
              className={`h-0.5 flex-1 mx-4 transition-colors ${
                currentStep >= 2 ? 'bg-[#FBBF24]' : 'bg-[#4C2A66]/40'
              }`}
            />

            {/* Step 2 Indicator */}
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                  currentStep >= 2
                    ? 'border-2 border-[#FBBF24] bg-[#FBBF24] text-[#090511] shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'border border-[#4C2A66] bg-[#140D22] text-[#CFC5DC]'
                }`}
              >
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Academic Details</span>
                <span className="text-[10px] text-[#CFC5DC]">Course, Year &amp; Consent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Personal Information */}
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="rounded-3xl border border-[#4C2A66]/60 bg-[#100B18]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-[#4C2A66]/40 pb-5">
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Step 1: Personal &amp; Geographic Information
            </h2>
            <p className="mt-1 text-xs text-[#CFC5DC]">
              Enter your official identification details and institution information.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  First Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="e.g. Aryan"
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6B5A82] outline-none transition-all focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  Last Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6B5A82] outline-none transition-all focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Address & Mobile */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="name@college.edu or gmail.com"
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6B5A82] outline-none transition-all focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  Mobile Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative mt-1.5 flex items-center">
                  <span className="pointer-events-none absolute left-3.5 font-mono text-xs text-[#A855F7]">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => updateField('mobile', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-12 pr-4 text-sm text-white placeholder-[#6B5A82] outline-none transition-all focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-xs text-rose-400">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* College / Institution Autocomplete */}
            <div>
              <label className="block text-xs font-semibold text-[#E9D5FF]">
                College / University Name <span className="text-rose-400">*</span>
              </label>
              <div className="mt-1.5">
                <CollegeAutocomplete
                  value={formData.college}
                  collegeId={formData.collegeId}
                  collegeCity={formData.collegeCity}
                  onChange={(selected) => {
                    updateField('college', selected.name);
                    if (selected.id) updateField('collegeId', selected.id);
                    if (selected.city) updateField('collegeCity', selected.city);
                    if (selected.state) updateField('state', selected.state);
                  }}
                  error={errors.college}
                />
              </div>
            </div>

            {/* State & City Dropdowns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  State / Region <span className="text-rose-400">*</span>
                </label>
                <div className="mt-1.5">
                  <SearchableCombobox
                    options={STATE_OPTIONS}
                    value={formData.state}
                    onChange={(val) => {
                      updateField('state', val);
                      if (val === 'Uttar Pradesh') updateField('city', 'Greater Noida');
                      else if (val === 'Delhi') updateField('city', 'South Delhi');
                      else if (val === 'Haryana') updateField('city', 'Gurugram');
                    }}
                    error={errors.state}
                    placeholder="Select State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  City / District / Locality <span className="text-rose-400">*</span>
                </label>
                <div className="mt-1.5">
                  <SearchableCombobox
                    options={getCityOptions()}
                    value={formData.city}
                    onChange={(val) => updateField('city', val)}
                    allowCustom={true}
                    customOptionLabel="Other / Enter Custom Locality"
                    error={errors.city}
                    placeholder="Select or Search City"
                  />
                </div>
              </div>
            </div>

            {/* Optional Locality / Sector Details */}
            <div>
              <label className="block text-xs font-semibold text-[#E9D5FF]">
                Sector / Locality (Optional)
              </label>
              <div className="relative mt-1.5">
                <MapPin className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                <input
                  type="text"
                  value={formData.locality || ''}
                  onChange={(e) => updateField('locality', e.target.value)}
                  placeholder="e.g. Sector 62 / Knowledge Park II / Indirapuram"
                  className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6B5A82] outline-none transition-all focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex justify-end border-t border-[#4C2A66]/40 pt-6">
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-8 py-3.5 text-xs font-bold text-[#090511] uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] active:scale-95"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Academic Details, Profiles & Consent */}
      {currentStep === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="rounded-3xl border border-[#4C2A66]/60 bg-[#100B18]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-[#4C2A66]/40 pb-5">
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Step 2: Academic &amp; Additional Details
            </h2>
            <p className="mt-1 text-xs text-[#CFC5DC]">
              Provide your course, year of study, technical interests, and confirmation.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {/* Degree & Academic Year */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  Degree / Program <span className="text-rose-400">*</span>
                </label>
                <div className="mt-1.5">
                  <SearchableCombobox
                    options={DEGREE_OPTIONS}
                    value={formData.degree}
                    onChange={(val) => updateField('degree', val)}
                    allowCustom={true}
                    error={errors.degree}
                    placeholder="Select Degree"
                  />
                </div>
                {formData.degree === 'Other' && (
                  <input
                    type="text"
                    value={formData.customDegree || ''}
                    onChange={(e) => updateField('customDegree', e.target.value)}
                    placeholder="Specify your degree / course"
                    className="mt-2 w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] px-4 py-2 text-xs text-white placeholder-[#6B5A82] outline-none focus:border-[#FBBF24]"
                  />
                )}
                {errors.customDegree && (
                  <p className="mt-1 text-xs text-rose-400">{errors.customDegree}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  Academic Year <span className="text-rose-400">*</span>
                </label>
                <div className="mt-1.5">
                  <SearchableCombobox
                    options={ACADEMIC_YEAR_OPTIONS}
                    value={formData.academicYear}
                    onChange={(val) =>
                      updateField(
                        'academicYear',
                        val as RegistrationFormData['academicYear']
                      )
                    }
                    error={errors.academicYear}
                    placeholder="Select Year of Study"
                  />
                </div>
              </div>
            </div>

            {/* Branch / Department */}
            <div>
              <label className="block text-xs font-semibold text-[#E9D5FF]">
                Branch / Specialization <span className="text-rose-400">*</span>
              </label>
              <div className="mt-1.5">
                <SearchableCombobox
                  options={BRANCH_OPTIONS}
                  value={formData.branch}
                  onChange={(val) => updateField('branch', val)}
                  allowCustom={true}
                  error={errors.branch}
                  placeholder="Select Branch / Specialization"
                />
              </div>
              {formData.branch === 'Other' && (
                <input
                  type="text"
                  value={formData.customBranch || ''}
                  onChange={(e) => updateField('customBranch', e.target.value)}
                  placeholder="Specify your branch / department"
                  className="mt-2 w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] px-4 py-2 text-xs text-white placeholder-[#6B5A82] outline-none focus:border-[#FBBF24]"
                />
              )}
              {errors.customBranch && (
                <p className="mt-1 text-xs text-rose-400">{errors.customBranch}</p>
              )}
            </div>

            {/* Technical Interests */}
            <div>
              <label className="block text-xs font-semibold text-[#E9D5FF]">
                Primary Technical Interests <span className="text-rose-400">*</span>
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {INTEREST_AREAS.map((interest) => {
                  const selected = formData.areasOfInterest.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${
                        selected
                          ? 'border-[#FBBF24] bg-[#FBBF24]/10 text-white font-medium'
                          : 'border-[#4C2A66]/40 bg-[#140D22] text-[#CFC5DC] hover:border-[#4C2A66] hover:text-white'
                      }`}
                    >
                      <div
                        className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? 'border-[#FBBF24] bg-[#FBBF24] text-[#090511]'
                            : 'border-[#6B5A82]'
                        }`}
                      >
                        {selected && <CheckCircle2 className="size-3" />}
                      </div>
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
              {errors.areasOfInterest && (
                <p className="mt-1 text-xs text-rose-400">{errors.areasOfInterest}</p>
              )}
            </div>

            {/* Optional Links: LinkedIn & GitHub & AWS Builder ID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  LinkedIn URL (Optional)
                </label>
                <div className="relative mt-1.5">
                  <Globe className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                  <input
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-3 text-xs text-white placeholder-[#6B5A82] outline-none focus:border-[#FBBF24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  GitHub URL (Optional)
                </label>
                <div className="relative mt-1.5">
                  <Globe className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => updateField('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-3 text-xs text-white placeholder-[#6B5A82] outline-none focus:border-[#FBBF24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9D5FF]">
                  AWS Builder ID (Optional)
                </label>
                <div className="relative mt-1.5">
                  <Sparkles className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#A855F7]" />
                  <input
                    type="text"
                    value={formData.awsBuilderId || ''}
                    onChange={(e) => updateField('awsBuilderId', e.target.value)}
                    placeholder="e.g. your-alias"
                    className="w-full rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-2.5 pl-10 pr-3 text-xs text-white placeholder-[#6B5A82] outline-none focus:border-[#FBBF24]"
                  />
                </div>
              </div>
            </div>

            {/* How did you hear about event */}
            <div>
              <label className="block text-xs font-semibold text-[#E9D5FF]">
                How did you hear about this event? <span className="text-rose-400">*</span>
              </label>
              <div className="mt-1.5">
                <SearchableCombobox
                  options={REFERRAL_SOURCES.map((s) => ({ value: s, label: s }))}
                  value={formData.referralSource}
                  onChange={(val) => updateField('referralSource', val)}
                  error={errors.referralSource}
                  placeholder="Select source"
                />
              </div>
            </div>

            {/* Required Consents */}
            <div className="space-y-3 rounded-2xl border border-[#4C2A66]/40 bg-[#140D22] p-4 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => updateField('privacyConsent', e.target.checked)}
                  className="mt-0.5 rounded border-[#4C2A66] bg-[#1A112B] text-[#FBBF24] focus:ring-[#FBBF24]"
                />
                <span className="text-[#CFC5DC]">
                  I consent to AWS Student Builder Group GCET processing my details for event communication and registration entry. <span className="text-rose-400">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.participationConsent}
                  onChange={(e) => updateField('participationConsent', e.target.checked)}
                  className="mt-0.5 rounded border-[#4C2A66] bg-[#1A112B] text-[#FBBF24] focus:ring-[#FBBF24]"
                />
                <span className="text-[#CFC5DC]">
                  I agree to abide by the Community Code of Conduct and bring my student ID to the venue. <span className="text-rose-400">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.whatsappConsent}
                  onChange={(e) => updateField('whatsappConsent', e.target.checked)}
                  className="mt-0.5 rounded border-[#4C2A66] bg-[#1A112B] text-[#FBBF24] focus:ring-[#FBBF24]"
                />
                <span className="text-[#CFC5DC]">
                  Send me my entry pass confirmation and event day updates on WhatsApp.
                </span>
              </label>
            </div>
            {errors.privacyConsent && (
              <p className="text-xs text-rose-400">{errors.privacyConsent}</p>
            )}
            {errors.participationConsent && (
              <p className="text-xs text-rose-400">{errors.participationConsent}</p>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-8 flex items-center justify-between border-t border-[#4C2A66]/40 pt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 rounded-full border border-[#4C2A66] bg-[#140D22] px-6 py-3 text-xs font-semibold text-[#E9D5FF] transition-all hover:bg-[#1A112B] hover:text-white"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToVerification}
              className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-8 py-3.5 text-xs font-bold text-[#090511] uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] active:scale-95"
            >
              <span>Proceed to Verification</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Identity Verification & Submit */}
      {currentStep === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="rounded-3xl border border-[#4C2A66]/60 bg-[#100B18]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FBBF24] shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <ShieldCheck className="size-6" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
              Identity Verification
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#CFC5DC]">
              We&apos;ve sent a 6-digit confirmation code to{' '}
              <span className="font-mono text-[#FBBF24]">{formData.email}</span> and your mobile.
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#4C2A66]/60 bg-[#160E25] px-3 py-1 font-mono text-xs text-[#A855F7]">
              <span>Demo Mode Test OTP:</span>
              <span className="font-bold text-[#FBBF24]">{generatedOtp}</span>
            </div>
          </div>

          <div className="mx-auto mt-7 max-w-sm">
            <label className="block text-center text-xs font-semibold text-[#E9D5FF]">
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="mt-2 w-full text-center font-mono text-2xl tracking-[0.4em] rounded-xl border border-[#4C2A66]/60 bg-[#150D24] py-3 text-white placeholder-[#6B5A82] outline-none transition-all focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]"
            />
            {verificationError && (
              <p className="mt-2 text-center text-xs text-rose-400">{verificationError}</p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FBBF24] py-3.5 text-xs font-bold text-[#090511] uppercase shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all hover:bg-amber-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Issuing Your Digital Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Registration</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-center font-mono text-xs text-[#CFC5DC] hover:text-white"
              >
                &larr; Back to edit details
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Success & Digital QR Pass */}
      {currentStep === 4 && passData && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-[#FBBF24]/30 bg-gradient-to-b from-[#180E28] via-[#100B18] to-[#140D22] p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center"
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300">
            <span>Pass Issued · Confirmed</span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            You&apos;re Registered, {formData.firstName}!
          </h2>

          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#CFC5DC] sm:text-sm">
            Your registration for <strong className="text-white">{eventTitle}</strong> is confirmed. Show this digital pass at the entrance on event morning.
          </p>

          {/* Digital Entry Pass Card */}
          <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-[#4C2A66]/80 bg-[#120B1D] p-6 text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-[#4C2A66]/40 pb-4">
              <div>
                <span className="font-mono text-[10px] text-[#A855F7] uppercase tracking-wider">
                  Registration ID
                </span>
                <p className="font-mono text-base font-bold text-[#FBBF24]">
                  {passData.registrationId}
                </p>
              </div>
              <div className="rounded-md border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#FBBF24]">
                STUDENT PASS
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono text-[10px] text-[#A855F7] uppercase">
                  Attendee Name
                </span>
                <p className="mt-0.5 font-bold text-white">
                  {formData.firstName} {formData.lastName}
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#A855F7] uppercase">
                  Institution
                </span>
                <p className="mt-0.5 font-medium text-[#E9D5FF] truncate">
                  {formData.college}
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#A855F7] uppercase">
                  Event Date
                </span>
                <p className="mt-0.5 font-medium text-white">{eventDate}</p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#A855F7] uppercase">
                  Venue
                </span>
                <p className="mt-0.5 font-medium text-[#E9D5FF] truncate">
                  {eventVenue}
                </p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[#4C2A66]/60 bg-[#090511] p-5">
              <div className="relative size-40 overflow-hidden rounded-lg bg-white p-2 shadow-md">
                {/* Embedded QR Code */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={passData.qrUrl}
                  alt="Attendee Entry Pass QR Code"
                  className="size-full object-contain"
                />
              </div>
              <span className="mt-3 font-mono text-[11px] text-[#FBBF24]">
                Scan for Venue Check-in
              </span>
              <span className="text-[10px] text-[#CFC5DC]">
                Valid only with college physical ID card
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/40 bg-[#160E25] px-6 py-3 text-xs font-semibold text-[#FBBF24] transition-all hover:bg-[#FBBF24]/10"
            >
              <Download className="size-4" />
              <span>Save / Print Pass</span>
            </button>
            <a
              href="/community-day"
              className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-7 py-3 text-xs font-bold text-[#090511] uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:bg-amber-300"
            >
              <span>Back to Community Day</span>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
