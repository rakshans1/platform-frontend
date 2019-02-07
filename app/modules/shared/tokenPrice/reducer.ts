import { AppReducer } from "../../../store";
import {ITokenPriceState} from './interfaces'

const walletInitialState: ITokenPriceState = {
  loading: true,
};

export const tokenPriceReducer: AppReducer<ITokenPriceState> = (
  state = walletInitialState,
  action,
): ITokenPriceState => {
  switch (action.type) {
    case "TOKEN_PRICE_LOAD_START":
      return {
        ...state,
        loading: true,
      };
    case "TOKEN_PRICE_SAVE":
      return {
        ...state,
        loading: false,
        tokenPriceData: action.payload,
      };
  }

  return state;
};
