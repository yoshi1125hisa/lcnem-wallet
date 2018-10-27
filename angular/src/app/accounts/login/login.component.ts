import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase';
import 'firebase/auth';
import { User } from '../../../../../firebase/functions/src/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { back } from 'src/models/back';
import { lang, setLang } from 'src/models/lang';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loading = true;

  get lang() { return lang; }
  set lang(value: string) { setLang(value); }
  public agree = false;
  public safeSite: SafeResourceUrl;

  constructor(
    public router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    sanitizer: DomSanitizer
  ) {
    this.safeSite = sanitizer.bypassSecurityTrustResourceUrl(`assets/terms/terms/${this.lang}.txt`);
  }

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.router.navigate([""]);
        return;
      }
      this.loading = false;
    });
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public async login() {
    await this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider);
    
    let uid = this.auth.auth.currentUser!.uid;
    let user = await this.firestore.collection("users").doc(uid).ref.get();

    if (!user.exists) {
      await user.ref.set({
        name: this.auth.auth.currentUser!.displayName
      } as User);
    }
    this.router.navigate([""]);
  }

  public translation = {
    agree: {
      en: "I agree.",
      ja: "同意します"
    } as any,
    login: {
      en: "Log in",
      ja: "ログイン"
    } as any
  };
}
