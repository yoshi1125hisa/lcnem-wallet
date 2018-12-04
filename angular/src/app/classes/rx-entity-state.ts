export interface RxEntityState<T> {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: T }
}