# CP2 — STRIDE Analysis: React Administrative Frontend to Product API

**Owner:** Luis Gasca Bonilla (`@luisGascaB`)
**Trust-boundary issue:** [Bysellens docs #56](https://github.com/code-corhuila/bysellens-docs/issues/56)
**Scope:** Complete STRIDE analysis of the selected boundary. The S/T/R analysis and the I/D/E analysis with prioritization and residual-risk review are recorded in separate commits and pushes as required by the workshop.
**Status:** Design-based analysis. The documented Product service implementation and runtime controls remain pending; no deployed service or executed security tests are claimed.

## Boundary and assets

The boundary is the Administrator's React browser client calling the
documented Product API. The representative protected operation is
`PATCH /api/v1/products/{id}/stock`, which sets an absolute stock quantity.
The OpenAPI contract requires an RS256 bearer token and `ADMIN` role for
business operations. The architecture says each service validates tokens
independently, whether or not a gateway is adopted.

The Product service documentation and traceability matrix mark implementation
and acceptance verification as pending. The separate local microservices
snapshot contains `catalogo-service`, not the documented Product service; it
is not treated as proof that the Product contract's controls are implemented.

Primary assets are the Administrator's identity and bearer token, Stock
quantity/version, and the correctness of product availability shown to the
business. Evidence: [architecture overview](https://github.com/code-corhuila/bysellens-docs/blob/main/05-architecture/overview.md),
[Product service design](https://github.com/code-corhuila/bysellens-docs/blob/main/09-microservices/services/03-product-service/README.md),
[Product API contract](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/contracts/openapi/product-service.yaml),
[authentication profile](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/authentication.md).

## Risk scale

Probability and impact are each scored 1 (low) to 3 (high); risk is their
product. A score of 9 is P0, 6 is P1, 3–4 is P2, and 1–2 is P3. Scores below
reflect the documented design and plausible browser/API attack paths, not
measured incident likelihood. Re-score when implementation and deployment
evidence is available.

## Spoofing

- **Threat / asset:** An external attacker impersonates the Administrator and
  changes Stock; affected assets are the ADMIN identity/token and Stock data.
- **Path and conditions:** The attacker obtains a still-valid bearer token from
  a compromised browser or endpoint, then replays it to
  `PATCH /api/v1/products/{id}/stock`. The API must be reachable and the token
  must not be expired. Token acquisition or a successful exploit was not
  observed.
- **Probability:** 2. **Impact:** 3. **Risk:** `2 × 3 = 6` — **P1**.
- **Verified control:** No running Product implementation or runtime token
  verification was available to verify. The contract specifies bearer
  authentication and `ADMIN`; the authentication profile specifies RS256,
  issuer, audience and expiry validation at each business service. These are
  documented requirements, not verified Product controls.
- **Missing / proposed mitigation:** Implement and test independent token
  signature, algorithm, issuer, audience, expiry and role validation on
  Product. Keep the token in memory as the accepted design requires, apply
  browser XSS protections, and reject missing/invalid tokens before any stock
  side effect. Add a negative integration test for an absent, tampered, expired
  or non-ADMIN token.
- **Evidence:** [Product contract](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/contracts/openapi/product-service.yaml)
  (global bearer security and `x-required-role: ADMIN`);
  [authentication profile](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/authentication.md)
  (token validation rules and implementation pending);
  [Product service status](https://github.com/code-corhuila/bysellens-docs/blob/main/09-microservices/services/03-product-service/README.md)
  (implementation and runtime verification pending).

## Tampering

- **Threat / asset:** An attacker with a stolen ADMIN session or control of the
  browser submits an unauthorized absolute quantity, corrupting Stock and
  derived product availability.
- **Path and conditions:** Send a crafted `PATCH
  /api/v1/products/{id}/stock` with a non-negative integer `quantity` and the
  current `expectedVersion`. The attack requires a valid ADMIN token; a stale
  version alone is not a security boundary because the attacker may first read
  the current stock/version.
- **Probability:** 2. **Impact:** 3. **Risk:** `2 × 3 = 6` — **P1**.
- **Verified control:** No Product runtime enforcement or test was verified.
  The draft contract requires a non-negative integer and an exact version
  match, with quantity, version and `updated_at` committed atomically; a stale
  version must return `409` without a write or event. These are specified
  controls only.
- **Missing / proposed mitigation:** Enforce ADMIN authorization and all
  quantity/version validation server-side; perform a compare-and-set update in
  one transaction, emit no event on rejection, and test that invalid or stale
  updates cause no data change. Record accepted quantity changes with an audit
  event without storing bearer tokens.
- **Evidence:** [PATCH stock contract](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/contracts/openapi/product-service.yaml)
  (request validation and `409` semantics);
  [ADR-003 — Stock Concurrency](https://github.com/code-corhuila/bysellens-docs/blob/main/05-architecture/decisions/records/ADR-003-stock-concurrency.md)
  (atomic version strategy and implementation status).

## Repudiation

- **Threat / asset:** An Administrator disputes a stock change and the business
  cannot establish which identity changed which product, when, or whether the
  operation succeeded. Affected assets are stock accountability and audit
  evidence.
- **Path and conditions:** The Administrator submits an authorized stock
  update; later, the actor denies it. The risk materializes if the Product
  service does not persist a trustworthy audit event or if logs cannot be
  correlated with the accepted request.
- **Probability:** 2. **Impact:** 2. **Risk:** `2 × 2 = 4` — **P2**.
- **Verified control:** The security policy requires audit records with
  `userId`, `sourceIp` when available, `action`, `resource`, `result` and
  `timestamp`, and requires recording stock changes. No Product audit
  implementation or runtime log was verified; therefore no operational
  repudiation control is confirmed.
- **Missing / proposed mitigation:** Emit a tamper-resistant, access-restricted
  audit record for each accepted and rejected stock update, binding the
  verified Administrator UUID to product ID, old/new quantity, result and
  timestamp. Do not log credentials or the full token. Test that accepted
  updates produce one attributable audit record and rejected updates produce a
  failure record without changing stock.
- **Evidence:** [Security policy — audit and security logs](https://github.com/code-corhuila/bysellens-docs/blob/main/00-governance/security-policy.md)
  (required event and fields); [authentication profile](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/authentication.md)
  (stable Administrator subject and prohibition on logging tokens);
  [Product service design](https://github.com/code-corhuila/bysellens-docs/blob/main/09-microservices/services/03-product-service/README.md)
  (implementation and acceptance pending).

## Information Disclosure

- **Threat / asset:** An unauthorized caller reads commercial data such as
  product prices and current stock from the Product API. Affected assets are
  product records and stock information.
- **Path and conditions:** Call `GET /api/v1/products` or
  `GET /api/v1/products/{id}` without a valid ADMIN token, or exploit a
  missing/misconfigured service authorization check. The contract requires
  ADMIN authorization; actual runtime enforcement has not been verified.
- **Probability:** 2. **Impact:** 3. **Risk:** `2 × 3 = 6` — **P1**.
- **Verified control:** The OpenAPI contract specifies bearer authentication,
  ADMIN authorization, and `401`/`403` responses. This is a contract, not
  evidence of a running control.
- **Missing / proposed mitigation:** Enforce authentication and authorization
  inside Product, including direct service requests; return only fields needed
  by each operation; use HTTPS outside local development; test anonymous and
  non-ADMIN reads against a running implementation.
- **Evidence:** [Product contract](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/contracts/openapi/product-service.yaml)
  (list/detail operations and security responses);
  [authentication profile](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/authentication.md)
  (service-level validation); [traceability matrix](https://github.com/code-corhuila/bysellens-docs/blob/main/04-requirements/traceability-matrix.md)
  (FR-001/FR-002 security implementation pending).

## Denial of Service

- **Threat / asset:** Repeated or expensive requests exhaust Product API
  capacity and prevent the Administrator from consulting or updating stock.
  Affected assets are API availability and operational stock information.
- **Path and conditions:** An attacker can reach the API and send repeated
  product-list or stock requests, or large/expensive requests, at a rate that
  exceeds available service capacity. Public exposure and deployed rate limits
  are not verified.
- **Probability:** 2. **Impact:** 2. **Risk:** `2 × 2 = 4` — **P2**.
- **Verified control:** The Product list contract defines pagination; no
  Product runtime rate limit, request budget, or availability control was
  verified. The optional Gateway is not adopted as a confirmed dependency.
- **Missing / proposed mitigation:** Enforce bounded page size and request
  validation, configure rate and concurrency limits at the service or adopted
  edge, set downstream timeouts and resource limits, and monitor saturation.
  Test that oversized parameters are rejected and request bursts do not cause
  unbounded work.
- **Evidence:** [Product API contract](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/contracts/openapi/product-service.yaml)
  (paginated list); [Product service design](https://github.com/code-corhuila/bysellens-docs/blob/main/09-microservices/services/03-product-service/README.md)
  (deployment and implementation remain pending); [architecture overview](https://github.com/code-corhuila/bysellens-docs/blob/main/05-architecture/overview.md)
  (Gateway adoption is not established).

## Elevation of Privilege

- **Threat / asset:** A caller without the ADMIN role gains permission to
  perform the stock update reserved for the Administrator. Affected assets are
  access-control policy and Stock quantity.
- **Path and conditions:** A caller sends a forged token, a token with a
  different role, or client-supplied identity/role data to
  `PATCH /api/v1/products/{id}/stock`. The attack succeeds only if Product
  trusts unverified claims or fails to enforce the ADMIN requirement.
- **Probability:** 2. **Impact:** 3. **Risk:** `2 × 3 = 6` — **P1**.
- **Verified control:** The contract declares `x-required-role: ADMIN` and
  bearer security. The authentication design requires signature, algorithm,
  issuer, audience, expiry and role validation by each service. Product
  implementation and negative authorization tests remain unverified.
- **Missing / proposed mitigation:** Use the approved JWT resource-server
  validation at the Product boundary; derive the role only from a verified
  token; ignore client identity headers for authorization; deny by default.
  Add automated tests for missing, invalid, and valid-but-non-ADMIN tokens and
  assert rejected requests have no business side effects.
- **Evidence:** [Product contract](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/contracts/openapi/product-service.yaml)
  (global ADMIN role); [authentication profile](https://github.com/code-corhuila/bysellens-docs/blob/main/07-api/authentication.md)
  (token validation and `401`/`403` requirements); [FR-014 / NFR-003](https://github.com/code-corhuila/bysellens-docs/blob/main/04-requirements/traceability-matrix.md)
  (implementation and tests pending).

## Risk prioritization

| Priority | STRIDE category | Probability × impact | Risk | Basis |
|---|---|---:|---:|---|
| P1 | Spoofing | 2 × 3 | 6 | Misused/stolen token could authorize stock operations if boundary enforcement fails. |
| P1 | Tampering | 2 × 3 | 6 | Unauthorized absolute stock changes affect availability and business operations. |
| P1 | Information Disclosure | 2 × 3 | 6 | Product list/detail data may be exposed if service authorization is absent or misconfigured. |
| P1 | Elevation of Privilege | 2 × 3 | 6 | Missing role enforcement could allow non-ADMIN stock updates. |
| P2 | Repudiation | 2 × 2 | 4 | Lack of verified audit evidence could prevent attribution of a stock change. |
| P2 | Denial of Service | 2 × 2 | 4 | Repeated API requests could degrade a service whose deployed protections are unknown. |

These are initial estimates from design and code-status evidence, not measured
production likelihood. Priorities must be revisited after implementation and
runtime testing. Under the workshop scale, P0 applies to score 9, P1 to 6,
P2 to 3–4, and P3 to 1–2.

## Residual risk after proposed controls

The residual estimates below are conditional targets if the listed mitigations
are implemented and verified; they are not claims that residual risks have
already been reduced.

| Category | Proposed control | Remaining risk | Target residual score |
|---|---|---|---:|
| Spoofing | Independently validate signed token, fixed algorithm, issuer, audience, expiry and ADMIN role; reduce browser token exposure. | A compromised Administrator device or stolen still-valid token may be replayed until expiry. | 1 × 2 = 2 (P3) |
| Tampering | Enforce role and quantity validation; use an atomic expected-version update and audit accepted changes. | An authorized Administrator can still make an incorrect business decision; privileged database access remains a separate risk. | 1 × 2 = 2 (P3) |
| Repudiation | Record identity, resource, action, result and timestamp in access-restricted audit storage. | A compromised audit administrator or unavailable logging pipeline may weaken evidence. | 1 × 2 = 2 (P3) |
| Information Disclosure | Deny unauthenticated/non-ADMIN reads, minimize responses and use HTTPS outside local development. | Authorized users can disclose data, and endpoint/device compromise can expose a legitimate session. | 1 × 2 = 2 (P3) |
| Denial of Service | Bound pagination and request size, set rate/concurrency limits, timeouts and resource monitoring. | Distributed traffic or infrastructure failure can still exhaust shared capacity. | 1 × 2 = 2 (P3) |
| Elevation of Privilege | Validate authorization at the service, deny by default, and reject client-supplied identity headers. | Incorrect future policy changes, signing-key compromise or application defects may reintroduce privilege escalation. | 1 × 2 = 2 (P3) |

The target residual ratings are provisional acceptance targets, not evidence
for risk acceptance. The service owner must review and accept residual risks
after controls and tests are demonstrated.

## Physical-book reference

[PENDING: verify the page in the physical copy of *Sistemas Distribuidos:
Conceptos y Diseño*, 3rd edition. Do not attribute an idea or page until
verified.]
