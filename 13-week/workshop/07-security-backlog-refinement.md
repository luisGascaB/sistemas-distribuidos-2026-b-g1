# CP7 — Security Backlog Refinement

**STRIDE pull request:** [#70 — React administrative frontend → product-service](https://github.com/code-corhuila/bysellens-docs/pull/70)
**Status:** All three stories now have tracker issues. Refinement instructions
below are prepared, but the issue bodies/labels and team Project board could
not be updated from this session.

## Issue review and required tracker updates

| Issue | STRIDE | Risk | Required labels | Overlap / relation |
|---|---|---:|---|---|
| [#57 — Authentication and ADMIN authorization](https://github.com/code-corhuila/bysellens-docs/issues/57) | S, E | 9 (3 × 3), P0 | `security`, `P0` | Protects operations in #58 and #68; keep the stories separate because authorization, validation and auditing are distinct controls. |
| [#58 — Validate stock updates](https://github.com/code-corhuila/bysellens-docs/issues/58) | T | 6 (2 × 3), P1 | `security`, `P1` | Same stock endpoint as audit story #68, but a different threat and control. |
| [#68 — Audit stock changes](https://github.com/code-corhuila/bysellens-docs/issues/68) | R | 4 (2 × 2), P2 | `security`, `P2` | Shares the stock endpoint with #58; link them as related, not duplicate issues. |

Each issue should link [PR #70](https://github.com/code-corhuila/bysellens-docs/pull/70)
and the threat-model claim [#56](https://github.com/code-corhuila/bysellens-docs/issues/56).
The label states above are the target labels; the live issues currently have no
labels. Issue #68's body says P2, so `P2` is the matching label. The issue
search found #54, a teammate's model for React → `inventory-service`
`POST /api/v1/inventory/products`; it concerns product registration and
immutable `initialStock`, not Product's later stock-update endpoint. It is
related context, not a duplicate story.

## Acceptance criteria to use in the issue bodies

### #57 — Authentication and ADMIN authorization

Retain the existing user story. Replace/refine acceptance criteria to state:

1. `GET /api/v1/products/{id}` without a bearer token returns `401`; the
   response contains no protected Product fields.
2. The same request with a correctly signed, unexpired token lacking `ADMIN`
   returns `403` and no protected Product fields.
3. `PATCH /api/v1/products/{id}/stock` with that non-ADMIN token returns
   `403`; the persisted quantity and version remain unchanged, and no stock
   event is emitted.
4. An automated integration test sends the missing-token and valid
   non-ADMIN-token cases to the protected operations, asserts the exact status
   codes and response-data restrictions, and verifies no business side effects.

### #58 — Validate stock updates

Retain the existing user story. Refine acceptance criteria against the draft
Product API contract:

1. For an active product with initialized stock, a PATCH with a negative or
   fractional `quantity` returns `400`; stored quantity/version remain
   unchanged and no event is emitted.
2. A PATCH with a non-negative integer `quantity` and the current
   `expectedVersion` returns `200`, stores the absolute quantity atomically,
   increments the version by one, and emits the documented update event. Zero
   is valid.
3. A PATCH with a stale `expectedVersion` returns `409` and changes neither
   quantity nor version; no event is emitted.
4. Automated API tests cover negative, fractional, zero, valid positive, and
   stale-version requests and assert status, response, persisted quantity and
   version, and event side effects.

### #68 — Audit stock changes

Retain the existing user story and risk score. Refine acceptance criteria:

1. Each accepted stock PATCH writes exactly one audit record containing the
   authenticated user ID, product resource, action, `SUCCESS` result, timestamp,
   source IP when available, correlation ID, and before/after quantities.
2. Each rejected stock PATCH records the authenticated user ID or `ANONYMOUS`,
   affected product/resource when available, action, `FAILURE` result,
   timestamp, source IP when available and correlation ID; rejected requests
   do not change quantity/version.
3. Audit records contain no bearer tokens, passwords or private keys. An
   unauthorized reader cannot retrieve the audit records.
4. Automated tests assert required fields, one record per outcome, no
   credentials in serialized records, access denial for an unauthorized reader,
   and no stock side effects on rejected requests.

The protected audit fields follow the security policy's documented event
fields; testable delivery behavior remains a proposed requirement, not a claim
that Product currently implements audit logging.

## Team Project board

Add issues [#57](https://github.com/code-corhuila/bysellens-docs/issues/57),
[#58](https://github.com/code-corhuila/bysellens-docs/issues/58), and
[#68](https://github.com/code-corhuila/bysellens-docs/issues/68) as separate
items to the team's security Project. Board membership is not exposed by the
available read-only GitHub tools and remains unverified.

## Completion status

- [x] Confirm all three story issues exist and inspect their acceptance
  criteria, risk values and current labels.
- [x] Check related work and distinguish the teammate's Inventory-registration
  boundary from Product stock updates.
- [x] Prepare testable acceptance-criteria refinements, STRIDE tags, risk
  metadata, PR links and non-duplicating cross-links.
- [ ] Update all three issue bodies and add `security` plus the matching P0/P1/P2
  labels in GitHub.
- [ ] Add all three issues to the team Project board.
- [ ] Verify the issue changes and board membership in GitHub.
- [x] Update this fork's `STORIES` line.
- [ ] Commit and push this checkpoint.

CP7 remains **in progress** until the tracker and board changes are applied and
verified.
