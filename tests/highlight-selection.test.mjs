import { test } from "node:test";
import assert from "node:assert/strict";
import { addHighlight, availableHighlights } from "../lib/task/highlight-selection.ts";
import { highlightPresentation, visibleHighlights } from "../lib/task/highlight-presentation.ts";

const tags = [
  { id: "arrays", label: "Masīvi", archived: false },
  { id: "sort", label: "Kārtošana", archived: false },
  { id: "old", label: "Vecais temats", archived: true },
  { id: "breadth-first", label: "meklēšana plašumā", abbreviation: "BFS", english_label: "breadth-first search", archived: false },
];

test("search is Latvian case-insensitive and excludes retired and selected tags", () => {
  assert.deepEqual(availableHighlights(tags, [], "  KĀR ").map(t => t.id), ["sort"]);
  assert.deepEqual(availableHighlights(tags, ["arrays"], "").map(t => t.id), ["sort", "breadth-first"]);
  assert.deepEqual(availableHighlights(tags, [], "vecais"), []);
});

test("search includes slug, abbreviation and English name", () => {
  for (const query of ["breadth-first", "bfs", "SEARCH", "plašumā"]) {
    assert.deepEqual(availableHighlights(tags, [], query).map(t => t.id), ["breadth-first"]);
  }
});

test("abbreviated chips retain their full name and optional English in the title", () => {
  assert.deepEqual(highlightPresentation(tags[3]), {
    text: "BFS", title: "meklēšana plašumā\nbreadth-first search (BFS)",
  });
  assert.deepEqual(highlightPresentation(tags[0]), { text: "Masīvi", title: undefined });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", abbreviation: "  " }), { text: "Temats", title: undefined });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", abbreviation: " DP " }), { text: "DP", title: "Temats" });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", abbreviation: " temats " }), { text: "Temats", title: undefined });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", english_label: "topic" }), { text: "Temats", title: "Temats\ntopic" });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", english_label: " TEMATS " }), { text: "Temats", title: undefined });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", abbreviation: "DP", english_label: "temats" }), { text: "DP", title: "Temats" });
  assert.deepEqual(highlightPresentation({ id: "x", label: "Temats", abbreviation: "DP", english_label: "dp" }), { text: "DP", title: "Temats" });
});

test("selection preserves order and limits assignments to two distinct ids", () => {
  assert.deepEqual(addHighlight([], "arrays"), ["arrays"]);
  assert.deepEqual(addHighlight(["arrays"], "arrays"), ["arrays"]);
  assert.deepEqual(addHighlight(["arrays"], "sort"), ["arrays", "sort"]);
  assert.deepEqual(addHighlight(["arrays", "sort"], "old"), ["arrays", "sort"]);
});

test("hidden highlighted topics leave no chip or description data, guests remain unchanged", () => {
  assert.deepEqual(visibleHighlights(tags, true), []);
  assert.deepEqual(visibleHighlights(tags, false), tags);
  assert.deepEqual(visibleHighlights(tags, undefined), tags);
  assert.deepEqual(visibleHighlights(undefined, false), []);
});
