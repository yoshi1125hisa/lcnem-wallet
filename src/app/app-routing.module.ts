import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './accounts/login/login.component';
import { HistoryComponent } from './transactions/history/history.component';
import { ScanComponent } from './transactions/scan/scan.component';
import { TransferComponent } from './transactions/transfer/transfer.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { TermsComponent } from './terms/terms/terms.component';
import { DepositComponent } from './accounts/deposit/deposit.component';
import { WithdrawComponent } from './accounts/withdraw/withdraw.component';
import { ContactsComponent } from './accounts/contacts/contacts.component';
import { PrivacyPolicyComponent } from './terms/privacy-policy/privacy-policy.component';
import { PlanComponent } from './accounts/plan/plan.component';
import { WalletsComponent } from './accounts/wallets/wallets.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "accounts/login", component: LoginComponent },
  { path: "accounts/wallets", component: WalletsComponent },
  { path: "accounts/plan", component: PlanComponent },
  { path: "accounts/deposit", component: DepositComponent },
  { path: "accounts/withdraw", component: WithdrawComponent },
  { path: "accounts/contacts", component: ContactsComponent },
  { path: "transactions/history", component: HistoryComponent },
  { path: "transactions/scan", component: ScanComponent },
  { path: "transactions/transfer", component: TransferComponent },
  { path: "terms/terms", component: TermsComponent },
  { path: "terms/privacy-policy", component: PrivacyPolicyComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
