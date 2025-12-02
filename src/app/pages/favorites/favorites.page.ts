import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { FavoritePair } from '../../models/rate.model';

interface FavoriteWithRate extends FavoritePair {
  currentRate: number;
  isLoading: boolean;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FavoritesPage implements OnInit {
  favorites: FavoriteWithRate[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private exchangeRateService: ExchangeRateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    const favs = this.favoritesService.getFavorites();

    this.favorites = favs.map(fav => ({
      ...fav,
      currentRate: 0,
      isLoading: true
    }));

    this.favorites.forEach((fav, index) => {
      this.exchangeRateService.getRate(fav.fromCurrency, fav.toCurrency).subscribe({
        next: (rate) => {
          this.favorites[index].currentRate = rate;
          this.favorites[index].isLoading = false;
        },
        error: () => {
          this.favorites[index].isLoading = false;
        }
      });
    });
  }

  removeFavorite(id: string, slidingItem: any) {
    this.favoritesService.removeFavorite(id);
    slidingItem.close();
    this.loadFavorites();
  }

  openConverter(from: string, to: string) {
    this.router.navigate(['/tabs/converter'], {
      queryParams: { from, to }
    });
  }

  getTimeSinceAdded(date: Date): string {
    const now = new Date();
    const added = new Date(date);
    const diffMs = now.getTime() - added.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Dnes';
    } else if (diffDays === 1) {
      return 'Včera';
    } else if (diffDays < 7) {
      return `Před ${diffDays} dny`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Před ${weeks} týdn${weeks > 1 ? 'y' : 'em'}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Před ${months} měsíc${months > 1 ? 'i' : 'em'}`;
    }
  }
}
