import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SimpleWallet, Password } from 'nem-library';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { AlertDialogComponent } from '../../../app/components/alert-dialog/alert-dialog.component';
import { PromptDialogComponent } from '../../../app/components/prompt-dialog/prompt-dialog.component';

import { ConfirmDialogComponent } from '../../../app/components/confirm-dialog/confirm-dialog.component';
import { WalletsService } from '../../../app/services/wallets.service';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { Plan } from '../../../../../firebase/functions/src/models/plan';
import { lang } from '../../../models/lang';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public loading = true;
  get lang() { return lang; }
  public wallets!: {
    [id: string]: Wallet
  };
  public walletIds: string[] = [];
  public plan?: Plan;
  public clouds = 0;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private user: UserService,
    private wallet: WalletsService
  ) {
  }

  ngOnInit() {
    this.user.checkLogin().then(async () => {
      await this.refresh();
    });
  }

  async refresh(force?: boolean) {
    this.loading = true;

    await this.wallet.readWallets(force);
    this.wallets = this.wallet.wallets!;
    this.walletIds = Object.keys(this.wallet.wallets!);
    this.clouds = 0;
    for(let id of this.walletIds) {
      if(!this.wallets[id].local) {
        this.clouds++;
      }
    }

    this.loading = false;
  }

  async addWallet() {
    let result = await this.dialog.open(CreateDialogComponent).afterClosed().toPromise();

    if (!result) {
      return;
    }
    let uid = this.auth.auth.currentUser!.uid;

    let wallet: SimpleWallet;

    if (result.import) {
      wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), result.privateKey);
    } else {
      wallet = SimpleWallet.create(uid, new Password(uid));
    }

    let firestoreObject: Wallet = {
      name: result.name,
      local: result.local == 1 ? true: false,
      nem: wallet.address.plain(),
      wallet: wallet.writeWLTFile()
    };

    await this.wallet.createWallet(firestoreObject);

    await this.refresh(true);
  }

  public async enterWallet(id: string) {
    this.wallet.updateCurrentWallet(id);
    this.router.navigate([""]);
  }

  public async importPrivateKey(id: string) {
    let pk = await this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.importPrivateKey[this.lang],
        input: {
          placeholder: this.translation.privateKey[this.lang],
          pattern: "[0-9a-f]{64}"
        }
      }
    }).afterClosed().toPromise();

    if(!pk) {
      return;
    }

    this.wallet.importPrivateKey(id, pk);
  }

  public async renameWallet(id: string) {
    let name = await this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.rename[this.lang],
        input: {
          placeholder: this.translation.walletName[this.lang],
          value: this.wallet.wallets![id].name
        }
      }
    }).afterClosed().toPromise();

    if(!name) {
      return;
    }

    await this.wallet.updateWallet(id, { name: name });
  }

  public async backupWallet(id: string) {
    let pk = this.wallet.backupPrivateKey(id);

    await this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.backup[this.lang],
        content: pk
      }
    });
  }

  public async deleteWallet(id: string) {
    let result = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.deleteConfirm[this.lang],
        content: ""
      }
    }).afterClosed().toPromise();

    if (!result) {
      return;
    }

    await this.wallet.deleteWallet(id);

    await this.refresh();
  }

  public async openSnackBar(type: string) {
    if(type == "import") {
      this.snackBar.open(this.translation.localNotFound[this.lang], undefined, { duration: 3000 });
    } else if (type == "plan") {
      this.snackBar.open(this.translation.unavailablePlan[this.lang], undefined, { duration: 3000 });
    }
  }

  public translation = {
    wallets: {
      en: "Wallets",
      ja: "ウォレット"
    } as any,
    rename: {
      en: "Rename",
      ja: "名前を変更"
    } as any,
    backup: {
      en: "Back up",
      ja: "バックアップ"
    } as any,
    delete: {
      en: "Delete",
      ja: "削除"
    } as any,
    importPrivateKey: {
      en: "Import your private key",
      ja: "秘密鍵をインポート"
    } as any,
    privateKey: {
      en: "Private key",
      ja: "秘密鍵"
    } as any,
    walletName: {
      en: "Wallet name",
      ja: "ウォレット名"
    } as any,
    deleteConfirm: {
      en: "Are you sure to delete the wallet?",
      ja: "ウォレットを削除しますか？"
    } as any,
    addWallet: {
      en: "Add a wallet",
      ja: "ウォレットを追加"
    } as any,
    localNotFound: {
      en: "The private key is not imported so some functions which require the private key are not available.",
      ja: "秘密鍵がインポートされていないため、秘密鍵が必要な一部の機能が制限されます。"
    } as any,
    unavailablePlan: {
      en: "More than one private key in Free plan is not supported.",
      ja: "Freeプランでは、複数のクラウド秘密鍵はサポートされていません。"
    } as any
  }
}
