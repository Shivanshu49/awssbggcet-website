// Usage: pnpm check:registration
// The rules that are easy to break silently: section 3a's validation, masking and journey progress.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

import { ZXING_WASM_VERSION } from 'barcode-detector/ponyfill';

import { cronAuthorized } from '../lib/admin/cron-auth';
import { escapeLike, parseAdminEmails, toCsv } from '../lib/admin/rules';
import { dbCredentials, dbSsl } from '../lib/db/ssl';
import { eventPage, qrReleased } from '../lib/registration/content';
import {
  formatDeadline,
  hoursLeft,
  interestsEditable,
  journeyStates,
  maskEmail,
  maskPhone,
  maskUtr,
  passSteps,
  reminderLine,
  seatDeadline,
} from '../lib/registration/format';
import {
  builderIdSchema,
  checkinCodeFromScan,
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
} else {
  assert.equal(detailsSchema.parse({ ...details, mealPref: '' }).mealPref, null);
  assert.equal(parsedDetails.mealPref, null, 'a value from an old form is dropped');
}
for (const id of ['ab', 'a'.repeat(51), 'has space', 'bad!']) {
  assert.equal(builderIdSchema.safeParse(id).success, false, id);
}
// Every pasted form of an alias saves the same value, so the unique index still catches duplicates.
const PROFILE = 'https://builder.aws.com/community/';
for (const pasted of [
  '@Asha.Rao-1',
  ' @asha.rao-1 ',
  `${PROFILE}@Asha.Rao-1`,
  ` ${PROFILE}@asha.rao-1/ `,
  `${PROFILE}@asha.rao-1?utm_source=share`,
  `${PROFILE}@asha.rao-1/#about`,
  'http://builder.aws.com/community/@asha.rao-1',
  'builder.aws.com/community/@asha.rao-1',
  'HTTPS://BUILDER.AWS.COM/community/@ASHA.RAO-1',
]) {
  assert.equal(builderIdSchema.parse(pasted), 'asha.rao-1', pasted);
  assert.equal(detailsSchema.parse({ ...details, builderId: pasted }).builderId, 'asha.rao-1', pasted);
}
assert.equal(builderIdSchema.parse('https://builder.aws.com/community/@shivanshu049'), 'shivanshu049');
assert.equal(detailsSchema.parse({ ...details, builderId: '   ' }).builderId, null, 'blank stays optional');
for (const bad of [
  '@',
  '@@asha',
  '@ab',
  '@has space',
  'asha@example.com',
  `${PROFILE}@`,
  `${PROFILE}@ab`,
  `${PROFILE}@has space`,
  `${PROFILE}@bad!`,
  `${PROFILE}asha`, // no @: not a profile
  `${PROFILE}events`, // a site page must not pass as the alias "events"
  `${PROFILE}@asha/posts`,
  'https://builder.aws.com/@asha',
  'https://evil.example/community/@asha',
  'https://builder.aws.com.evil.example/community/@asha',
  'https://builder.aws.com@evil.example/community/@asha',
  'https://evil.example/builder.aws.com/community/@asha',
  'ftp://builder.aws.com/community/@asha',
]) {
  assert.equal(builderIdSchema.safeParse(bad).success, false, bad);
  assert.equal(errorFor(detailsSchema, { ...details, builderId: bad }, 'builderId'), 'Enter a valid AWS Builder ID', bad);
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

const heldAt = new Date('2026-11-07T00:00:00Z');
const after_ = (hours: number) => new Date(heldAt.getTime() + hours * 3_600_000);
assert.equal(hoursLeft(heldAt, after_(24)), 24);
assert.equal(hoursLeft(heldAt, after_(24.5)), 24, 'rounds up');
assert.equal(hoursLeft(heldAt, after_(47.9)), 1);
assert.equal(hoursLeft(heldAt, after_(60)), 1, 'never says 0h');
assert.equal(reminderLine(24, true, 45), 'Your seat expires in 24h: pay ₹45');
assert.equal(reminderLine(24, false, 45), 'Your seat expires in 24h: add your Builder ID and pay ₹45');

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

assert.equal(qrReleased(new Date('2026-11-16T23:59:59+05:30')), false);
assert.equal(qrReleased(new Date('2026-11-16T18:30:00Z')), true, 'midnight IST, whatever the server zone');
assert.equal(qrReleased(new Date('2026-11-17T00:00:00+05:30')), true);

assert.deepEqual(passSteps('pending'), ['done', 'done', 'current']);
assert.deepEqual(passSteps('payment_submitted'), ['done', 'done', 'current']);
assert.deepEqual(passSteps('approved'), ['done', 'done', 'done']);
for (const status of ['waitlisted', 'rejected', 'cancelled'] as const) {
  assert.deepEqual(passSteps(status), ['done', 'done', 'upcoming'], status);
}

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

const CHECKIN_CODE = 'AbCdEfGhIjKlMnOpQrSt-_';
assert.equal(checkinCodeFromScan(`https://www.awssbggcet.com/admin/checkin?c=${CHECKIN_CODE}`), CHECKIN_CODE);
assert.equal(checkinCodeFromScan(` http://localhost:3000/admin/checkin?c=${CHECKIN_CODE} `), CHECKIN_CODE);
assert.equal(checkinCodeFromScan(CHECKIN_CODE), CHECKIN_CODE, 'a bare code');
for (const other of [
  'upi://pay?pa=9289850019@ptaxis&pn=A',
  'https://www.awssbggcet.com/admin/checkin',
  'https://www.awssbggcet.com/admin/checkin?c=short',
  'https://www.awssbggcet.com/admin/checkin?c=',
  `https://www.awssbggcet.com/admin/checkin?c=${CHECKIN_CODE}x`,
  'hello',
  '',
]) {
  assert.equal(checkinCodeFromScan(other), null, other);
}
assert.ok(existsSync(`public/scd/zxing_reader-${ZXING_WASM_VERSION}.wasm`), 'scanner WASM must match the installed library');

assert.deepEqual(parseAdminEmails(' A@x.com, b@y.org ,,'), ['a@x.com', 'b@y.org']);
assert.deepEqual(parseAdminEmails(undefined), [], 'unset means nobody is an admin');
assert.equal(escapeLike('50%_a\\b'), '50\\%\\_a\\\\b');

assert.equal(toCsv([['a', null, 'x,y', 'say "hi"', 'two\nlines']]), 'a,,"x,y","say ""hi""","two\nlines"');
for (const formula of ['=SUM(A1)', '+91', '-1', '@cmd', '\tx', '\rx']) {
  assert.ok(toCsv([[formula]]).replace(/^"/, '').startsWith("'"), `formula ${JSON.stringify(formula)}`);
}
assert.equal(toCsv([['a'], ['b']]), 'a\r\nb');

assert.equal(cronAuthorized('Bearer s3cret', 's3cret'), true);
assert.equal(cronAuthorized('Bearer wrong', 's3cret'), false);
assert.equal(cronAuthorized('s3cret', 's3cret'), false, 'needs the Bearer prefix');
assert.equal(cronAuthorized(null, 's3cret'), false);
assert.equal(cronAuthorized('Bearer ', ''), false, 'an unset secret refuses everything');
assert.equal(cronAuthorized('Bearer undefined', undefined), false, 'an unset secret refuses everything');

console.log('Registration rules OK');
