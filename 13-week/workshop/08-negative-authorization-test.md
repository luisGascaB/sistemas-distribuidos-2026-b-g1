# CP8 — Negative Authorization Test

**Status:** Test executed successfully against the available local
`catalogo-service` snapshot. This is provisional evidence, not verification of
the documented `product-service`; its authoritative implementation repository
is still unconfirmed.

## Test performed

The test uses MockMvc to send requests through the service's configured Spring
Security filter chain and the real product/inventory controller routes. The
domain use cases and JWT decoder are mocked so the test does not connect to a
database, RabbitMQ, or external service.

| Scenario | Expected | Result |
|---|---:|---|
| `GET /api/productos` without a bearer token | `401 Unauthorized` | Passed; the response is the security error JSON, and the product use case is not called. |
| `PUT /api/inventario/123/aumentar?cantidad=1` with a decoded `USER` role | `403 Forbidden` | Passed; the response is the security error JSON, and the inventory use case is not called. |
| `GET /api/productos` with an `ADMIN` role | `200 OK` | Passed; the controller calls the product use case. |

The `USER` token is supplied by a mocked decoder. These tests exercise
authorization and confirm that denied requests do not reach the business
use cases; they do **not** verify JWT signature, issuer, audience, expiry, or
the live database/event side effects.

## Evidence

- Test: local `bysellens-microservicios/catalogo-service/src/test/java/mvp/bysellens/catalogo/infrastructure/adapter/in/web/ProductoAuthorizationTest.java`.
- Command, run from the local microservices snapshot root:

  ```powershell
  .\mvnw.cmd -B -ntp -pl catalogo-service -am -Dtest=ProductoAuthorizationTest -Dsurefire.failIfNoSpecifiedTests=false test
  ```

- Exit code: `0`.
- Result: `Tests run: 3, Failures: 0, Errors: 0, Skipped: 0`; Maven `BUILD SUCCESS`.
- The snapshot needed the Boot 4 MVC test starter and Spring Security test
  dependency. It has no Git repository, so the test code is not committed with
  this workshop checkpoint.

## Environment and verdict

```text
environment:
  docker: UNAVAILABLE — docker info could not connect to the Docker Desktop Linux engine (named pipe not found)
  node: AVAILABLE — v24.15.0
  playwright: NOT REQUIRED — the selected test target is an API with no browser UI
  infra-tier: NOT REQUIRED for this MVC slice — database and broker are not started or contacted
  browser-tier: SKIPPED — API-only test scope; CP4 selects MockMvc
startup: PASS — MockMvc Spring test context started in 5.607s as part of the Maven test command
integration: PASS — exit_code: 0, passed: 3, failed: 0, skipped: 0; authorization filter chain and controller routes; mocked decoder/use cases
e2e: UNVERIFIED — no browser UI; live service and external dependencies were not started
overall: NEEDS_SIGNOFF — the tests pass against the available catalogo-service snapshot, but the canonical product-service remains unverified
```

## Completion

- [x] Add and run a negative authorization test against the available service
  snapshot.
- [x] Assert both the denial response and that the protected stock use case is
  not invoked.
- [ ] Confirm the authoritative application repository and rerun equivalent
  tests against its actual `product-service`.
- [ ] Record canonical-service evidence before marking CP8 complete.

CP8 remains **provisional** until the correct Product service is identified and
verified.
