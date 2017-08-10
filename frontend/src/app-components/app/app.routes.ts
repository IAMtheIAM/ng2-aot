// app.routes.ts
/**
 * Angular 2 decorators and services
 */

import { Routes } from '@angular/router';

/**
 * Other services
 */
import { RouteProtection } from '../services/route-protection.service';
// import { DataResolver } from './app.resolver';

/**
 * Imported Components
 */
import { LoginComponent } from '../login/login.component';
import { NotFound404Component } from '../404/notfound404.component';

export const ROUTES: Routes = [{
   path: '',
   redirectTo: 'subscriber',
   pathMatch: 'full',
}, {
   path: 'subscriber',
   loadChildren: '../+subscriber/subscriber.module#SubscriberModule',
   // canActivate: [RouteProtection]
}, {
   path: 'detail',
   loadChildren: '../+detail/detail.module#DetailModule',
   canActivate: [RouteProtection]
}, {
   path: 'login',
   component: LoginComponent
}, {
   path: '**',
   component: NotFound404Component
}, {
   path: '404',
   component: NotFound404Component
}];

// export const routing = RouterModule.forRoot(ROUTES, { useHash: true});

