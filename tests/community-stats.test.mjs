import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCommunityStats,
  formatCommunityCount,
} from "../lib/task/community-stats.ts";

function parseWedgePath(path) {
  assert.equal(typeof path, "string");
  assert.ok(!/[eE]/.test(path), `scientific notation: ${path}`);
  const tokens = path.match(/[MLAZ]|-?\d+(?:\.\d+)?/g) ?? [];
  let index = 0;
  const nextToken = () => {
    assert.ok(index < tokens.length, path);
    return tokens[index++];
  };
  const number = () => {
    const value = Number(nextToken());
    assert.ok(Number.isFinite(value), path);
    return value;
  };

  assert.equal(nextToken(), "M");
  const cx = number();
  const cy = number();
  assert.equal(nextToken(), "L");
  let start = [number(), number()];
  const arcs = [];
  while (tokens[index] === "A") {
    index++;
    const rx = number();
    const ry = number();
    const rotation = number();
    const largeArc = number();
    const sweep = number();
    const end = [number(), number()];
    arcs.push({ rx, ry, rotation, largeArc, sweep, start, end });
    start = end;
  }
  assert.equal(nextToken(), "Z");
  assert.equal(index, tokens.length, path);
  return { cx, cy, arcs };
}

function arcLength(arc) {
  return Math.hypot(arc.end[0] - arc.start[0], arc.end[1] - arc.start[1]);
}

function assertSameGeometry(path) {
  const { cx, cy, arcs } = parseWedgePath(path);
  assert.equal(cx, 10, path);
  assert.equal(cy, 10, path);
  assert.ok(arcs.length > 0, path);
  // viewBox is 0 0 20 20. Every arc is an explicit, finite sub-180-degree
  // segment with the 10px radius; no coordinate uses exponent notation.
  for (const arc of arcs) {
    assert.equal(arc.rx, 10, path);
    assert.equal(arc.ry, 10, path);
    assert.equal(arc.rotation, 0, path);
    assert.equal(arc.largeArc, 0, path);
    assert.equal(arc.sweep, 1, path);
    for (const value of [...arc.start, ...arc.end]) {
      assert.ok(Number.isFinite(value), path);
      assert.ok(value >= 0 && value <= 20, `${value} in ${path}`);
    }
  }
}

test("missing stats and zero attempted users have no verdict breakdown", () => {
  assert.equal(buildCommunityStats(undefined), null);
  assert.equal(buildCommunityStats(null), null);
  assert.equal(
    buildCommunityStats({
      unique_attempted: 0,
      unique_solvers: 0,
      verdicts: { accepted: 0 },
    }),
    null,
  );
  assert.equal(
    buildCommunityStats({ unique_attempted: Number.NaN, unique_solvers: 3 }),
    null,
  );
  assert.equal(
    buildCommunityStats({ unique_attempted: -3, unique_solvers: 0 }),
    null,
  );
});

test("attempts without solvers show count 0 and a filled verdict pie", () => {
  const view = buildCommunityStats({
    unique_attempted: 3,
    unique_solvers: 0,
    verdicts: { wrong_answer: 3 },
  });
  assert.ok(view);
  assert.equal(view.uniqueSolvers, 0);
  assert.equal(view.displaySolvers, "0");
  assert.equal(view.uniqueAttempted, 3);
  assert.equal(view.slices.length, 1);
  assert.equal(view.slices[0].key, "wrong_answer");
  assert.equal(view.slices[0].count, 3);
  assert.equal(view.slices[0].colorClass, "text-subm-danger");
  assert.equal(view.slices[0].fullCircle, true);
  assert.equal(view.slices[0].path, null);
  assert.equal(
    view.summary,
    "Atrisinājuši: 0. Mēģinājuši: 3. Nepareiza atbilde: 3.",
  );
  assert.match(view.summary, /^Atrisinājuši: 0\. Mēģinājuši: 3\./);
});

test("all-zero verdicts cannot produce a breakdown when attempts exist", () => {
  assert.equal(
    buildCommunityStats({
      unique_attempted: 8,
      unique_solvers: 0,
      verdicts: {
        accepted: 0,
        partially_correct: 0,
        wrong_answer: 0,
        time_limit_exceeded: 0,
        memory_limit_exceeded: 0,
        runtime_error: 0,
        compile_error: 0,
        internal_error: 0,
        tester_unavailable: 0,
        unknown: 0,
      },
    }),
    null,
  );
});

