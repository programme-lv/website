/**
 * Username path helpers.
 *
 * Next.js page params arrive percent-encoded, so the profile page decodes
 * exactly once with `decodeUsernamePageParam`. `generateMetadata` params are
 * already decoded and must not use it. Every path segment built from a real
 * username is encoded with `encodeUsernameSegment` (directly or through
 * `userProfilePath`). See `docs/user-paths.md`.
 */

export function decodeUsernamePageParam(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

export function encodeUsernameSegment(username: string): string {
  return encodeURIComponent(username);
}

export function userProfilePath(username: string): string {
  return `/users/${encodeUsernameSegment(username)}`;
}

export const USERNAME_CONTAINS_AT_ERROR =
  "Lietotājvārds nedrīkst saturēt simbolu @.";

/**
 * New usernames cannot contain @. Legacy usernames may, and usernames are
 * not trimmed, matching backend validation.
 */
export function validateRegistrationUsername(username: string): string | null {
  return username.includes("@") ? USERNAME_CONTAINS_AT_ERROR : null;
}
