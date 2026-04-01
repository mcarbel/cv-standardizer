# CVTech2 SharePoint Site Template

This folder contains a reusable SharePoint site template starter for the `CVTech2` site.

The target visual direction is inspired by the provided dashboard mockup:

- teal-to-deep-green brand gradient
- bold "hello" header area
- left navigation focused on dashboard-style entries
- KPI cards arranged in two-column dashboard rows
- clean, airy layout with rounded white panels

## What this template includes

- a backup workflow before deployment
- a SharePoint theme definition
- a target navigation model
- starter list definitions for the dashboard metrics
- a PnP PowerShell provisioning script
- a deploy wrapper that backs up first, then provisions
- a layout blueprint explaining how the mockup maps to native SharePoint building blocks

## Important limitation

This template is designed to **approximate** the mockup using native modern SharePoint capabilities.

Modern SharePoint does **not** natively support:

- a fully custom curved left shell like the screenshot
- pixel-perfect app-like positioning everywhere
- bespoke KPI cards with arbitrary styling without custom SPFx components

So the recommended approach is:

1. back up the existing site state
2. apply the theme
3. provision the lists and navigation
4. build the home page with the supplied structure
5. optionally add a dedicated SPFx dashboard web part later for a closer visual match

## Folder structure

- `theme/cvtech2-theme.json`
- `config/navigation.json`
- `config/lists.json`
- `config/dashboard-layout.json`
- `scripts/backup-cvtech2-site.ps1`
- `scripts/provision-cvtech2-site.ps1`
- `scripts/deploy-cvtech2-template.ps1`
- `archives/`

## Recommended site type

Use a **Communication Site** for the closest result to the mockup:

- more visual landing page
- stronger homepage focus
- easier dashboard presentation

## Provisioning flow

1. Ensure `PnP.PowerShell` is installed
2. Review the theme and labels in `config/` and `theme/`
3. Run the backup-aware deploy wrapper
4. Review the generated archive under `archives/`
5. Open the homepage and fine-tune content blocks if needed

## Example

```powershell
./sharepoint/CVTech2/scripts/deploy-cvtech2-template.ps1 `
  -SiteUrl "https://braineesysms365.sharepoint.com/sites/CVTech2" `
  -TenantAdminUrl "https://braineesysms365-admin.sharepoint.com" `
  -Tenant "braineesysms365.onmicrosoft.com" `
  -ClientId "9fb46f90-4038-4225-9241-0ced8ad3318b" `
  -PersistLogin
```

## Backup behavior

Before provisioning, the deploy wrapper stores a timestamped snapshot under `archives/`.

The backup currently includes:

- site metadata
- navigation
- a PnP site template export
- visible lists metadata
- visible lists items as JSON
- site pages metadata

### Important note

Existing lists are preserved by the provisioning script:

- if a list already exists, it is kept and not recreated
- the main page is recreated during provisioning, which is why the backup step is important

## Mockup mapping

### Left rail

Approximated with:

- site theme
- quick launch navigation
- optional logo/header image

### "Hello Mario" header

Approximated with:

- title area
- hero text block
- optional audience/user profile section

### KPI cards

Approximated with:

- two-column sections
- text parts and list-driven quick summaries
- optional future SPFx KPI card web part

### Monthly report area

Approximated with:

- additional two-column sections
- lists and quick links to operational pages

## Next level refinement

If you want the page to look even closer to the screenshot, the next step would be:

- a dedicated SPFx `CVTech2 Dashboard` web part with custom cards, icons, and gradients
- possibly a header extension/app customizer for a more app-like shell
