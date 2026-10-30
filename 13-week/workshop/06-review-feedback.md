# CP6 — Review Feedback and Follow-up

**Evidence source:** Teammate pull request
[#66 — Complete inventory STRIDE analysis — CP2 continuation](https://github.com/code-corhuila/bysellens-docs/pull/66)
**Author:** `7714095Alexandra`
**Status:** The PR's feedback cycle is documented below. This is not feedback
on the participant's CP5 review, which has not been submitted.

## Feedback received

On October 30, 2026, reviewer `AnaMariaCharry` commented that scenario T-02
(replay or alteration of `ProductCreated`) was outside the selected
administrator React → `inventory-service` HTTP boundary. The reviewer
recommended labeling it as a related downstream threat and assessing it
separately so the scope and prioritization remain clear.

Evidence: [reviewer comment on PR #66](https://github.com/code-corhuila/bysellens-docs/pull/66#issuecomment-6514577794).

## Author response and observed change

The PR author replied that T-02 had been relabeled as a related downstream
threat, removed from the direct HTTP risk ranking, and retained for a separate
event-processing analysis. The current PR diff implements that response:

- T-02 is explicitly marked as a related downstream threat, not a direct
  React → Inventory HTTP threat.
- The mitigation and verification steps are assigned to a separate downstream
  event-processing scope.
- T-02 is listed separately from the direct risk ranking.

Evidence: [author response](https://github.com/code-corhuila/bysellens-docs/pull/66#issuecomment-6514816526)
and [current PR diff](https://github.com/code-corhuila/bysellens-docs/pull/66/files).

## Assessment

The author addressed the reviewer's scope concern in the document. No further
action on T-02 was identified in the inspected diff. The PR remains open; this
record does not imply approval, merge, or runtime verification.

The S-02 likelihood-calibration suggestion in
[`05-peer-review.md`](./05-peer-review.md) is a separate, non-blocking
recommendation drafted by the participant. It has not been posted, so no
response to that suggestion is available.

## CP6 completion status

- [x] Record a real review comment and link to its source.
- [x] Check the author's response against the current PR change.
- [x] Record the outcome without claiming approval or merge.
- [ ] Submit the participant's CP5 review and record any response to it.

CP6 is **partially evidenced**; the participant's own review/response cycle
remains pending.
