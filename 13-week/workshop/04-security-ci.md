# CP4 — Security CI Plan

**Owner:** Luis Gasca Bonilla (`@luisGascaB`)
**Trust boundary:** React administrative frontend → documented `product-service`
**Status:** Pipeline and authorization-test design prepared; workflow implementation
is blocked until the authoritative application repository is confirmed.

## Evidence and scope

The available microservices folder is a local snapshot without `.git`. It
contains a Java 17, Maven multi-module application and a `catalogo-service`,
not the separately documented `product-service`. Its shared Spring Security
configuration requires `ROLE_ADMIN` for all routes except explicitly public
paths. The inspected catalog service has product routes under
`/api/productos` and stock routes under `/api/inventario`; it does not implement
the documented `/api/v1/products` contract.

The snapshot has no project-level GitHub Actions workflow. Its only original
catalog-service test was a domain unit test; CP8 now adds a MockMvc
authorization test to this local snapshot. The course repository contains
workshop documentation, not the Java application. The snapshot has no Git
repository and is not confirmed as the authoritative Product implementation,
so no workflow or test is claimed as committed to the canonical application.

## Selected CI tools

| Purpose | Selected tool | Gate |
|---|---|---|
| Pull-request and `main` checks | GitHub Actions | Run on pull requests and pushes to `main`; fail the check if any build, test, or security-analysis job fails. |
| Java build and unit/integration tests | Repository Maven Wrapper, JDK 17, JUnit 5 | Run `./mvnw -B -ntp -pl catalogo-service -am verify` from the confirmed microservices repository root. |
| HTTP authorization tests | Spring Security Test and MockMvc | Exercise the configured resource-server filter chain and assert status codes plus absence of business side effects. Add the test dependency and tests in the authoritative Java repository. |
| Static analysis | GitHub CodeQL for Java | Run on pull requests to detect code-level security issues; findings must be triaged rather than silently ignored. |
| Dependency alerts | GitHub Dependabot alerts and pull requests | Enable for the confirmed application repository; review and test dependency updates through the same Maven gate. |

Use the Maven Wrapper rather than a globally installed Maven version so the
build follows the project's pinned Maven distribution. Do not place private or
production signing keys in CI. Authorization tests must use an ephemeral
test-only RSA key pair and test tokens.

## Required authorization test matrix

Test the actual Spring Security filter chain and protected controller routes,
not only the security configuration in isolation. For the available
`catalogo-service` snapshot, the concrete candidate operations are:

| Request | Expected result | Required assertion |
|---|---|---|
| `GET /api/productos` without a bearer token | `401 Unauthorized` | No protected product response is returned. |
| `GET /api/productos` with a malformed, expired, wrong-issuer, wrong-audience, or invalid-signature token | `401 Unauthorized` | No protected product response is returned. |
| `GET /api/productos` with a valid token whose role is not `ADMIN` | `403 Forbidden` | No protected product response is returned. |
| `PUT /api/inventario/{id}/aumentar?cantidad=1` with a valid non-ADMIN token | `403 Forbidden` | Verify the inventory use case is not invoked and stock remains unchanged. |
| `GET /api/productos` with a valid ADMIN token | Expected successful response | Confirms the protected route remains usable by an authorized administrator. |

Generate correctly signed test tokens with the test-only RSA key and exercise
the real decoder for signature, issuer, audience, expiry, and role-claim
mapping. A Spring Security `jwt()` request post-processor can help test
authorization rules, but it bypasses bearer-token decoding; if used, retain
separate decoder tests and do not treat it alone as proof of end-to-end JWT
validation.

For stable MVC tests, mock the relevant input use cases and assert denied
requests never invoke them. Keep database and message-broker dependencies out
of these authorization tests unless the selected test is explicitly an
integration test requiring those services.

## Pipeline contract

1. Check out the confirmed application repository and configure JDK 17.
2. Run `./mvnw -B -ntp -pl catalogo-service -am verify` from its root.
3. Ensure the authorization-test matrix runs as part of Maven `verify` and
   blocks merging on a failure.
4. Run CodeQL for Java on pull requests and publish its results to the
   repository's security tab.
5. Keep dependency alerts enabled and send dependency update pull requests
   through the same build and authorization tests.

The workflow belongs in the confirmed application repository, under
`.github/workflows/`; adding a Java workflow to the course-workshop repository
would not build the service and would give a misleading green check.

## Local baseline evidence

Command run against the available, non-Git microservices snapshot:

```text
./mvnw -B -ntp -pl catalogo-service -am verify
```

Result: **BUILD SUCCESS**; 5 `ProductoTest` tests passed, with 0 failures,
errors, or skips. This establishes that the selected Maven command runs against
that snapshot. It does not test the security filter chain, an HTTP endpoint, or
the documented `product-service`.

## Completion criteria and blocker

- [x] Select a Java/Maven CI build command based on the available snapshot.
- [x] Identify protected read and stock-update operations and define expected
  `401`/`403` behavior plus no-side-effect assertions.
- [x] Run the available Maven baseline and record its result.
- [ ] Confirm the authoritative application repository and its branch.
- [ ] Add the workflow, CodeQL configuration, and authorization tests to that
  repository.
- [ ] Run the new authorization tests in CI and record the actual check result.

Until the implementation repository is confirmed and the workflow/CI checks
pass there, CP4 remains **design prepared, implementation pending**. The CP8
test is provisional evidence for the available `catalogo-service` snapshot.
