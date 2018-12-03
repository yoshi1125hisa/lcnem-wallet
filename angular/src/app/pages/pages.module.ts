import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SettingsComponent } from './account/settings/settings.component';
import { ContactsComponent } from './contacts/contacts.component';
import { LoginComponent } from './account/login/login.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './terms/privacy-policy/privacy-policy.component';
import { QrScanComponent } from './nem/qr-scan/qr-scan.component';
import { TransferComponent } from './nem/transfer/transfer.component';
import { DepositComponent } from './digital-legal-currency/deposit/deposit.component';
import { WithdrawComponent } from './digital-legal-currency/withdraw/withdraw.component';
import { HomeComponent } from './home/home.component';
import { NemComponent } from './nem/nem.component';

@NgModule({
  declarations: [PagesComponent, SettingsComponent, ContactsComponent, LoginComponent, TermsComponent, PrivacyPolicyComponent, QrScanComponent, TransferComponent, DepositComponent, WithdrawComponent, HomeComponent, NemComponent],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
