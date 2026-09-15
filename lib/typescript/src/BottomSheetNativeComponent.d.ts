import { type CodegenTypes, type ColorValue, type ViewProps } from 'react-native';
type NativeDetent = Readonly<{
    value: CodegenTypes.Double;
    kind: string;
    programmatic: boolean;
}>;
export interface NativeProps extends ViewProps {
    detents: ReadonlyArray<NativeDetent>;
    index: CodegenTypes.Int32;
    animateIn?: CodegenTypes.WithDefault<boolean, true>;
    animateContentHeight?: CodegenTypes.WithDefault<boolean, true>;
    modal: boolean;
    nativeOverlay?: boolean;
    hasCloseRequestHandler: boolean;
    extendUnderStatusBar?: boolean;
    scrollableExpandNegotiation: CodegenTypes.Int32;
    scrollableCollapseNegotiation: CodegenTypes.Int32;
    scrimColor?: ColorValue;
    scrimOpacities?: ReadonlyArray<CodegenTypes.Double>;
    onIndexChange?: CodegenTypes.DirectEventHandler<Readonly<{
        index: CodegenTypes.Int32;
    }>>;
    onSettle?: CodegenTypes.DirectEventHandler<Readonly<{
        index: CodegenTypes.Int32;
    }>>;
    onPositionChange?: CodegenTypes.DirectEventHandler<Readonly<{
        position: CodegenTypes.Double;
        index: CodegenTypes.Double;
    }>>;
    onCloseRequest?: CodegenTypes.DirectEventHandler<null>;
}
declare const _default: import("react-native/types_generated/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;
//# sourceMappingURL=BottomSheetNativeComponent.d.ts.map