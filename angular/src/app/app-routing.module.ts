import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/account/login/login.component';
import { SettingsComponent } from './pages/account/settings/settings.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { DepositComponent } from './pages/digital-legal-currency/deposit/deposit.component';
import { WithdrawComponent } from './pages/digital-legal-currency/withdraw/withdraw.component';
import { QrScanComponent } from './pages/nem/qr-scan/qr-scan.component';
import { TransferComponent } from './pages/nem/transfer/transfer.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/terms/privacy-policy/privacy-policy.component';
import { PageNotFoundComponent } from './pages/error/page-not-found/page-not-found.component';
import { WalletsComponent } from './pages/account/wallets/wallets.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "account/login", component: LoginComponent },
  { path: "account/settings", component: SettingsComponent },
  { path: "account/wallets", component: WalletsComponent },
  { path: "contacts", component: ContactsComponent },
  { path: "digital-legal-currency/deposit", component: DepositComponent },
  { path: "digital-legal-currency/withdraw", component: WithdrawComponent },
  { path: "nem/qr-scan", component: QrScanComponent },
  { path: "nem/transfer", component: TransferComponent },
  { path: "terms", component: TermsComponent },
  { path: "terms/privacy-policy", component: PrivacyPolicyComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
