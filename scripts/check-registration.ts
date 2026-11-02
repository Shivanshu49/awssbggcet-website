// Usage: pnpm check:registration
// The rules that are easy to break silently: section 3a's validation, masking and journey progress.
import assert from 'node:assert/strict';

import { eventPage } from '../lib/registration/content';
import { journeyStates, maskEmail, maskPhone } from '../lib/registration/format';
import { builderIdSchema, contactSchema, detailsSchema } from '../lib/registration/validation';

const details = {
  name: 'Asha Rao',
  college: eventPage.colleges[0],
  branch: eventPage.branches[0],
  yearOfStudy: '2nd',
  mealPref: 'veg',
  builderId: '',
};
const contact = { email: ' Asha@Example.COM ', phone: '9812345210', consent: true };
const errorFor = (schema: typeof detailsSchema | typeof contactSchema, input: object, field: string) => {
  const result = schema.safeParse(input);
  return result.success ? undefined : result.error.issues.find((i) => i.path[0] === field)?.message;
};

const parsedDetails = detailsSchema.parse(details);
assert.equal(parsedDetails.builderId, null);
assert.equal(detailsSchema.parse({ ...details, builderId: ' Asha.Rao-1 ' }).builderId, 'asha.rao-1');
assert.equal(contactSchema.parse(contact).email, 'asha@example.com');
assert.equal(detailsSchema.parse({ ...details, name: ' आशा राव ' }).name, 'आशा राव');
assert.equal(detailsSchema.parse({ ...details, name: "Mary-Jane O'Neil Jr." }).name, "Mary-Jane O'Neil Jr.");

const NAME = 'Please enter your full name';
for (const name of ['', 'A', '1Asha', 'Asha2', '-Asha', 'A'.repeat(121)]) {
  assert.equal(errorFor(detailsSchema, { ...details, name }, 'name'), NAME, name);
}
assert.equal(errorFor(detailsSchema, { ...details, college: '' }, 'college'), 'Enter your college or university name');
assert.equal(errorFor(detailsSchema, { ...details, branch: 'Nope' }, 'branch'), 'Choose your branch');
assert.equal(errorFor(detailsSchema, { ...details, yearOfStudy: '' }, 'yearOfStudy'), 'Choose your year of study');
assert.equal(detailsSchema.parse({ ...details, yearOfStudy: 'other' }).yearOfStudy, 'other');
if (eventPage.registration.collectMeal) {
  assert.equal(errorFor(detailsSchema, { ...details, mealPref: '' }, 'mealPref'), 'Choose a meal preference');
}
for (const id of ['ab', 'a'.repeat(51), 'has space', 'bad!']) {
  assert.equal(builderIdSchema.safeParse(id).success, false, id);
}
assert.equal(errorFor(contactSchema, { ...contact, email: 'nope' }, 'email'), 'Enter a valid email address');
for (const phone of ['', '5812345210', '981234521', '98123452100', '+919812345210']) {
  assert.equal(errorFor(contactSchema, { ...contact, phone }, 'phone'), 'Enter a valid 10-digit mobile number', phone);
}
assert.equal(errorFor(contactSchema, { ...contact, consent: false }, 'consent'), 'Please accept to continue');

assert.equal(maskEmail('shivanshu@gmail.com'), 'sh****@gmail.com');
assert.equal(maskEmail('a@b.co'), 'a****@b.co');
assert.equal(maskPhone('9812345210'), '98•••••210');

const journey = [
  { phase: 'before', step: 'registered', title: '' },
  { phase: 'before', step: 'builder_id', title: '' },
  { phase: 'before', step: 'approved', title: '' },
  { phase: 'venue', step: 'checked_in', title: '' },
  { phase: 'venue', step: null, title: '' },
] as const;
const states = (status: 'pending' | 'approved' | 'rejected', builderId: string | null, checkedInAt: Date | null = null) =>
  journeyStates([...journey], { status, builderId, checkedInAt });
assert.deepEqual(states('pending', null), ['done', 'current', 'upcoming', 'upcoming', 'info']);
assert.deepEqual(states('pending', 'asha'), ['done', 'done', 'current', 'upcoming', 'info']);
assert.deepEqual(states('approved', 'asha'), ['done', 'done', 'done', 'current', 'info']);
assert.deepEqual(states('approved', 'asha', new Date()), ['done', 'done', 'done', 'done', 'info']);
assert.deepEqual(states('rejected', 'asha'), ['done', 'done', 'upcoming', 'upcoming', 'info']);

console.log('Registration rules OK');
