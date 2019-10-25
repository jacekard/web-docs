import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { registerLocaleData } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localePl from '@angular/common/locales/pl';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { SafeHtml } from './pipes/safe-html';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { DocumentsComponent } from './components/documents/documents.component';

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    WorkspaceComponent,
    SafeHtml,
    DocumentsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    MatCardModule,
    NgbModule,
    RouterModule.forRoot([
      /* canActivate: [AuthorizeGuard] enables authorization on page. */
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'workspace/new', component: WorkspaceComponent, canActivate: [AuthorizeGuard] },
      { path: 'workspace/:id', component: WorkspaceComponent, canActivate: [AuthorizeGuard] },
      { path: 'documents', component: DocumentsComponent, canActivate: [AuthorizeGuard] } 
    ]),
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    SafeHtml
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
