import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExchangeRateResponse } from '../models/rate.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  isOnline(): boolean {
    return navigator.onLine;
  }

  getLatestRates(baseCurrency: string): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(`${this.API_URL}/${baseCurrency}`).pipe(
      catchError(() => {
        const offline = this.storageService.getLastRates();
        if (offline && offline.base === baseCurrency) {
          return of(offline);
        }
        return of({} as ExchangeRateResponse);
      })
    );
  }

  convertCurrency(from: string, to: string, amount: number): Observable<number> {
    return new Observable(observer => {
      this.getLatestRates(from).subscribe({
        next: (rates) => {
          const rate = rates.rates[to];
          if (rate) {
            observer.next(amount * rate);
          } else {
            observer.next(0);
          }
          observer.complete();
        },
        error: () => {
          observer.next(0);
          observer.complete();
        }
      });
    });
  }

  getRate(from: string, to: string): Observable<number> {
    return new Observable(observer => {
      this.getLatestRates(from).subscribe({
        next: (rates) => {
          const rate = rates.rates[to];
          if (rate) {
            observer.next(rate);
          } else {
            observer.next(0);
          }
          observer.complete();
        },
        error: () => {
          observer.next(0);
          observer.complete();
        }
      });
    });
  }
}
