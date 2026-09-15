import { type ComponentType, type ReactNode } from 'react';
import type { NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { type NativeProps } from './BottomSheetNativeComponent';
import { type Detent } from './bottomSheetUtils';
export type { Detent, DetentValue } from './bottomSheetUtils';
export { programmatic } from './bottomSheetUtils';
/**
 * Payload of the {@link BottomSheetProps.onPositionChange} event, accessed as
 * `event.nativeEvent`.
 */
export type PositionChangeEventData = Readonly<{
    /** Sheet position, in points from the bottom. */
    position: number;
    /**
     * Fractional detent index in `0..(detents.length - 1)`: `0` at the shortest
     * detent, `1` at the next, and so on, interpolated as the sheet moves between
     * them. Detents are required to be in ascending order by height. The
     * continuous counterpart of `onIndexChange`, so a backdrop or per-detent
     * animation can be driven without knowing the sheet's height.
     */
    index: number;
}>;
export type ScrollableNegotiationMode = 'none' | 'initial' | 'handoff';
export type ScrollableNegotiation = ScrollableNegotiationMode | Readonly<{
    expand: ScrollableNegotiationMode;
    collapse: ScrollableNegotiationMode;
}>;
/**
 * Props for the inline bottom-sheet component.
 */
export interface BottomSheetProps {
    /** Sheet contents, including any scrollable content. */
    children: ReactNode;
    /**
     * Optional visual surface (background) rendered behind the content. The
     * library sizes and positions the surface natively to cover the full sheet,
     * independently of the content, so a shrinking content height never exposes
     * blank space. Put a background View here instead of inside `children` when
     * you want that shrink-safe behavior. When omitted, behavior is unchanged.
     *
     * Give the surface element a filling style such as `StyleSheet.absoluteFill`:
     * it is mounted in a full-size host, so a surface sized only by its own
     * content would collapse and not show.
     */
    surface?: ReactNode;
    /** Additional style applied to the native sheet host view. */
    style?: StyleProp<ViewStyle>;
    /**
     * Snap points for the sheet, in ascending order by height. Defaults to
     * `[0, 'content']` and must contain at least one value. Numbers must be finite
     * and non-negative. Percentage strings must be unsigned values from `0%`
     * through `100%` and resolve against the native usable height. Fixed detents
     * may be taller than the measured content or available height; native layout
     * caps them to the available geometry.
     */
    detents?: Detent[];
    /**
     * Finite, zero-based integer in `0..(detents.length - 1)`. When shortening
     * `detents`, update `index` to remain in range in the same render.
     */
    index: number;
    /** Whether the sheet should animate in on first layout. */
    animateIn?: boolean;
    /**
     * Whether the sheet should animate when the active `'content'` detent changes
     * height. Disable this when your content animates its own height.
     *
     * @default true
     */
    animateContentHeight?: boolean;
    /**
     * Whether the sheet may extend under the status bar when using full-height
     * detents. Defaults to `false`, so detents remain capped below the status bar.
     */
    extendUnderStatusBar?: boolean;
    /**
     * Called when a user-driven snap is initiated: the moment a drag commits to a
     * detent, before the animation settles. Does not fire for programmatic `index`
     * changes; you already know when you make those. Use it to keep your controlled
     * `index` state in sync. For the end of any movement, use `onSettle`.
     */
    onIndexChange?: (index: number) => void;
    /** Called when a snap animation settles, including programmatic changes. */
    onSettle?: (index: number) => void;
    /**
     * Called as the sheet position changes. A standard native direct event; read
     * `event.nativeEvent.position` (points from the bottom). To handle it on the
     * UI thread, see `wrapNativeView`.
     */
    onPositionChange?: (event: NativeSyntheticEvent<PositionChangeEventData>) => void;
    /**
     * Wraps the native sheet view—the one that emits `onPositionChange`—before it
     * is rendered. Pass `Animated.createAnimatedComponent` to handle
     * `onPositionChange` on the UI thread with a Reanimated worklet (e.g., from
     * `useEvent`): Because the animated wrapper sits directly on the native view,
     * the worklet binds to the sheet at mount, for both inline and modal sheets,
     * without the library depending on Reanimated.
     *
     * Called once; pass a stable function (a module-level reference such as
     * `Animated.createAnimatedComponent`, not an inline lambda recreated each
     * render).
     */
    wrapNativeView?: (component: ComponentType<NativeProps>) => ComponentType<NativeProps>;
    /**
     * Controls how gestures that start in nested scrollables interact with the
     * sheet. A string applies to both directions; an object configures expansion
     * and collapse independently. `initial` selects one owner at touch-down,
     * while `handoff` also permits ownership to transfer without lifting.
     *
     * @default { expand: 'handoff', collapse: 'initial' }
     */
    scrollableNegotiation?: ScrollableNegotiation;
    /** @deprecated Use `scrollableNegotiation="none"` instead. */
    disableScrollableNegotiation?: boolean;
}
type ModalOnlyBottomSheetProps = {
    /** Internal flag used by `ModalBottomSheet`. */
    modal?: boolean;
    /** Android-only controlled close request callback used by `ModalBottomSheet`. */
    onCloseRequest?: () => void;
    /**
     * Internal flag used by `ModalBottomSheet`. When set, the sheet is presented
     * in a native overlay above everything (including native modal screens)
     * instead of the `BottomSheetProvider` portal.
     */
    nativeOverlay?: boolean;
    /** Scrim color used by `ModalBottomSheet`. */
    scrimColor?: string;
    /**
     * Scrim opacities per detent, indexed to match `detents`. Each value in 0-1
     * scales the scrim color's alpha at the detent of the same index, and the
     * opacity is linearly interpolated as the sheet is dragged between detents.
     * A shorter array than `detents` reuses its last value for any remaining
     * detents.
     *
     * The default maps each detent to 0 when it is closed and 1 otherwise,
     * so the scrim is transparent at any closed detent and fully opaque at every
     * open one; e.g., `[0, 'content']` defaults to `[0, 1]`, and all-open detents
     * default to a constant opaque scrim. Pass one value per detent, e.g.
     * `[0, 0.5, 1]`, to keep the scrim deepening across every detent.
     */
    scrimOpacities?: number[];
};
export type BottomSheetInternalProps = BottomSheetProps & ModalOnlyBottomSheetProps;
/** Native bottom sheet that renders inline within the current screen layout. */
export declare const BottomSheet: (props: BottomSheetProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BottomSheet.d.ts.map