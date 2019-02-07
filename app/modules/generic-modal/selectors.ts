import {DeepReadonly} from "../../types";
import {IGenericModalObjectState, IGenericModalState} from "./interfaces";

export const selectGenericModalIsOpen = (state: DeepReadonly<IGenericModalState>): boolean =>
  state.isOpen;
export const selectGenericModalObj = (
  state: DeepReadonly<IGenericModalState>,
): DeepReadonly<IGenericModalObjectState> | undefined => state.genericModalObj;
export const selectGenericModalComponent = (
  state: DeepReadonly<IGenericModalState>,
): React.ComponentType<any> | undefined => state.component;
