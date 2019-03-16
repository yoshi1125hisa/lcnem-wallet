import { Component, OnInit } from '@angular/core';
import { map, mergeMap, first, filter } from 'rxjs/operators';
import { LanguageService } from '../../../services/language/language.service';
import { Invoice } from '../../../classes/invoice';
import { ShareService } from '../../../services/api/share/share.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { State } from '../../../services/reducer';

@Component({
  selector: 'app-nem',
  templateUrl: './nem.component.html',
  styleUrls: ['./nem.component.css']
})
export class NemComponent implements OnInit {
  public get lang() { return this.language.code; }

  constructor(
    private language: LanguageService,
    private auth: AuthService,
    private store: Store<State>,
    private share: ShareService
  ) {
  }

  public wallet$ = this.store.select(state => state.wallet);

  public loading$ = this.wallet$.pipe(map(state => state.loading));

  public email$ = this.auth.user$.pipe(
    filter(user => user !== null),
    map(user => user!.email)
  );

  public address$ = this.wallet$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!].nem)
  );

  public qrUrl$ = this.wallet$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!]),
    map(
      (currentWallet) => {
        const invoice = new Invoice();
        invoice.data.addr = currentWallet.nem;
        return 'https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=' + encodeURI(invoice.stringify());
      }
    )
  );

  public translation = {
    transfer: {
      en: 'Transfer',
      ja: '送信'
    } as any,
    scan: {
      en: 'Scan QR',
      ja: 'QRスキャン'
    } as any,
    yourAddress: {
      en: 'Your address',
      ja: 'あなたのアドレス'
    } as any,
    copy: {
      en: 'Copy this Address',
      ja: 'アドレスをコピーする'
    } as any,
    orderCheque: {
      en: 'Deposit',
      ja: '入金'
    } as any,
    orderClearance: {
      en: 'Withdraw',
      ja: '出金'
    } as any
  };

  ngOnInit() {
  }

  public async copyAddress() {
    const wallet = await this.wallet$.pipe(first()).toPromise();
    this.share.copy(wallet.entities[wallet.currentWalletId!].nem);
  }

  public prettifyAddress(address: string) {
    return address.match(/.{1,6}/g)!.join('-');
  }
}
