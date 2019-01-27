import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { Address, Wallet } from 'nem-library';
import { LanguageService } from '../../../../services/language/language.service';
import { MultisigService } from '../../../../services/dlt/nem/multisig/multisig.service';
import { WalletService } from '../../../../services/user/wallet/wallet.service';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter; }

  public loading$ = combineLatest(
    this.wallet.state$,
    this.wallet.state$
  ).pipe(
    map(fork => fork[0].loading || fork[1].loading)
  )

  public state$ = this.multisig.state$

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
    this.wallet.state$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).subscribe(
      (state) => {
        const address = new Address(state.entities[state.currentWalletId!].nem)
        this.multisig.loadMultisig(address, refresh)
      }
    )
  }

  public onClick(address: string) {
  }

  public translation = {
    cosignatoryOf: {
      en: "Multisig addresses you can cosign",
      ja: "連署名できるマルチシグアドレス"
    } as any,
    empty: {
      en: "There is no multisig address.",
      ja: "マルチシグアドレスはありません。"
    } as any
  }
}
