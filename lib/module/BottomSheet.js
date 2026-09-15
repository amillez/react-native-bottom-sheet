"use strict";

import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import BottomSheetNativeView from './BottomSheetNativeComponent';
import BottomSheetSurfaceNativeComponent from './BottomSheetSurfaceNativeComponent';
import { Portal } from "./BottomSheetProvider.js";
import { isNormalizedDetentClosed, normalizeDetent, validateIndex } from "./bottomSheetUtils.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export { programmatic } from "./bottomSheetUtils.js";

/**
 * Payload of the {@link BottomSheetProps.onPositionChange} event, accessed as
 * `event.nativeEvent`.
 */

const SCROLLABLE_NEGOTIATION_LEVEL = {
  none: 0,
  initial: 1,
  handoff: 2
};
const DEFAULT_SCROLLABLE_NEGOTIATION = {
  expand: 'handoff',
  collapse: 'initial'
};

/**
 * Props for the inline bottom-sheet component.
 */

/** Native bottom sheet that renders inline within the current screen layout. */
export const BottomSheet = props => {
  const {
    children,
    surface,
    style,
    detents = [0, 'content'],
    index,
    animateIn = true,
    animateContentHeight = true,
    extendUnderStatusBar = false,
    onIndexChange,
    onSettle,
    onPositionChange,
    onCloseRequest,
    wrapNativeView,
    modal = false,
    nativeOverlay = false,
    scrollableNegotiation,
    disableScrollableNegotiation,
    scrimColor,
    scrimOpacities
  } = props;
  const resolvedScrollableNegotiation = scrollableNegotiation ?? (disableScrollableNegotiation ? 'none' : DEFAULT_SCROLLABLE_NEGOTIATION);
  const resolvedExpandNegotiation = typeof resolvedScrollableNegotiation === 'string' ? resolvedScrollableNegotiation : resolvedScrollableNegotiation.expand;
  const resolvedCollapseNegotiation = typeof resolvedScrollableNegotiation === 'string' ? resolvedScrollableNegotiation : resolvedScrollableNegotiation.collapse;
  const usesNativeOverlay = modal && nativeOverlay;
  // All real geometry — the sheet's frame, the content wrapper's bounds, and
  // the detent cap (host height minus the overlapping status-bar inset, unless
  // extendUnderStatusBar) — is measured natively from the window the sheet
  // actually lives in and flows into the shadow tree through state (see
  // BottomSheetHostView / BottomSheetHostingView). The window dimensions here
  // only size the native-overlay host for the first frame, before the overlay
  // window reports its measured geometry.
  const {
    width: windowWidth,
    height: windowHeight
  } = useWindowDimensions();
  // Percentage detents stay as unitless ratios and are resolved against the
  // current native cap whenever detents are refreshed. Point detents retain
  // their requested height; native layout clamps both kinds to that cap.
  validateIndex(index, detents.length);
  const normalizedDetents = detents.map(normalizeDetent);
  const selectedNormalizedDetent = normalizedDetents[index];
  const isSheetClosed = isNormalizedDetentClosed(selectedNormalizedDetent);
  const hasCloseRequestHandler = onCloseRequest != null;
  // Default the scrim opacity per detent: transparent at any closed detent,
  // fully opaque at every open one.
  const resolvedScrimOpacities = scrimOpacities ?? normalizedDetents.map(detent => isNormalizedDetentClosed(detent) ? 0 : 1);
  const handleIndexChange = event => {
    onIndexChange?.(event.nativeEvent.index);
  };
  const handleSettle = event => {
    onSettle?.(event.nativeEvent.index);
  };

  // The native sheet view, optionally wrapped (e.g. with
  // `Animated.createAnimatedComponent`) so a Reanimated worklet can handle
  // `onPositionChange` on the UI thread. Wrapping the leaf native view (rather
  // than this whole component) keeps the animated boundary on the host that
  // emits events—so it resolves at mount, inline or inside the modal portal
  // alike. Computed once: a fresh wrapped component each render would remount
  // the native sheet.
  const [NativeView] = useState(() => wrapNativeView?.(BottomSheetNativeView) ?? BottomSheetNativeView);
  const sheet = /*#__PURE__*/_jsx(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: modal ? isSheetClosed ? 'none' : 'auto' : 'box-none',
    children: /*#__PURE__*/_jsx(View, {
      pointerEvents: "box-none",
      style: StyleSheet.absoluteFill,
      children: /*#__PURE__*/_jsxs(NativeView, {
        pointerEvents: "box-none",
        style: [
        // Inline (and portal) sheets fill their container — the teleport
        // portal view takes the size of the provider's host, so a modal
        // sheet's canvas is the real provider extent, laid out by Fabric
        // in this window. In
        // native-overlay mode the host is reparented into a separate
        // full-screen window whose measured size reaches the shadow tree
        // via state; the window dimensions here are only the first-frame
        // estimate until that arrives.
        usesNativeOverlay ? {
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: windowWidth,
          height: windowHeight
        } : StyleSheet.absoluteFill, style],
        detents: normalizedDetents,
        extendUnderStatusBar: extendUnderStatusBar,
        index: index,
        animateIn: animateIn,
        animateContentHeight: animateContentHeight,
        modal: modal,
        nativeOverlay: usesNativeOverlay,
        hasCloseRequestHandler: hasCloseRequestHandler,
        scrollableExpandNegotiation: SCROLLABLE_NEGOTIATION_LEVEL[resolvedExpandNegotiation],
        scrollableCollapseNegotiation: SCROLLABLE_NEGOTIATION_LEVEL[resolvedCollapseNegotiation],
        scrimColor: scrimColor,
        scrimOpacities: resolvedScrimOpacities,
        onIndexChange: handleIndexChange,
        onSettle: handleSettle,
        onPositionChange: onPositionChange,
        onCloseRequest: onCloseRequest,
        children: [surface != null && /*#__PURE__*/_jsx(BottomSheetSurfaceNativeComponent, {
          collapsable: false,
          pointerEvents: "box-none",
          style: StyleSheet.absoluteFill,
          children: surface
        }), /*#__PURE__*/_jsxs(View, {
          collapsable: false
          // The wrapper fills the sheet's content region exactly: the native
          // side reports the region's top inset (the gap between the sheet
          // top and the detent cap) into the shadow tree, where it is
          // applied as Yoga top padding on the sheet node — so this in-flow
          // flex: 1 child resolves to the region the sheet can actually
          // show, on every device and in every mode.
          ,
          style: styles.contentWrapper,
          children: [children, /*#__PURE__*/_jsx(View, {
            collapsable: false,
            pointerEvents: "none"
          })]
        })]
      })
    })
  });
  if (modal) {
    // In native-overlay mode the sheet is rendered inline; the native layer
    // reparents it into a full-screen overlay above everything (including
    // native modal screens), so it bypasses the provider portal entirely.
    if (usesNativeOverlay) {
      return sheet;
    }
    return /*#__PURE__*/_jsx(Portal, {
      children: sheet
    });
  }
  return sheet;
};
const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1
  }
});
//# sourceMappingURL=BottomSheet.js.map