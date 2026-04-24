# Contract: GitHub Actions workflow_dispatch API (n8n → GitHub)

**Direction**: n8n → GitHub REST API
**Auth**: `Authorization: Bearer {GITHUB_PAT}`
**Scope required**: `workflow` (classic PAT) or Fine-grained PAT with `Actions: write` on the `GitchPage` repository

---

## Trigger Site Rebuild

```text
POST https://api.github.com/repos/Gitchegumi/GitchPage/actions/workflows/nextjs.yml/dispatches
Authorization: Bearer {GITHUB_PAT}
Accept: application/vnd.github+json
Content-Type: application/json
```

**Request body**:

```json
{ "ref": "main" }
```

No additional `inputs` required — `nextjs.yml` declares `workflow_dispatch:` with no input parameters.

**Success response**: HTTP 204 No Content (empty body)

**Failure responses**:

| Status | Meaning | Action |
|--------|---------|--------|
| 401 | PAT invalid or expired | Retry once; alert admin if persists |
| 403 | PAT lacks `workflow` scope | Alert admin immediately (retry won't help) |
| 404 | Workflow file not found or repo not accessible | Alert admin immediately |
| 422 | Invalid `ref` (branch doesn't exist) | Alert admin immediately |
| 5xx | GitHub API error | Retry once after 30s |

**Retry policy**: Retry once (30s delay) on 5xx or network error. On 4xx (except 429): skip retry and send admin alert directly (retrying won't resolve auth/config issues).

---

## Notes

- The workflow file identifier can be either `nextjs.yml` (filename) or the numeric workflow ID. Using the filename is more readable and robust to workflow ID changes.
- The rebuild takes approximately 2–8 minutes to complete (build + deploy to GitHub Pages). This is within the 15-minute homepage update success criterion.
- Concurrent rebuild protection: `nextjs.yml` uses `concurrency: group: "pages", cancel-in-progress: false`, which means a new dispatch while a build is running will queue and execute after the current build completes.
