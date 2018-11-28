import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SimpleWallet, Password } from 'nem-library';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { AlertDialogComponent } from '../../../app/components/alert-dialog/alert-dialog.component';
import { PromptDialogComponent } from '../../../app/components/prompt-dialog/prompt-dialog.component';
import { ConfirmDialogComponent } from '../../../app/components/confirm-dialog/confirm-dialog.component';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { Plan } from '../../../../../firebase/functions/src/models/plan';
import { LanguageService } from '../../services/language.service';
import { State } from '../../store/index'
import { LoadWallets, UpdateWallet, DeleteWallet, AddWallet, SetCurrentWallet } from '../../store/wallet/wallet.actions';
import { AddLocalWallet } from '../../store/local-wallet/local-wallet.actions';
import { Navigate } from 'src/app/store/router/router.actions';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public loading$: Observable<boolean>;
  public wallets$: Observable<Dictionary<Wallet>>;
  public walletIds$: Observable<(string | number)[]>;
  public clouds$: Observable<number>;
  public plan?: Plan;
  public get lang() { return this.language.twoLetter; }

  constructor(
    private store: Store<State>,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private language: LanguageService
  ) {
    this.loading$ = store.select(state => state.wallet.loading);
    this.wallets$ = store.select(state => state.wallet.entities);

    this.walletIds$ = store.select(state => state.wallet.ids).pipe(
      map((ids: (string | number)[]) => ids.filter(id => id != "multisig"))
    )
    this.clouds$ = this.walletIds$.pipe(
      mergeMap(
        ids => from(ids)
      ),
      mergeMap(
        id =>
        this.wallets$.pipe(
          map(
            wallets => wallets[id]
          )
        )
      ),
      toArray(),
      map(wallets => wallets.filter(wallet => !wallet.local).length)
    )
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) { // refreshの導入をする必要あり？
    const uid = this.auth.auth.currentUser!.uid;
    this.store.dispatch(new LoadWallets({userId: uid}))
  }

  addWallet() {
    const uid = this.auth.auth.currentUser!.uid;
    let simpleWallet: SimpleWallet;

    this.dialog.open(CreateDialogComponent).afterClosed().subscribe(
      result => {
        if (!result) {
          return;
        }
        if (result.import) {
          simpleWallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), result.privateKey);
        } else {
          simpleWallet = SimpleWallet.create(uid, new Password(uid));
        }

        const wallet: Wallet = {
          name: result.name,
          local: result.local == 1 ? true : false,
          nem: simpleWallet.address.plain(),
          wallet: simpleWallet.writeWLTFile()
        };

        this.store.dispatch(new AddWallet({userId: uid, wallet}))
      }
    );
  }

  public enterWallet(id: string) {
    this.wallets$.pipe(
      map(
        wallets => wallets[id]
      ),
      map(
        wallet => {
          if (wallet) {
            return;
          }
          if (id != "multisig") {
            localStorage.setItem("currentWallet", id);
          }
          this.store.dispatch(new SetCurrentWallet({id}))
          this.store.dispatch(new Navigate({ commands: [""] }))
        }
      )
      // TODO: this.balance.initialize(); とかをngrxに置き換えて実装
    )
  }

  public importPrivateKey(id: string) {
    const uid = this.auth.auth.currentUser!.uid;
    this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.importPrivateKey[this.lang],
        input: {
          placeholder: this.translation.privateKey[this.lang],
          pattern: "[0-9a-f]{64}"
        }
      }
    }).afterClosed().subscribe(
      pk => {
        if (!pk) {
          return;
        }

        const wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), pk);
        this.store.dispatch(new AddLocalWallet({id: id, wallet: wallet.writeWLTFile()}))
      }
    );
  }

  public renameWallet(id: string) {
    this.wallets$.pipe(
      map(
        wallets => wallets[id]
      ),
      map(
        wallet => {
          this.dialog.open(PromptDialogComponent, {
            data: {
              title: this.translation.rename[this.lang],
              input: {
                placeholder: this.translation.walletName[this.lang],
                value: wallet.name
              }
            }
          }).afterClosed().subscribe(
            name => {
              if (!name) {
                return;
              }
              this.store.dispatch(new UpdateWallet({
                userId: this.auth.auth.currentUser!.uid,
                id,
                wallet: {...wallet, name}
              }))
            }
          );
        }
      )
    )
  }

  public backupWallet(id: string) {
    const uid = this.auth.auth.currentUser!.uid;
    this.wallets$.pipe(
      map(
        wallets => wallets[id]
      ),
      map(
        targetWallet => {
          if (!targetWallet || !targetWallet.wallet) {
            return
          }

          const wallet = SimpleWallet.readFromWLT(targetWallet.wallet!);
          const account = wallet.open(new Password(uid));

          this.dialog.open(AlertDialogComponent, {
            data: {
              title: this.translation.backup[this.lang],
              content: account.privateKey
            }
          });
        }
      )
    )
  }

  public deleteWallet(id: string) {
    const uid = this.auth.auth.currentUser!.uid;

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.deleteConfirm[this.lang],
        content: ""
      }
    }).afterClosed().subscribe(
      result => {
        if (!result) {
          return;
        }
        this.store.dispatch(new DeleteWallet({userId: uid, id: id}))
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
