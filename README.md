# RoadPilot

Desktop application for autonomous driving in Euro Truck Simulator 2 and American Truck Simulator.

**Current state: Phase 1.** The app shows the dashboard UI with static mock data only. It has no game
integration, telemetry or vehicle control, and the controls are visual placeholders.

## Stack

Tauri 2 (Rust) · React 19 · TypeScript (strict) · Vite · plain CSS with design tokens · Lucide icons

## Development

```sh
npm install
npm run tauri dev      # start the desktop app
npm run dev            # frontend only, http://localhost:1420
```

## Checks

```sh
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm run format:check   # Prettier
npm run build          # production frontend build
cd src-tauri && cargo clippy -- -D warnings && cargo fmt --check
```

## Structure

```
src/
  components/
    layout/      Header, Logo
    dashboard/   Dashboard and its panels
    ui/          Reusable primitives (Card, Toggle, Badge, ...)
  data/          Static mock data
  styles/        Design tokens and global styles
  types/         Shared TypeScript types
  utils/         Formatting helpers
src-tauri/       Minimal Rust shell (no commands, no plugins)
```
