# CVTech2 Sprint 2 Deployment Note

## Summary

Sprint 2 for `CVTech2` has been deployed with a backup-first process and focuses on cleaning the site navigation and making the homepage feel more like the provided dashboard reference.

## What changed

- the legacy Quick Launch entries were removed from the left navigation
- the target dashboard navigation was reapplied in a clean order:
  - Dashboard
  - My Profile
  - Jobs
  - Simulations
  - Missions
  - Leaves
  - Overtime
- the homepage provisioning was refined to produce a more dashboard-oriented layout
- the deployment script was hardened to handle:
  - existing tenant theme reuse
  - legacy navigation cleanup
  - flaky SharePoint text-part provisioning with retries

## Site impact

- existing business lists were preserved
- dashboard KPI lists remain available and were not recreated destructively
- `Home.aspx` was reprovisioned
- navigation is now aligned with the intended dashboard structure

## Backup and safety

Each deployment attempt was preceded by a backup stored under:

- `sharepoint/CVTech2/archives/`

Recent Sprint 2 backup snapshots include:

- `20260402-180920`
- `20260402-181107`
- `20260402-181313`
- `20260402-181705`

## Verified outcomes

- Quick Launch now only shows the intended dashboard entries
- `Home.aspx` exists and contains provisioned controls
- KPI lists are still present on the site

## Remaining gap

The site is cleaner and closer to the mockup after Sprint 2, but it is still a native SharePoint approximation rather than a pixel-perfect app shell.

The next logical step is Sprint 3:

- bring the homepage closer to the mockup
- strengthen the hero/header area
- improve visual grouping of KPI cards
- decide whether a custom SPFx dashboard web part is needed for the last mile

