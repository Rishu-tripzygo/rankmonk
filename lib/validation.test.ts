// Run with `npm test` (Node's built-in test runner; Node strips the TS types).
import assert from "node:assert/strict";
import { test } from "node:test";
import { clean, parseDemo, validateDemo } from "./validation.ts";
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

test("clean truncates and rejects non-strings", () => {
  assert.equal(clean("x".repeat(50), 10).length, 10);
  assert.equal(clean(42, 10), "");
});

test("rateLimit allows N hits per window then blocks", () => {
  const key = `t-${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.equal(rateLimit(key, 3, 60_000), true);
  assert.equal(rateLimit(key, 3, 60_000), false);
});

test("blog markdown neutralises HTML and unsafe links", async () => {
  const { renderMarkdown, parsePostInput, slugify } = await import("./blog.ts");
  const html = renderMarkdown('# Title\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1)) [ok](/pricing) ![a](https://evil.com/x.png)');
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("javascript:"));
  assert.ok(!html.includes("evil.com"));
  assert.ok(html.includes('<h2 id="title">'));
  assert.ok(html.includes('href="/pricing"'));
  assert.equal(slugify("Google Business Profile: 2026 Checklist & Tips"), "google-business-profile-2026-checklist-and-tips");
  const bad = parsePostInput({ title: "short", category: "Nope" }, false);
  assert.equal(bad.ok, false);
  const good = parsePostInput({ title: "A proper title for a post", description: "d".repeat(80), content: "word ".repeat(300), category: "Local SEO", cover_image_url: "/images/blog-geo-grid.jpg", cover_image_alt: "Map" }, false);
  assert.equal(good.ok, true);
  if (good.ok) assert.equal(good.row.slug, "a-proper-title-for-a-post");
});
