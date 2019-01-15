import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/language/language.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { RouterService } from '../../../../services/router/router.service';
import { UserService } from '../../../../services/user/user.service';
import { map, first, filter } from 'rxjs/operators';

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

  public forms: {
    plan?: number
  } = {}

  ngOnInit() {
    this.load()
  }

  public back() {
    this._router.back([""])
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user != null),
      first()
    ).toPromise()

    this.user.loadUser(user!.uid, refresh)

    this.forms.plan = await this.user.state$.pipe(
      filter(state => !state.loading),
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
        }
      )
    ).toPromise()
  }

  public translation = {
    plan: {
      en: "Plan",
      ja: "プラン"
    } as any,
    freeTitle: {
      en: "",
      ja: "Freeプラン"
    } as any,
    freeContent: {
      en: "",
      ja: "内容；クラウドウォレットを一つのみ作成可能です。料金：無料"
    } as any,
    standardTitle: {
      en: "",
      ja: "Standardプラン"
    } as any,
    standardContent: {
      en: "",
      ja: "内容；クラウドウォレットを複数個作成可能です。料金:月額200JPY（登録翌月の月初めより請求が発生します。）"
    } as any,
    changePlan: {
      en: "",
      ja: "プラン変更"
    } as any,
  }
}
