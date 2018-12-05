import { Subject } from "rxjs";

export class RxStateStore<T> {
  private _subject$ = new Subject<T>()
  protected _state: T
  protected _state$ = this._subject$.asObservable()

  public get state() { return this._state }
  public get state$() { return this._state$ }

  constructor(state: T) {
    this._state = state
    this._subject$.next(this._state)
    this._state$.subscribe(
      (state) => {
        this._state = state
      }
    )
  }

  protected streamState(state: T) {
    this._subject$.next(state)
  }
}
