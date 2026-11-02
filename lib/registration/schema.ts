// lib/registration/schema.ts
// Shared Zod schemas used by both the API route (server) and the form (client).
import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email address"),
  mobile: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Enter a valid mobile number with country code"),
  collegeId: z.string().optional(),
  college: z.string().min(3, "College name is required").max(150),
  collegeCity: z.string().optional(),
  degree: z.string().min(2, "Degree/course is required").max(100),
  customDegree: z.string().optional(),
  branch: z.string().min(2, "Branch/department is required").max(100),
  customBranch: z.string().optional(),
  academicYear: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"]),
  state: z.string().min(2, "State is required").max(80),
  city: z.string().min(2, "City is required").max(80),
  locality: z.string().optional(),
}).refine((data) => {
  if (data.degree === "Other" && !data.customDegree?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Please specify your degree/course",
  path: ["customDegree"],
}).refine((data) => {
  if (data.branch === "Other" && !data.customBranch?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Please enter your branch / department",
  path: ["customBranch"],
});

export const additionalSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  awsBuilderId: z.string().max(100).optional().or(z.literal("")),
  areasOfInterest: z
    .array(z.string())
    .min(1, "Select at least one area of interest"),
  referralSource: z.string().min(1, "Please tell us how you heard about this event"),
});

export const consentSchema = z.object({
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
  participationConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to event participation terms",
  }),
  whatsappConsent: z.boolean().default(false),
});

export const registrationFormSchema = personalSchema
  .and(additionalSchema)
  .and(consentSchema);

export type RegistrationFormData = z.infer<typeof personalSchema> &
  z.infer<typeof additionalSchema> &
  z.infer<typeof consentSchema>;

// ─── OTP request/response ─────────────────────────────────────────────────────
export const sendOtpSchema = z.object({
  registrationId: z.string().min(1),
  purpose: z.enum(["email", "mobile"]),
  recipient: z.string().min(1),
});

export const verifyOtpSchema = z.object({
  registrationId: z.string().min(1),
  purpose: z.enum(["email", "mobile"]),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type SendOtpPayload = z.infer<typeof sendOtpSchema>;
export type VerifyOtpPayload = z.infer<typeof verifyOtpSchema>;
