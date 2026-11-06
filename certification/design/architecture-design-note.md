<!-- Nota: completa este documento con información verificada; la versión final debe tener entre 1200 y 2000 palabras. -->

# Architecture design note — Bysellens

## 1. Target architecture

![Target architecture diagram](./target-architecture.png)

The target diagram has not been created because no verified architecture diagram was available in this workspace. Create and place the real Huawei Cloud target-architecture diagram at `certification/design/target-architecture.png`; do not use an illustrative or fabricated diagram.

The course workspace references the Bysellens architecture files `05-architecture/overview.md`, `05-architecture/hexagonal-architecture.md`, `05-architecture/pattern-guide.md`, and `05-architecture/decisions/records/ADR-003-stock-concurrency.md`. These paths are cited by weekly status records, but the current contents of the separate team documentation repository could not be verified here. Confirm each file and its contents before using it as design evidence.

The available local notes also warn that the Product Portal is a React/Ionic browser application with mock and configured HTTP modes, and that its backend is not part of that repository's runbook. They distinguish a documented `product-service` API from a local `catalogo-service` snapshot whose API differs. Confirm which components belong in the approved target before completing the map.

| Component as shown in the verified diagram | Real file in the team -docs repository (path and relevant section) |
|---|---|
| [Enter a component name from the final diagram] | [Enter and verify the corresponding real -docs path and section] |

Add one mapping row for every component in the final diagram. Do not infer a component or a documentation path.

## 2. Five principles

| Principle | Current weakness | Evidence in -docs | Design decision | Huawei Cloud service |
|---|---|---|---|---|
| Reliability | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Security | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Performance efficiency | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Cost | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |
| Operations | [Assess from verified evidence; do not assume a weakness.] | [Add a verified path and section; check 05-architecture/overview.md.] | [Enter a decision supported by project requirements.] | [Select after validating the design and service fit.] |

## 3. Scalability

The project workspace names the services below, but the notes identify different snapshots and an API-contract mismatch. Verify their inclusion and authoritative source before setting targets. All scaling values remain intentionally unspecified.

| Service | Scaling metric | Threshold | Minimum instances | Maximum instances |
|---|---|---|---|---|
| `product-service` (documented API; verify authoritative implementation) | [Choose a measured or requirement-based metric] | [Set from verified workload or test results] | [Enter] | [Enter] |
| `catalogo-service` (local snapshot; verify relation to target) | [Choose a measured or requirement-based metric] | [Set from verified workload or test results] | [Enter] | [Enter] |

## 4. Disaster recovery

- **Critical data store:** [Identify the store from the verified current architecture.]
- **RTO in minutes:** [Set and justify the required recovery time.]
- **RPO in minutes:** [Set and justify the acceptable data-loss window.]
- **Disaster recovery pattern:** [Select and describe a pattern supported by the actual system and requirements.]

Explain the selected pattern using verified requirements and recovery evidence:

1. This pattern meets the specified RTO of [value] minutes because [describe the verified recovery mechanism and its demonstrated or validated recovery time].
2. This pattern meets the specified RPO of [value] minutes because [describe the verified data-protection mechanism and its demonstrated or validated recovery point].

## 5. Automated deployment

The available local notes do not establish deployment pipeline files or triggers in the team's repositories. Verify each entry and provide a real repository path; otherwise leave it marked for completion.

| Stage | Trigger | Tool or service | File in team's repositories |
|---|---|---|---|
| Build | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Test | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Image | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Deploy to QA | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Deploy to production | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |
| Rollback | [Complete from the actual pipeline] | [Identify the actual tool or service] | [Not verified; add the real file path] |

## 6. Decisions

- [ADR-C3-01](./ADR-C3-01.md)
- [ADR-C3-02](./ADR-C3-02.md)

Complete both records with decisions made by the team and evidence from its repositories. The current files are editable templates, not statements of decisions already adopted.
