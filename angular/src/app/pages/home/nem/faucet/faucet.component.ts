import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../services/auth/auth.service';
import { LanguageService } from '../../../../services/language/language.service';
import { ApiService } from '../../../../services/api/api.service';
import { WalletService } from '../../../../services/user/wallet/wallet.service';
import { first, filter, map } from 'rxjs/operators';
import { LoadingDialogComponent } from '../../../../components/loading-dialog/loading-dialog.component';
import { Address } from 'nem-library';
import { BalanceService } from '../../../../services/dlt/nem/balance/balance.service';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css']
})
export class FaucetComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }
  private walletId = ""

  public visible$ = this.balance.state$.pipe(
    map(state => state.assets.find(a => a.assetId.toString() == "xem")),
    map(state => {
      console.log(state)
      return state
    }),
    map(state => state!.quantity < 1 * (10 ** 6))
  )
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private language: LanguageService,
    private api: ApiService,
    private wallet: WalletService,
    private balance: BalanceService,
    private user: UserService,

  ) {
    this.wallet.state$.pipe(
      first()
    ).subscribe(
      (state) => {
        if (state.currentWalletId) {
          this.walletId = state.currentWalletId
        }
      }
    )
  }

  ngOnInit() {
    this.load()
  }

  public async load() {
    const state = await this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()

    const address = new Address(state.entities[state.currentWalletId!].nem)
    this.user.loadUser(user!.uid)
    this.balance.loadBalance(address)
  }

  public faucet() {
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })
    this.api.faucet(
      {
        userId: this.auth.user!.uid,
        walletId: this.walletId
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
      en: "Competed",
      ja: "送金しました。"
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    recommend: {
      en: "Let's receive 1 XEM!!",
      ja: "1XEM を受け取ることができます"
    } as any
  }

}
