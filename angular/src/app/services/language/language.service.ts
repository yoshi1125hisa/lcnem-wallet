import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ReactiveService } from '../../classes/reactive-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends ReactiveService<State> {
  constructor() {
    super({
      twoLetter: window.navigator.language.substr(0, 2) == "ja" ? "ja" : "en"
    })
  }

  public setLanguage(twoLetter: string) {
    this._subject$.next({
      twoLetter: twoLetter,
      ...this._state
    })
  }
}

interface State {
  twoLetter: string
}