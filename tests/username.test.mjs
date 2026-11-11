import assert from "node:assert/strict";
import test from "node:test";

import {
  USERNAME_CONTAINS_AT_ERROR,
  decodeUsernamePageParam,
  encodeUsernameSegment,
  userProfilePath,
  validateRegistrationUsername,
} from "../lib/username.ts";

const usernames = [
  "user",
  "user name",
  " leading and trailing ",
  "x%40y",
  "student@legacy",
  "#hash",
  "a+b",
  "Ābols",
];

test("profile param round-trips every supported username exactly once", () => {
  for (const username of usernames) {
    const nextParam = encodeUsernameSegment(username);
    assert.equal(decodeUsernamePageParam(nextParam), username);
  }
});

test("literal percent sequences are not decoded twice", () => {
  assert.equal(decodeUsernamePageParam("x%2540y"), "x%40y");
  assert.equal(decodeUsernamePageParam("100%25"), "100%");
});

test("malformed percent input is left untouched", () => {
  assert.equal(decodeUsernamePageParam("100%"), "100%");
});

test("profile paths encode one path segment", () => {
  assert.equal(userProfilePath("simple"), "/users/simple");
  assert.equal(userProfilePath("a b"), "/users/a%20b");
  assert.equal(userProfilePath("x%40y"), "/users/x%2540y");
  assert.equal(userProfilePath("student@legacy"), "/users/student%40legacy");
  assert.equal(userProfilePath("a+b#c"), "/users/a%2Bb%23c");
});

test("registration rejects @ before any network call", () => {
  for (const username of ["user@example.com", "@user", "user@", "@"]) {
    assert.equal(validateRegistrationUsername(username), USERNAME_CONTAINS_AT_ERROR);
  }
  assert.equal(USERNAME_CONTAINS_AT_ERROR, "Lietotājvārds nedrīkst saturēt simbolu @.");
});

test("registration keeps existing username syntax, including spaces", () => {
  for (const username of [
    "ab",
    "user-name",
    "user_name",
    "user.name",
    "user123",
    "user name",
    " leading and trailing ",
    "x%40y",
    "Ābols",
  ]) {
    assert.equal(validateRegistrationUsername(username), null);
  }
});
