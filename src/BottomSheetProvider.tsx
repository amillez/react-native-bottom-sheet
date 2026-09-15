import { createContext, useContext, useId, useMemo } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import {
  Portal as TeleportPortal,
  PortalHost as TeleportPortalHost,
  PortalProvider as TeleportPortalProvider,
} from 'react-native-teleport';

/**
 * A component that presents its `children` above the tree that declared them.
 * It receives a modal sheet and must render it exactly once.
 */
export type BottomSheetPortalComponent = ComponentType<{ children: ReactNode }>;

/** Props for {@link BottomSheetProvider}. */
export interface BottomSheetProviderProps {
  children: ReactNode;
  /**
   * Whether the provider mounts `react-native-teleport`'s `PortalProvider`.
   * Pass `false` when the app already mounts one above this provider: teleport
   * expects a single `PortalProvider`, and every extra one adds another unnamed
   * `root` host. Ignored when `portal` is set.
   *
   * @default true
   */
  renderPortalProvider?: boolean;
  /**
   * Bring your own portal. Modal sheets render through this component instead
   * of the built-in teleport host, and the provider mounts no host or teleport
   * provider of its own: the app owns where the host lives and what draws above
   * it.
   *
   * Pass a stable reference such as a module-level component. A new component
   * type on each render remounts every mounted modal sheet.
   */
  portal?: BottomSheetPortalComponent;
}

type PortalContextType =
  | { type: 'teleport'; hostName: string }
  | { type: 'custom'; portal: BottomSheetPortalComponent };

const PortalContext = createContext<PortalContextType | null>(null);

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
  portal,
}: BottomSheetProviderProps) => {
  // Teleport resolves hosts by name natively, across the whole app. A name per
  // provider keeps a nested provider (e.g., one inside a native modal screen)
  // from capturing sheets declared under an outer provider.
  const hostName = `react-native-bottom-sheet-${useId()}`;
  const context = useMemo<PortalContextType>(
    () =>
      portal != null
        ? { type: 'custom', portal }
        : { type: 'teleport', hostName },
    [portal, hostName]
  );

  if (context.type === 'custom') {
    return (
      <PortalContext.Provider value={context}>
        {children}
      </PortalContext.Provider>
    );
  }

  const content = (
    <PortalContext.Provider value={context}>
      {children}
      <TeleportPortalHost name={hostName} style={StyleSheet.absoluteFill} />
    </PortalContext.Provider>
  );

  return renderPortalProvider ? (
    <TeleportPortalProvider>{content}</TeleportPortalProvider>
  ) : (
    content
  );
};

export const Portal = ({ children }: { children: ReactNode }) => {
  const context = useContext(PortalContext);
  if (context === null) {
    throw new Error('`Portal` must be used within `BottomSheetProvider`.');
  }

  if (context.type === 'custom') {
    const CustomPortal = context.portal;
    return <CustomPortal>{children}</CustomPortal>;
  }

  return (
    <TeleportPortal hostName={context.hostName} style={StyleSheet.absoluteFill}>
      {children}
    </TeleportPortal>
  );
};
