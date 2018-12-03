import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login/login.component';
import { SettingsComponent } from './account/settings/settings.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DepositComponent } from './digital-legal-currency/deposit/deposit.component';
import { WithdrawComponent } from './digital-legal-currency/withdraw/withdraw.component';
import { QrScanComponent } from './nem/qr-scan/qr-scan.component';
import { TransferComponent } from './nem/transfer/transfer.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './terms/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "account/login", component: LoginComponent },
  { path: "account/settings", component: SettingsComponent },
  { path: "contacts", component: ContactsComponent },
  { path: "digital-legal-currency/deposit", component: DepositComponent },
  { path: "digital-legal-currency/withdraw", component: WithdrawComponent },
  { path: "nem/qr-scan", component: QrScanComponent },
  { path: "nem/transfer", component: TransferComponent },
  { path: "terms", component: TermsComponent },
  { path: "terms/privacy-policy", component: PrivacyPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
