export interface EntityReactiveState<T> {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: T }
}