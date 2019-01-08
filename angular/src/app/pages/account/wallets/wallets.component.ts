import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
import { PromptDialogComponent } from '../../../components/prompt-dialog/prompt-dialog.component';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { WalletCreateDialogComponent } from './wallet-create-dialog/wallet-create-dialog.component';

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

  public plan$ = this.user.state$.pipe(
    filter(state => !!state.user),
    map(state => state.user!),
    map(user => user.plan)
  )
  public state$ = this.wallet.state$;

  public clouds$ = this.state$.pipe(
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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _router: RouterService,
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private wallet: WalletService,
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

  public addWallet() {
    this.dialog.open(WalletCreateDialogComponent).afterClosed().pipe(
      filter(result => result),
    ).subscribe(
      (result) => {
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
    );
  }

  public enterWallet(id: string) {
    this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).subscribe(
      (state) => {
        this.router.navigate([""])
      }
    )
    this.wallet.setCurrentWallet(id);
  }

  public importPrivateKey(id: string) {
    this.dialog.open(
      PromptDialogComponent,
      {
        data: {
          title: this.translation.importPrivateKey[this.lang],
          input: {
            placeholder: this.translation.privateKey[this.lang],
            pattern: "[0-9a-f]{64}"
          }
        }
      }
    ).afterClosed().pipe(
      filter(pk => pk)
    ).subscribe(
      (pk) => {
        const uid = this.auth.user!.uid
        const wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), pk)

        this.wallet.addLocalWallet(id, wallet.writeWLTFile())
      }
    );
  }

  public renameWallet(id: string) {
    const wallet = this.wallet.state.entities[id];

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
        this.wallet.updateWallet(this.auth.user!.uid, id, { ...wallet, name })
      }
    )
  }

  public backupWallet(id: string) {
    const wallet = SimpleWallet.readFromWLT(this.wallet.state.entities[id].wallet!);
    const account = wallet.open(new Password(this.auth.user!.uid));

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
        this.wallet.deleteWallet(this.auth.user!.uid, id)
      }
    );
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
