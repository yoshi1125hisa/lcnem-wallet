import { RxStateStore } from "./rx-state-store";
import { RxEffectiveState } from "./rx-effective-state";

export class RxEffectiveStateStore<T extends RxEffectiveState> extends RxStateStore<T> {
  protected load() {
    const state: T = Object.assign(
      {
        loading: true,
        error: undefined
      },
      this._state
    )

    this._subject$.next(state)
  }

  protected error(error: Error) {
    const state: T = Object.assign(
      {
        loading: false,
        error: error
      },
      this._state
    )

    this._subject$.next(state)
  }
}
