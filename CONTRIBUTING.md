# Contributing to the Muscle Memory Hub

Everything here arrives as a pull request and is read by a person before it is public.

## The path of a package

1. **Submit.** When you make a routine, a menu map, a site map or an API record, Muscle Memory asks
   whether to share it (sharing is on by default; answer no to keep it on your computer). A shared
   item is packed and signed with your key into `~/.musclememory/hub/submissions/`. Packing refuses
   anything that carries a password, an API key, a value a routine captured as a secret, a picture of
   one, a card or account number, or other personal data.
2. **Pull request.** Muscle Memory sends the queue with the GitHub CLI (`gh`, logged in as you): it
   unpacks each package into `submissions/<id>/<version>/` on a branch `submission/<id>-<version>`,
   pushes it (to your fork if you cannot push here) and opens a pull request. Sent packages are not
   sent again.
3. **Review.** The `review` workflow checks the author's signature, every file hash, the secret and
   personal data scanner, that each routine loads, and that the folder sits where its manifest says.
   It posts the result on the pull request. A maintainer then reads the files themselves.
4. **Merge.** Merging is the maintainer's acceptance.
5. **Public.** The `publish` workflow moves the submission to `packages/<kind>/<id>/<version>/`,
   rebuilds and signs `index.json`, and deploys the site. From then on `musclememory hub search`
   finds it.

## Fixes from the field

When Muscle Memory heals a step of a hub routine on someone's machine (the button moved, say), it
queues a fix. Sending fixes opens a pull request that edits the package's files (the step's box in
`routine.json`, the new snippet, the manifest's file hashes) with the fix's signature in the
description. The author's `manifest.sig` no longer matches after such an edit, so the review check
fails until a maintainer re-signs and bumps the version:

```
python -m hub.repo resign packages/<kind>/<id>/<version> --version <next version>
git mv packages/<kind>/<id>/<version> packages/<kind>/<id>/<next version>
```

## Rules for packages

- No secrets, no personal data, no captured keys. Inputs are `{{placeholders}}`; passwords come from
  the credential manager at run time.
- API records use `{{api_key}}` in headers and never carry a key.
- One package id per program or site task; a new version for every change.
- A version that is published is never changed in place except by a maintainer-signed fix.
