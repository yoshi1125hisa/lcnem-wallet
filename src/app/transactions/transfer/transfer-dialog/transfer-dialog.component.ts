import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TransferTransaction, Mosaic, MosaicTransferable } from 'nem-library';
import { GlobalDataService } from '../../../services/global-data.service';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.css']
})
export class TransferDialogComponent {
  public transaction: TransferTransaction;
  public mosaics: Mosaic[];
  public Math = Math;

  constructor(
    public global: GlobalDataService,
    @Inject(MAT_DIALOG_DATA) public data: {
      transaction: TransferTransaction
      message: string
    }
  ) {
    this.transaction = data.transaction as TransferTransaction;
    this.mosaics = this.transaction.mosaics();
  }

  public translation = {
    confirmation: {
      en: "Are you sure?",
      ja: "送信しますか？"
    },
    encryption: {
      en: "Encryption",
      ja: "暗号化"
    },
    amount: {
      en: "Amount",
      ja: "送信量"
    },
    fee: {
      en: "Blockchain fee",
      ja: "ブロックチェーン手数料"
    },
    message: {
      en: "Message",
      ja: "メッセージ"
    }
  };
}
