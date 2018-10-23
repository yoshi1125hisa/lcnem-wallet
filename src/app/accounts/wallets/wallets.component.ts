import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';
import { Wallet } from '../../../../models/wallet';
import { SimpleWallet } from 'nem-library';
import { MatDialog } from '@angular/material';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';

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
    private auth: AngularFireAuth,
    private dialog: MatDialog
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

    await this.global.refresh();

    this.wallets = this.global.account.wallets;

    for (let localWallet of this.global.account.localWallets) {
      let simpleWallet = SimpleWallet.readFromWLT(localWallet);
      let sameWallet = this.wallets.find(w => w.nem == simpleWallet.address.plain());
      if (sameWallet) {
        sameWallet.wallet = localWallet;
      }
    }

    this.loading = false;
  }

  changeWallet(index: number) {
    this.global.changeWallet(index);
    this.router.navigate([""]);
  }

  async addWallet() {
    let result = await this.dialog.open(CreateDialogComponent, {
      data: {

      }
    }).afterClosed().toPromise();
  }

  enterWallet(index: number) {
    
  }

  backupWallet(index: number) {

  }

  deleteWallet(index: number) {

    localStorage.removeItem("currentWallet");
  }

  public translation = {
    wallets: {
      en: "Wallets",
      ja: "ウォレット"
    } as any,
    backup: {
      en: "Back up",
      ja: "バックアップ"
    } as any,
    delete: {
      en: "Delete",
      ja: "削除"
    } as any,

  }
}
