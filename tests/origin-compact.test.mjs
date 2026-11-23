import assert from "node:assert/strict";
import test from "node:test";

import { compactLioOrigin } from "../lib/task/origin-compact.ts";

test("structured LIO year and stage win over legacy prose", () => {
  assert.deepEqual(
    compactLioOrigin({
      origin_olympiad: "LIO",
      origin_year: "2023/2024",
      olymp_stage: "national",
      origin_note_short: "Uzdevums no 2024. g. LIO skolas kārtas.",
    }),
    { year: "2024", stage: "valsts" },
  );
});

test("structured LIO stage label is lowercased for the compact stack", () => {
  assert.deepEqual(
    compactLioOrigin({
      origin_olympiad: "LIO",
      origin_year: "2026",
      olymp_stage: "selection",
    }),
    { year: "2026", stage: "atlases" },
  );
});

test("legacy LIO short note supplies year and stage", () => {
  assert.deepEqual(
    compactLioOrigin({
      origin_olympiad: "LIO",
      origin_year: "",
      olymp_stage: "",
      origin_note_short: "Uzdevums no 2024. g. LIO skolas kārtas.",
      origin_note:
        "Uzdevums no Latvijas 37. (2023./2024. m.g.) informātikas olimpiādes (LIO) skolas kārtas.",
    }),
    { year: "2024", stage: "skolas" },
  );
});

test("legacy LIO fallback uses the full note when the short note is absent", () => {
  assert.deepEqual(
    compactLioOrigin({
      origin_olympiad: "LIO",
      origin_note: "Uzdevums no 2002. g. LIO valsts kārtas.",
    }),
    { year: "2002", stage: "valsts" },
  );
});

test("unknown or missing legacy origin stays prose", () => {
  for (const origin_note_short of [
    "Uzdevums no 2024. g. LIO rajona kārtas.",
    "Uzdevums no 2024. g. skolas kārtas.",
    "Uzdevums no LIO skolas kārtas.",
    "Uzdevums no 2024. g. LIO kārtas.",
    "",
  ]) {
    assert.equal(
      compactLioOrigin({ origin_olympiad: "LIO", origin_note_short }),
      null,
      origin_note_short,
    );
  }
});

test("unknown structured LIO stage stays prose", () => {
  assert.equal(
    compactLioOrigin({
      origin_olympiad: "LIO",
      origin_year: "2024",
      olymp_stage: "rajona",
    }),
    null,
  );
});

test("legacy parsing is LIO only", () => {
  assert.equal(
    compactLioOrigin({
      origin_olympiad: "BOI",
      origin_note_short: "Uzdevums no 2024. g. LIO skolas kārtas.",
    }),
    null,
  );
});
