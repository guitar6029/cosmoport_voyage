# Media delivery operations runbook

This runbook is for the future activation of `media.cosmos-universe.com`. It does not authorize activation, a route, a custom domain, public R2 access, caching, or any Cloudflare dashboard change. Keep `MEDIA_DELIVERY_ENABLED` set to `"false"` until a separate, approved activation procedure is complete.

## Configuration guardrails in this repository

`wrangler.jsonc` is intentionally fail-closed:

- `MEDIA_DELIVERY_ENABLED` is `"false"`.
- `workers_dev` and `preview_urls` are `false`.
- There is no `route`, `routes`, custom-domain setting, or public R2 setting.
- The only R2 binding is `MEDIA_BUCKET` for `cosmos-universe-public-media`.
- `cache.enabled` is explicitly `false`; do not enable Workers Caching in this phase.

`test/config.test.mjs` protects these assumptions in CI. A proposed change to any public exposure or cache setting should be reviewed as an intentional activation change, not folded into unrelated work.

## Emergency edge block — configure before public activation

Create and leave enabled a Cloudflare WAF Custom Rule once the media hostname is present:

| Setting | Value |
| --- | --- |
| Name | `Emergency block: media.cosmos-universe.com` |
| Expression | `http.host eq "media.cosmos-universe.com"` |
| Action | `Block` |
| Status | Enabled |

Dashboard procedure:

1. Select the `cosmos-universe.com` zone, then go to **Security > Security rules > Create rule > Custom rules**.
2. Give the rule the name above, switch to the expression editor, and enter the exact expression.
3. Select **Block**, save, and deploy it. Do not broaden the expression to `cosmos-universe.com`, a wildcard, or a path-only match.
4. Verify from a non-privileged client that a request to `https://media.cosmos-universe.com/` is blocked by Cloudflare and that the Worker does not show a corresponding invocation. Record the test time and rule ID in the activation ticket.
5. If an incident requires the emergency block again, return to **Security > Security rules**, find this rule by name, and enable it. Prefer toggling the existing scoped rule over creating an ad-hoc broad block. Do not delete the rule during incident response.

Cloudflare documents creating Custom Rules in the dashboard at <https://developers.cloudflare.com/waf/custom-rules/create-dashboard/>. The exact-host expression limits the blast radius to the future media hostname; it does not block the main site or other Cosmos Universe applications.

## Rate limiting — deferred on the current Free plan

Cloudflare's current Free-plan material advertises **one** rate-limiting rule per zone, but the available matching fields are limited to path and verified-bot matching: hostname matching is not available. Its available counting window is 10 seconds, not 60 seconds.

As a result, the previously considered `120 requests/minute/IP` rule scoped to `http.host eq "media.cosmos-universe.com"` is **not deployable** on this plan. Do not translate it into a broad `20 requests/10 seconds/IP` path rule: the media hostname shares the `cosmos-universe.com` zone, and a path-only rule could affect another Cosmos Universe application that uses the same path.

No WAF rate-limiting rule is proposed or should be created in this phase. Retain the hostname-scoped emergency WAF Block rule above, and defer rate limiting until an approved plan or architecture provides a hostname-scoped condition. At that time, test normal image loading, MP4 probing/seeking, retries, shared NAT addresses, and scripted bursts before selecting a threshold. Rate limiting is not a hard cost cap: distributed traffic and requests below the threshold can still incur cost.

## Billing and usage monitoring

Before any public activation:

- In **Manage Account > Billing > Billable Usage**, review Workers and R2 daily and weekly. Track R2 Standard storage, Class A operations, and Class B operations; streaming reads and `head()` calls are Class B operations.
- Compare Worker request volume and CPU use in **Workers & Pages** with R2 Class B growth. A range request currently performs metadata lookup plus a ranged `get`, so it can create more than one R2 read-class operation.
- Add at least two **Budget alerts** in **Billing > Billable Usage**: an early warning and an escalation threshold. Include the billing owner plus an on-call/shared operations recipient. Budget alerts are account-wide and cover usage-based spend, not a single hostname.
- Where the account/plan exposes them, configure per-product usage notifications in **Notifications** for Workers requests and relevant R2 usage. Confirm the real recipients by sending a test notification where supported.
- Record the billing-cycle boundary and free/paid plan assumptions in the activation ticket. Workers Free currently includes 100,000 requests/day and 10 ms CPU per invocation; Workers Paid includes 10 million requests/month and 30 million CPU-ms before overages. Verify the account's actual plan at activation.

R2 charges storage plus Class A and Class B operations. Cloudflare currently lists 10 GB-month, 1 million Class A operations, and 10 million Class B operations per month in the R2 Standard free tier. R2 egress is listed as free, but this does not make operations free. See <https://developers.cloudflare.com/r2/pricing/> and <https://developers.cloudflare.com/workers/platform/pricing/>.

Budget alerts and usage notifications are **notifications, not spending caps**. They can be delayed because usage data is processed on a schedule; continue to rely on the delivery kill switch and emergency WAF block for immediate response. Cloudflare's billing guidance is at <https://developers.cloudflare.com/billing/manage/budget-alerts/> and <https://developers.cloudflare.com/billing/manage/billable-usage/>.

