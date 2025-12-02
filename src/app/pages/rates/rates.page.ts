import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { RatesHeaderService } from '../../services/rates-header.service';
import { ALL_CURRENCIES, Currency } from '../../models/currency.model';
import { Subscription } from 'rxjs';

interface CurrencyRate extends Currency {
  rate: number;
}

@Component({
  selector: 'app-rates',
  templateUrl: './rates.page.html',
  styleUrls: ['./rates.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RatesPage implements OnInit, OnDestroy {
  baseCurrency: string = 'USD';
  rates: CurrencyRate[] = [];
  filteredRates: CurrencyRate[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  lastUpdate: Date | null = null;
  allCurrencies = ALL_CURRENCIES;

  private subscriptions = new Subscription();

  constructor(
    private exchangeRateService: ExchangeRateService,
    private ratesHeaderService: RatesHeaderService
  ) { }

  ngOnInit() {
    this.baseCurrency = this.ratesHeaderService.getBaseCurrency();
    this.searchTerm = this.ratesHeaderService.getSearchTerm();

    this.subscriptions.add(
      this.ratesHeaderService.baseCurrency$.subscribe(currency => {
        this.baseCurrency = currency;
        this.loadRates();
      })
    );

    this.subscriptions.add(
      this.ratesHeaderService.searchTerm$.subscribe(term => {
        this.searchTerm = term;
        this.filterRates();
      })
    );

    this.loadRates();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadRates() {
    this.isLoading = true;

    this.exchangeRateService.getLatestRates(this.baseCurrency).subscribe({
      next: (data) => {
        this.rates = ALL_CURRENCIES.map(currency => ({
          ...currency,
          rate: data.rates[currency.code] || 0
        })).filter(r => r.code !== this.baseCurrency);

        this.filteredRates = [...this.rates];
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading rates:', error);
        this.isLoading = false;
      }
    });
  }

  handleRefresh(event: any) {
    this.loadRates();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  filterRates() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRates = this.rates.filter(rate =>
      rate.code.toLowerCase().includes(term) ||
      rate.name.toLowerCase().includes(term)
    );
  }
}
