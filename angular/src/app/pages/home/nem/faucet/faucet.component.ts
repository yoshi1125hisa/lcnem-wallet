import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
import { WalletService } from 'src/app/services/user/wallet/wallet.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css']
})
export class FaucetComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }
  private walletId = ""
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private language: LanguageService,
    private api: ApiService,
    private wallet: WalletService
  ) {
    this.wallet.state$.pipe(
      first()
    ).subscribe(
      (state) => {
        if (state.currentWalletId) {
          this.walletId = state.currentWalletId
        }
      }
    )
  }

  ngOnInit() {
  }

  public faucet() {
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true })
    this.api.faucet(
      {
        userId: this.auth.user!.uid,
        walletId: this.walletId
      }
    ).subscribe(
      () => {
        this.snackBar.open(this.translation.completed[this.lang], undefined, { duration: 6000 })
      },
      (error) => {
        this.snackBar.open(this.translation.error[this.lang], undefined, { duration: 6000 })
      },
      () => {
        dialog.close()
      }
    )
  }

  public translation = {
    completed: {
      en: "Competed",
      ja: "送金しました。"
    } as any,
    error: {
      en: "Error",
      ja: "エラー"
    } as any
  }

}
