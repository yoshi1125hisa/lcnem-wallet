import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TransferTransaction, Asset, AssetTransferable, XEM } from 'nem-library';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.css']
})
export class TransferDialogComponent {
  get lang() { return this.language.twoLetter; }
  
  public transaction: TransferTransaction;
  public assets: Asset[];
  public fee: Asset[];
  public levy: Asset[];
  public Math = Math;

  constructor(
    private store: Store<State>,
    private language: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: {
      transaction: TransferTransaction
      message: string
    }
  ) {
    this.transaction = data.transaction as TransferTransaction;
    this.assets = this.transaction.mosaics();
    this.fee = [new XEM(this.transaction.fee / 1000000)];
    this.levy = [];

    /*
    let definition = await this.balance.readDefinition(assetId);

      let absolute = asset.amount! * Math.pow(10, definition.properties.divisibility);

      if (definition.levy) {
        if (definition.levy.type == AssetLevyType.Absolute) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee));
        } else if (definition.levy.type == AssetLevyType.Percentil) {
          levy.push(new Asset(definition.levy.assetId, definition.levy.fee * absolute / 10000));
        }
      }

      transferAssets.push(AssetTransferable.createWithAssetDefinition(definition, absolute));
    */
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
