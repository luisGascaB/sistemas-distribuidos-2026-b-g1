# CP2 — STRIDE Analysis: React Administrative Frontend to Product API

**Owner:** Luis Gasca Bonilla (`@luisGascaB`)
**Trust-boundary issue:** [Bysellens docs #56](https://github.com/code-corhuila/bysellens-docs/issues/56)
**Scope:** First CP2 push — Spoofing, Tampering and Repudiation. The remaining STRIDE categories and risk summaries will be added in a separate second push.
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

## Physical-book reference

[PENDING: verify the page in the physical copy of *Sistemas Distribuidos:
Conceptos y Diseño*, 3rd edition. Do not attribute an idea or page until
verified.]
