import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
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

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './accounts/login/login.component';
import { SignComponent } from './accounts/sign/sign.component';
import { HistoryComponent } from './transactions/history/history.component';
import { TransactionComponent } from './transactions/history/transaction/transaction.component';
import { ScanComponent } from './transactions/scan/scan.component';
import { TransferComponent } from './transactions/transfer/transfer.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
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
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    FlexLayoutModule,
    ZXingScannerModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
