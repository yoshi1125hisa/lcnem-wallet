import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, first, filter } from 'rxjs/operators';
import { LanguageService } from '../../../services/language/language.service';
import { WalletService } from '../../../services/wallet/wallet.service';
import { Invoice } from '../../../classes/invoice';
import { ShareService } from '../../../services/api/share/share.service';

@Component({
  selector: 'app-nem',
  templateUrl: './nem.component.html',
  styleUrls: ['./nem.component.css']
})
export class NemComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public address$ = this.wallet.state$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!].nem)
  )

  public qrUrl$ = this.wallet.state$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!]),
    map(currentWallet => {
      const invoice = new Invoice();
      invoice.data.addr = currentWallet.nem;
      return "https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=" + encodeURI(invoice.stringify());
    })
  )

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private share: ShareService
  ) {
  }

  ngOnInit() {
  }

  public copyAddress() {
    this.share.copy(this.wallet.state.entities[this.wallet.state.currentWalletId!].nem)
  }
  
  public translation = {
    balance: {
      en: "Balance",
      ja: "残高"
    } as any,
    history: {
      en: "History",
      ja: "履歴"
    } as any,
    yourAddress: {
      en: "Your address",
      ja: "あなたのアドレス"
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
