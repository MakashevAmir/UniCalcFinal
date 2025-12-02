import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'converter',
        loadComponent: () =>
          import('../pages/converter/converter.page').then((m) => m.ConverterPage),
      },
      {
        path: 'rates',
        loadComponent: () =>
          import('../pages/rates/rates.page').then((m) => m.RatesPage),
      },
      {
        path: 'chart',
        loadComponent: () =>
          import('../pages/chart/chart.page').then((m) => m.ChartPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../pages/favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/converter',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/converter',
    pathMatch: 'full',
  },
];
