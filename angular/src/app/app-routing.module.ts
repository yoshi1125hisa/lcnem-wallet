import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/account/login/login.component';
import { WalletsComponent } from './pages/account/wallets/wallets.component';
import { SettingsComponent } from './pages/account/settings/settings.component';
import { ChangeComponent as PlanChangeComponent } from './pages/account/settings/plan/change/change.component';
import { ContactsComponent } from './pages/account/contacts/contacts.component';
import { QrScanComponent } from './pages/nem/qr-scan/qr-scan.component';
import { TransferComponent } from './pages/nem/transfer/transfer.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/terms/privacy-policy/privacy-policy.component';
import { PageNotFoundComponent } from './pages/error/page-not-found/page-not-found.component';
import { IntegrateComponent } from './pages/account/integrate/integrate.component';
import { OrderChequeComponent } from './pages/cheque/order-cheque/order-cheque.component';
import { OrderCashComponent } from './pages/cheque/order-cash/order-cash.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "account/login", component: LoginComponent },
  { path: "account/wallets", component: WalletsComponent },
  { path: "account/integrate", component: IntegrateComponent },
  { path: "account/settings", component: SettingsComponent },
  { path: "account/settings/plan/change", component: PlanChangeComponent },
  { path: "account/contacts", component: ContactsComponent },
  { path: "cheque/order-cheque", component: OrderChequeComponent },
  { path: "cheque/order-cash", component: OrderCashComponent },
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
