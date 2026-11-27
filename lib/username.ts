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
 * Validate new usernames without changing their exact value. Legacy usernames
 * may contain @.
 */
export function validateRegistrationUsername(username: string): string | null {
  if (username.includes("@")) return USERNAME_CONTAINS_AT_ERROR;
  if (username === ".." || username.includes("\0")) {
    return "Lietotājvārds nav derīgs.";
  }
  const bytes = new TextEncoder().encode(username).length;
  if (bytes < 2 || bytes > 24) {
    return "Lietotājvārdam jābūt no 2 līdz 24 UTF-8 baitiem.";
  }
  return null;
}
