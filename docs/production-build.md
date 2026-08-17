# Production build

`yarn build` (`next build`) type-checks. The GHCR image job runs the same command in the Dockerfile builder stage, so a type error fails the publish.

Success API payloads are `{ status: "success", data }`. For `{ message: string }` bodies the string is `data.message`. Error payloads keep `message` on the response root. Do not read `response.message` after narrowing to `status === "success"`.
