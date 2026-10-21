# CP7 - Burn-rate alert policy for Product Portal

## Availability SLI and budget

The alerts use the CP6 availability SLI:

```text
availability = successful valid operations / all valid operations
error ratio = failed valid operations / all valid operations
SLO = 99% over 30 days
allowed error ratio = 1%
```

The Prometheus metric contract is `product_portal_operations_total{operation, outcome}`. For the SLO, `outcome="error"` represents a valid operation that failed. Client-side validation rejections and MOCK-mode activity must not be counted as production service failures.

## Fast burn alert

- **Rule:** `ProductPortalAvailabilityFastBurn`
- **Condition:** burn rate > 14.4 in both the rolling 1-hour and 5-minute windows.
- **Confirmation:** `for: 5m`.
- **Severity/team:** `critical` / `By-sellens`.
- **Budget meaning:** at a constant burn rate of 14.4, 1 hour consumes `14.4 × 1 / 720 = 2%` of a 30-day budget.
- **Illustrative CP6 budget:** 2% of 7.5 failed operations is `0.15` operation; 2% of 144 minutes is `2.88` minutes. These are expected budget consumption at that burn rate, not a promise that a fraction of a request can fail.
- **Interpretation:** investigate promptly using the trace ID and the CP8 runbook. The second, short window confirms that the elevated rate is still occurring rather than only reflecting an older one-hour incident.

## Slow burn alert

- **Rule:** `ProductPortalAvailabilitySlowBurn`
- **Condition:** burn rate > 6 in both the rolling 6-hour and 30-minute windows.
- **Confirmation:** `for: 30m`.
- **Severity/team:** `warning` / `By-sellens`.
- **Budget meaning:** at a constant burn rate of 6, 6 hours consumes `6 × 6 / 720 = 5%` of a 30-day budget.
- **Illustrative CP6 budget:** 5% of 7.5 failed operations is `0.375` operation; 5% of 144 minutes is `7.2` minutes.
- **Interpretation:** review recent changes, API availability and the operation traces; prioritize a fix before the error budget continues to drain.

## Why the alerts use two windows

The long window measures sustained budget consumption. The short window confirms that the burn is current. Both must exceed the threshold before an alert can fire, reducing alerts caused by a brief historical spike. The `for` duration adds a further confirmation period.

## Cause-based alerts intentionally not added

1. **Product-list HTTP 5xx or timeout alert:** not added because those are causes/signals, not the user-facing availability objective. If the backend exports these separately, use them as diagnostic panels or route-specific alerts only when they have an owner and actionable response; otherwise they duplicate the SLO alert.
2. **Stock-adjustment failure-count alert:** not added because it overlaps with the availability SLI and can fire on low traffic or expected business validation. Separate business rejection from technical failure first, and ensure there is enough traffic and a clear remediation action before adding a dedicated alert.

## Low-traffic limitation

The illustrative scenario is only 25 operations per 8-hour business day. At that volume, one failure can cause a large short-window error ratio, while periods with no requests provide no evidence of availability. Treat these burn alerts as a workshop design until real-mode telemetry is exported, request volume is sufficient, and alert behavior has been tested against actual traffic. A synthetic check may be needed to measure availability during idle periods, but it is not part of this CP7 rule set.
