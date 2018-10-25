import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { SimpleWallet, Password } from 'nem-library';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AnyKindOfDictionary } from 'lodash';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Plan } from '../../../../../firebase/functions/src/models/plan';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  public loading = true;
  public wallets!: Wallet[];
  public plan?: Plan;
  public clouds = 0;

  constructor(
    public global: GlobalDataService,
    private router: Router,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
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

  async refresh(force?: boolean) {
    this.loading = true;

    localStorage.removeItem("currentWallet");

    await this.global.refresh(force);

    this.wallets = this.global.account.wallets.concat();
    this.clouds = this.wallets.filter(w => !w.local).length;

    let localWallets = this.global.account.localWallets;
    let length = localWallets.length;

    for (let i = length - 1; i >= 0; i--) {
      let simpleWallet = SimpleWallet.readFromWLT(localWallets[i]);
      let sameWallet = this.wallets.find(w => w.nem == simpleWallet.address.plain());
      if (sameWallet) {
        sameWallet.wallet = localWallets[i];
      } else {
        localWallets.splice(i, 1);
      }
    }
    if (length != localWallets.length) {
      localStorage.setItem("wallets", JSON.stringify(this.global.account.localWallets));
    }

    this.plan = this.global.account.plan;

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

      //アドレス重複対策
      if (this.wallets.find(w => w.nem == wallet.address.plain())) {
        return;
      }
    } else {
      wallet = SimpleWallet.create(uid, new Password(uid));
    }

    let firestoreObject: Wallet = {
      name: result.name,
      local: result.local == 1 ? true: false,
      nem: wallet.address.plain()
    };

    if (result.local) {
      this.global.account.localWallets.push(wallet.writeWLTFile());
      localStorage.setItem("wallets", JSON.stringify(this.global.account.localWallets));
    } else {
      firestoreObject.wallet = wallet.writeWLTFile();
    }

    await this.firestore.collection("users").doc(uid).collection("wallets").add(firestoreObject);

    await this.refresh(true);
  }

  public async enterWallet(index: number) {
    await this.global.changeWallet(index);
    this.router.navigate([""]);
  }

  public async importPrivateKey() {
    let pk = await this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.importPrivateKey[this.global.lang],
        input: {
          placeholder: this.translation.privateKey[this.global.lang],
          pattern: "[0-9a-f]{64}"
        }
      }
    }).afterClosed().toPromise();

    if(!pk) {
      return;
    }

    let uid = this.auth.auth.currentUser!.uid;
    let wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), pk);
    this.global.account.localWallets.push(wallet.writeWLTFile());
    localStorage.setItem("wallets", JSON.stringify(this.global.account.localWallets));

    await this.refresh(true);
  }

  public async renameWallet(index: number) {
    let name = await this.dialog.open(PromptDialogComponent, {
      data: {
        title: this.translation.rename[this.global.lang],
        input: {
          placeholder: this.translation.walletName[this.global.lang],
          value: this.wallets[index].name
        }
      }
    }).afterClosed().toPromise();

    if(!name) {
      return;
    }

    let uid = this.auth.auth.currentUser!.uid;
    let nem = this.wallets[index].nem;

    let wallet = await this.firestore.collection("users").doc(uid).collection("wallets").ref.where("nem", "==", nem).get();
    await wallet.docs[0].ref.set({
      name: name
    }, {
      merge: true
    })

    await this.refresh(true);
  }

  public async backupWallet(index: number) {
    let wallet = SimpleWallet.readFromWLT(this.wallets[index].wallet!);
    let account = wallet.open(new Password(this.auth.auth.currentUser!.uid));

    await this.dialog.open(AlertDialogComponent, {
      data: {
        title: this.translation.backup[this.global.lang],
        content: account.privateKey
      }
    });
  }

  public async deleteWallet(index: number) {
    let result = await this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translation.deleteConfirm[this.global.lang],
        content: ""
      }
    }).afterClosed().toPromise();

    if (!result) {
      return;
    }

    let uid = this.auth.auth.currentUser!.uid;
    let nem = this.wallets[index].nem;

    let wallet = await this.firestore.collection("users").doc(uid).collection("wallets").ref.where("nem", "==", nem).get();
    await wallet.docs[0].ref.delete();

    await this.refresh(true);
  }

  public async openSnackBar(type: "import" | "plan") {
    if(type == "import") {
      this.snackBar.open(this.translation.localNotFound[this.global.lang], undefined, { duration: 3000 });
    } else if (type == "plan") {
      this.snackBar.open(this.translation.unavailablePlan[this.global.lang], undefined, { duration: 3000 });
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
