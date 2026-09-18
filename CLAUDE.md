# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

The frontend is a static site served via PhpStorm's built-in web server (default port 63342). Open `index.html` in
PhpStorm and use the built-in server to run it locally.

Authentication is handled by a separate `login-page` project, hosted
at `https://bread-005.github.io/login-page/index.html`. Pages redirect there when no valid session is found.
Authentication state is shared through `localStorage` (key `"login-page"`) — no local setup needed beyond having a valid
session in that storage key.

## Architecture

This is a **vanilla JS frontend-only app** — no framework, no build step, no bundler. All JS files use native ES
modules (`import`/`export`).

### Pages and their JS entry points

| HTML file         | JS file         | Purpose                                      |
|-------------------|-----------------|----------------------------------------------|
| `index.html`      | `script.js`     | Main page: role list, filters, role creation |
| `wiki.html`       | `wiki.js`       | Detail/edit view for a single role           |
| `nightorder.html` | `nightOrder.js` | Full night order display and editing         |
| `scriptTool.html` | `scriptTool.js` | Script builder tool                          |

The role list on `index.html` is paginated at 10 roles per page (`displayRoles()`/`showPages()` in `script.js`).
Clicking a pagination button preserves `window.scrollY` across the re-render to avoid a visible page jump.

### Shared module: `functions.js`

All shared logic lives here and is imported by the page scripts. Key exports:

- `API_URL` — backend base URL (`https://hobby-projects-api.onrender.com`)
- `websiteStorage` — parsed `localStorage` object keyed as `"websiteStorage1"`;
  shape: `{ localRoleIdeas, roleIdeas, officialRoles, user, archive }`
- `loginStorage` — parsed `localStorage` object keyed as `"login-page"`; shape: `{ name, token }`
- `saveLocalStorage()` — persists `websiteStorage` back to `localStorage`
- `getRoleIdeas()` — merges `roleIdeas` (remote) and `localRoleIdeas` (offline) into one array
- `databaseIsConnected()` — async check against the API; app degrades gracefully when offline
- `updateRole()`, `createRole()`, `deleteRole()` — REST calls to the backend, each re-fetches the full role list after
  mutation
- `getJsonString(role)` — serialises a role into the Blood on the Clocktower JSON script format
- `getTeamColor(team)` — maps character type to a CSS color string
- `characterTypes`, `allTags`, `StevenApprovedOrder` — shared lookup arrays

### Shared module: `roleData.js`

Pure role-data logic with no DOM dependencies, used by `script.js` when creating or importing roles. Key exports:

- `createRoleFromForm(name, characterType, ability, owner)` — builds a role object with all default fields for a role
  created via the manual form
- `generateUniqueCreatedAt(candidateCreatedAt)` — resolves `createdAt` collisions when importing roles
- `normalizeRoleImage()`, `normalizeRoleDefaults()`, `normalizeJinxes()`, `normalizeSpecial()`, `normalizeRoleTags()` —
  normalise a role/JSON object imported via the JSON textarea or script upload
- `autoAddTags(role)` — derives tags from the ability text via `autoTagRules` when no tags were supplied
- `migrateRoleRating()`, `migrateRoleFavorite()`, `migrateRoleOwnership()`, `migrateRoleLastEdited()` — one-time
  migrations applied to roles loaded from an older `localStorage` schema

### Data flow

1. On page load, `websiteStorage` is read from `localStorage`.
2. If the backend is reachable, `roleIdeas` is refreshed from the API and merged with `localRoleIdeas`.
3. All UI mutations call `saveLocalStorage()` immediately to keep the local copy in sync.
4. Authentication is checked by sending `loginStorage.token` to the backend's `POST /session/verify` endpoint on each
   page load; failed/expired auth redirects to the login page. The role create/update/delete endpoints separately
   authenticate each request by forwarding `loginStorage` as `credentials` and having the backend look up the token
   in its `sessions` collection. The login/logout button also calls `POST /session/delete` before redirecting to the
   login page, invalidating the session server-side.

### Navigation

- `index.html` has a `.bottom-nav` with links to the night order, filtered-role download, the official Steven/Clocktower
  script list, and the script tool.
- `wiki.html` uses a tab-based layout: `.tab-button[data-tab]` buttons in `.wiki-tabs` toggle
  matching `.tab-panel[data-tab]` sections (night order, jinxes, special, reminders, tags, script, how-to-run, rating,
  comments, and the edit-only icon/owners/privacy tabs). Tab switching logic lives in `wiki.js`.

### `officialCharacters.json`

Static file bundled with the frontend. Contains all official Blood on the Clocktower characters. Loaded once at startup
into `websiteStorage.officialRoles`.

### Icons

Role token images live in `icons/` as `Icon_<rolename>.png` (all lowercase, spaces removed). The `imagePath` helper
in `functions.js` resolves icon paths.
