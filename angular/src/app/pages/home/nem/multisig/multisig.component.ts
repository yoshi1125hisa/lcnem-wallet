import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address, Wallet } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { MultisigService } from '../../../../services/nem/multisig/multisig.service';
import { WalletService } from '../../../../services/wallet/wallet.service';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public loading$ = this.multisig.state$.pipe(map(state => state.loading))
  public multisigs$ = this.multisig.state$.pipe(map(state => state.addresses))

  constructor(
    private language: LanguageService,
    private wallet: WalletService,
    private multisig: MultisigService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    const address = new Address(this.wallet.state.entities[this.wallet.state.currentWalletId!].nem)
    this.multisig.loadMultisig(address, refresh)
  }

  public onClick(address: string) {
  }

  public translation = {
    empty: {
      en: "There is no multisig address.",
      ja: "マルチシグアドレスはありません。"
    }
  }
}
