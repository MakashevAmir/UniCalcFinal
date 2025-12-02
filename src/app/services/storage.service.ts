import { Injectable } from '@angular/core';
import { ExchangeRateResponse } from '../models/rate.model';
import { Conversion } from '../models/conversion.model';
import { FavoritePair } from '../models/rate.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly RATES_KEY = 'cached_rates';
  private readonly TIMESTAMP_KEY = 'last_update_time';
  private readonly HISTORY_KEY = 'conversion_history';
  private readonly FAVORITES_KEY = 'favorite_pairs';
  private readonly MAX_HISTORY = 50;

  constructor() { }

  saveRates(rates: ExchangeRateResponse): void {
    localStorage.setItem(this.RATES_KEY, JSON.stringify(rates));
  }

  getLastRates(): ExchangeRateResponse | null {
    const value = localStorage.getItem(this.RATES_KEY);
    return value ? JSON.parse(value) : null;
  }

  saveTimestamp(date: Date): void {
    localStorage.setItem(this.TIMESTAMP_KEY, date.toISOString());
  }

  getLastUpdateTime(): Date | null {
    const value = localStorage.getItem(this.TIMESTAMP_KEY);
    return value ? new Date(value) : null;
  }

  saveConversionHistory(conversion: Conversion): void {
    let history = this.getConversionHistory();
    history.unshift(conversion);

    if (history.length > this.MAX_HISTORY) {
      history = history.slice(0, this.MAX_HISTORY);
    }

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getConversionHistory(): Conversion[] {
    const value = localStorage.getItem(this.HISTORY_KEY);
    return value ? JSON.parse(value) : [];
  }

  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  saveFavorites(favorites: FavoritePair[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  getFavorites(): FavoritePair[] {
    const value = localStorage.getItem(this.FAVORITES_KEY);
    return value ? JSON.parse(value) : [];
  }

  clearAll(): void {
    localStorage.clear();
  }
}
