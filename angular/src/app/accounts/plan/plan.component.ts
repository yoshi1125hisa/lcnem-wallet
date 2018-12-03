import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { lang } from '../../models/lang';
import { back } from '../../models/back';
import { UserService } from '../../services/user/user.service';
import { State } from '../../store/index'
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  public loading$: Observable<boolean>;
  public loading = true;
  get lang() { return lang; }

  constructor(
    private store: Store<State>,
    private router: Router,
    private user: UserService
  ) {
    this.loading$ = store.select(state => state.user.loading)
  }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.refresh();
    });
  }

  public async refresh() {
    this.loading = true;



    this.loading = false;
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public translation = {
    plan: {
      en: "Pricing Plan",
      ja: "利用プラン"
    } as any,
    plans: [
      {
        name: {
          en: "Free Plan",
          ja: "フリープラン"
        } as any,
        price: {
          en: "0 JPY/Month",
          ja: "0 円/月"
        } as any,
        functions: [
          {
            en: "",
            ja: "秘密鍵クラウド保管のウォレットを一つ利用可"
          } as any,
          {
            en: "",
            ja: "秘密鍵ローカル保存のウォレットを複数利用可"
          }
        ]
      },
      {
        name: {
          en: "Standard Plan",
          ja: "スタンダードプラン"
        } as any,
        price: {
          en: "200 JPY/Month (+Tax)",
          ja: "200 円/月 (+税)"
        } as any,
        functions: [
          {
            en: "",
            ja: "フリープランの機能を全て利用可"
          } as any,
          {
            en: "",
            ja: "秘密鍵クラウド保管のウォレットを複数利用可"
          } as any,
          {
            en: "",
            ja: "ブロックチェーンの手数料を支払えないとき、何回でも手数料に使う仮想通貨をプレゼントされる機能(ウォレットのXEM残高が1を下回っているとき、1XEMプレゼント)を利用可"
          } as any
        ]
      }
    ]
  }
}
