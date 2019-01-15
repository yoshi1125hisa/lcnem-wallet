export interface User {
  plan?: {
    type: "Standard" | "Premium"
    expireYear: number
    expireMonth: number
    expireDay: number
  }
  admin?: boolean
}
