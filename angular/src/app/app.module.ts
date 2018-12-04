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
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { SettingsComponent } from './pages/account/settings/settings.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { LoginComponent } from './pages/account/login/login.component';
import { TermsComponent } from './pages/terms/terms.component';
import { QrScanComponent } from './pages/nem/qr-scan/qr-scan.component';
import { TransferComponent } from './pages/nem/transfer/transfer/transfer.component';
import { PrivacyPolicyComponent } from './pages/terms/privacy-policy/privacy-policy.component';
import { DepositComponent } from './pages/digital-legal-currency/deposit/deposit.component';
import { WithdrawComponent } from './pages/digital-legal-currency/withdraw/withdraw.component';
import { HomeComponent } from './pages/home/home.component';
import { NemComponent } from './pages/home/nem/nem.component';
import { HistoryComponent } from './pages/home/nem/history/history.component';
import { TransactionComponent } from './pages/home/nem/history/transaction/transaction.component';
import { BalanceComponent } from './pages/home/nem/balance/balance.component';
import { MultisigComponent } from './pages/home/nem/multisig/multisig.component';
import { TransferDialogComponent } from './pages/nem/transfer/transfer/transfer-dialog/transfer-dialog.component';
import { CreateDialogComponent } from './pages/account/wallets/create-dialog/create-dialog.component';
import { ContactEditDialogComponent } from './pages/contacts/contact-edit-dialog/contact-edit-dialog.component';
import { LanguageMenuComponent } from './components/language-menu/language-menu.component';
import { NemAddressInputComponent } from './components/nem-address-input/nem-address-input.component';
import { WalletsComponent } from './pages/account/wallets/wallets.component';
import { ContactComponent } from './pages/contacts/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    ContactsComponent,
    LoginComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    QrScanComponent,
    TransferComponent,
    DepositComponent,
    WithdrawComponent,
    HomeComponent,
    NemComponent,
    HistoryComponent,
    TransactionComponent,
    BalanceComponent,
    MultisigComponent,
    LanguageMenuComponent,
    NemAddressInputComponent,
    WalletsComponent,
    ContactComponent,
    ContactEditDialogComponent
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
    CreateDialogComponent,
    ContactsComponent,
    ContactEditDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
