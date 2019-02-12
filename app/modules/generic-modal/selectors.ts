import {DeepReadonly} from "../../types";
import {IStateGenericModalObject, IStateGenericModal} from "./interfaces";

export const selectGenericModalIsOpen = (state: DeepReadonly<IStateGenericModal>): boolean =>
  state.isOpen;
export const selectGenericModalObj = (
  state: DeepReadonly<IStateGenericModal>,
): DeepReadonly<IStateGenericModalObject> | undefined => state.genericModalObj;
export const selectGenericModalComponent = (
  state: DeepReadonly<IStateGenericModal>,
): React.ComponentType<any> | undefined => state.component;
