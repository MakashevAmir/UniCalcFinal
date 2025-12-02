import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { FavoritesService } from '../../services/favorites.service';
import { StorageService } from '../../services/storage.service';
import { ALL_CURRENCIES, Currency } from '../../models/currency.model';
import { Conversion } from '../../models/conversion.model';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.page.html',
  styleUrls: ['./converter.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConverterPage implements OnInit {
  amount: number = 100;
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  result: number = 0;
  currentRate: number = 0;
  isLoading: boolean = false;
  isOffline: boolean = false;
  isFavorite: boolean = false;
  currencies: Currency[] = ALL_CURRENCIES;

  constructor(
    private exchangeRateService: ExchangeRateService,
    private favoritesService: FavoritesService,
    private storageService: StorageService,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.checkOnlineStatus();
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      if (params['from']) {
        this.fromCurrency = params['from'];
      }
      if (params['to']) {
        this.toCurrency = params['to'];
      }
      this.checkIfFavorite();
      this.convert();
    });
  }

  checkOnlineStatus() {
    this.isOffline = !this.exchangeRateService.isOnline();
  }

  checkIfFavorite() {
    this.isFavorite = this.favoritesService.isFavorite(
      this.fromCurrency,
      this.toCurrency
    );
  }

  convert() {
    if (!this.amount || this.amount <= 0) {
      return;
    }

    this.isLoading = true;

    this.exchangeRateService.convertCurrency(
      this.fromCurrency,
      this.toCurrency,
      this.amount
    ).subscribe({
      next: (result) => {
        this.result = result;
        this.isLoading = false;
        this.getCurrentRate();
        this.saveConversion();
      },
      error: (error) => {
        this.isLoading = false;
        this.showToast('Chyba při převodu měny. Zkuste to prosím znovu.', 'danger');
      }
    });
  }

  getCurrentRate() {
    this.exchangeRateService.getRate(this.fromCurrency, this.toCurrency).subscribe({
      next: (rate) => {
        this.currentRate = rate;
      },
      error: () => {
        this.currentRate = 0;
      }
    });
  }

  saveConversion() {
    const conversion: Conversion = {
      id: Date.now().toString(),
      fromCurrency: this.fromCurrency,
      toCurrency: this.toCurrency,
      amount: this.amount,
      result: this.result,
      rate: this.currentRate,
      timestamp: new Date()
    };

    this.storageService.saveConversionHistory(conversion);
  }

  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.checkIfFavorite();
    this.convert();
  }

  toggleFavorite() {
    if (this.isFavorite) {
      const favorites = this.favoritesService.getFavorites();
      const favorite = favorites.find(f =>
        f.fromCurrency === this.fromCurrency && f.toCurrency === this.toCurrency
      );
      if (favorite) {
        this.favoritesService.removeFavorite(favorite.id);
        this.showToast('Odebráno z oblíbených', 'success');
      }
    } else {
      this.favoritesService.addFavorite(this.fromCurrency, this.toCurrency);
      this.showToast('Přidáno do oblíbených', 'success');
    }
    this.isFavorite = !this.isFavorite;
  }

  onCurrencyChange() {
    this.checkIfFavorite();
    this.convert();
  }

  onAmountChange() {
    if (this.amount && this.amount > 0) {
      this.convert();
    }
  }

  getCurrencyInfo(code: string): Currency | undefined {
    return this.currencies.find(c => c.code === code);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
