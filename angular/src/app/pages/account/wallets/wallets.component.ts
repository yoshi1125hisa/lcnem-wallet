import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SimpleWallet, Password } from 'nem-library';
import { Router } from '@angular/router';
import { from, combineLatest } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';
import { LanguageService } from '../../../services/language/language.service';
import { AuthService } from '../../../services/auth/auth.service';
import { WalletCreateDialogComponent } from './wallet-create-dialog/wallet-create-dialog.component';
import { ShareService } from '../../../services/api/share/share.service';
import { Store } from '@ngrx/store';
import { LoadUser } from '../../../services/user/user.actions';
import { LoadWallets, AddWallet, SetCurrentWallet, UpdateWallet, AddLocalWallet, DeleteWallet } from '../../../services/user/wallet/wallet.actions';
import { State } from '../../../services/reducer';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public get lang() { return this.language.code; }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private language: LanguageService,
    private auth: AuthService,
    private store: Store<State>,
    private share: ShareService
  ) {
  }

  public user$ = this.store.select(state => state.user);

  public wallet$ = this.store.select(state => state.wallet);

  public loading$ = combineLatest(
    this.auth.user$,
    this.wallet$
  ).pipe(
    map(([auth, wallet]) => !auth || wallet.loading)
  );

  public translation = {
    wallets: {
      en: 'Wallets',
      ja: 'ウォレット'
    } as any,
    rename: {
      en: 'Rename',
      ja: '名前を変更'
    } as any,
    backup: {
      en: 'Back up',
      ja: 'バックアップ'
    } as any,
    delete: {
      en: 'Delete',
      ja: '削除'
    } as any,
    importPrivateKey: {
      en: 'Import your private key',
      ja: '秘密鍵をインポート'
    } as any,
    privateKey: {
      en: 'Private key',
      ja: '秘密鍵'
    } as any,
    walletName: {
      en: 'Wallet name',
      ja: 'ウォレット名'
    } as any,
    deleteConfirm: {
      en: 'Are you sure to delete the wallet?',
      ja: 'ウォレットを削除しますか？'
    } as any,
    addWallet: {
      en: 'Add a wallet',
      ja: 'ウォレットを追加'
    } as any,
    localNotFound: {
      en: 'The private key is not imported so some functions which require the private key are not available.',
      ja: '秘密鍵がインポートされていないため、秘密鍵が必要な一部の機能が制限されます。'
    } as any,
    unavailablePlan: {
      en: 'More than one private key in Free plan is not supported.',
      ja: 'Freeプランでは、複数のクラウド秘密鍵はサポートされていません。'
    } as any
  };

  ngOnInit() {
    this.load();
  }

  public async load(refresh?: boolean) {
    const user = await this.auth.user$.pipe(
      filter(user => user != null),
      first()
    ).toPromise();

    this.store.dispatch(new LoadUser({ userId: user!.uid, refresh: refresh }));
    this.store.dispatch(new LoadWallets({ userId: user!.uid, refresh: refresh }));
  }

  public async addWallet() {
    const result = await this.dialog.open(WalletCreateDialogComponent).afterClosed().toPromise();

    if (!result) {
      return;
    }
    const uid = this.auth.user!.uid;

    const simpleWallet = result.import
      ? SimpleWallet.createWithPrivateKey(uid, new Password(uid), result.privateKey)
      : SimpleWallet.create(uid, new Password(uid));

    const wallet: Wallet = {
      name: result.name,
      local: result.local == 1 ? true : false,
      nem: simpleWallet.address.plain(),
      wallet: simpleWallet.writeWLTFile()
    };

    this.store.dispatch(new AddWallet({userId: uid, wallet: wallet}));
  }

  public async enterWallet(id: string) {
    this.store.dispatch(new SetCurrentWallet({walletId: id}));

    await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise();

    this.router.navigate([''], { queryParamsHandling: 'preserve' });
  }

  public importPrivateKey(id: string) {
    const pk = window.prompt(this.translation.importPrivateKey[this.lang]);
    if (!pk || !pk.match('[0-9a-f]{64}')) {
      return;
    }

    const uid = this.auth.user!.uid;
    const wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), pk);

    this.store.dispatch(new AddLocalWallet({walletId: id, wallet: wallet}));
  }

  public async renameWallet(id: string) {
    const wallet = await this.wallet$.pipe(first()).toPromise();

    const name = window.prompt(this.translation.rename[this.lang], wallet.entities[id].name);

    if (!name) {
      return;
    }

    this.store.dispatch(new UpdateWallet({userId: this.auth.user!.uid, walletId: id, wallet: { ...wallet.entities[id], name }}));
  }

  public async backupWallet(id: string) {
    const wallet = await this.wallet$.pipe(first()).toPromise();
    const simpleWallet = SimpleWallet.readFromWLT(wallet.entities[id].wallet!);
    const account = simpleWallet.open(new Password(this.auth.user!.uid));

    this.share.copy(account.privateKey);

    this.snackBar.open(this.translation.backup[this.lang], undefined, { duration: 6000 });
  }

  public deleteWallet(id: string) {
    const result = window.confirm(this.translation.deleteConfirm[this.lang]);
    if (!result) {
      return;
    }

    this.store.dispatch(new DeleteWallet({userId: this.auth.user!.uid, walletId: id}));
  }
}
