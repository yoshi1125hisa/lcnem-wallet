export interface User {
  plan?: {
    type: "Standard" | "Premium"
    expire: string
  }
  admin?: boolean
}
