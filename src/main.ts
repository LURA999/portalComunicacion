import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION} from '@angular/material/core';

const date : Date = new Date() ;

console.info('Angular CDK version', CDK_VERSION.full, date.toLocaleDateString()+" "+date.toLocaleTimeString());
console.info('Angular Material version', MAT_VERSION.full, date.toLocaleDateString()+" "+date.toLocaleTimeString());
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
