import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { RouterService } from '../../../../../services/router/router.service';
import { LanguageService } from '../../../../../services/language/language.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { IntegrationService } from '../../../../../services/user/wallet/integration/integration.service';
import { WalletService } from '../../../../../services/user/wallet/wallet.service';
import { map, filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  public loading$ = combineLatest(
    this.auth.user$,
    this.integration.state$
  ).pipe(
    map(([auth, integration]) => auth === null || integration.loading)
  )

  public state$ = this.integration.state$

  constructor(
    private _router: RouterService,
    private language: LanguageService,
    private auth: AuthService,
    private wallet: WalletService,
    private integration: IntegrationService
  ) {
  }

  ngOnInit() {
    this.load()
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()

    const state = await this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    this.integration.loadIntegrations(user!.uid, state.currentWalletId!, refresh)
  }

  public back() {
    this._router.back([""])
  }

  public deleteIntegration(id: string) {
    const result = window.confirm(this.translation.confirm[this.lang])

    if (!result) {
      return
    }
    
    this.integration.deleteIntegration(this.auth.user!.uid, this.wallet.state.currentWalletId!, id)
  }

  public translation = {
    applications: {
      en: "Integrated applications",
      ja: "連携アプリ"
    } as any,
    empty: {
      en: "There is no integrated applications.",
      ja: "連携アプリはありません。"
    } as any,
    confirm: {
      en: "Are you sure?",
      ja: "削除しますか？"
    } as any,
  }
}
