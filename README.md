# RoadPilot

Desktop application for autonomous driving in Euro Truck Simulator 2 and American Truck Simulator.

**Current state: demo, version 0.1.0.** The app shows the dashboard with a simulated demo drive and
sample data. It has no game integration, telemetry or vehicle control. It can check for, download
and install signed updates from GitHub Releases (see [Releases and updates](#releases-and-updates)).

## Stack

Tauri 2 (Rust) · React 19 · TypeScript (strict) · Vite · plain CSS with design tokens · Lucide icons ·
Vitest · official Tauri updater plugin

## Development

```sh
npm install
npm run tauri dev      # start the desktop app
npm run dev            # frontend only, http://localhost:1420
```

Local and dev builds have **no update source**. The "App updates" card under Settings then shows
"Update checks are not set up for this build", and RoadPilot never contacts an update server. In the
browser-only preview (`npm run dev`) it shows that updates are only available in the desktop app.

## Checks

```sh
npm run format:check   # Prettier
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # Vitest: version comparison, update states, error cases
npm run check:versions # all version numbers agree
npm run build          # production frontend build
cd src-tauri && cargo fmt --check && cargo clippy --all-targets -- -D warnings && cargo test
```

## Structure

```
src/
  components/
    layout/      Header, Logo
    dashboard/   Dashboard, pages and their panels
    updates/     Update notice (dashboard) and "App updates" card (settings)
    ui/          Reusable primitives (Card, Toggle, Badge, ...)
  data/          Mock data, starting point of the demo drive
  demo/          Simulated demo drive
  updates/       Update state, version comparison, bridge to the Rust commands
  styles/        Design tokens and global styles
  types/         Shared TypeScript types
  utils/         Formatting helpers
src-tauri/
  src/updater.rs              Update commands (check, download, install, restart)
  tauri.conf.json             Base config, used for dev and local builds
  tauri.release.conf.json     Release-only additions: updater artifacts and update source
  capabilities/default.json   Window permissions
scripts/check-versions.mjs    Version consistency check
.github/workflows/release.yml Signed Windows release build
```

## Versioning

RoadPilot uses [Semantic Versioning](https://semver.org): patch for bug fixes, minor for new
backwards-compatible features, major for incompatible changes. While the version is `0.x`, the
first public demo release is planned as `0.2.0`.

The version is stored in five places. They must always agree, and `npm run check:versions` checks
this:

- `package.json` and `package-lock.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml` and `src-tauri/Cargo.lock`

The release workflow also requires the Git tag to match (tag `v0.2.0` for version `0.2.0`).

## Releases and updates

### How it works

- Updates use the official [Tauri updater plugin](https://v2.tauri.app/plugin/updater/) (v2). Check,
  download, signature check and installation all run in Rust (`src-tauri/src/updater.rs`). The
  React UI only calls these commands and shows their state.
- Releases are hosted on **GitHub Releases** of `OranjeDev/RoadPilot`. Installed apps read
  `https://github.com/OranjeDev/RoadPilot/releases/latest/download/latest.json`. It always points to
  the newest **published** release; drafts and pre-releases are not served.
- Every update is signed. The app has the public key built in and installs nothing whose signature
  does not match.
- RoadPilot checks once, a few seconds after start, and on demand via **Settings → App updates →
  Check for updates**. If an update is found, a compact notice on the dashboard shows the installed
  and the new version. Download and install only start when the user clicks.
- On Windows, "Install and restart" closes RoadPilot, the installer runs with a progress window
  (`installMode: passive`) and starts RoadPilot again. The UI says so before the user clicks.
- The UI only offers a version that is strictly newer than the installed one. Without a published
  release, the check reports "No published release was found" instead of inventing an update.

**Platforms:** only Windows (x64, NSIS installer) is built and released. macOS and Linux are not part
of the release process. Adding them needs extra runners in the workflow and, for macOS, code signing.

### One-time setup (not done yet)

1. **Generate the updater signing key** on your own machine. Choose a strong password when asked:

   ```sh
   npx tauri signer generate -w ~/.tauri/roadpilot.key
   ```

   This creates `~/.tauri/roadpilot.key` (private) and `~/.tauri/roadpilot.key.pub` (public).

2. **Back up the private key and its password** somewhere safe, e.g. a password manager. If either
   is lost, installed copies can never receive another update. Never commit the private key, never
   put it in the repository or in `.env` files, and never share it in issues or chats.

3. **Add them to GitHub** under Settings → Secrets and variables → Actions:

   | Kind     | Name                                 | Value                               |
   | -------- | ------------------------------------ | ----------------------------------- |
   | Secret   | `TAURI_SIGNING_PRIVATE_KEY`          | full content of `roadpilot.key`     |
   | Secret   | `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | the key password                    |
   | Variable | `TAURI_UPDATER_PUBKEY`               | full content of `roadpilot.key.pub` |

   The public key is not secret. It is a variable so the workflow can write it into the build config
   (`plugins.updater.pubkey`) without a hardcoded copy in the repository. It must always belong to
   the private key; changing keys later cuts off every installed version built with the old key.

### Publishing a release (e.g. the first public demo `0.2.0`)

1. Set the new version everywhere:

   ```sh
   npm version 0.2.0 --no-git-tag-version   # package.json + package-lock.json
   # edit "version" in src-tauri/tauri.conf.json and [package] version in src-tauri/Cargo.toml
   cargo check --manifest-path src-tauri/Cargo.toml   # updates Cargo.lock
   npm run check:versions
   ```

2. Commit, then tag and push:

   ```sh
   git tag v0.2.0
   git push origin main v0.2.0
   ```

3. The **release** workflow runs all checks, builds the NSIS installer with
   `tauri.release.conf.json`, signs it and creates a **draft** release with the installer, its
   `.sig` file and `latest.json`.
4. Check the draft on GitHub: version, assets, and the release notes (the text appears in the app
   under "What's new"). Then **publish** it. From that moment, installed apps see the update.

Version `0.2.0` is the first release with an update source built in. `0.1.0` is a local demo build
without one, so it cannot update itself: install `0.2.0` by hand once. All later releases reach it
through the updater.

### Testing a release build locally

A local build with the update source needs your public key in a config file that is not committed:

```sh
echo '{"plugins":{"updater":{"pubkey":"<content of roadpilot.key.pub>"}}}' > src-tauri/tauri.pubkey.conf.json
TAURI_SIGNING_PRIVATE_KEY="$(cat ~/.tauri/roadpilot.key)" TAURI_SIGNING_PRIVATE_KEY_PASSWORD="<password>" \
  npx tauri build --config src-tauri/tauri.release.conf.json --config src-tauri/tauri.pubkey.conf.json
```

`src-tauri/tauri.pubkey.conf.json` is listed in `.gitignore`. Without the signing variables,
`tauri build` with the release config fails on purpose; plain `npm run tauri build` keeps working.
