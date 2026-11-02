'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
  Send,
  Building
} from 'lucide-react';
import { RegistrationFormData } from '@/lib/registration/schema';
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

interface RegistrationFormProps {
  eventSlug: string;
  eventTitle: string;
  onSuccess: (data: { registrationId: string; qrDataUrl: string; verifyUrl: string; firstName: string }) => void;
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

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  eventSlug,
  eventTitle,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    state: 'Uttar Pradesh',
    areasOfInterest: [],
    privacyConsent: false as unknown as true,
    participationConsent: false as unknown as true,
    whatsappConsent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Custom city entry toggle when state is 'Other' or city is custom
  const [isCustomCity, setIsCustomCity] = useState(false);

  // OTP Verification State
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Temporary registration ID generated client-side for OTP identification
  const [tempRegId] = useState(() => 'TEMP-' + Math.random().toString(36).substring(2, 9).toUpperCase());

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleStateChange = (newState: string) => {
    // Reset city when state changes
    setFormData((prev) => ({
      ...prev,
      state: newState,
      city: '',
      locality: '',
    }));
    setIsCustomCity(newState === 'Other');
    if (errors.state || errors.city) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.state;
        delete next.city;
        return next;
      });
    }
  };

  const toggleInterest = (interest: string) => {
    const list = formData.areasOfInterest || [];
    if (list.includes(interest)) {
      handleInputChange('areasOfInterest', list.filter((i) => i !== interest));
    } else {
      handleInputChange('areasOfInterest', [...list, interest]);
    }
  };

  // Determine city options based on selected state
  const getCityOptions = () => {
    switch (formData.state) {
      case 'Uttar Pradesh':
        return UTTAR_PRADESH_NCR_OPTIONS;
      case 'Delhi':
        return DELHI_OPTIONS;
      case 'Haryana':
        return HARYANA_OPTIONS;
      default:
        return [];
    }
  };

  // Validation per step
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.mobile?.trim() || !/^\+?[1-9]\d{9,14}$/.test(formData.mobile)) {
      newErrors.mobile = 'Valid phone with country code required (e.g. +919876543210)';
    }
    if (!formData.college?.trim()) newErrors.college = 'College/University name is required';
    if (!formData.degree?.trim()) newErrors.degree = 'Degree/Course is required';
    if (formData.degree === 'Other' && !formData.customDegree?.trim()) {
      newErrors.customDegree = 'Please specify your degree';
    }
    if (!formData.branch?.trim()) newErrors.branch = 'Branch is required';
    if (formData.branch === 'Other' && !formData.customBranch?.trim()) {
      newErrors.customBranch = 'Please specify your branch / department';
    }
    if (!formData.academicYear) newErrors.academicYear = 'Select your academic year';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city?.trim()) newErrors.city = 'City / Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.areasOfInterest || formData.areasOfInterest.length === 0) {
      newErrors.areasOfInterest = 'Select at least one area of interest';
    }
    if (!formData.referralSource) {
      newErrors.referralSource = 'Please tell us how you heard about this event';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'You must accept the privacy policy';
    }
    if (!formData.participationConsent) {
      newErrors.participationConsent = 'You must accept the event participation terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // OTP Handlers
  const handleSendOtp = async (purpose: 'email' | 'mobile') => {
    setIsSendingOtp(purpose);
    setOtpMessage(null);
    try {
      const recipient = purpose === 'email' ? formData.email! : formData.mobile!;
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: tempRegId,
          purpose,
          recipient,
          firstName: formData.firstName || 'Attendee',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      if (purpose === 'email') setEmailOtpSent(true);
      else setMobileOtpSent(true);

      setOtpMessage(`Verification code sent to your ${purpose}!`);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSendingOtp(null);
    }
  };

  const handleVerifyOtp = async (purpose: 'email' | 'mobile') => {
    setIsVerifyingOtp(purpose);
    setSubmitError(null);
    try {
      const otp = purpose === 'email' ? emailOtp : mobileOtp;
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: tempRegId,
          purpose,
          otp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid verification code');

      if (purpose === 'email') setEmailVerified(true);
      else setMobileVerified(true);

      setOtpMessage(`${purpose === 'email' ? 'Email' : 'Mobile'} successfully verified!`);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsVerifyingOtp(null);
    }
  };

  // Final Submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/events/${eventSlug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onSuccess(data);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-[#100B18]/90 border border-[#4C2A66]/60 backdrop-blur-xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      {/* Progress Steps Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2B173D] -translate-y-1/2 -z-0" />
          {[
            { step: 1, label: 'Personal' },
            { step: 2, label: 'Details' },
            { step: 3, label: 'Consent' },
            { step: 4, label: 'Verification' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                  currentStep === item.step
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-110'
                    : currentStep > item.step
                    ? 'bg-[#6B21A8] text-white border border-purple-400/40'
                    : 'bg-[#1A0E2A] text-[#A89DB5] border border-[#4C2A66]/40'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </div>
              <span className="text-[11px] font-mono mt-2 text-[#A89DB5] hidden sm:block">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{submitError}</span>
        </div>
      )}

      {otpMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 text-emerald-200 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{otpMessage}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" /> Personal Information
              </h2>
              <p className="text-xs text-[#A89DB5] mt-1">
                Enter your details exactly as shown on your academic identification card.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">First Name *</label>
                <input
                  type="text"
                  placeholder="Aryan"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                />
                {errors.firstName && <p className="text-red-400 text-[11px] mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">Last Name *</label>
                <input
                  type="text"
                  placeholder="Sharma"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                />
                {errors.lastName && <p className="text-red-400 text-[11px] mt-1">{errors.lastName}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                  <input
                    type="email"
                    placeholder="student@gcet.edu.in"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                  <input
                    type="tel"
                    placeholder="+919876543210"
                    value={formData.mobile || ''}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                {errors.mobile && <p className="text-red-400 text-[11px] mt-1">{errors.mobile}</p>}
              </div>

              {/* College / University Name (Searchable Autocomplete with fallback) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">
                  College / University Name *
                </label>
                <CollegeAutocomplete
                  value={formData.college || ''}
                  collegeId={formData.collegeId}
                  collegeCity={formData.collegeCity}
                  error={errors.college}
                  onChange={({ id, name, city }) => {
                    handleInputChange('college', name);
                    handleInputChange('collegeId', id);
                    handleInputChange('collegeCity', city);
                  }}
                />
                {errors.college && <p className="text-red-400 text-[11px] mt-1">{errors.college}</p>}
              </div>

              {/* Degree / Course (Searchable Combobox) */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">Degree / Course *</label>
                <SearchableCombobox
                  options={DEGREE_OPTIONS}
                  value={formData.degree || ''}
                  onChange={(val) => handleInputChange('degree', val)}
                  placeholder="Select Degree / Course"
                  searchPlaceholder="Search degree (e.g. B.Tech, BCA, MCA)..."
                  allowCustom={true}
                  customOptionLabel="Other (Specify below)"
                  error={errors.degree}
                />
                {errors.degree && <p className="text-red-400 text-[11px] mt-1">{errors.degree}</p>}

                {/* Conditional Degree input */}
                {formData.degree === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Please specify your degree / course"
                      value={formData.customDegree || ''}
                      onChange={(e) => handleInputChange('customDegree', e.target.value)}
                      className="w-full bg-[#12071E] border border-amber-400/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
                    />
                    {errors.customDegree && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.customDegree}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Branch / Department (Searchable Combobox) */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">Branch / Department *</label>
                <SearchableCombobox
                  options={BRANCH_OPTIONS}
                  value={formData.branch || ''}
                  onChange={(val) => handleInputChange('branch', val)}
                  placeholder="Select Branch / Specialization"
                  searchPlaceholder="Search branch (e.g. CSE, AI & ML, ECE)..."
                  allowCustom={true}
                  customOptionLabel="Other (Specify below)"
                  error={errors.branch}
                />
                {errors.branch && <p className="text-red-400 text-[11px] mt-1">{errors.branch}</p>}

                {/* Conditional Branch input */}
                {formData.branch === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter your branch / department"
                      value={formData.customBranch || ''}
                      onChange={(e) => handleInputChange('customBranch', e.target.value)}
                      className="w-full bg-[#12071E] border border-amber-400/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
                    />
                    {errors.customBranch && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.customBranch}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Academic Year (Searchable Combobox) */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">Academic Year *</label>
                <SearchableCombobox
                  options={ACADEMIC_YEAR_OPTIONS}
                  value={formData.academicYear || ''}
                  onChange={(val) => handleInputChange('academicYear', val as any)}
                  placeholder="Select Academic Year"
                  searchPlaceholder="Search year (e.g. 1st, 2nd, Alumni)..."
                  error={errors.academicYear}
                />
                {errors.academicYear && <p className="text-red-400 text-[11px] mt-1">{errors.academicYear}</p>}
              </div>

              {/* State (Dependent Dropdown) */}
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">State *</label>
                <SearchableCombobox
                  options={STATE_OPTIONS}
                  value={formData.state || ''}
                  onChange={handleStateChange}
                  placeholder="Select State"
                  searchPlaceholder="Search state..."
                  error={errors.state}
                />
                {errors.state && <p className="text-red-400 text-[11px] mt-1">{errors.state}</p>}
              </div>

              {/* City / Locality (Dependent on State) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-[#C4B5DA]">
                    City / Locality / Sector *
                  </label>
                  {formData.state !== 'Other' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCity(!isCustomCity);
                        handleInputChange('city', '');
                      }}
                      className="text-[11px] text-amber-300 hover:text-amber-200 underline font-mono"
                    >
                      {isCustomCity ? '← Choose from list' : 'Not in list? Enter manually'}
                    </button>
                  )}
                </div>

                {!isCustomCity && formData.state !== 'Other' ? (
                  <SearchableCombobox
                    options={getCityOptions()}
                    value={formData.city || ''}
                    onChange={(val) => {
                      handleInputChange('city', val);
                      handleInputChange('locality', val);
                    }}
                    placeholder={`Select area / sector in ${formData.state || 'NCR'}`}
                    searchPlaceholder="Search area (e.g. Pari Chowk, Sector 62, Indirapuram, Dwarka)..."
                    allowCustom={true}
                    customOptionLabel="Other (Enter manually)"
                    onCustomSelect={() => setIsCustomCity(true)}
                    error={errors.city}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Enter your city / locality / area"
                    value={formData.city || ''}
                    onChange={(e) => {
                      handleInputChange('city', e.target.value);
                      handleInputChange('locality', e.target.value);
                    }}
                    className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                  />
                )}
                {errors.city && <p className="text-red-400 text-[11px] mt-1">{errors.city}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white text-xs font-bold border border-purple-400/40 hover:border-amber-400/60 transition flex items-center gap-2 shadow-[0_0_15px_rgba(107,33,168,0.4)]"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Additional Information */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Additional Information
              </h2>
              <p className="text-xs text-[#A89DB5] mt-1">
                Help us tailor the sessions, keynote speakers, and workshops to your profile.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">LinkedIn Profile (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">GitHub Profile (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl || ''}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">AWS Builder ID (Optional)</label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89DB5]" />
                  <input
                    type="text"
                    placeholder="your-alias@amazon.com or Builder ID profile"
                    value={formData.awsBuilderId || ''}
                    onChange={(e) => handleInputChange('awsBuilderId', e.target.value)}
                    className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-2">Areas of Interest *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTEREST_AREAS.map((interest) => {
                    const isSelected = formData.areasOfInterest?.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#6B21A8]/50 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                            : 'bg-[#1A0E2A]/60 border-[#4C2A66]/40 text-[#A89DB5] hover:border-purple-400/50 hover:text-white'
                        }`}
                      >
                        <span>{interest}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {errors.areasOfInterest && <p className="text-red-400 text-[11px] mt-1.5">{errors.areasOfInterest}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">How did you hear about this event? *</label>
                <select
                  value={formData.referralSource || ''}
                  onChange={(e) => handleInputChange('referralSource', e.target.value)}
                  className="w-full bg-[#1A0E2A] border border-[#4C2A66]/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                >
                  <option value="">Select an option</option>
                  {REFERRAL_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                {errors.referralSource && <p className="text-red-400 text-[11px] mt-1">{errors.referralSource}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-[#A89DB5] text-xs font-semibold flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setCurrentStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white text-xs font-bold border border-purple-400/40 hover:border-amber-400/60 transition flex items-center gap-2 shadow-[0_0_15px_rgba(107,33,168,0.4)]"
              >
                <span>Continue to Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Consents & Agreements */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Consent & Privacy Policy
              </h2>
              <p className="text-xs text-[#A89DB5] mt-1">
                Please review and accept our event terms before proceeding to identity verification.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#1A0E2A]/60 border border-[#4C2A66]/50 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.privacyConsent}
                    onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-purple-500 bg-[#0E061A] text-amber-400 focus:ring-amber-400"
                  />
                  <span className="text-xs text-[#C4B5DA] leading-relaxed">
                    I agree to the <strong className="text-white">Privacy Policy</strong> and authorize AWS Builder Center GCET to process my details for event administration and pass verification.
                  </span>
                </label>
                {errors.privacyConsent && <p className="text-red-400 text-[11px] pl-7">{errors.privacyConsent}</p>}
              </div>

              <div className="p-4 rounded-2xl bg-[#1A0E2A]/60 border border-[#4C2A66]/50 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.participationConsent}
                    onChange={(e) => handleInputChange('participationConsent', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-purple-500 bg-[#0E061A] text-amber-400 focus:ring-amber-400"
                  />
                  <span className="text-xs text-[#C4B5DA] leading-relaxed">
                    I agree to the <strong className="text-white">Code of Conduct</strong> and declare that I will carry my official college ID card to the venue for identity verification.
                  </span>
                </label>
                {errors.participationConsent && <p className="text-red-400 text-[11px] pl-7">{errors.participationConsent}</p>}
              </div>

              <div className="p-4 rounded-2xl bg-[#1A0E2A]/60 border border-[#4C2A66]/50 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.whatsappConsent}
                    onChange={(e) => handleInputChange('whatsappConsent', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-purple-500 bg-[#0E061A] text-amber-400 focus:ring-amber-400"
                  />
                  <span className="text-xs text-[#C4B5DA] leading-relaxed">
                    <strong className="text-amber-300">WhatsApp Updates (Recommended):</strong> Receive instant pass confirmations, QR updates, schedule reminders, and speaker announcements on WhatsApp.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-[#A89DB5] text-xs font-semibold flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setCurrentStep(4);
                }}
                className="px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white text-xs font-bold border border-purple-400/40 hover:border-amber-400/60 transition flex items-center gap-2 shadow-[0_0_15px_rgba(107,33,168,0.4)]"
              >
                <span>Proceed to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: OTP Verification & Final Submit */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Identity Verification
              </h2>
              <p className="text-xs text-[#A89DB5] mt-1">
                To prevent duplicate and invalid sign-ups, verify your email and mobile number.
              </p>
            </div>

            {/* Email Verification Box */}
            <div className="p-5 rounded-2xl bg-[#1A0E2A]/70 border border-[#4C2A66]/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Email Verification</h4>
                  <p className="text-xs text-[#A89DB5]">{formData.email}</p>
                </div>
                {emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp('email')}
                    disabled={isSendingOtp === 'email'}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#6B21A8] text-white hover:bg-[#7E22CE] border border-purple-400/30 flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {isSendingOtp === 'email' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{emailOtpSent ? 'Resend OTP' : 'Send OTP'}</span>
                  </button>
                )}
              </div>

              {!emailVerified && emailOtpSent && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="flex-1 bg-[#10071C] border border-[#4C2A66]/60 rounded-xl px-4 py-2 text-sm text-center font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp('email')}
                    disabled={isVerifyingOtp === 'email' || emailOtp.length !== 6}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition disabled:opacity-50"
                  >
                    {isVerifyingOtp === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Verification Box */}
            <div className="p-5 rounded-2xl bg-[#1A0E2A]/70 border border-[#4C2A66]/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Mobile Verification</h4>
                  <p className="text-xs text-[#A89DB5]">{formData.mobile}</p>
                </div>
                {mobileVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp('mobile')}
                    disabled={isSendingOtp === 'mobile'}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#6B21A8] text-white hover:bg-[#7E22CE] border border-purple-400/30 flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {isSendingOtp === 'mobile' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{mobileOtpSent ? 'Resend OTP' : 'Send OTP'}</span>
                  </button>
                )}
              </div>

              {!mobileVerified && mobileOtpSent && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    className="flex-1 bg-[#10071C] border border-[#4C2A66]/60 rounded-xl px-4 py-2 text-sm text-center font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp('mobile')}
                    disabled={isVerifyingOtp === 'mobile' || mobileOtp.length !== 6}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition disabled:opacity-50"
                  >
                    {isVerifyingOtp === 'mobile' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#4C2A66]/40">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-[#A89DB5] text-xs font-semibold flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.4)] transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
