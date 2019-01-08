import { FormControl } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, Inject, ViewChild, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LanguageService } from '../../../services/language/language.service';
import { StripeService } from '../../../services/api/stripe/stripe.service'
import 'firebase/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth/auth.service';
import { RouterService } from '../../../services/router/router.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  searchTypeSelected!: string;
  searchTypes: string[] = ['free', 'standard'];
  

  constructor(
    private language: LanguageService,
    private stripeService: StripeService,
    private fbAuth: AngularFireAuth,
    private auth: AuthService,
    private firestore: AngularFirestore,
    private _router: RouterService,
  ) { }

  userId!: any;
  uid!: any;

  ngOnInit() {
    console.log(this.fbAuth.auth.currentUser);
    this.uid = this.fbAuth.auth.currentUser!.uid;
    this.userId = this.firestore.collection("users").doc(this.uid).ref.get().then(
      function (doc) {
        if (doc.data()!.plan !== "free") {
          return "standard"
        } else {
          return "free"
        }
      });
    console.log(this.userId)

  }

  public get lang() { return this.language.state.twoLetter }

  private dialog!: MatDialog;
mode = new FormControl("over");

@Input() formControl: any

  public openCheckout() {
  this.stripeService.charge();
}

  public back() {
  this._router.back([""])
}

  public translation = {
  setting: {
    en: "Setting",
    ja: "設定"
  } as any,
  plan: {
    en: "Plan",
    ja: "プラン選択"
  } as any,
  freeTitle: {
    en: "",
    ja: "Freeプラン"
  } as any,
  freeContent: {
    en: "",
    ja: "Freeプラン内容"
  } as any,
  standardTitle: {
    en: "",
    ja: "Standardプラン"
  } as any,
  standardContent: {
    en: "",
    ja: "Standardプラン内容"
  } as any,
}

}