test("a single 100% accepted slice renders as a full circle", () => {
  const view = buildCommunityStats({
    unique_attempted: 4,
    unique_solvers: 4,
    verdicts: { accepted: 4 },
  });
  assert.ok(view);
  assert.equal(view.displaySolvers, "4");
  assert.equal(view.slices.length, 1);
  assert.equal(view.slices[0].key, "accepted");
  assert.equal(view.slices[0].fullCircle, true);
  assert.equal(view.slices[0].path, null);
  assert.equal(view.slices[0].fraction, 1);
  assert.equal(view.slices[0].colorClass, "text-subm-success");
  assert.equal(
    view.summary,
    "Atrisinājuši: 4. Mēģinājuši: 4. Atbilde ir pareiza: 4.",
  );
});

test("mixed verdicts keep fixed order, exact sums and finite wedge arcs", () => {
  const view = buildCommunityStats({
    unique_attempted: 10,
    unique_solvers: 6,
    verdicts: {
      wrong_answer: 2,
      partially_correct: 2,
      accepted: 6,
    },
  });
  assert.ok(view);
  assert.deepEqual(
    view.slices.map((slice) => [slice.key, slice.count]),
    [
      ["accepted", 6],
      ["partially_correct", 2],
      ["wrong_answer", 2],
    ],
  );
  assert.equal(
    view.slices.reduce((sum, slice) => sum + slice.fraction, 0),
    1,
  );
  assert.equal(view.slices[0].fraction, 0.6);
  assert.equal(view.slices[1].fraction, 0.2);
  assert.equal(view.slices[2].fraction, 0.2);
  for (const slice of view.slices) {
    assert.equal(slice.fullCircle, false);
    assertSameGeometry(slice.path);
    assert.match(slice.path, /^M 10 10 L /);
  }
  // The 60% wedge is split into two sub-180-degree arcs so its endpoints can
  // never collapse into one another.
  const accepted = parseWedgePath(view.slices[0].path);
  assert.equal(accepted.arcs.length, 2);
  for (const arc of accepted.arcs) {
    assert.ok(arcLength(arc) > 1, "accepted arc endpoints collapsed");
  }
  assert.equal(parseWedgePath(view.slices[1].path).arcs.length, 1);
  assert.equal(parseWedgePath(view.slices[2].path).arcs.length, 1);
  assert.match(view.summary, /Atrisinājuši: 6\. Mēģinājuši: 10\./);
  assert.match(view.summary, /Atbilde ir pareiza: 6\./);
  assert.match(view.summary, /Daļēji pareizi: 2\./);
  assert.match(view.summary, /Nepareiza atbilde: 2\./);
});

test("tiny and unknown verdicts stay proportional and merge into unknown", () => {
  const view = buildCommunityStats({
    unique_attempted: 1000000,
    unique_solvers: 999999,
    verdicts: {
      accepted: 999999,
      some_future_verdict: 1,
    },
  });
  assert.ok(view);
  assert.equal(view.slices.length, 2);
  assert.equal(view.slices[0].key, "accepted");
  assert.equal(view.slices[0].fraction, 0.999999);
  assert.equal(view.slices[1].key, "unknown");
  assert.equal(view.slices[1].count, 1);
  assert.equal(view.slices[1].fraction, 1 / 1000000);
  assert.equal(view.slices[1].colorClass, "text-default-500");
  // Not inflated to a minimum wedge.
  assert.equal(view.slices[1].fraction, 1 / 1000000);
  assert.ok(view.slices[1].fraction < 0.001);
  assertSameGeometry(view.slices[0].path);
  assertSameGeometry(view.slices[1].path);
  // The dominant wedge must stay a visible almost-full circle: splitting it
  // keeps both arc endpoints far apart even though 1/1e6 is nearly zero.
  const dominant = parseWedgePath(view.slices[0].path);
  assert.equal(dominant.arcs.length, 2);
  for (const arc of dominant.arcs) {
    assert.ok(arcLength(arc) > 10, `dominant arc collapsed: ${JSON.stringify(arc)}`);
  }
  const tiny = parseWedgePath(view.slices[1].path);
  assert.equal(tiny.arcs.length, 1);
  assert.ok(arcLength(tiny.arcs[0]) > 0, "tiny arc collapsed entirely");
  assert.match(view.summary, /Nezināms: 1\./);
});

test("unrecognized keys combine into one neutral unknown slice", () => {
  const view = buildCommunityStats({
    unique_attempted: 9,
    unique_solvers: 2,
    verdicts: { accepted: 2, foo: 3, bar: 4 },
  });
  assert.ok(view);
  const unknown = view.slices.find((slice) => slice.key === "unknown");
  assert.ok(unknown);
  assert.equal(unknown.count, 7);
  assert.equal(unknown.label, "Nezināms");
  assert.deepEqual(
    view.slices.map((slice) => slice.key),
    ["accepted", "unknown"],
  );
});

