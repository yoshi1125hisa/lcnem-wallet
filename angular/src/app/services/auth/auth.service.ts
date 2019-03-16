import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public get user() { return this.auth.auth.currentUser; }
  public get user$() { return this.auth.authState; }

  constructor(
    private auth: AngularFireAuth
  ) {}

  public login() {
    return this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider);
  }

  public logout() {
    return this.auth.auth.signOut();
  }
}
