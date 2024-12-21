import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './modules/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonMethodService } from './services/common/common-method.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './modules/core/interceptor/auth.interceptor';
import { LoadingInterceptorService } from './services/common/loading-interceptor.service';
import { LoadingService } from './services/common/loading.service';
import { ToasterService } from './services/common/toaster.service';
import { DatePipe } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, protectedResources } from './auth.config';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
    {
      // The routing guard configuration. 
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: protectedResources.DaApi.scopes
      }
    },
    {
      // MSAL interceptor configuration.
      // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        [protectedResources.DaApi.endpoint, protectedResources.DaApi.scopes]
      ])
    }),
    NgIdleKeepaliveModule.forRoot(),
    SharedModule.forRoot(),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideAnimationsAsync(),CommonMethodService,ToasterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    MsalGuard,
    LoadingInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (service: LoadingService) => new LoadingInterceptorService(service),
      multi: true,
      deps: [LoadingService]
    },
    DatePipe
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
