import { Component, OnInit, Input, Output } from '@angular/core';
import { Wallet } from '../../../../../../../firebase/functions/src/models/wallet';
import { EventEmitter } from 'events';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  @Input() lang = ""
  @Input() wallet: Wallet = {} as any

  @Output() enter = new EventEmitter()
  @Output() backup = new EventEmitter()
  @Output() rename = new EventEmitter()
  @Output() delete = new EventEmitter()
  @Output() import = new EventEmitter()

  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  public openSnackBar(type: string) {
    if (type == "import") {
      this.snackBar.open(this.translation.localNotFound[this.lang], undefined, { duration: 3000 });
    }
  }

  public translation = {
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
    localNotFound: {
      en: "The private key is not imported so some functions which require the private key are not available.",
      ja: "秘密鍵がインポートされていないため、秘密鍵が必要な一部の機能が制限されます。"
    } as any
  }
}
