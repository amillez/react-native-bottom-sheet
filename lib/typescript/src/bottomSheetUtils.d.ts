/**
 * A finite, non-negative height in points, an unsigned percentage from `0%`
 * through `100%`, or `'content'` for the measured content height.
 */
export type DetentValue = number | `${number}%` | 'content';
/** A draggable detent or an object form that can mark a detent as programmatic-only. */
export type Detent = DetentValue | {
    value: DetentValue;
    programmatic?: boolean;
};
/** Marks a detent as reachable only via controlled `index` updates, not dragging. */
export declare const programmatic: (value: DetentValue) => Detent;
export declare const detentValue: (detent: Detent) => DetentValue;
export declare const isDetentProgrammatic: (detent: Detent) => boolean;
type NormalizedDetent = Readonly<{
    value: number;
    kind: 'points' | 'percentage' | 'content';
    programmatic: boolean;
}>;
/** Serializes a public detent into the shape consumed by the native views. */
export declare const normalizeDetent: (detent: Detent, index: number) => NormalizedDetent;
/** Whether a normalized detent represents a fully closed sheet. */
export declare const isNormalizedDetentClosed: (detent: NormalizedDetent) => boolean;
/** Validates a controlled index before props are passed to the native view. */
export declare const validateIndex: (index: number, detentCount: number) => void;
export declare const findSnapTarget: (currentTranslate: number, velocityY: number, currentIndex: number, allPositions: {
    index: number;
    translateY: number;
    isDraggable: boolean;
}[]) => number;
export {};
//# sourceMappingURL=bottomSheetUtils.d.ts.map