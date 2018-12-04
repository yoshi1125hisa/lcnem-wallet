import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SimpleWallet, Password } from 'nem-library';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, mergeMap, toArray, filter, first } from 'rxjs/operators';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';
import { LanguageService } from '../../../services/language/language.service';
import { RouterService } from '../../../services/router/router.service';
import { WalletService } from '../../../services/wallet/wallet.service';
import { UserService } from '../../../services/user/user.service';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { PromptDialogComponent } from '../../../components/prompt-dialog/prompt-dialog.component';
import { LocalWalletService } from '../../../services/wallet/local-wallet.service';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public state$ = this.wallet.state$;
  public clouds$: Observable<number>;
  public plan = ""

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private _router: RouterService,
    private language: LanguageService,
    private user: UserService,
    private wallet: WalletService,
    private localWallet: LocalWalletService
  ) {
    this.clouds$ = this.state$.pipe(
      mergeMap(
        (state) => {
          return from(state.ids).pipe(
            map(id => state.entities[id].local),
            toArray(),
            map(array => array.filter(local => !local).length)
          )
        }
      )
    )

    this.state$.pipe(
      filter(state => state.currentWalletId ? true : false),
      first()
    ).subscribe(
      () => {
        this.router.navigate([""])
      }
    )
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    this.wallet.loadWallets(this.user.state.currentUser!.uid, refresh)
  }

  public addWallet() {
    this.dialog.open(CreateDialogComponent).afterClosed().pipe(
      filter(result => result),
    ).subscribe(
      (result) => {
        const uid = this.user.state.currentUser!.uid

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
    );
  }

  public enterWallet(id: string) {
    this.wallet.setCurrentWallet(id);
  }

  public importPrivateKey(id: string) {
    this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.importPrivateKey[this.lang],
        input: {
          placeholder: this.translation.privateKey[this.lang],
          pattern: "[0-9a-f]{64}"
        }
      }
    }).afterClosed().pipe(
      filter(pk => pk)
    ).subscribe(
      (pk) => {
        const uid = this.user.state.currentUser!.uid
        const wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), pk)

        this.localWallet.addLocalWallet(id, wallet.writeWLTFile())
      }
    );
  }

  public renameWallet(id: string) {
    const wallet = this.wallet.state.entities[id]
    this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.rename[this.lang],
        input: {
          placeholder: this.translation.walletName[this.lang],
          value: wallet.name
        }
      }
    }).afterClosed().pipe(
      filter(name => name)
    ).subscribe(
      (name) => {
        const uid = this.user.state.currentUser!.uid
        this.wallet.updateWallet(uid, id, { ...wallet, name })
      }
    )
  }

  public backupWallet(id: string) {
    const uid = this.user.state.currentUser!.uid

    const wallet = SimpleWallet.readFromWLT(this.wallet.state.entities[id].wallet!);
    const account = wallet.open(new Password(uid));

    this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.backup[this.lang],
        content: account.privateKey
      }
    });
  }

  public deleteWallet(id: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.deleteConfirm[this.lang],
        content: ""
      }
    }).afterClosed().pipe(
      filter(result => result)
    ).subscribe(
      (result) => {
        const uid = this.user.state.currentUser!.uid

        this.wallet.deleteWallet(uid, id)
      }
    );
  }

  public async openSnackBar(type: string) {
    if (type == "import") {
      this.snackBar.open(this.translation.localNotFound[this.lang], undefined, { duration: 3000 });
    } else if (type == "plan") {
      this.snackBar.open(this.translation.unavailablePlan[this.lang], undefined, { duration: 3000 });
    }
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
