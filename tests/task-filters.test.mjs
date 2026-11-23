import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// The Next.js bundler resolves extensionless TypeScript imports.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith("/lib/task/origin-compact")) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
const { parseTaskListSearchParams, taskListSearchHref, taskMatchesFilters, sourcesFromFilterTree, decorateOriginTree } = await import("../app/(platform)/tasks/origin-filter.ts");

const sources = [
  { id: "LIO", kind: "olympiad", count: 1, years: [] },
  { id: "PPS", kind: "institution", count: 1, years: [] },
  { id: "other", kind: "other", count: 1, years: [] },
];
const task = { full_name: "Piena iepirkums", source_id: "PPS", difficulty_rating: 1 };

test("LIO URL round-trips and structured filters still apply", () => {
  const { filters, query } = parseTaskListSearchParams(new URLSearchParams("origin=LIO&year=2025&stage=national&age=junior"));
  assert.equal(taskListSearchHref("/tasks", filters, query), "/tasks?origin=LIO&year=2025&stage=national&age=junior");
  const lio = { ...task, source_id: "LIO", origin_year: "2024/2025", olymp_stage: "national", origin_divisions: ["junior"] };
  assert.equal(taskMatchesFilters(lio, filters, "", sources), true);
  assert.equal(taskMatchesFilters({ ...lio, olymp_stage: "school" }, filters, "", sources), false);
});

test("institution and other ignore stale olympiad parameters", () => {
  const { filters } = parseTaskListSearchParams(new URLSearchParams("origin=PPS&year=2025&stage=national&age=junior"));
  assert.equal(taskListSearchHref("/tasks", { ...filters, yearId: null, stageId: null, ageGroupId: null }, ""), "/tasks?origin=PPS");
  assert.equal(taskMatchesFilters(task, filters, "piena", sources), true);
  assert.equal(taskMatchesFilters(task, { ...filters, originId: "other" }, "", sources), false);
  assert.equal(taskMatchesFilters({ ...task, source_id: "other" }, { ...filters, originId: "other" }, "", sources), true);
  assert.equal(taskMatchesFilters(task, filters, "not found", sources), false);
});

test("older responses fall back to olympiads and origin_olympiad", () => {
  const fallback = sourcesFromFilterTree(undefined, [{ id: "LIO", count: 1, years: [] }, { id: "other", count: 1, years: [] }]);
  assert.deepEqual(fallback.map((s) => s.kind), ["olympiad", "other"]);
  assert.equal(sourcesFromFilterTree([], fallback).length, 0);
  assert.equal(taskMatchesFilters({ ...task, source_id: undefined, origin_olympiad: "LIO" }, { originId: "LIO", yearId: null, stageId: null, ageGroupId: null }, "", fallback), true);
  assert.equal(decorateOriginTree(sources)[1].fullName, "Pirmā programmēšanas skola");
});
