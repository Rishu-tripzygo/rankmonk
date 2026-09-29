// Run with `npm test` (Node's built-in test runner; Node strips the TS types).
import assert from "node:assert/strict";
import { test } from "node:test";
import { clean, escapeHtml, parseDemo, validateDemo } from "./validation.ts";
import { rateLimit } from "./rate-limit.ts";

test("validateDemo enforces the reference rules", () => {
  assert.deepEqual(validateDemo({ name: "Asha", email: "asha@clinic.in", phone: "+91 98765 43210" }), {});
  const e = validateDemo({ name: " ", email: "nope", phone: "12345" });
  assert.ok(e.name && e.email && e.phone);
});

test("parseDemo sanitises untrusted input", () => {
  const r = parseDemo({ name: "  Asha\u0000 Rao ", email: "ASHA@Clinic.in", phone: "9876543210", locations: "evil", message: "a\r\nb", extra: 1 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.data.name, "Asha Rao");
  assert.equal(r.data.email, "asha@clinic.in");
  assert.equal(r.data.locations, "2–10");
  assert.equal(r.data.message, "a\nb");
  assert.equal(parseDemo(null).ok, false);
  assert.equal(parseDemo({ name: "x", email: "a@b.co", phone: "<script>1234567890" }).ok, false);
});

test("clean truncates and escapeHtml escapes", () => {
  assert.equal(clean("x".repeat(50), 10).length, 10);
  assert.equal(clean(42, 10), "");
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
});

test("rateLimit allows N hits per window then blocks", () => {
  const key = `t-${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.equal(rateLimit(key, 3, 60_000), true);
  assert.equal(rateLimit(key, 3, 60_000), false);
});