### Unexpected-spike procedure

1. Enable the scoped emergency WAF block immediately; if the hostname is not yet routed, keep it that way.
2. Set `MEDIA_DELIVERY_ENABLED` to `"false"` only through an approved deployment path; this is a secondary application guard, not a replacement for an edge block.
3. Inspect Security Events by hostname, request path, source IP/ASN, and time range. Compare Worker request metrics, R2 Class B operations, and Billable Usage for the same window.
4. Preserve timestamps, rule IDs, and request samples in the incident record. Do not expose request credentials or private object keys.
5. Reopen only after identifying the source, checking the proposed rate-limit scope, and obtaining explicit approval.

## Safe image edge caching

The Worker uses the explicit Cloudflare **Cache API** (`caches.default`) only for successful, full `GET` responses for Astro Pop PNG, JPEG, and WebP objects. It does not enable the Wrangler `cache` setting: `cache.enabled` remains `false`, so this is not Workers Caching and the Worker still executes for every request.

The Worker checks the delivery switch, allowed method, and safe public-media path before looking in the Cache API. `MEDIA_DELIVERY_ENABLED: "false"` therefore returns the normal `503` even when an image was cached while delivery was enabled. Range requests—including image ranges—bypass the Cache API, are served by the existing R2 range path, and are never stored as `206` responses. MP4 and audio always retain their existing R2 streaming behavior.

Successful cacheable image responses receive `Cache-Control: public, max-age=300, s-maxage=300, must-revalidate`. The Cache API key contains only the request origin and validated object path, so harmless query strings such as campaign tags map to the same object. This lets a repeated image request in the same edge data center avoid an R2 `get` and its associated R2 Class B operation. Cache API entries do not replicate across data centers, so do not treat a hit in one location as a global hit guarantee. Cache lookup or write failures are intentionally non-fatal: the Worker falls back to the normal R2 streaming response.

The Cache API write runs through `ctx.waitUntil()` using a clone of the streaming response. Do not replace this with a full `arrayBuffer()`, `text()`, or similar operation: media should not be buffered in Worker memory merely to cache it.

### Object replacement and TTL

The TTL is a conservative 300 seconds, not an invalidation guarantee. Replacing an R2 object at the same key can leave the previous image served for up to five minutes. For an urgent replacement, use a new, versioned object key and update the approved application reference; if a same-key replacement is unavoidable, use an approved Cloudflare cache-purge procedure and verify it against the media hostname. Do not lower the TTL or add broad purge rules during an incident without assessing the effect on the rest of the zone.

### Verification after an approved activation

1. Confirm the emergency WAF Block rule remains enabled and `MEDIA_DELIVERY_ENABLED` is still `"false"` before beginning. Do not make media public as part of a cache test.
2. In an approved staging or controlled production activation, enable delivery only through the authorized release process and request the same PNG, JPEG, or WebP twice with different benign query strings. Check Worker observability and R2 Class B operation trends: the first request should read R2 and the repeated request should be a Cache API hit without another R2 `get`.
3. Request an MP4 with `Range: bytes=0-...` and confirm `206`, `Content-Range`, and streaming continue to work. Repeat with an image range and confirm it also bypasses the image cache.
4. Check cache-hit headers: `Content-Type`, `Content-Length`, `ETag`, and `X-Content-Type-Options: nosniff` must match the R2-delivered response. Confirm error responses and disabled `503` responses have not been cached.
5. Test the existing WAF emergency block against a previously cached image from a non-privileged client. It must block the request before the Worker serves the cached response. Record the rule ID, time, test path, and result in the activation ticket; then leave the rule enabled unless a separately approved launch procedure directs otherwise.

Final cache-hit and WAF-order verification requires Cloudflare's live edge: Wrangler's local runtime can exercise R2 behavior but does not prove the production Cache API or WAF execution order.

### Controlled activation checklist

1. Obtain written approval for public media delivery and confirm the domain, R2 binding, WAF emergency rule, billing alerts, and owner/on-call contacts.
2. Review `wrangler.jsonc`: preserve `cache.enabled: false`, keep `workers_dev` and preview URLs disabled, and do not add a public R2 endpoint. Confirm cache code still checks the kill switch before `caches.default`.
3. Deploy only by the approved release path, enable delivery only when approved, then perform the verification steps above with a small non-sensitive image and a range-enabled MP4.
4. Monitor Worker requests, errors, Cache API behavior, and R2 Class B operations through the first 300-second cache lifetime. Keep the WAF rule ready for immediate use.

### Rollback

1. Enable the existing hostname-scoped WAF Block rule immediately to stop both cache hits and R2 delivery at the edge.
2. Set `MEDIA_DELIVERY_ENABLED` back to `"false"` only through the approved release path. This protects requests that reach the Worker after the WAF block is removed.
3. If stale or incorrect images remain a concern after the incident is contained, use an approved hostname/path-specific cache purge. Do not create a broad zone purge without explicit authorization because other Cosmos Universe applications share the zone.
4. Preserve metrics, affected object keys, cache/WAF observations, and timestamps for the incident record before considering reactivation.
