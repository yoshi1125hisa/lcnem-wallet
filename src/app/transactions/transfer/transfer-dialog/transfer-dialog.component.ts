import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TransferTransaction, Asset, AssetTransferable } from 'nem-library';
import { GlobalDataService } from '../../../services/global-data.service';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.css']
})
export class TransferDialogComponent {
  public transaction: TransferTransaction;
  public assets: Asset[];
  public levy: Asset[];
  public Math = Math;

  constructor(
    public global: GlobalDataService,
    @Inject(MAT_DIALOG_DATA) public data: {
      transaction: TransferTransaction
      message: string,
      levy: Asset[]
    }
  ) {
    this.transaction = data.transaction as TransferTransaction;
    this.assets = this.transaction.mosaics();
    this.levy = data.levy;
  }

  public translation = {
    confirmation: {
      en: "Are you sure?",
      ja: "送信しますか？"
    } as any,
    encryption: {
      en: "Encryption",
      ja: "暗号化"
    } as any,
    amount: {
      en: "Amount",
      ja: "送信量"
    } as any,
    fee: {
      en: "Blockchain fee",
      ja: "ブロックチェーン手数料"
    } as any,
    message: {
      en: "Message",
      ja: "メッセージ"
    } as any,
    levy: {
      en: "Levy",
      ja: "徴収"
    } as any
  };
}
