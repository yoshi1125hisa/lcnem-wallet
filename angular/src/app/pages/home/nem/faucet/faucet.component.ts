import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../services/auth/auth.service';
import { LanguageService } from '../../../../services/language/language.service';
import { ApiService } from '../../../../services/api/api.service';
import { first, filter, map } from 'rxjs/operators';
import { LoadingDialogComponent } from '../../../../components/loading-dialog/loading-dialog.component';
import { Address } from 'nem-library';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoadUser } from '../../../../services/user/user.actions';
import { LoadBalances } from '../../../../services/dlt/nem/balance/balance.actions';
import { State } from '../../../../services/reducer';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css']
})
export class FaucetComponent implements OnInit {
  public get lang() { return this.language.code }

  public wallet$ = this.store.select(state => state.wallet)
  public user$ = this.store.select(state => state.user)
  public balance$ = this.store.select(state => state.balance)

  public visible$ = combineLatest(
    this.user$,
    this.balance$
  ).pipe(
    filter(([user, balance]) => !user.loading && !balance.loading),
    filter(([user, balance]) => user.user !== undefined && balance.assets.find(asset => asset.assetId.toString() === "nem:xem") !== undefined),
    map(
      ([user, balance]) => {
        if(user.user!.faucetDate) {
          const faucetDate = new Date(user.user!.faucetDate!)
          faucetDate.setDate(faucetDate.getDate() + 1)
          if(faucetDate > new Date()) {
            return false
          }
        }

        if(balance.assets.find(asset => asset.assetId.toString() === "nem:xem")!.quantity >= 10 ** 6) {
          return false
        }

        return true
      }
    )
  )

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private language: LanguageService,
    private api: ApiService,
    private store: Store<State>
  ) {
　}

  ngOnInit() {
    this.load()
  }

  public async load() {
    const state = await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()
    
    const address = new Address(state.entities[state.currentWalletId!].nem)
    this.store.dispatch(new LoadUser({ userId: user!.uid }))
    this.store.dispatch(new LoadBalances({ address }))
  }

  public async faucet() {
    const state = await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })
    this.api.faucet(
      {
        userId: this.auth.user!.uid,
        walletId: state.currentWalletId!
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

  public translation = {
    completed: {
      en: "You've got 1 XEM!",
      ja: "1XEM獲得しました！"
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    receive: {
      en: "Receive",
      ja: "受け取る"
    } as any,
    faucet: {
      en: "1XEM present",
      ja: "1XEM プレゼント"
    } as any,
    faucetBody: {
      en: "Let's get XEM for transaction fees!",
      ja: "手数料に使用するXEMをプレゼント！"
    } as any
  }
}
