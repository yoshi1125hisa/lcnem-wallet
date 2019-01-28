import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { IntegrationService } from '../../../services/user/wallet/integration/integration.service';
import { AuthService } from '../../../services/auth/auth.service';
import { WalletService } from '../../../services/user/wallet/wallet.service';
import { filter, first } from 'rxjs/operators';
import { Integration } from '../../../../../../firebase/functions/src/models/integration';

@Component({
  selector: 'app-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.css']
})
export class IntegrateComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  public agree = false
  public redirect = ""
  public clientToken = ""
  public name = ""
  public owner = ""

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
    this.clientToken = this.route.snapshot.queryParams.clientToken || ""

    const application = await this.integration.getApplication(this.clientToken)
    this.name = application.name
    this.owner = application.owner
  }

  public async integrate() {
    const integration: Integration = {
      clientToken: this.clientToken,
      name: this.name,
      owner: this.owner
    }
    const accessToken = this.integration.createIntegration(this.auth.user!.uid, this.wallet.state.currentWalletId!, integration)
    const nem = this.wallet.state.entities[this.wallet.state.currentWalletId!].nem

    location.href = `${this.redirect}?nem=${nem}&accessToken=${accessToken}`
  }

  public reject() {
    location.href = this.redirect
  }

  public translation = {
    agree: {
      en: "I agree.",
      ja: "同意します"
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
