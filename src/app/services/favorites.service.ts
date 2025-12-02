import { Injectable } from '@angular/core';
import { FavoritePair } from '../models/rate.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private storageService: StorageService) { }

  addFavorite(from: string, to: string): void {
    const favorites = this.getFavorites();

    const exists = favorites.some(f =>
      f.fromCurrency === from && f.toCurrency === to
    );

    if (!exists) {
      const newFavorite: FavoritePair = {
        id: Date.now().toString(),
        fromCurrency: from,
        toCurrency: to,
        addedAt: new Date()
      };

      const updated = [...favorites, newFavorite];
      this.storageService.saveFavorites(updated);
    }
  }

  removeFavorite(id: string): void {
    const favorites = this.getFavorites();
    const updated = favorites.filter(f => f.id !== id);
    this.storageService.saveFavorites(updated);
  }

  isFavorite(from: string, to: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f =>
      f.fromCurrency === from && f.toCurrency === to
    );
  }

  getFavorites(): FavoritePair[] {
    return this.storageService.getFavorites();
  }
}
