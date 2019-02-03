import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { IntegrationService } from '../../../services/user/integration/integration.service';
import { AuthService } from '../../../services/auth/auth.service';
import { WalletService } from '../../../services/user/wallet/wallet.service';
import { Application } from '../../../../../../firebase/functions/src/models/application';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.css']
})
export class IntegrateComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  public loading$ = this.wallet.state$.pipe(map(state => state.loading))
  public wallet$ = this.wallet.state$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!])
  )

  public forms = {
    password: "",
    passwordConfirm: "",
    agree: false
  }
  public redirect = ""
  public application?: Application

  constructor(
    private route: ActivatedRoute,
    private language: LanguageService,
    private auth: AuthService,
    private wallet: WalletService,
    private integration: IntegrationService
  ) { }

  ngOnInit() {
    this.load()
  }

  public async load(refresh?: boolean) {
    this.redirect = this.route.snapshot.queryParams.redirect || ""
    const clientToken = this.route.snapshot.queryParams.clientToken || ""

    const application = await this.integration.getApplication(clientToken)
    this.application = {
      name: application.name,
      owner: application.owner
    }
  }

  public async integrate() {
    const wallet = await this.integration.createIntegration(
      this.auth.user!.uid,
      this.wallet.state.entities[this.wallet.state.currentWalletId!],
      this.forms.password
    )

    location.href = `${this.redirect}?wallet=${wallet}`
  }

  public reject() {
    location.href = this.redirect
  }

  public translation = {
    walletName: {
      en: "Wallet name",
      ja: "ウォレット名"
    } as any,
    walletNemAddress: {
      en: "NEM address",
      ja: "NEMアドレス"
    } as any,
    password: {
      en: "Password",
      ja: "パスワード"
    } as any,
    passwordConfirm: {
      en: "Password confirmation",
      ja: "パスワード確認"
    } as any,
    integrate: {
      en: "Integrate",
      ja: "連携"
    } as any,
    reject: {
      en: "Reject",
      ja: "拒否する"
    } as any
  }
}
