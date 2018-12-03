import { ReactiveService } from "./reactive-service";
import { AsyncReactiveState } from "./async-reactive-state";

export class AsyncReactiveService<T extends AsyncReactiveState> extends ReactiveService<T> {
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
