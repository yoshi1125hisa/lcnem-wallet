import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatListModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatMenuModule
} from '@angular/material';

import { AppComponent } from './app.component';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './accounts/login/login.component';
import { SignComponent } from './accounts/sign/sign.component';
import { HistoryComponent } from './transactions/history/history.component';
import { TransactionComponent } from './transactions/history/transaction/transaction.component';
import { ScanComponent } from './transactions/scan/scan.component';
import { TransferComponent } from './transactions/transfer/transfer.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { GlobalDataService } from './services/global-data.service';
import { MosaicListComponent } from './components/mosaic-list/mosaic-list.component';
import { DepositComponent } from './accounts/deposit/deposit.component';
import { TermsComponent } from './accounts/terms/terms.component';
import { WithdrawComponent } from './accounts/withdraw/withdraw.component';
import { ContactsComponent } from './accounts/contacts/contacts.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { AssetsDialogComponent } from './transactions/transfer/assets-dialog/assets-dialog.component';
import { TransferDialogComponent } from './transactions/transfer/transfer-dialog/transfer-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignComponent,
    HistoryComponent,
    TransactionComponent,
    ScanComponent,
    TransferComponent,
    PageNotFoundComponent,
    LoadingDialogComponent,
    MosaicListComponent,
    DepositComponent,
    TermsComponent,
    WithdrawComponent,
    ContactsComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    AssetsDialogComponent,
    TransferDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ZXingScannerModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatListModule,
    MatSlideToggleModule,
    MatMenuModule
  ],
  entryComponents: [
    LoadingDialogComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    AssetsDialogComponent,
    TransferDialogComponent
  ],
  providers: [GlobalDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
