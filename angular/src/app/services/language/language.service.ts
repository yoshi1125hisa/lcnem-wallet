import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RxStateStore } from '../../classes/rx-state-store';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends RxStateStore<State> {
  constructor() {
    super(
      {
        twoLetter: window.navigator.language.substr(0, 2) == "ja" ? "ja" : "en"
      }
    )
  }

  public setLanguage(twoLetter: string) {
    this.streamState(
      {
        twoLetter: twoLetter,
        ...this._state
      }
    )
  }
}

interface State {
  twoLetter: string
}