# Backend admin authentication

The backend supports `Authorization: Bearer <ADMIN_API_KEY>` for server-to-server access to admin-only endpoints.
The website uses this credential for server-rendered requests that cannot rely on the browser's `auth_token` cookie, including execution detail retrieval.

`ADMIN_API_KEY` is a runtime-only server environment variable and must equal the backend value.
It must not use the `NEXT_PUBLIC_` prefix, appear in client components, or be forwarded to the browser.
Server-only modules that use the key must import `server-only`.

Browser-initiated admin operations continue to use the signed-in administrator's cookie.
Do not replace that authorization with an unguarded server action using the shared key, because server actions are externally callable and would otherwise grant backend admin privileges.

To verify the integration, configure the same key for the website and backend, then open a submission details page and confirm its execution results load.
