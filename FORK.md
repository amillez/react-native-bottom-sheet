# Fork notes: teleport-backed provider portal

Branch `teleport-portal` of
[amillez/react-native-bottom-sheet](https://github.com/amillez/react-native-bottom-sheet),
forked from
[software-mansion-labs/react-native-bottom-sheet](https://github.com/software-mansion-labs/react-native-bottom-sheet)
at `eb77ea8` (0.17.0-next.1).

## Problem: upstream #61

[#61 — ModalBottomSheet loses contexts](https://github.com/software-mansion-labs/react-native-bottom-sheet/issues/61).

Upstream's `Portal` does not use a React portal. It stores the sheet's
_elements_ in a map, and `PortalHost` renders them as children of
`BottomSheetProvider`. React resolves context where an element is rendered, not
where it was created, so every provider between `BottomSheetProvider` and a
`ModalBottomSheet` is invisible to the sheet's content. In practice that is most
of an app's providers: theme, i18n, query clients, feature config, and React
Navigation's screen context (`useNavigation`, `useRoute`), which can only live
below the provider.

The workarounds in the issue thread are to hoist providers above
`BottomSheetProvider` (impossible for navigation) or to re-provide captured
context values inside each sheet (one line per context, at every call site, and
easy to forget).

The same problem affects `@gorhom/portal`. The KaikuLabs forks fixed it there
with `its-fine`'s context bridge. This fork fixes it by removing the remount
instead of bridging around it.

## Change

`BottomSheetProvider` is rebuilt on
[`react-native-teleport`](https://github.com/kirillzyusko/react-native-teleport)
(peer dependency, `>=1.2.2`):

- The provider mounts a teleport `PortalHost` (absolute fill) after its
  children. `ModalBottomSheet` wraps the sheet in a teleport `Portal` aimed at
  it.
- The sheet's fiber stays at the declaration site; teleport reparents the native
  view into the host. Context, including navigation, flows normally.
- Teleport's shadow node sizes the portal from its host and offsets it to the
  host's origin, so a sheet's canvas is still the provider's extent, whatever
  the size of the view that declares it.
- Host names are global natively, so each provider generates its own (`useId`).
  A nested provider captures only the sheets declared beneath it, which matches
  the old context-scoped registry.
- Stacking is unchanged: UI mounted after (outside) the provider still draws
  above its sheets, and sheets stack in mount order.

Public API is a superset of upstream's:

| Prop                   | Default | Purpose                                                                                 |
| ---------------------- | ------- | --------------------------------------------------------------------------------------- |
| `renderPortalProvider` | `true`  | Set `false` when the app already mounts teleport's `PortalProvider` above the provider. |
| `portal`               | —       | Bring your own portal component; the provider mounts no host.                           |

`BottomSheetProviderProps` and `BottomSheetPortalComponent` are exported types.
The internal `Portal` keeps its name and shape.

Not changed: native sheet code on both platforms, `nativeOverlay`, close request
routing, and every `BottomSheet` / `ModalBottomSheet` prop.

Distribution changes, so apps can depend on a commit
(`github:amillez/react-native-bottom-sheet#<sha>`):

- `lib/` is committed. Rebuild it with `bun run build` after changing `src/`,
  and commit the output with the source change.
- There is no `prepare` script. Upstream's ran `lefthook install && bob build`;
  pnpm refuses to install a git-hosted package with a build script unless the
  app allowlists it, and running it would need bun and a git checkout. Run
  `bun run hooks` once in a clone to install the git hooks.

## What to verify when upgrading teleport or rebasing

- Context: a provider between `BottomSheetProvider` and `ModalBottomSheet`
  reaches the sheet's content.
- Touches pass through a mounted, closed sheet to the screen that declares it.
- Android Back / Escape (`onCloseRequest`) still goes to the topmost sheet;
  portal ordering is resolved per root view, and teleported views stay in the
  same root.
- Rapid remount of a sheet on Android. Upstream
  [#78](https://github.com/software-mansion-labs/react-native-bottom-sheet/issues/78)
  (fix in
  [#79](https://github.com/software-mansion-labs/react-native-bottom-sheet/pull/79))
  is a Fabric unflattening crash under portal churn. The teleport path removes
  the provider's per-entry wrapper, but `BottomSheet`'s two flattenable wrappers
  remain until #79 lands.

## Upstream proposal

Suggested comment or PR description for #61:

> The provider portal re-renders sheets under the provider, which drops context
> declared between the two (#61). `nativeOverlay` already avoids this by keeping
> the sheet inline and reparenting natively. We moved the default portal to the
> same model with `react-native-teleport`: the provider mounts a `PortalHost`
> after its children and `ModalBottomSheet` renders a teleport `Portal`
> targeting it. Sheet mechanics, layering relative to the provider and the
> public API are unchanged; we added `renderPortalProvider` (for apps that
> already mount teleport) and `portal` (bring your own portal, suggested earlier
> in the thread). The cost is a native peer dependency. If that is unwelcome,
> the `portal` prop alone would let apps opt into teleport without the library
> depending on it.

Options for upstream, in the order this fork would prefer them:

1. Adopt teleport as the default provider portal (this branch).
2. Ship only the `portal` hatch, with the JS portal as default. Apps pass a
   teleport-backed component. No new dependency upstream.
3. Reparent natively in the provider, as `nativeOverlay` does for its window,
   without a third-party dependency.

## Removal condition

Remove the fork when upstream's default provider portal preserves
declaration-site context by any of the options above and #61 is closed by it.
Swap the commit pin for the npm release, adapt `renderPortalProvider` / `portal`
call sites to whatever upstream names them, and remove `react-native-teleport`
unless the app uses it elsewhere.
