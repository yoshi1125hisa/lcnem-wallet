import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SimpleWallet, Password } from 'nem-library';
import { Router } from '@angular/router';
import { from, combineLatest } from 'rxjs';
import { map, mergeMap, toArray, filter, first } from 'rxjs/operators';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';
import { LanguageService } from '../../../services/language/language.service';
import { RouterService } from '../../../services/router/router.service';
import { WalletService } from '../../../services/wallet/wallet.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { WalletCreateDialogComponent } from './wallet-create-dialog/wallet-create-dialog.component';
import { ShareService } from '../../../services/api/share/share.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public loading$ = combineLatest(
    this.auth.user$,
    this.user.state$,
    this.wallet.state$
  ).pipe(
    map(([auth, user, wallet]) => !auth || user.loading || wallet.loading)
  )

  public state$ = this.wallet.state$

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private wallet: WalletService,
    private share: ShareService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user != null),
      first()
    ).toPromise()

    this.user.loadUser(user!.uid, refresh)
    this.wallet.loadWallets(user!.uid, refresh)
  }

  public async addWallet() {
    const result = await this.dialog.open(WalletCreateDialogComponent).afterClosed().toPromise()

    if (!result) {
      return
    }
    const uid = this.auth.user!.uid

    const simpleWallet = result.import
      ? SimpleWallet.createWithPrivateKey(uid, new Password(uid), result.privateKey)
      : SimpleWallet.create(uid, new Password(uid))

    const wallet: Wallet = {
      name: result.name,
      local: result.local == 1 ? true : false,
      nem: simpleWallet.address.plain(),
      wallet: simpleWallet.writeWLTFile()
    }

    this.wallet.addWallet(uid, wallet)
  }

  public async enterWallet(id: string) {
    this.wallet.setCurrentWallet(id);

    await this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise()

    this.router.navigate([""])
  }

  public importPrivateKey(id: string) {
    const pk = window.prompt(this.translation.importPrivateKey[this.lang])
    if (!pk || !pk.match("[0-9a-f]{64}")) {
      return
    }

    const uid = this.auth.user!.uid
    const wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), pk)

    this.wallet.addLocalWallet(id, wallet.writeWLTFile())
  }

  public renameWallet(id: string) {
    const wallet = this.wallet.state.entities[id];

    const name = window.prompt(this.translation.rename[this.lang], wallet.name)

    if (!name) {
      return
    }

    this.wallet.updateWallet(this.auth.user!.uid, id, { ...wallet, name })
  }

  public backupWallet(id: string) {
    const wallet = SimpleWallet.readFromWLT(this.wallet.state.entities[id].wallet!)
    const account = wallet.open(new Password(this.auth.user!.uid))

    this.share.copy(account.privateKey)

    this.snackBar.open(this.translation.backup[this.lang])
  }

  public deleteWallet(id: string) {
    const result = window.confirm(this.translation.deleteConfirm[this.lang])
    if (!result) {
      return
    }

    this.wallet.deleteWallet(this.auth.user!.uid, id)
  }

  public translation = {
    wallets: {
      en: "Wallets",
      ja: "ウォレット"
    } as any,
    rename: {
      en: "Rename",
      ja: "名前を変更"
    } as any,
    backup: {
      en: "Back up",
      ja: "バックアップ"
    } as any,
    delete: {
      en: "Delete",
      ja: "削除"
    } as any,
    importPrivateKey: {
      en: "Import your private key",
      ja: "秘密鍵をインポート"
    } as any,
    privateKey: {
      en: "Private key",
      ja: "秘密鍵"
    } as any,
    walletName: {
      en: "Wallet name",
      ja: "ウォレット名"
    } as any,
    deleteConfirm: {
      en: "Are you sure to delete the wallet?",
      ja: "ウォレットを削除しますか？"
    } as any,
    addWallet: {
      en: "Add a wallet",
      ja: "ウォレットを追加"
    } as any,
    localNotFound: {
      en: "The private key is not imported so some functions which require the private key are not available.",
      ja: "秘密鍵がインポートされていないため、秘密鍵が必要な一部の機能が制限されます。"
    } as any,
    unavailablePlan: {
      en: "More than one private key in Free plan is not supported.",
      ja: "Freeプランでは、複数のクラウド秘密鍵はサポートされていません。"
    } as any
  }
}
