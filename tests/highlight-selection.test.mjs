import { test } from "node:test";
import assert from "node:assert/strict";
import { addHighlight, availableHighlights } from "../lib/task/highlight-selection.ts";

const tags = [
  { id: "arrays", label: "Masīvi", archived: false },
  { id: "sort", label: "Kārtošana", archived: false },
  { id: "old", label: "Vecais temats", archived: true },
];

test("search is Latvian case-insensitive and excludes retired and selected tags", () => {
  assert.deepEqual(availableHighlights(tags, [], "  KĀR ").map(t => t.id), ["sort"]);
  assert.deepEqual(availableHighlights(tags, ["arrays"], "").map(t => t.id), ["sort"]);
  assert.deepEqual(availableHighlights(tags, [], "vecais"), []);
});

test("selection preserves order and limits assignments to two distinct ids", () => {
  assert.deepEqual(addHighlight([], "arrays"), ["arrays"]);
  assert.deepEqual(addHighlight(["arrays"], "arrays"), ["arrays"]);
  assert.deepEqual(addHighlight(["arrays"], "sort"), ["arrays", "sort"]);
  assert.deepEqual(addHighlight(["arrays", "sort"], "old"), ["arrays", "sort"]);
});
