// import 'reflect-metadata';
// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {AppModule} from './app.module';
//
// platformBrowserDynamic().bootstrapModule(AppModule);


/**
 * JIT/AOT Build
 * MAIN ANGULAR2 APP ENTRY POINT
 * This is where we bootstrap the Angular2 application
 */

/**
 * reflect-metadata needs to be imported here, in the app bundle, or app throws errors during bootstrapping
 */
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './environment';
import { bootloader } from '@angularclass/hmr';
import { Logging } from '../services/utility.service';

/**
 * AppComponent and AppComponent Services
 */
import { AppModule } from './app.module';

/**
 * zone.js MUST be imported AFTER AppModule/AppModuleNgFactory, otherwise it will throw
 * error "ZoneAware promise has been overridden" during bootstrapping
 */
import 'zone.js/dist/zone';

if ('production' === ENV) {
    enableProdMode();
}

console.log('%c Welcome Angular! \n', Logging.normal.yellow);

/*
 * Bootstrap our Angular app with a top level NgModule
 */

export function main(): Promise<any> {

    return platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .then(decorateModuleRef)
        .catch(function(err) {
            console.log('%c ERROR Bootstrapping Angular! \n', Logging.bold.teal);
            console.error(err);
        });
}

bootloader(main);
