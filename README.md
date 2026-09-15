# React Native Bottom Sheet

![](https://img.shields.io/npm/v/@swmansion/react-native-bottom-sheet)

![](cover.png)

React Native Bottom Sheet provides bottom-sheet components for React Native.

> [!IMPORTANT]
>
> **This is a fork.** Branch `teleport-portal` of
> [amillez/react-native-bottom-sheet](https://github.com/amillez/react-native-bottom-sheet)
> replaces the provider's JS portal with
> [`react-native-teleport`](https://github.com/kirillzyusko/react-native-teleport),
> so a `ModalBottomSheet` keeps the React context of the tree that declares it.
> Upstream is
> [software-mansion-labs/react-native-bottom-sheet](https://github.com/software-mansion-labs/react-native-bottom-sheet),
> and the bug it fixes is
> [#61](https://github.com/software-mansion-labs/react-native-bottom-sheet/issues/61).
> [FORK.md](FORK.md) has the rationale and the proposal for upstream.

## Fork: teleport-backed provider portal

**What changes.** Upstream's `BottomSheetProvider` re-renders every modal sheet
inside the provider, so a provider between `BottomSheetProvider` and a
`ModalBottomSheet` (theme, i18n, navigation, anything) never reaches the sheet's
content. On this branch the sheet's React subtree stays where it is declared,
and only its native view is reparented into a host the provider mounts after its
children. Layering is unchanged: UI mounted outside the provider still draws
above its sheets. Native sheet mechanics and `nativeOverlay` are untouched.

**Install.** The package name stays `@swmansion/react-native-bottom-sheet`, so
imports do not change. Pin a commit and add the new peer:

```sh
npm i "@swmansion/react-native-bottom-sheet@github:amillez/react-native-bottom-sheet#<commit>" "react-native-teleport@^1.2.2"
```

`react-native-teleport` is a native module for the New Architecture; rebuild the
app after adding it. This branch commits `lib/`, so installing from a commit
needs no build step.

**API added.** `BottomSheetProvider` takes two optional props. With neither, it
is a drop-in replacement.

- `renderPortalProvider` (default `true`): pass `false` when the app already
  mounts teleport's `PortalProvider` above this provider, so there is only one.
- `portal`: bring your own portal component. Sheets render through it, and the
  provider mounts no host.

Each provider names its host uniquely, so a nested provider (for example inside
a native modal screen) only receives the sheets declared beneath it, as before.

**Remove this fork when** upstream's default provider portal preserves
declaration-site context—through teleport, a bring-your-own-portal hatch, or
native reparenting like `nativeOverlay` already does—and #61 is closed by that
change. Then swap the commit pin for the npm release, adapt any
`renderPortalProvider` / `portal` call sites to the upstream API, and drop
`react-native-teleport` unless something else in the app uses it.

Learn more in
[the documentation](https://software-mansion-labs.github.io/react-native-bottom-sheet).

## By [Software Mansion](https://swmansion.com)

Founded in 2012, [Software Mansion](https://swmansion.com) is a software agency
with experience in building web and mobile apps. We are core React Native
contributors and experts in dealing with all kinds of React Native issues. We
can help you build your next dream
product—[hire us](https://swmansion.com/contact/projects?utm_source=react-native-bottom-sheet&utm_medium=readme).

[![](https://logo.swmansion.com/logo?color=white&variant=desktop&width=152&tag=react-native-bottom-sheet-github)](https://swmansion.com)

## Sponsored by [Gobi Maps](https://www.gobimaps.com)

The best of your city, all in one map.

[<img src="gobi.png" height="80" />](https://www.gobimaps.com)
