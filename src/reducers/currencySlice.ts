import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface CurrencyRates {
  [currencyCode: string]: number;
}

export interface CurrencySlice {
  currentCurrency: string;
  rates: CurrencyRates;
  currencyMode: string;
  symbol:string;
}

const initialState: CurrencySlice = {
  currentCurrency: "USD",
  currencyMode: "en-US",
  symbol:"$",
  rates: {},
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencyRates: (state, action: PayloadAction<CurrencyRates>) => {
      state.rates = { ...state.rates, ...action.payload };
    },

    resetCurrencyRates: (state) => {
      return initialState;
    },

    setCurrentCurrency: (state, action: PayloadAction<string>) => {
      state.currentCurrency = action.payload;
    },
    setCurrencyMode: (state, action: PayloadAction<string>) => {
      state.currencyMode = action.payload;
    },
    setCurrencySymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
  },
});

export const {
  setCurrencyRates,
  setCurrentCurrency,
  resetCurrencyRates,
  setCurrencyMode,
  setCurrencySymbol
} = currencySlice.actions;
export const selectCurrencyRates = (state: RootState) =>
  state.currency.rates;
export const selectCurrentCurrency = (state: RootState) =>
  state.currency.currentCurrency;
export const currencyMode = (state: RootState) =>
  state.currency.currencyMode;
export const currencySymbol = (state: RootState) =>
  state.currency.symbol;

export default currencySlice.reducer;
