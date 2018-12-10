import { Injectable } from '@angular/core';
import { RxStateStore } from 'rx-state-store-js'

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