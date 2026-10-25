# Muscle Memory Hub

Maps for [Muscle Memory](https://github.com/Dominic-Shirazi/OpenClaw_Screen_Driver): routines, menu
catalogues, site maps and API records that people have already made, so nobody has to map the same
program twice.

Browse: https://dominic-shirazi.github.io/musclememory-hub/

## Using it

Muscle Memory reads this hub by default (`hub.url` in `config.yaml` is
`https://dominic-shirazi.github.io/musclememory-hub/index.json`). Nothing installs by itself:

```
musclememory hub search gnucash receipt
musclememory hub pull gnucash-receipt
```

or ask your agent (`mm_hub_search`, `mm_hub_pull`). Every package is signed by its author, and
`index.json` is signed by this hub (`index.sig`, key in `hub_root.pub`). Muscle Memory checks both, and
every file's sha256, before it installs anything.

## What is in this repo

```
packages/<kind>/<id>/<version>/   published packages, unzipped (kind: routine, catalogue, site, api)
    manifest.json, manifest.sig   the author's signed manifest
    routines/..., catalogue/..., apis/...
submissions/<id>/<version>/       packages waiting for review (each arrives as a pull request)
index.json, index.sig             the signed index the app and the browse page read
site/                             the browse page
.github/workflows/                review (every pull request) and publish (every merge)
```

Packages are kept as plain files, so an update shows up as a readable diff.

## Sharing your own maps

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: Muscle Memory asks "share it with the hub?" for each
new map, packs the ones you say yes to (refusing anything that holds a password, a key or personal
data) and opens a pull request here for you.

## LICENCE NOTE

In plain words (the full terms are in Muscle Memory's `docs/LICENSING.md`):

- Personal use of Muscle Memory is free: your own tasks, study, hobby
  projects, on your own computer.
- A business, or anyone using it for paid work, needs a commercial licence.
  Building Muscle Memory into another product or service, reselling it or
  hosting it for others needs a separate paid agreement.
- Routines, menu maps and site maps on this hub are free to use with a
  properly licensed Muscle Memory (free personal use counts for personal
  use; business use needs the commercial licence for the Muscle Memory doing
  the running).
- Authors publish packages here under Creative Commons Attribution 4.0
  (CC-BY-4.0). Anyone may reuse and adapt a package as long as they credit
  the author; the hub shows the author on each package.
- Submitting a package means you confirm you have the right to share what is
  in it. Snippets are small screenshots of the program a routine drives;
  those pictures are not yours to licence, and the CC-BY grant covers only
  what you own.
- Model and API costs are always yours: Muscle Memory calls the models you
  point it at with your own accounts and keys. Local models cost nothing per
  call.
