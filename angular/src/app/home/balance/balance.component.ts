import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { State } from '../../store/index'
import { LanguageService } from '../../services/language.service';
import { Asset } from 'nem-library';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  public loading$: Observable<boolean>;
  public assets$: Observable<Asset[]>;

  constructor(
    private store: Store<State>,
    private language: LanguageService
  ) {
    this.loading$ = this.store.select(state => state.nemBalance.loading);
    this.assets$ = this.store.select(state => state.nemBalance.assets);
  }

  ngOnInit() {
    this.load();
  }

  public load(refresh?: boolean) {

  }
}
