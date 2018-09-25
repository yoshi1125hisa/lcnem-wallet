import { firestore } from 'firebase';

export interface User {
  wallet: string,
  name: string,
  nem: string,
  cosmos: string,
  createdAt: firestore.Timestamp
}