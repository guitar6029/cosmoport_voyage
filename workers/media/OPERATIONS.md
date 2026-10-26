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

## Caching safety assessment — deferred

Caching is intentionally not enabled in this Worker. These layers differ:

- **Browser caching** follows response `Cache-Control` in the visitor's cache. It may reduce repeat browser requests, but does not create a Cloudflare Worker cache or replace the kill switch.
- **Cache API** is explicit Worker code such as `caches.default.match()` and `put()`. It would need its own reviewed cache key, TTL, invalidation, and kill-switch ordering.
- **Workers Caching** is a platform setting. It can serve cached responses before Worker execution; it is therefore deliberately disabled until its behavior is tested with this media Worker.

Before a future caching proposal, test all of the following:

- The kill switch must be checked before any Worker-managed cache lookup. A platform cache that runs first must not continue serving media after delivery is disabled.
- The WAF emergency block must be verified against cache hits: it must stop media at the edge before cached content reaches a visitor.
- Do not cache `206` responses or ranges without a canonical range-aware cache-key and invalidation design. Seeking can create many distinct ranges and incorrect keys can return the wrong bytes.
- Define how object replacement invalidates browser, Worker, and platform cache entries. Use immutable/versioned object keys or a documented purge process; TTL alone is not an update strategy.
- Measure whether repeat requests reduce R2 Class B operations without unexpectedly increasing Worker request cost. Workers Cache hits still count as Worker requests under current pricing, even though they avoid Worker CPU on hits.

No cache implementation belongs in this phase.
