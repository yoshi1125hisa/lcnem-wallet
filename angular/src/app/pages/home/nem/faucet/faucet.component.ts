import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../services/auth/auth.service';
import { LanguageService } from '../../../../services/language/language.service';
import { ApiService } from '../../../../services/api/api.service';
import { WalletService } from '../../../../services/user/wallet/wallet.service';
import { first, filter, map } from 'rxjs/operators';
import { LoadingDialogComponent } from '../../../../components/loading-dialog/loading-dialog.component';
import { Address, Asset, AssetId } from 'nem-library';
import { BalanceService } from '../../../../services/dlt/nem/balance/balance.service';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css']
})
export class FaucetComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }

  public visible$ = this.balance.state$.pipe(
    filter(state => state.assets.length !== 0),
    map(state => state.assets.find(a => a.assetId.toString() == "nem:xem")),
    map(asset => asset ? asset!.quantity < 10 ** 6 : false))

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

  public async faucet() {
    const state = await this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })
    this.api.faucet(
      {
        userId: this.auth.user!.uid,
        walletId: state.entities[state.currentWalletId!].nem
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
    } as any,
    prettifyXem: {
      en: "1 XEM Present",
      ja: "1 XEM プレゼント"
    } as any
  }
}
