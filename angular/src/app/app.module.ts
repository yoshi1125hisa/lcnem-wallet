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
  MatFormFieldModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatListModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './accounts/login/login.component';
import { HistoryComponent } from './transactions/history/history.component';
import { TransactionComponent } from './transactions/history/transaction/transaction.component';
import { ScanComponent } from './transactions/scan/scan.component';
import { TransferComponent } from './transactions/transfer/transfer.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { AssetsListComponent } from './components/assets-list/assets-list.component';
import { DepositComponent } from './accounts/deposit/deposit.component';
import { TermsComponent } from './terms/terms/terms.component';
import { WithdrawComponent } from './accounts/withdraw/withdraw.component';
import { ContactsComponent } from './accounts/contacts/contacts.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { TransferDialogComponent } from './transactions/transfer/transfer-dialog/transfer-dialog.component';
import { PrivacyPolicyComponent } from './terms/privacy-policy/privacy-policy.component';
import { PlanComponent } from './accounts/plan/plan.component';
import { WalletsComponent } from './accounts/wallets/wallets.component';
import { CreateDialogComponent } from './accounts/wallets/create-dialog/create-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HistoryComponent,
    TransactionComponent,
    ScanComponent,
    TransferComponent,
    PageNotFoundComponent,
    LoadingDialogComponent,
    AssetsListComponent,
    DepositComponent,
    TermsComponent,
    WithdrawComponent,
    ContactsComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    TransferDialogComponent,
    PrivacyPolicyComponent,
    WalletsComponent,
    PlanComponent,
    CreateDialogComponent
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
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatListModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  entryComponents: [
    LoadingDialogComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    TransferDialogComponent,
    CreateDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
