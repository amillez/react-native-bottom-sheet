"use strict";

import { createElement } from 'react';
import { BottomSheet } from "./BottomSheet.js";

/** Props for the modal bottom-sheet variant, presented through a portal by default. */

/** Bottom sheet presented above the current UI with a scrim. */
export const ModalBottomSheet = props => {
  // `modal` lives on the internal prop set (it is hidden from the public
  // `BottomSheet` type), so type the merged object as the internal shape rather
  // than casting it away.
  const internalProps = {
    ...props,
    modal: true
  };
  return /*#__PURE__*/createElement(BottomSheet, internalProps);
};
//# sourceMappingURL=ModalBottomSheet.js.map