import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/language/language.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { RouterService } from '../../../../services/router/router.service';
import { UserService } from '../../../../services/user/user.service';
import { map, first, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  constructor(
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private _router: RouterService,
  ) { }
  public get lang() { return this.language.state.twoLetter }

  public loading$ = combineLatest(
    this.auth.user$,
    this.user.state$
  ).pipe(
    map(([auth, user]) => auth === null || user.loading)
  )

  public forms = {
    plan: 0
  }

  public current = {
    plan: 0
  }

  ngOnInit() {
    this.load()
  }

  public back() {
    this._router.back(["account", "settings"])
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()

    this.user.loadUser(user!.uid, refresh)

    this.forms.plan = await this.user.state$.pipe(
      filter(state => !!state.user),
      first(),
      map(state => state.user!.plan),
      map(
        (plan) => {
          if (!plan) {
            return 0
          }
          if (plan.type == "Standard") {
            return 1
          }
          if (plan.type == "Premium") {
            return 2
          }
          return 0
        }
      )
    ).toPromise()

    this.current.plan = this.forms.plan
  }

  public plans = [
    {
      value: 0,
      name: "Free",
      price: {
        en: "0 JPY / Month",
        ja: "0 円 / 月"
      } as any,
      functions: [
        {
          en: "Every basic functions",
          ja: "全ての基本的な機能"
        } as any
      ]
    },
    {
      value: 1,
      name: "Standard",
      price: {
        en: "200 JPY / Month",
        ja: "200 円 / 月"
      } as any,
      functions: [
        {
          en: "Every functions of Free plan",
          ja: "Freeプランの全ての機能"
        } as any,
        {
          en: "Free acquisition of assets used as fee for blockchains",
          ja: "ブロックチェーンへの手数料に使われるアセットの無料取得"
        } as any,
        {
          en: "Multisig Transaction",
          ja: "マルチシグトランザクション"
        } as any,
        {
          en: "Issuing assets",
          ja: "アセットの発行"
        } as any
      ]
    },
    {
      value: 2,
      name: "Premium",
      price: {
        en: "600 JPY / Month",
        ja: "600円 / 月"
      } as any,
      functions: [
        {
          en: "Every functions of Standard plan",
          ja: "Standardプランの全ての機能"
        } as any,
        {
          en: "Hide advertisements",
          ja: "広告の非表示"
        } as any,
        {
          en: "Notification of transactions",
          ja: "トランザクションへの通知"
        } as any,
        {
          en: "Register the icon of assets",
          ja: "アセットのアイコンの登録"
        } as any
      ]
    }
  ]

  public translation = {
    plan: {
      en: "Plan",
      ja: "プラン"
    } as any,
    changePlan: {
      en: "",
      ja: "プラン変更"
    } as any,
    availableFunctions: {
      en: "Available functions",
      ja: "利用可能な機能"
    } as any
  }
}
