import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { map, first, filter, mergeMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { LanguageService } from '../../../../../services/language/language.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { RouterService } from '../../../../../services/router/router.service';
import { UserService } from '../../../../../services/user/user.service';
import { ApiService } from '../../../../../services/api/api.service';
import { TransferTransaction, TimeWindow, Address, EmptyMessage, TransactionHttp } from 'nem-library';
import { NemService } from '../../../../../services/dlt/nem/nem.service';
import { TransferDialogComponent } from '../../../../../components/transfer-dialog/transfer-dialog.component';
import { LoadingDialogComponent } from '../../../../../components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }
  
  public loading$ = combineLatest(
    this.auth.user$,
    this.user.state$
  ).pipe(
    map(([auth, user]) => auth === null || user.loading)
  )

  public expire$ = this.user.state$.pipe(
    filter(user => user.user !== undefined && user.user.plan !== undefined),
    map(user => new Date(user.user!.plan!.expire))
  )

  public forms = {
    plan: 0,
    currentPlan: 0,
    months: 6
  }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private nem: NemService,
    private api: ApiService,
    private _router: RouterService,
  ) { }

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
      filter(state => state.user !== undefined),
      first(),
      map(state => state.user!.plan),
      map(
        (plan) => {
          if (plan && new Date(plan.expire) > new Date()) {
            if (plan.type == "Standard") {
              return 1
            }
            if (plan.type == "Premium") {
              return 2
            }
          }

          return 0
        }
      ),
      first()
    ).toPromise()

    this.forms.currentPlan = this.forms.plan
  }

  public async chargePlan() {
    const account = await this.nem.getAccount().catch(
      () => {
        this.snackBar.open(this.translation.importRequired[this.lang], undefined, { duration: 6000 })
        throw Error()
      }
    )
    const price = this.plans[this.forms.plan].price.value * this.forms.months

    const transaction = TransferTransaction.createWithAssets(
      TimeWindow.createWithDeadline(),
      new Address("NDTZECV7NU5QANKTVUHWLTSYTNZIQNJKAVNTC54U"),
      await this.nem.createAssetTransferable([{ id: "lc:jpy", amount: price }]),
      EmptyMessage
    )

    const result = await this.dialog.open(
      TransferDialogComponent,
      {
        data: {
          transaction: transaction,
          message: ""
        }
      }
    ).afterClosed().toPromise()

    if (!result) {
      return
    }

    const signed = account.signTransaction(transaction)
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })

    this.api.changePlan(
      {
        userId: this.auth.user!.uid,
        plan: this.plans[this.forms.plan].name,
        months: this.forms.months,
        ...signed
      }
    ).subscribe(
      () => {
        this.snackBar.open(this.translation.completed[this.lang], undefined, { duration: 6000 })
      },
      (error) => {
        this.snackBar.open(this.translation.error[this.lang], undefined, { duration: 6000 })
      },
      () => {
        dialog.close()
      }
    )
  }

  public plans = [
    {
      value: 0,
      name: "Free",
      price: {
        value: 0,
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
        value: 200,
        en: "200 JPY / Month",
        ja: "200 円 / 月"
      } as any,
      functions: [
        {
          en: "Every functions of Free plan",
          ja: "Freeプランの全ての機能"
        } as any,
        {
          en: "Multi cloud wallets",
          ja: "複数のクラウドウォレットの利用"
        } as any,
      ]
    },
    {
      value: 2,
      name: "Premium",
      price: {
        value: 600,
        en: "600 JPY / Month",
        ja: "600円 / 月"
      } as any,
      functions: [
        {
          en: "Every functions of Standard plan",
          ja: "Standardプランの全ての機能"
        } as any,
        {
          en: "Notification of transactions(not implemented yer)",
          ja: "トランザクションへの通知(未実装)"
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
      en: "Change plan",
      ja: "プラン変更"
    } as any,
    availableFunctions: {
      en: "Available functions",
      ja: "利用可能な機能"
    } as any,
    months: {
      en: "Months",
      ja: "利用月間"
    } as any,
    importRequired: {
      en: "Importing the private key is required.",
      ja: "秘密鍵のインポートが必要です。"
    } as any,
    completed: {
      en: "Completed.",
      ja: "完了しました。"
    } as any,
    error: {
      en: "Error",
      ja: "エラーが発生しました。"
    } as any
  }
}
