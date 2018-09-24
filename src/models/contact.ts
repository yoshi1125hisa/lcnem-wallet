import { firestore } from 'firebase';

export interface Contact {
  userId: string,
  createdAt: firestore.Timestamp
}