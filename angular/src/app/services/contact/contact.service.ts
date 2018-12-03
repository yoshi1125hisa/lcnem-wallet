import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from '../../../../../firebase/functions/src/models/contact';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private subject = new Subject<{
    loading: boolean
    error: Error
    ids: string[]
    contacts: { [id: string]: Contact }
  }>();
  public state$ = this.subject.asObservable();

  constructor(
    private firestore: AngularFirestore
  ) { }
}
