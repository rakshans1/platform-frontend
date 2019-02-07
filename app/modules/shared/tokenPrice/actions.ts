import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITokenPriceDataState } from "./interfaces";

export const tokenPriceActions = {
  watchTokenPriceStart: () => createSimpleAction("TOKEN_PRICE_WATCH_START"),
  watchTokenPriceStop: () => createSimpleAction("TOKEN_PRICE_WATCH_STOP"),
  loadTokenPriceStart: () => createSimpleAction("TOKEN_PRICE_LOAD_START"),
  saveTokenPrice: (tokenPriceData: ITokenPriceDataState) =>
    createAction("TOKEN_PRICE_SAVE", tokenPriceData),
};
