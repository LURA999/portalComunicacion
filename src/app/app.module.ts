import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { LoginAdminComponent } from './auth/login-admin/login-admin.component';
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from './error/error.component';
import { ComentarComidaComponent } from './comentar-comida/comentar-comida.component';
import { ThanksComponent } from './comentar-comida/popup/thanks/thanks.component';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        LoginAdminComponent,
        ErrorComponent,
        ComentarComidaComponent,
        ThanksComponent,
    ],
    exports: [],
    bootstrap: [AppComponent], imports: [CustomMaterialModule,
        SharedModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NgbModule], providers: [CookieService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
