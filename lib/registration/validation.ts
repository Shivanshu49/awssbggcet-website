import { z } from 'zod';

import { eventPage } from './content';

// One set of rules shared by the form and the server (plan section 3a).
const { allowOtherColleges, branches, colleges, registration, workshops } = eventPage;

export const YEAR_OPTIONS = [
  { value: '1st', label: '1st' },
  { value: '2nd', label: '2nd' },
  { value: '3rd', label: '3rd' },
  { value: '4th', label: '4th' },
  { value: 'other', label: 'Other' },
] as const;

export const MEAL_OPTIONS = [
  { value: 'veg', label: 'Veg' },
  { value: 'non_veg', label: 'Non-veg' },
  { value: 'jain', label: 'Jain' },
] as const;

const YEARS = ['1st', '2nd', '3rd', '4th', 'other'] as const;
const MEALS = ['veg', 'non_veg', 'jain'] as const;
type Meal = (typeof MEALS)[number];

const NAME_ERROR = 'Please enter your full name';
const COLLEGE_ERROR = 'Enter your college or university name';
const BRANCH_ERROR = 'Choose your branch';
const YEAR_ERROR = 'Choose your year of study';
const MEAL_ERROR = 'Choose a meal preference';
const BUILDER_ID_ERROR = 'Enter a valid AWS Builder ID';
const EMAIL_ERROR = 'Enter a valid email address';
const PHONE_ERROR = 'Enter a valid 10-digit mobile number';
const CONSENT_ERROR = 'Please accept to continue';

export const BUILDER_ID_TAKEN =
  "This Builder ID is already linked to another registration — contact us if that's wrong.";

// Starts with a letter; \p{M} keeps combining marks, so names in Indian scripts pass.
const NAME_PATTERN = /^\p{L}[\p{L}\p{M} .'’-]*$/u;
const BUILDER_ID_PATTERN = /^[A-Za-z0-9._-]{3,50}$/;
const PASS_CODE_PATTERN = /^[\w-]{22}$/; // randomBytes(16) in base64url

export const passCodeSchema = z.string().regex(PASS_CODE_PATTERN);

export const builderIdSchema = z
  .string(BUILDER_ID_ERROR)
  .trim()
  .regex(BUILDER_ID_PATTERN, BUILDER_ID_ERROR)
  .transform((value) => value.toLowerCase());

export const emailSchema = z
  .string(EMAIL_ERROR)
  .trim()
  .toLowerCase()
  .max(254, EMAIL_ERROR)
  .pipe(z.email(EMAIL_ERROR));

// Step 1: Your details
export const detailsSchema = z.object({
  name: z
    .string(NAME_ERROR)
    .trim()
    .min(2, NAME_ERROR)
    .max(120, NAME_ERROR)
    .regex(NAME_PATTERN, NAME_ERROR),
  college: z
    .string(COLLEGE_ERROR)
    .trim()
    .min(2, COLLEGE_ERROR)
    .max(200, COLLEGE_ERROR)
    .refine((value) => allowOtherColleges || value === colleges[0], COLLEGE_ERROR),
  branch: z.string(BRANCH_ERROR).refine((value) => branches.includes(value), BRANCH_ERROR),
  yearOfStudy: z.enum(YEARS, { error: YEAR_ERROR }),
  mealPref: z
    .string(MEAL_ERROR)
    .refine((value) => !registration.collectMeal || (MEALS as readonly string[]).includes(value), MEAL_ERROR)
    .transform((value) => (registration.collectMeal ? (value as Meal) : null)),
  builderId: z
    .string(BUILDER_ID_ERROR)
    .trim()
    .refine((value) => value === '' || BUILDER_ID_PATTERN.test(value), BUILDER_ID_ERROR)
    .transform((value) => value.toLowerCase() || null),
});

// Step 2: Contact & confirm
export const contactSchema = z.object({
  email: emailSchema,
  phone: z.string(PHONE_ERROR).trim().regex(/^[6-9]\d{9}$/, PHONE_ERROR),
  consent: z.literal(true, { error: CONSENT_ERROR }),
});

export const registrationSchema = detailsSchema.extend(contactSchema.shape);
export type RegistrationInput = z.output<typeof registrationSchema>;

export const NONE_OF_THE_ABOVE = 'none';

export const interestsSchema = z.object({
  interests: z
    .array(z.string())
    .refine((list) => list.every((item) => item === NONE_OF_THE_ABOVE || workshops.includes(item))),
  note: z.string().trim().max(500, 'Keep this under 500 characters'),
});

export function firstErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[String(issue.path[0])] ??= issue.message;
  return errors;
}
