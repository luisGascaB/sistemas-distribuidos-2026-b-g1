
<!-- Complete this document with verified information. The final version must contain 1,200–2,000 words, written by you. -->

# Architecture design note — Bysellens

## 1. Target architecture

![Target architecture](./target-architecture.png)

The target architecture diagram has not been created because no verified architecture diagram was available in this workspace. Create and place the actual Huawei Cloud target architecture diagram at `certification/design/target-architecture.png`. Do not use an illustrative or fabricated diagram.

The course workspace references the following Bysellens architecture files:

- `05-architecture/overview.md`
- `05-architecture/hexagonal-architecture.md`
- `05-architecture/pattern-guide.md`
- `05-architecture/decisions/records/ADR-003-stock-concurrency.md`

These paths are cited by weekly status records, but the current contents of the separate team documentation repository have not been verified here. Confirm each file and its contents before using it as design evidence.

The available local notes identify the Product Portal as a React/Ionic browser application with mock and configured HTTP modes. They also indicate that its backend is not part of that repository's runbook.

The notes distinguish a documented `product-service` API from a local `catalogo-service` snapshot whose API differs. Confirm which components belong in the approved target architecture before completing the diagram.

| Component as shown in the verified diagram | Real file in the team -docs repository (path and relevant section) |
|---|---|
| [Enter a component name from the final diagram] | [Enter and verify the corresponding real -docs path and section] |

Add one mapping row for every component in the final diagram. Do not infer components or documentation paths.

## 2. Five principles

Evaluate the five principles using verified project evidence. Identify the current weakness, reference the relevant documentation, explain the design decision and select an appropriate Huawei Cloud service only after validating its suitability.

| Principle | Current weakness | Evidence in -docs | Design decision | Huawei Cloud service |
|---|---|---|---|---|
| Reliability | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Security | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Performance efficiency | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Cost | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Operations | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |

## 3. Scalability

The project workspace names the services below, but the notes identify different snapshots and an API-contract mismatch. Verify their inclusion and authoritative source before setting scaling targets.

All scaling values remain intentionally unspecified until supported by workload measurements or documented requirements.

| Service | Scaling metric | Threshold (number and unit) | Minimum instances | Maximum instances |
|---|---|---|---|---|
| `product-service` (documented API; verify authoritative implementation) | [Choose a measured or requirement-based metric] | [Set from verified workload or test results] | [Enter] | [Enter] |
| `catalogo-service` (local snapshot; verify relation to target) | [Choose a measured or requirement-based metric] | [Set from verified workload or test results] | [Enter] | [Enter] |

## 4. Disaster recovery

- **Critical data store:** [Identify the store from the verified current architecture.]
- **RTO in minutes:** [Set and justify the required recovery time.]
- **RPO in minutes:** [Set and justify the acceptable data-loss window.]
- **Disaster recovery pattern (chapter 11):** [Select and describe a pattern supported by the actual system and requirements.]

Explain the selected pattern using verified requirements and recovery evidence:

1. This pattern meets the specified RTO of [value] minutes because [describe the verified recovery mechanism and its demonstrated or validated recovery time].
2. This pattern meets the specified RPO of [value] minutes because [describe the verified data-protection mechanism and its demonstrated or validated recovery point].

## 5. Automated deployment

The available local notes do not establish deployment pipeline files or triggers in the team's repositories. Verify each entry and provide a real repository path. Otherwise, leave it marked for completion.

| Stage | Trigger | Tool or service | File in team's repositories |
|---|---|---|---|
| Build | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Test | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Image | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Deploy to QA | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Deploy to production | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Rollback | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |

## 6. Decisions

The following Architecture Decision Records document the decisions associated with the architecture design. Complete both records with decisions made or confirmed by the team and evidence from its repositories.

- [ADR-C3-01](./ADR-C3-01.md)
- [ADR-C3-02](./ADR-C3-02.md)

The current ADR files are editable templates, not statements of decisions already adopted.
