import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../../services/language/language.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { RouterService } from '../../../../services/router/router.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  constructor(
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
    private _router: RouterService,
  ) { }
  public get lang() { return this.language.state.twoLetter }

  ngOnInit() {
    this.load()
  }

  public back() {
    this._router.back([""])
  }

  public async load(refresh?: boolean) {
  }
  
  public translation = {
    plan: {
      en: "Plan",
      ja: "プラン"
    } as any,
    change: {
      en: "Change plan",
      ja: "プラン変更"
    } as any
  }
}
