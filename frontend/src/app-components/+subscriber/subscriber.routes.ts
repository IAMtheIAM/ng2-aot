/**
 * Imported Components
 */
import { SubscriberLookupComponent } from './lookup/subscriber-lookup.component';
import { SubscriberRegisterComponent } from './register/subscriber-register.component';

/*
 * Shared Utilities & Other Services
 */
// import { RouteProtection } from '../services/route-protection.service';
// import { DataResolver } from '../services/app.resolver';

export const subscriberRoutes = [{
   path: '',
   children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'lookup'
   }, {
      path: 'lookup',
      component: SubscriberLookupComponent, //canActivate: [RouteProtection],
   }, {
      path: 'register',
      component: SubscriberRegisterComponent, //canActivate: [RouteProtection],  // resolve: {      'dataBroughtToComponent': DataResolver   }
   }]

},];
