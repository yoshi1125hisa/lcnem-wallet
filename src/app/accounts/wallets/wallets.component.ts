import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';
import { Wallet } from '../../../models/wallet';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public loading = true;
  public wallets: Wallet[];

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private auth: AngularFireAuth
  ) {
    this.wallets = global.account.wallets;
  }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
      await this.refresh();
    });
  }

  async refresh() {
    this.loading = true;

    if(!this.global.refreshed) {
      await this.global.refresh();
    }

    this.loading = false;
  }

  public translation = {
    wallets: {
      en: "Wallets",
      ja: "ウォレット"
    } as any
  }
}
