// Usage: pnpm check:registration
// The rules that are easy to break silently: section 3a's validation, masking and journey progress.
import assert from 'node:assert/strict';

import { escapeLike, parseAdminEmails, toCsv } from '../lib/admin/rules';
import { dbCredentials, dbSsl } from '../lib/db/ssl';
import { eventPage } from '../lib/registration/content';
import {
  formatDeadline,
  interestsEditable,
  journeyStates,
  maskEmail,
  maskPhone,
  maskUtr,
  seatDeadline,
} from '../lib/registration/format';
import {
  builderIdSchema,
  contactSchema,
  detailsSchema,
  interestsSchemaFor,
  normalizePhone,
  paymentSchema,
} from '../lib/registration/validation';

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
for (const phone of ['+91 98123 45210', '919812345210', '09812345210']) {
  assert.equal(normalizePhone(phone), '9812345210', phone);
  assert.equal(contactSchema.parse({ ...contact, phone }).phone, '9812345210', phone);
}
assert.equal(normalizePhone('9198123456'), '9198123456');
assert.equal(contactSchema.parse({ ...contact, phone: '9198123456' }).phone, '9198123456');
for (const phone of ['', '5812345210', '981234521', '98123452100', '98123452101']) {
  assert.equal(errorFor(contactSchema, { ...contact, phone }, 'phone'), 'Enter a valid 10-digit mobile number', phone);
}
assert.equal(errorFor(contactSchema, { ...contact, consent: false }, 'consent'), 'Please accept to continue');

assert.equal(maskEmail('shivanshu@gmail.com'), 'sh****@gmail.com');
assert.equal(maskEmail('a@b.co'), 'a****@b.co');
assert.equal(maskPhone('9812345210'), '98•••••210');
assert.equal(maskUtr('123456789012'), '••••••••9012');

const payment = { utr: ' 123456789012 ', payerName: ' Asha Rao ' };
assert.deepEqual(paymentSchema.parse(payment), { utr: '123456789012', payerName: 'Asha Rao' });
for (const utr of ['', '12345678901', '1234567890123', '12345678901a', '1234 5678 9012', '١٢٣٤٥٦٧٨٩٠١٢']) {
  assert.equal(paymentSchema.safeParse({ ...payment, utr }).success, false, `utr ${utr}`);
}
for (const payerName of ['', 'A', 'A'.repeat(121)]) {
  assert.equal(paymentSchema.safeParse({ ...payment, payerName }).success, false, `payer ${payerName}`);
}

// 48 hours from noon IST on 7 Nov, shown in IST whatever the server's time zone.
const deadline = seatDeadline(new Date('2026-11-07T12:00:00+05:30'));
assert.equal(deadline.toISOString(), new Date('2026-11-09T12:00:00+05:30').toISOString());
assert.match(formatDeadline(deadline), /^9 Nov 2026, 12:00 pm IST$/i);

const journey = [
  { phase: 'before', step: 'registered', title: '' },
  { phase: 'before', step: 'builder_id', title: '' },
  { phase: 'before', step: 'paid', title: '' },
  { phase: 'before', step: 'approved', title: '' },
  { phase: 'venue', step: 'checked_in', title: '' },
  { phase: 'venue', step: null, title: '' },
] as const;
const states = (
  status: 'pending' | 'payment_submitted' | 'approved' | 'waitlisted' | 'cancelled',
  builderId: string | null,
  utr: string | null = null,
  checkedInAt: Date | null = null,
) => journeyStates([...journey], { status, builderId, utr, checkedInAt });
const UTR = '123456789012';
assert.deepEqual(states('pending', null), ['done', 'current', 'upcoming', 'upcoming', 'upcoming', 'info']);
assert.deepEqual(states('pending', 'asha'), ['done', 'done', 'current', 'upcoming', 'upcoming', 'info']);
assert.deepEqual(states('payment_submitted', 'asha', UTR), ['done', 'done', 'done', 'current', 'upcoming', 'info']);
assert.deepEqual(states('approved', 'asha', UTR), ['done', 'done', 'done', 'done', 'current', 'info']);
assert.deepEqual(states('approved', 'asha', UTR, new Date()), ['done', 'done', 'done', 'done', 'done', 'info']);
assert.deepEqual(states('waitlisted', null), ['done', 'current', 'upcoming', 'upcoming', 'upcoming', 'info']);
assert.deepEqual(states('waitlisted', 'asha'), ['done', 'done', 'upcoming', 'upcoming', 'upcoming', 'info'], 'no seat, so paying is not next');
assert.deepEqual(states('cancelled', 'asha'), ['done', 'done', 'upcoming', 'upcoming', 'upcoming', 'info']);

