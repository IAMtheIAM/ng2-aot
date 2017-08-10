import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'; // just the base functionality, add the rest below
import { FormControl } from '@angular/forms';
// import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { Title } from '@angular/platform-browser';
/*
 * Shared UtilityService
 */
import { Logging } from '../../services';
import { UtilityService } from '../../services/';
import { AppState } from '../../services/appstate.service';
import { DataService } from '../../services/data.service';

/**
 * This is where CSS/SCSS files that the component depends on are required.
 *
 * Function: To enable "Hot Module Replacement" of CSS/SCSS files
 * during development. During productions, all styles will be extracted into
 * external stylesheets. Do NOT add styles the "Angular2 Way" in the
 * @Component decorator ("styles" and "styleUrls" properties)
 */
import './subscriber-lookup.style.scss';

@Component({
   selector: 'subscriber-lookup',
   templateUrl: './subscriber-lookup.template.html',
   providers: []
})

export class SubscriberLookupComponent {
   lookupSubscriberApiUrl: string = '//addams-asoc-signup-api.azurewebsites.net/api/associationsignup/v1/searchsubscribersnamelicense/';
   model: any;
   searching = false;
   searchFailed = false;
   response: Object[];
   subscribersFound: Array<Object>;
   lookupSubscriberControl = new FormControl();

   constructor(
      public appState: AppState,
      public utilities: UtilityService,
      public dataService: DataService,
      // private appInsightsService: AppInsightsService,
      private titleService: Title
   ) {   }

   ngOnInit() {
      if (Logging.isEnabled.light) {
         console.log('%c Hello \"Subscriber-Lookup\" component!', Logging.normal.lime);
      }
      this.titleService.setTitle('Subscriber Lookup | Atlas');
      // this.appInsightsService.trackPageView('Subscriber-Lookup Component');
   }

   lookupSubscriber = (text$: Observable<string>) => {

      return text$.debounceTime(300)
         .distinctUntilChanged()
         .do(() => this.searching = true)
         .switchMap(term => {
            var data = this._callApi(this.lookupSubscriberApiUrl, term)
               .map(response => this._transformSubscriberInfo(response))
               .do((response) => {
                  this.response = response;
                  this.searchFailed = false;
                  this.searching = false;
                  if (Logging.isEnabled.light) {
                     console.log('%c API Call Complete', Logging.normal.orange);
                  }
               })
               .catch((err) => {
                  console.log(err);
                  this.searchFailed = true;
                  this.searching = false;
                  return Observable.of([]);
               })
            return data;
         })
         .do(() => this.searching = false);
   }

   getSelectedSubscriberData = (result) => {
      console.log(result);
   }

   _callApi = (url: string, term: string) => {
      this.response = undefined;
      // Trim whitespaces at both ends of string
      term = term.trim();

      // Don't call api if input is blank / deleted
      if (term === '' || term.length === 0) {
         this.searching = false;
         return Observable.of([]);

      } else {
         console.log('%c API Call Begin', Logging.normal.orange);
         return this.dataService.get(url + term);
      }
   }

   _transformSubscriberInfo = (response: Array<object>) => {

      var newSubscriberInfo = [];
      // apply this function to each object in the response array. Limit to 15 items displayed
      response.slice(0, 15).map((obj) => {
         var concatValuesFromObj = "";
         for (var key in obj) {
            // skip subscriberId
            if (key !== "subscriberId") {
               concatValuesFromObj += obj[key] + " ";
            }
         }
         concatValuesFromObj = concatValuesFromObj.slice(0, -1);
         newSubscriberInfo.push(concatValuesFromObj);
         // console.log("concatValuesFromObj: ", concatValuesFromObj);
      })

      // console.log("newSubscriberInfo: ", newSubscriberInfo);
      this.subscribersFound = newSubscriberInfo;
      return this.subscribersFound;

   }

}
