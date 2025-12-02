import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatesHeaderService {
  private baseCurrencySubject = new BehaviorSubject<string>('USD');
  private searchTermSubject = new BehaviorSubject<string>('');

  baseCurrency$ = this.baseCurrencySubject.asObservable();
  searchTerm$ = this.searchTermSubject.asObservable();

  setBaseCurrency(currency: string) {
    this.baseCurrencySubject.next(currency);
  }

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  getBaseCurrency(): string {
    return this.baseCurrencySubject.value;
  }

  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }
}
