import {genericModalIcons} from "../../components/modals/GenericModal";
import {TMessage} from "../../components/translatedMessages/utils";
import {AppActionTypes} from "../../store";

export interface IGenericModalState {
  isOpen: boolean;
  genericModalObj?: IGenericModalObjectState;
  component?: React.ComponentType<any>; //FIXME no components in state
}

//Add more custom icons here
export type TIconType = keyof typeof genericModalIcons;

export interface IGenericModalObjectState {
  title: TMessage;
  description?: TMessage;
  icon?: TIconType;
  actionLinkText?: TMessage;
  onClickAction?: AppActionTypes;
}
