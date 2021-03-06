/**
 * Angular 2 decorators and services
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../common/shared.module';
import { subscriberRoutes } from './subscriber.routes';


/*
 * Shared Utilities & Other Services
 */
import { Logging } from '../services/utility.service';

/**
 * Imported Components
 */
import { SubscriberLookupComponent } from './lookup/subscriber-lookup.component';
import { SubscriberRegisterComponent } from './register/subscriber-register.component';

@NgModule({
   imports: [
      SharedModule,
      CommonModule,
      RouterModule.forChild(subscriberRoutes)
   ],
   declarations: [ // Components / Directives / Pipes
      SubscriberLookupComponent,
      SubscriberRegisterComponent
   ],
   // exports: [
   //    SharedModule,
   //    SubscriberLookupComponent,
   //    SubscriberRegisterComponent
   // ]
})

export class SubscriberModule {

   constructor() {
      if (Logging.isEnabled.light) {
         console.log('%c Hello \"Subscriber\" Module!', Logging.normal.orange);
      }
   }
}
