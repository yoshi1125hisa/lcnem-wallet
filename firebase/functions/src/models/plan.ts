//Freeはundefinedで表現
export type PlanType = "null" | "Standard";

export interface Plan {
  type: PlanType
  year: number
  month: number
}
