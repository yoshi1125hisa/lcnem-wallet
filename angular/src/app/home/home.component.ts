import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { Asset, NEMLibrary, NetworkTypes } from 'nem-library';
import { Store } from '@ngrx/store';
import { State } from '../store/index'
import { Invoice } from '../models/invoice';
import { Logout } from '../store/user/user.actions';
import { LoadBalances } from '../store/nem/balance/balance.actions';
import { LoadWallets } from '../store/wallet/wallet.actions';
import { Observable, of } from 'rxjs';
import { map, mergeMap, first } from 'rxjs/operators';
import { Wallet } from '../store/wallet/wallet.model';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public language = "";
  public photoUrl$: Observable<string>;
  public currentWallet$: Observable<Wallet>;
  public qrUrl$: Observable<string>;
  public assets$: Observable<Asset[]>;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private auth: AngularFireAuth
  ) {
    this.store.select(state => state.language).subscribe(
      language => {
        this.language = language.twoLetter;
      }
    )

    this.photoUrl$ = this.auth.authState.pipe(
      first(),
      map(authState => authState && authState.photoURL ? authState.photoURL : "")
    )

    this.currentWallet$ = this.store.select(state => state.wallet.currentWallet).pipe(
      mergeMap(id => id ? this.store.select(state => state.wallet.entities[id]) : of())
    );

    this.qrUrl$ = this.currentWallet$.pipe(
      map(currentWallet => {
        let invoice = new Invoice();
        invoice.data.addr = currentWallet.nem;
        return "https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=" + encodeURI(invoice.stringify());
      })
    )

    this.assets$ = this.store.select(state => state.nem.balance.assets);
  }

  ngOnInit() {
    this.load();
  }

  public async logout() {
    this.store.dispatch(new Logout());
  }

  public load(refresh?: boolean) {
    this.store.dispatch(new LoadWallets());
    this.store.dispatch(new LoadBalances());
  }

  copyMessage(val: string) {
    Share.copyMessage(val);
  }

  public translation = {
    balance: {
      en: "Balance",
      ja: "残高"
    } as any,
    language: {
      en: "Language",
      ja: "言語"
    } as any,
    wallets: {
      en: "Change the wallet",
      ja: "ウォレットの切り替え"
    } as any,
    logout: {
      en: "Log out",
      ja: "ログアウト"
    } as any,
    transfer: {
      en: "Transfer",
      ja: "送信"
    } as any,
    scan: {
      en: "Scan QR-code",
      ja: "QRコードをスキャン"
    } as any,
    history: {
      en: "History",
      ja: "履歴"
    } as any,
    deposit: {
      en: "Deposit",
      ja: "入金"
    } as any,
    withdraw: {
      en: "Withdraw",
      ja: "出金"
    } as any,
    yourAddress: {
      en: "Your address",
      ja: "あなたのアドレス"
    } as any,
    terms: {
      en: "Terms of Service",
      ja: "利用規約"
    } as any,
    privacyPolicy: {
      en: "Privacy Policy",
      ja: "プライバシーポリシー"
    } as any,
    completed: {
      en: "Successfully logged out",
      ja: "正常にログアウトしました。"
    } as any,
    copy: {
      en: "Copy this Address",
      ja: "アドレスをコピーする"
    } as any,
    contacts: {
      en: "Contact list",
      ja: "コンタクトリスト"
    } as any,
    cosignatoryOf: {
      en: "Multisig addresses you can cosign",
      ja: "連署名できるマルチシグアドレス"
    } as any
  };
}
