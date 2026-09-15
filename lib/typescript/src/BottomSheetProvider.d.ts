import type { ComponentType, ReactNode } from 'react';
/**
 * A component that presents its `children` above the tree that declared them.
 * It receives a modal sheet and must render it exactly once.
 */
export type BottomSheetPortalComponent = ComponentType<{
    children: ReactNode;
}>;
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
/**
 * Provides the portal host required for modal bottom sheets.
 *
 * Modal sheets are teleported: a sheet's React subtree stays where
 * `ModalBottomSheet` is declared, so it reads that site's context (theme, i18n,
 * navigation, and so on), and only its native view is reparented into a host
 * mounted after this provider's children. UI mounted outside the provider still
 * draws above its sheets.
 */
export declare const BottomSheetProvider: ({ children, renderPortalProvider, portal, }: BottomSheetProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const Portal: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BottomSheetProvider.d.ts.map