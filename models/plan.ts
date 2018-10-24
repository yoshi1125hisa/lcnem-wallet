//Freeはundefinedで表現
export type PlanType = "Standard" | "Premium";

export interface Plan {
  type: PlanType;
  year: number;
  month: number;
}
