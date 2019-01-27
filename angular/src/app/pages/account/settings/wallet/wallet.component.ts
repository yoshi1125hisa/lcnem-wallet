import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/language/language.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { RouterService } from '../../../../services/router/router.service';

@Component({
  selector: 'app-settings-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private _router: RouterService,
  ) { }
  public get lang() { return this.language.state.twoLetter }

  ngOnInit() {
    this.load()
  }

  public back() {
    this._router.back([""])
  }

  public async load(refresh?: boolean) {
  }
  
  public translation = {
    wallet: {
      en: "Wallet",
      ja: "ウォレット"
    } as any,
    integrations: {
      en: "Integrated applications",
      ja: "連携アプリ"
    } as any
  }
}
