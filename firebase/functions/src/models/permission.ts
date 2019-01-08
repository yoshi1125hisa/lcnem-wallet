import { Timestamp } from "@google-cloud/firestore";

export interface Permission {
  clientToken: string
  accessToken: string
  refreshToken: string
  expire: Timestamp
}