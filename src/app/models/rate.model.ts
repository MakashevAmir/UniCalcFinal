export interface ExchangeRateResponse {
  base: string;
  date: string;
  time_last_updated: number;
  rates: { [key: string]: number };
}

export interface FavoritePair {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  addedAt: Date;
}