const interests = interestsSchemaFor(['A', 'B']);
assert.deepEqual(interests.parse({ interests: ['A', 'A', 'none'], note: '' }).interests, ['A', 'none']);
assert.equal(interests.safeParse({ interests: ['A', 'B', 'none', 'A'], note: '' }).success, false, 'too many items');
assert.equal(interests.safeParse({ interests: ['Z'], note: '' }).success, false, 'unknown workshop');

const before = new Date('2026-11-21T09:00:00+05:30');
const after = new Date('2026-11-21T11:00:00+05:30');
const eventStart = new Date('2026-11-21T10:00:00+05:30');
for (const status of ['pending', 'payment_submitted', 'approved', 'waitlisted'] as const) {
  assert.equal(interestsEditable(status, eventStart, before), true, status);
  assert.equal(interestsEditable(status, eventStart, after), false, status);
}
for (const status of ['rejected', 'cancelled'] as const) {
  assert.equal(interestsEditable(status, eventStart, before), false, status);
}

const POOLER = 'aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
assert.equal(dbSsl(`postgresql://u:p@${POOLER}`), 'require');
assert.equal(dbSsl(`postgresql://u:p@${POOLER}?sslmode=disable`), 'require', "a URL can't turn TLS off");
assert.equal(dbSsl(`postgresql://localhost:127.0.0.1@${POOLER}`), 'require', 'localhost in the credentials');
assert.equal(dbSsl(undefined), 'require', 'CI builds with no URL');
assert.equal(dbSsl('port 6543'), 'require', 'not a URL');
assert.equal(dbSsl('postgres://postgres@127.0.0.1:55432/scd'), false);
assert.equal(dbSsl('postgres://localhost/scd'), false);

const PASSWORD = 'p@ss/w#rd%20 x:y?z';
assert.deepEqual(
  dbCredentials(`postgresql://postgres.ref:${encodeURIComponent(PASSWORD)}@x.pooler.supabase.com:5432/postgres`),
  { host: 'x.pooler.supabase.com', port: 5432, user: 'postgres.ref', password: PASSWORD, database: 'postgres', ssl: 'require' },
);
assert.deepEqual(dbCredentials('postgres://postgres@127.0.0.1:55432/scd'), {
  host: '127.0.0.1',
  port: 55432,
  user: 'postgres',
  password: undefined,
  database: 'scd',
  ssl: false,
});
assert.equal(dbCredentials(undefined).host, '', 'no URL: migrate stops on the empty host');
assert.equal(dbCredentials(undefined).ssl, 'require');

assert.deepEqual(parseAdminEmails(' A@x.com, b@y.org ,,'), ['a@x.com', 'b@y.org']);
assert.deepEqual(parseAdminEmails(undefined), [], 'unset means nobody is an admin');
assert.equal(escapeLike('50%_a\\b'), '50\\%\\_a\\\\b');

assert.equal(toCsv([['a', null, 'x,y', 'say "hi"', 'two\nlines']]), 'a,,"x,y","say ""hi""","two\nlines"');
for (const formula of ['=SUM(A1)', '+91', '-1', '@cmd', '\tx', '\rx']) {
  assert.ok(toCsv([[formula]]).replace(/^"/, '').startsWith("'"), `formula ${JSON.stringify(formula)}`);
}
assert.equal(toCsv([['a'], ['b']]), 'a\r\nb');

console.log('Registration rules OK');
