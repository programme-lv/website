import "server-only";

export function getAdminApiKey(): string {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    throw new Error("ADMIN_API_KEY is not configured");
  }

  return adminApiKey;
}
