import { RxEffectiveStateStore } from "./rx-effective-state-store";
import { RxEntityState } from "./rx-entity-state";

export class RxEntityStateStore<T extends RxEntityState<E>, E> extends RxEffectiveStateStore<T> {
  protected getEntityAddedState(id: string, entity: E) {
    const state: T = {
      ...this._state as any
    }
    state.ids = [...state.ids]
    state.entities = { ...state.entities }

    state.ids.push(id)
    state.entities[id] = entity

    return state
  }

  protected getEntityUpdatedState(id: string, entity: E) {
    const state: T = {
      ...this._state as any
    }
    state.ids = [...state.ids]
    state.entities = { ...state.entities }

    state.entities[id] = entity

    return state
  }

  protected getEntityDeletedState(id: string) {
    const state: T = {
      ...this._state as any
    }
    state.ids = state.ids.filter(_id => _id !== id)
    state.entities = { ...state.entities }

    delete state.entities[id]

    return state
  }
}
