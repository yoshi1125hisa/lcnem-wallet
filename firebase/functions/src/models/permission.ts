import { Timestamp } from "@google-cloud/firestore";

export interface Permission {
  userId: string
  walletId: string
  accessToken: string
  refreshToken: string
  expire: Timestamp
}