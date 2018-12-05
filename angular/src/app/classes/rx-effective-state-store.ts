import { RxStateStore } from "./rx-state-store";
import { RxEffectiveState } from "./rx-effective-state";

export class RxEffectiveStateStore<T extends RxEffectiveState> extends RxStateStore<T> {
  protected streamLoadingState() {
    const state: T = {
      ...this._state as any,
      loading: true,
      error: undefined
    } 

    this.streamState(state)
  }

  protected streamErrorState(error: Error) {
    const state: T = {
      ...this._state as any,
      loading: false,
      error: error
    }

    this.streamState(state)
  }
}
