# Initial publication checks

The initial public history is created from the reviewed project files as a single
root commit. Earlier development commits and local backup references are excluded.

## Scope

- Original project code is covered by the complete root MIT license.
- The seven Engineering OS skills and three generated adapters retain their
  upstream MIT license and attribution; their content matches the pinned source.
- No game images, fonts, music, audio, or assets with unverified licenses are included.
- No application functionality, deployment configuration, or user data is included.

## Verification

Review the exact staged files and root commit before publishing:

- Check filenames and content for credentials, private keys, token patterns,
  personal contact details, local paths, hostnames, and internal IP addresses.
- Check local Markdown links, skill metadata, adapter TOML, and license notices.
- Check `.gitignore` exclusions and whitespace with `git diff --cached --check`.
- Verify the initial commit has no parents and contains only the reviewed files.
- Push only `refs/heads/main`, without tags, backup refs, or development branches.
- Verify the remote commit and default branch after publication.

Pattern-based inspection cannot guarantee the absence of all secrets. There is
no application build or game test suite at this stage. See [asset notices](../ASSET_LICENSES.md)
and [Engineering OS provenance](engineering-os/README.md) for licensing details.
