# CVTech2 Sprint 3

This sprint focuses on bringing the native SharePoint homepage closer to the target dashboard mockup while staying inside a backup-first provisioning workflow.

## Goals

- strengthen the visual hierarchy of the homepage
- introduce a more app-like dashboard shell using native SharePoint-compatible markup
- improve the top-of-page experience so it feels closer to the supplied reference
- preserve the current clean Quick Launch achieved in Sprint 2

## Scope

### P1

- refine the homepage hero so it feels more like a product dashboard header
- improve KPI card styling with more consistent spacing and stronger visual grouping
- add a dedicated language/status panel area that feels closer to the mockup side controls
- introduce a more intentional dashboard title/subtitle rhythm
- add controlled placeholders for profile/avatar, notification area, and footer language block

### P2

- provision helper site pages linked from the left navigation with better placeholder content
- improve card labels for operational readability
- add a second section style variant for “highlight” KPI rows
- reduce repeated generic SharePoint visuals where possible

### P3

- assess whether an SPFx dashboard web part is now justified for pixel-level control
- prepare a follow-up concept for a custom app shell/header extension

## Acceptance Criteria

- the homepage remains provisionable through the current `PnP.PowerShell` workflow
- the page does not end up blank if SharePoint rejects a richer HTML fragment
- Quick Launch remains exactly:
  - Dashboard
  - My Profile
  - Jobs
  - Simulations
  - Missions
  - Leaves
  - Overtime
- the visual gap to the provided mockup is noticeably smaller than in Sprint 2

## Implementation Notes

- keep HTML fragments conservative enough for `Add-PnPPageTextPart`
- favor multiple simple text parts over one overly complex fragment
- continue creating a full backup archive before each deployment attempt
- keep all Sprint 3 work under a new feature branch and validate on `CVTech2`

