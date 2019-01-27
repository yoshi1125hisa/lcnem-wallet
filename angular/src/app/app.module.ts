import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

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
  MatTooltipModule,
  MatTabsModule,
  MatRippleModule,
} from '@angular/material';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
//pages
import { PageNotFoundComponent } from './pages/error/page-not-found/page-not-found.component';
//  home
import { HomeComponent } from './pages/home/home.component';
//    nem
import { NemComponent } from './pages/home/nem/nem.component';
import { HistoryComponent as NemHistoryComponent } from './pages/home/nem/history/history.component';
import { TransactionComponent as NemTransactionComponent } from './pages/home/nem/history/transaction/transaction.component';
import { BalanceComponent as NemBalanceComponent } from './pages/home/nem/balance/balance.component';
import { MultisigComponent as NemMultisigComponent } from './pages/home/nem/multisig/multisig.component';
import { FaucetComponent } from './pages/home/nem/faucet/faucet.component';
//    bitcoin-lightning
import { BitcoinLightningComponent } from './pages/home/bitcoin-lightning/bitcoin-lightning.component';
import { BalanceComponent as BitcoinLightningBalanceComponent } from './pages/home/bitcoin-lightning/balance/balance.component';
import { HistoryComponent as BitcoinLightningHistoryComponent } from './pages/home/bitcoin-lightning/history/history.component';
//    nem-cosmos
import { NemCosmosComponent } from './pages/home/nem-cosmos/nem-cosmos.component';
//  account
import { LoginComponent } from './pages/account/login/login.component';
//    settings
import { SettingsComponent } from './pages/account/settings/settings.component';
import { PlanComponent } from './pages/account/settings/plan/plan.component';
import { ChangeComponent as PlanChangeComponent } from './pages/account/settings/plan/change/change.component';
//      wallet
import { IntegrationsComponent } from './pages/account/settings/wallet/integrations/integrations.component';
import { WalletComponent as SettingsWalletComponent } from './pages/account/settings/wallet/wallet.component';
//    contacts
import { ContactsComponent } from './pages/account/contacts/contacts.component';
import { ContactComponent } from './pages/account/contacts/contact/contact.component';
import { ContactEditDialogComponent } from './pages/account/contacts/contact-edit-dialog/contact-edit-dialog.component';
//    wallets
import { WalletsComponent } from './pages/account/wallets/wallets.component';
import { WalletComponent } from './pages/account/wallets/wallet/wallet.component';
import { WalletCreateDialogComponent } from './pages/account/wallets/wallet-create-dialog/wallet-create-dialog.component';
//  nem
import { TransferComponent } from './pages/nem/transfer/transfer.component';
import { QrScanComponent } from './pages/nem/qr-scan/qr-scan.component';
//  cheque
import { DepositComponent } from './pages/cheque/deposit/deposit.component';
import { WithdrawComponent } from './pages/cheque/withdraw/withdraw.component';
//  terms
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/terms/privacy-policy/privacy-policy.component';
//components
import { TransferDialogComponent } from './components/transfer-dialog/transfer-dialog.component';
import { AssetsListComponent } from './components/assets-list/assets-list.component';
import { LanguageMenuComponent } from './components/language-menu/language-menu.component';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
//services
import { RouterService } from './services/router/router.service';
import { ApplicationsComponent } from './pages/account/applications/applications.component';
import { ApplicationDialogComponent } from './pages/account/applications/application-dialog/application-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    ContactsComponent,
    LoginComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    QrScanComponent,
    DepositComponent,
    WithdrawComponent,
    HomeComponent,
    NemComponent,
    NemHistoryComponent,
    NemTransactionComponent,
    NemBalanceComponent,
    NemMultisigComponent,
    LanguageMenuComponent,
    AddressInputComponent,
    WalletsComponent,
    ContactComponent,
    ContactEditDialogComponent,
    WalletComponent,
    WalletCreateDialogComponent,
    TransferComponent,
    TransferDialogComponent,
    AssetsListComponent,
    PageNotFoundComponent,
    PlanComponent,
    LoadingDialogComponent,
    BitcoinLightningBalanceComponent,
    NemCosmosComponent,
    FaucetComponent,
    IntegrationsComponent,
    PlanChangeComponent,
    SettingsWalletComponent,
    BitcoinLightningComponent,
    BitcoinLightningHistoryComponent,
    ApplicationsComponent,
    ApplicationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    ZXingScannerModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
    MatTooltipModule,
    MatTabsModule,
    MatRippleModule
  ],
  entryComponents: [
    LoadingDialogComponent,
    TransferDialogComponent,
    ContactEditDialogComponent,
    WalletCreateDialogComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (_router: RouterService) => () => _router,
      deps: [RouterService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
