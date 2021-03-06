import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Wallet } from '../../../../../../../firebase/functions/src/models/wallet';
import { LanguageService } from '../../../../services/language/language.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  public get lang() { return this.language.code; }

  constructor(
    private snackBar: MatSnackBar,
    private language: LanguageService
  ) { }

  @Input() wallet?: Wallet;

  @Output() enter = new EventEmitter();
  @Output() backup = new EventEmitter();
  @Output() rename = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() import = new EventEmitter();

  public translation = {
    rename: {
      en: 'Rename',
      ja: '名前を変更'
    } as any,
    backup: {
      en: 'Back up',
      ja: 'バックアップ'
    } as any,
    delete: {
      en: 'Delete',
      ja: '削除'
    } as any,
    importPrivateKey: {
      en: 'Import your private key',
      ja: '秘密鍵をインポート'
    } as any,
    localNotFound: {
      en: 'The private key is not imported so some functions which require the private key are not available.',
      ja: '秘密鍵がインポートされていないため、秘密鍵が必要な一部の機能が制限されます。'
    } as any
  };

  ngOnInit() {
  }


  public openSnackBar(type: string) {
    if (type == 'import') {
      this.snackBar.open(this.translation.localNotFound[this.lang], undefined, { duration: 6000 });
    }
  }
}