test("negative, fractional, NaN and infinite counts are ignored safely", () => {
  const view = buildCommunityStats({
    unique_attempted: 3.9,
    unique_solvers: -5,
    verdicts: {
      accepted: Number.NaN,
      wrong_answer: -4,
      runtime_error: Number.POSITIVE_INFINITY,
      partially_correct: 2.8,
      some_future_verdict: 1,
    },
  });
  assert.ok(view);
  assert.equal(view.uniqueSolvers, 0);
  assert.equal(view.displaySolvers, "0");
  assert.equal(view.uniqueAttempted, 3);
  assert.equal(view.slices.length, 2);
  assert.equal(view.slices[0].key, "partially_correct");
  assert.equal(view.slices[0].count, 2);
  assert.equal(view.slices[1].key, "unknown");
  assert.equal(view.slices[1].count, 1);
  assertSameGeometry(view.slices[0].path);
  assertSameGeometry(view.slices[1].path);
});

test("all verdict categories keep the fixed severity order", () => {
  const view = buildCommunityStats({
    unique_attempted: 10,
    unique_solvers: 1,
    verdicts: {
      unknown: 1,
      tester_unavailable: 1,
      internal_error: 1,
      compile_error: 1,
      runtime_error: 1,
      memory_limit_exceeded: 1,
      time_limit_exceeded: 1,
      wrong_answer: 1,
      partially_correct: 1,
      accepted: 1,
    },
  });
  assert.ok(view);
  assert.deepEqual(
    view.slices.map((slice) => slice.key),
    [
      "accepted",
      "partially_correct",
      "wrong_answer",
      "time_limit_exceeded",
      "memory_limit_exceeded",
      "runtime_error",
      "compile_error",
      "internal_error",
      "tester_unavailable",
      "unknown",
    ],
  );
  assert.deepEqual(
    view.slices.map((slice) => slice.count),
    Array.from({ length: 10 }, () => 1),
  );
});

test("contradictory totals and accepted counts hide instead of rescaling", () => {
  // Summed verdicts do not match the attempted count.
  assert.equal(
    buildCommunityStats({
      unique_attempted: 3,
      unique_solvers: 2,
      verdicts: { accepted: 2, wrong_answer: 4 },
    }),
    null,
  );
  assert.equal(
    buildCommunityStats({
      unique_attempted: 10,
      unique_solvers: 2,
      verdicts: { accepted: 6 },
    }),
    null,
  );
  // The total matches, but accepted no longer equals unique_solvers.
  assert.equal(
    buildCommunityStats({
      unique_attempted: 10,
      unique_solvers: 2,
      verdicts: { accepted: 6, wrong_answer: 4 },
    }),
    null,
  );
  // More solvers than attempts.
  assert.equal(
    buildCommunityStats({
      unique_attempted: 10,
      unique_solvers: 11,
      verdicts: { accepted: 11 },
    }),
    null,
  );
});

test("unsafe finite counts and overflowing sums hide instead of rendering NaN", () => {
  assert.equal(
    buildCommunityStats({
      unique_attempted: 3,
      unique_solvers: 0,
      verdicts: { wrong_answer: 1e308 },
    }),
    null,
  );
  assert.equal(
    buildCommunityStats({
      unique_attempted: 1e308,
      unique_solvers: 0,
      verdicts: { accepted: 1 },
    }),
    null,
  );
  assert.equal(
    buildCommunityStats({
      unique_attempted: Number.MAX_SAFE_INTEGER,
      unique_solvers: 0,
      verdicts: {
        wrong_answer: Number.MAX_SAFE_INTEGER,
        runtime_error: 1,
      },
    }),
    null,
  );

  // The largest safe integer remains a valid full circle.
  const boundary = buildCommunityStats({
    unique_attempted: Number.MAX_SAFE_INTEGER,
    unique_solvers: Number.MAX_SAFE_INTEGER,
    verdicts: { accepted: Number.MAX_SAFE_INTEGER },
  });
  assert.ok(boundary);
  assert.equal(boundary.uniqueAttempted, Number.MAX_SAFE_INTEGER);
  assert.equal(boundary.slices.length, 1);
  assert.equal(boundary.slices[0].fullCircle, true);
  assert.match(boundary.summary, /Atrisinājuši: 9/);
});

test("counts use locale-independent non-breaking thousands groups", () => {
  assert.equal(formatCommunityCount(0), "0");
  assert.equal(formatCommunityCount(999), "999");
  assert.equal(formatCommunityCount(1234), "1\u00A0234");
  assert.equal(formatCommunityCount(1234567), "1\u00A0234\u00A0567");
  assert.equal(formatCommunityCount(-12), "0");
  assert.equal(formatCommunityCount(Number.NaN), "0");
});
