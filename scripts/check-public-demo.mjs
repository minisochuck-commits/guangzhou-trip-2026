import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const evaluate = async file => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64'));
const data = await evaluate('lib/trip-data.ts');
assert.equal(data.PEOPLE.length, 5);
for (const [i, person] of data.PEOPLE.entries()) {
  assert.equal(person.id, `guest${i + 1}`);
  assert.equal(person.name, `Guest ${i + 1}`);
  assert(!('ticketName' in person));
}
for (const segment of data.FLIGHTS) {
  assert(segment.from.date.startsWith('2026-'));
  assert(segment.to.date.startsWith('2026-'));
}
assert.equal(data.REFERENCE_IMAGES.length, 0);
const eventSource = fs.readFileSync('lib/meeting-guide.ts', 'utf8').replace(/^import type.*$/m, '');
const eventData = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(eventSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64'));
assert.equal(eventData.EVENT_CONTACTS.length, 2);
assert(eventData.EVENT_CONTACTS.every(contact => contact.phone === null));
assert.deepEqual(fs.readdirSync('public/reference'), ['demo-cover.svg']);
// Check direct personal-phone assignments, while preserving the public hotel number.
for (const file of ['lib/trip-data.ts', 'lib/meeting-guide.ts', 'components/trip/attendee-guide-ar.tsx']) {
  const source = fs.readFileSync(file, 'utf8');
  assert(!/(?:\+86[ -]?)?\b1[3-9]\d{9}\b/.test(source), `Personal mobile number in ${file}`);
}
console.log('PASS: synthetic visitors/dates, no ticket names, no personal contact numbers, synthetic reference assets only.');
