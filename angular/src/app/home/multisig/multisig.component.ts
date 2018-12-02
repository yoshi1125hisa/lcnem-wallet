import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { State } from '../../store/index'
import { LanguageService } from '../../services/language.service';
import { Address } from 'nem-library';
import { first } from 'rxjs/operators';
import { LoadMultisigs } from '../../store/nem/multisig/multisig.actions';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public get lang() { return this.language.twoLetter; }
  
  public loading$: Observable<boolean>;
  public multisigs$: Observable<Address[]>;

  constructor(
    private store: Store<State>,
    private language: LanguageService
  ) {
    this.loading$ = this.store.select(state => state.NemMultisig.loading);
    this.multisigs$ = this.store.select(state => state.NemMultisig.multisigs);
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {
    this.store.select(state => state.wallet).pipe(first()).subscribe(
      (wallet) => {
        this.store.dispatch(
          new LoadMultisigs(
            {
              address: new Address(wallet.entities[wallet.currentWallet!].nem)
            }
          )
        );
      }
    )
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
