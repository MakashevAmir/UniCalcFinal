import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
  calculator,
  list,
  trendingUp,
  star,
  starOutline,
  swapVertical,
  searchOutline,
  chevronDownCircleOutline,
  trash,
  arrowForward,
  ellipse
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Register all icons globally
addIcons({
  'calculator': calculator,
  'list': list,
  'trending-up': trendingUp,
  'star': star,
  'star-outline': starOutline,
  'swap-vertical': swapVertical,
  'search-outline': searchOutline,
  'chevron-down-circle-outline': chevronDownCircleOutline,
  'trash': trash,
  'arrow-forward': arrowForward,
  'ellipse': ellipse
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
