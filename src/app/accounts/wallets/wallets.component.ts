import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public loading = true;

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.auth.authState.subscribe(async (user) => {
      if (user == null) {
        this.router.navigate(["accounts", "login"]);
        return;
      }
    });
  }

  public translation = {
    wallets: {
      en: "Wallets",
      ja: "ウォレット"
    } as any
  }
}
