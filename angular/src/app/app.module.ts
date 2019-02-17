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
//    bitcoin
import { BitcoinComponent } from './pages/home/bitcoin/bitcoin.component';
import { BalanceComponent as BitcoinBalanceComponent } from './pages/home/bitcoin/balance/balance.component';
import { HistoryComponent as BitcoinHistoryComponent } from './pages/home/bitcoin/history/history.component';
//    nem-cosmos
import { NemCosmosComponent } from './pages/home/nem-cosmos/nem-cosmos.component';
import { BalanceComponent as NemCosmosBalanceComponent } from './pages/home/nem-cosmos/balance/balance.component';
//  account
import { LoginComponent } from './pages/account/login/login.component';
import { IntegrateComponent } from './pages/account/integrate/integrate.component';
//    applications
import { ApplicationsComponent } from './pages/account/applications/applications.component';
import { ApplicationDialogComponent } from './pages/account/applications/application-dialog/application-dialog.component';
import { ApplicationComponent } from './pages/account/applications/application/application.component';
//    settings
import { SettingsComponent } from './pages/account/settings/settings.component';
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
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './services/reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    //pages
    PageNotFoundComponent,
    //  home
    HomeComponent,
    //    nem
    NemComponent,
    NemHistoryComponent,
    NemTransactionComponent,
    NemBalanceComponent,
    NemMultisigComponent,
    FaucetComponent,
    //    bitcoin
    BitcoinComponent,
    BitcoinBalanceComponent,
    BitcoinHistoryComponent,
    //    nem-cosmos
    NemCosmosComponent,
    NemCosmosBalanceComponent,
    //  account
    LoginComponent,
    IntegrateComponent,
    //    applications
    ApplicationsComponent,
    ApplicationDialogComponent,
    ApplicationComponent,
    //    settings
    SettingsComponent,
    //    contacts
    ContactsComponent,
    ContactComponent,
    ContactEditDialogComponent,
    //    wallets
    WalletsComponent,
    WalletComponent,
    WalletCreateDialogComponent,
    //  nem
    TransferComponent,
    QrScanComponent,
    //  terms
    TermsComponent,
    PrivacyPolicyComponent,
    //components
    TransferDialogComponent,
    AssetsListComponent,
    LanguageMenuComponent,
    AddressInputComponent,
    LoadingDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule,
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
