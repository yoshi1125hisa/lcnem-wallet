export interface CustodialTransaction {
  userId: string | "admin"
  recipientId: string | "admin"
  amount: number
}

export function sendCustodialLightning(userId: string | "admin", recipientId: string | "admin", amount: number) {
  
}