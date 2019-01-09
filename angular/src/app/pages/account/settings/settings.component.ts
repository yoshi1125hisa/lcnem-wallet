import { FormControl } from '@angular/forms'
import { Component, Inject, ViewChild, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LanguageService } from '../../../services/language/language.service';
import { StripeService } from '../../../services/api/stripe/stripe.service'
import { AuthService } from '../../../services/auth/auth.service';
import { RouterService } from '../../../services/router/router.service';
import { UserService } from '../../../services/user/user.service';
import { first, filter } from 'rxjs/operators';

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
    private auth: AuthService,
    private user: UserService,
    private _router: RouterService,
  ) { }

  ngOnInit() {
    this.load()
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

  public async load(refresh?: boolean) {
    console.log(this.auth.user);
    const user = await this.auth.user$.pipe(
      filter(user => user != null),
      first()
    ).toPromise()

    this.user.loadUser(user!.uid, refresh)
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