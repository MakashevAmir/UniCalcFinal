import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonSearchbar, IonTabs, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { filter } from 'rxjs/operators';
import { RatesHeaderService } from '../services/rates-header.service';
import { ALL_CURRENCIES } from '../models/currency.model';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonSearchbar, IonTabs, IonTabBar, IonTabButton],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  currentTab: string = 'converter';
  baseCurrency: string = 'USD';
  searchTerm: string = '';
  allCurrencies = ALL_CURRENCIES;

  constructor(
    private router: Router,
    private ratesHeaderService: RatesHeaderService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentTab();
    });
    this.updateCurrentTab();

    this.baseCurrency = this.ratesHeaderService.getBaseCurrency();
    this.searchTerm = this.ratesHeaderService.getSearchTerm();
  }

  updateCurrentTab() {
    const url = this.router.url;
    if (url.includes('/converter')) {
      this.currentTab = 'converter';
    } else if (url.includes('/rates')) {
      this.currentTab = 'rates';
    } else if (url.includes('/chart')) {
      this.currentTab = 'chart';
    } else if (url.includes('/favorites')) {
      this.currentTab = 'favorites';
    }
  }

  getPageTitle(): string {
    switch (this.currentTab) {
      case 'converter':
        return 'Měnová kalkulačka';
      case 'rates':
        return 'Směnné kurzy';
      case 'chart':
        return 'Graf směnného kurzu';
      case 'favorites':
        return 'Oblíbené páry';
      default:
        return '';
    }
  }

  onBaseCurrencyChange() {
    this.ratesHeaderService.setBaseCurrency(this.baseCurrency);
  }

  onSearchInput() {
    this.ratesHeaderService.setSearchTerm(this.searchTerm);
  }
}
