import { firestore } from 'firebase';

export interface User {
  name: string,
  nem: string,
  cosmos: string,
  createdAt: firestore.Timestamp,
  secret?: any
}