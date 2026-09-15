"use strict";

import { createContext, useContext, useId, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal as TeleportPortal, PortalHost as TeleportPortalHost, PortalProvider as TeleportPortalProvider } from 'react-native-teleport';

/**
 * A component that presents its `children` above the tree that declared them.
 * It receives a modal sheet and must render it exactly once.
 */

/** Props for {@link BottomSheetProvider}. */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PortalContext = /*#__PURE__*/createContext(null);

/**
 * Provides the portal host required for modal bottom sheets.
 *
 * Modal sheets are teleported: a sheet's React subtree stays where
 * `ModalBottomSheet` is declared, so it reads that site's context (theme, i18n,
 * navigation, and so on), and only its native view is reparented into a host
 * mounted after this provider's children. UI mounted outside the provider still
 * draws above its sheets.
 */
export const BottomSheetProvider = ({
  children,
  renderPortalProvider = true,
  portal
}) => {
  // Teleport resolves hosts by name natively, across the whole app. A name per
  // provider keeps a nested provider (e.g., one inside a native modal screen)
  // from capturing sheets declared under an outer provider.
  const hostName = `react-native-bottom-sheet-${useId()}`;
  const context = useMemo(() => portal != null ? {
    type: 'custom',
    portal
  } : {
    type: 'teleport',
    hostName
  }, [portal, hostName]);
  if (context.type === 'custom') {
    return /*#__PURE__*/_jsx(PortalContext.Provider, {
      value: context,
      children: children
    });
  }
  const content = /*#__PURE__*/_jsxs(PortalContext.Provider, {
    value: context,
    children: [children, /*#__PURE__*/_jsx(TeleportPortalHost, {
      name: hostName,
      style: StyleSheet.absoluteFill
    })]
  });
  return renderPortalProvider ? /*#__PURE__*/_jsx(TeleportPortalProvider, {
    children: content
  }) : content;
};
export const Portal = ({
  children
}) => {
  const context = useContext(PortalContext);
  if (context === null) {
    throw new Error('`Portal` must be used within `BottomSheetProvider`.');
  }
  if (context.type === 'custom') {
    const CustomPortal = context.portal;
    return /*#__PURE__*/_jsx(CustomPortal, {
      children: children
    });
  }
  return /*#__PURE__*/_jsx(TeleportPortal, {
    hostName: context.hostName,
    style: StyleSheet.absoluteFill,
    children: children
  });
};
//# sourceMappingURL=BottomSheetProvider.js.map