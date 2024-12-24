import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { LoginAdminComponent } from './auth/login-admin/login-admin.component';
import { CookieService } from 'ngx-cookie-service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ErrorComponent } from './error/error.component';
import { ComentarComidaComponent } from './comentar-comida/comentar-comida.component';
import { ThanksComponent } from './comentar-comida/popup/thanks/thanks.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import 'moment/locale/es';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        LoginAdminComponent,
        ErrorComponent,
        ComentarComidaComponent,
        ThanksComponent,
    ],
    exports: [],
    bootstrap: [AppComponent],
    imports: [CustomMaterialModule,
        SharedModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        CarouselModule,
        ReactiveFormsModule
      ],
      providers: [
          { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
          CookieService,
          provideMomentDateAdapter(),
          provideHttpClient(withInterceptorsFromDi()),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA] 
      })
export class AppModule { }


