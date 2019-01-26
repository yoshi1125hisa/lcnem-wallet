import * as admin from 'firebase-admin';

export interface CustodialTransaction {
  recipientId: string | "admin"
  amount: number
}

export function sendCustodialLightning(userId: string | "admin", recipientId: string | "admin", amount: number) {
  if (userId !== "admin") {
    admin.firestore().collection("users").doc(userId).collection("custodies").doc("lightning").collection("transactions").add(
      {
        recipientId: recipientId,
        amount: amount
      } as CustodialTransaction
    )
  }

  if(recipientId !== "admin") {
    admin.firestore().collection("users").doc(recipientId).collection("custodies").doc("lightning").collection("transactions").add(
      {
        recipientId: userId,
        amount: -1 * amount
      } as CustodialTransaction
    )
  }
}