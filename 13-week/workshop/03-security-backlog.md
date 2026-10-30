# CP3 — Security Backlog Stories

**Owner:** Luis Gasca Bonilla (`@luisGascaB`)
**Trust boundary:** React administrative frontend → `product-service`
**Threat-model issue:** [Bysellens docs #56](https://github.com/code-corhuila/bysellens-docs/issues/56)
**Status:** Two existing security issues are mapped below. The third story is
drafted here; its tracker issue is pending. No implementation or runtime
behavior is claimed as verified.

## Prioritization

The stories are ordered by the initial risk estimates recorded in CP2 and the
existing issue tracker. The estimates are provisional because the documented
Product service implementation and its controls have not been verified.

| Rank | Story | STRIDE coverage | Initial risk | Tracker status |
|---|---|---|---:|---|
| 1 | Enforce authentication and ADMIN authorization | Spoofing, Elevation of Privilege, and unauthorized disclosure of protected reads | P0 — 9/9 in issue #57; CP2 separately estimates P1 — 6/9 | Existing issue [#57](https://github.com/code-corhuila/bysellens-docs/issues/57) |
| 2 | Validate stock updates on the server | Tampering | P1 — 6/9 | Existing issue [#58](https://github.com/code-corhuila/bysellens-docs/issues/58) |
| 3 | Audit stock changes with attributable events | Repudiation | P2 — 4/9 | Draft below; tracker issue pending |

**Scoring note:** Issue #57 records Probability 3/3 × Impact 3/3 (P0), while
CP2 estimates Probability 2/3 × Impact 3/3 (P1) for Spoofing and Elevation of
Privilege. These are inconsistent initial estimates, not measured likelihoods.
Reconcile them with the service owner before treating either score as final.
Issue #57 also requires unauthorized protected requests to expose no data, so
the current backlog does not create a duplicate issue solely for Information
Disclosure.

## Story 1 — Authenticate and authorize protected Product operations

**Tracker:** [Issue #57](https://github.com/code-corhuila/bysellens-docs/issues/57)
**Existing title:** `[security] Enforce authentication and ADMIN authorization in product-service-@luisGascaB`
**STRIDE:** Spoofing and Elevation of Privilege; also protects against
unauthorized disclosure from protected read operations.

**User story:** As the system owner, I want `product-service` to authenticate
every protected request and authorize only ADMIN users, so that product and
stock operations cannot be accessed by unauthorized users.

**Acceptance criteria recorded in the existing issue:**

1. Requests to protected Product operations without a valid token return
   `401` and do not expose or modify protected data.
2. Requests with a valid token lacking the ADMIN role return `403` and do not
   modify data.
3. An automated integration test verifies both cases against a protected
   Product operation.

**Evidence limitation:** The issue references the security policy and draft
OpenAPI contract. They specify requirements; they do not prove that Product
enforces them at runtime.

## Story 2 — Validate stock updates on the server

**Tracker:** [Issue #58](https://github.com/code-corhuila/bysellens-docs/issues/58)
**Existing title:** `Validate stock updates to prevent data tampering-@luisGascaB`
**STRIDE:** Tampering.

**User story:** As the system owner, I want `product-service` to validate stock
updates on the server, so that stock data remains accurate and follows the
documented business rules.

**Acceptance criteria recorded in the existing issue:**

1. Negative and fractional quantities are rejected without changing stored
   stock; zero remains valid.
2. An automated API test checks negative, fractional, and zero quantities
   against both the response and persisted stock value.
3. A valid update for an active product with initialized stock is accepted
   according to the documented rules.

**Evidence limitation:** The Product service design and API contract describe
the operation and rules, but the route and runtime behavior remain unverified.

## Story 3 — Record attributable stock-change audit events

**Tracker:** **Pending.** No matching issue for auditable stock changes in
`product-service` was found in the repository issue search. This story is a
draft, not a created or assigned issue.
**STRIDE:** Repudiation.
**Initial risk:** Probability 2/3 × Impact 2/3 = 4/9 (P2), matching the CP2
estimate.

**User story:** As the system owner, I want each stock update to produce a
reliable, attributable audit event, so that authorized and rejected changes
can be investigated without exposing credentials.

**Acceptance criteria proposed for the tracker issue:**

1. Every accepted stock update records the verified actor ID, product ID,
   action, outcome, timestamp, and a request correlation ID; accepted changes
   also identify the before-and-after quantities.
2. Rejected authorization, validation, or stale-version requests do not
   change stock and produce an outcome that can be correlated with the
   request, consistent with the security logging policy.
3. Audit events never contain bearer tokens, passwords, or other credentials,
   and access to stored audit records is restricted.
4. Automated tests verify that accepted and rejected requests leave the
   expected audit evidence and that rejected requests have no stock side
   effects.

**Evidence:** The [security policy](https://github.com/code-corhuila/bysellens-docs/blob/main/00-governance/security-policy.md)
requires security/audit events and prohibits logging tokens; the
[authentication profile](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/authentication.md)
defines the stable Administrator identity; the [Product service design](https://github.com/code-corhuila/bysellens-docs/blob/main/09-microservices/services/03-product-service/README.md)
marks implementation and acceptance as pending. The proposed acceptance
criteria are backlog requirements, not verified controls.
