import { AsyncReactiveService } from "./async-reactive-service";
import { EntityReactiveState } from "./entity-reactive-state";

export class EntityReactiveService<T extends EntityReactiveState<E>, E> extends AsyncReactiveService<T> {
  protected addEntity(id: string, entity: E) {
    const state: T = Object.assign(
      {},
      this._state
    )
    state.ids = [...state.ids]
    state.entities = { ...state.entities }

    state.ids.push(id)
    state.entities[id] = entity

    return state
  }

  protected updateEntity(id: string, entity: E) {
    const state: T = Object.assign(
      {},
      this._state
    )
    state.ids = [...state.ids]
    state.entities = { ...state.entities }

    state.entities[id] = entity

    return state
  }

  protected deleteEntity(id: string) {
    const state: T = Object.assign(
      {},
      this._state
    )
    state.ids = state.ids.filter(_id => _id !== id)
    state.entities = { ...state.entities }

    delete state.entities[id]

    return state
  }
}
