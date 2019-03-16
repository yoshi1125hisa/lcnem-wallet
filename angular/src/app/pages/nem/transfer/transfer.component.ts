import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Address,
  TransferTransaction,
  Asset,
  TimeWindow,
  TransactionHttp,
  SignedTransaction
} from 'nem-library';
import { Observable, of, from, combineLatest } from 'rxjs';
import { mergeMap, first, map, filter } from 'rxjs/operators';
import { LanguageService } from '../../../services/language/language.service';
import { Invoice } from '../../../classes/invoice';
import { RouterService } from '../../../services/router/router.service';
import { ShareService } from '../../../services/api/share/share.service';
import { nodes } from '../../../classes/nodes';
import { TransferDialogComponent } from '../../../components/transfer-dialog/transfer-dialog.component';
import { LoadingDialogComponent } from '../../../components/loading-dialog/loading-dialog.component';
import { NemService } from '../../../services/dlt/nem/nem.service';
import { Store } from '@ngrx/store';
import { LoadBalances } from '../../../services/dlt/nem/balance/balance.actions';
import { State } from '../../../services/reducer';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public get lang() { return this.language.code; }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _router: RouterService,
    private language: LanguageService,
    private store: Store<State>,
    private nem: NemService,
    private share: ShareService
  ) {
  }

  public forms = {
    recipient: '',
    message: '',
    encryption: false,
    transferAssets: [] as {
      id: string,
      amount?: number,
      balance$: Observable<Asset>
    }[]
  };

  public wallet$ = this.store.select(state => state.wallet);
  public balance$ = this.store.select(state => state.balance);

  public loading$ = combineLatest(
    this.wallet$,
    this.balance$
  ).pipe(
    map(([wallet, balance]) => wallet.loading || balance.loading)
  );

  public assets$ = this.balance$.pipe(map(state => state.assets));

  public translation = {
    recipient: {
      en: 'Recipient',
      ja: '宛先'
    } as any,
    address: {
      en: 'NEM address',
      ja: 'NEMアドレス'
    } as any,
    importRequired: {
      en: 'Importing the private key is required.',
      ja: '秘密鍵のインポートが必要です。'
    } as any,
    addressRequired: {
      en: 'Correct address is required.',
      ja: 'アドレスを正しく入力してください。'
    } as any,
    namespace: {
      en: 'NEM namespace',
      ja: 'NEMネームスペース'
    } as any,
    message: {
      en: 'Message',
      ja: 'メッセージ'
    } as any,
    encryption: {
      en: 'Encryption',
      ja: '暗号化'
    } as any,
    assets: {
      en: 'Assets for transfer',
      ja: '送信するアセット'
    } as any,
    assetName: {
      en: 'Asset name',
      ja: 'アセット名'
    } as any,
    amount: {
      en: 'Amount',
      ja: '量'
    } as any,
    balance: {
      en: 'Balance',
      ja: '残高'
    } as any,
    share: {
      en: 'Create an invoice without transfer',
      ja: '送信せずに請求書を作る'
    } as any,
    transfer: {
      en: 'Transfer',
      ja: '送信'
    } as any,
    error: {
      en: 'Error',
      ja: 'エラー'
    } as any,
    completed: {
      en: 'Completed. Please confirm later that the transaction be confirmed by blockchain.',
      ja: '送信しました。ブロックチェーンに承認されたことを確認してください。'
    } as any,
    noPublicKey: {
      en: 'Failed to get the recipient public key for encryption.',
      ja: '暗号化のための宛先の公開鍵取得に失敗しました。'
    } as any,
    copyCompleted: {
      en: 'Copied',
      ja: 'コピーしました'
    } as any
  };

  ngOnInit() {
    this.load();
  }

  public async load() {
    const state = await this.wallet$.pipe(
      filter(state => state.currentWalletId !== undefined),
      first()
    ).toPromise();

    this.store.dispatch(new LoadBalances({ address: new Address(state.entities[state.currentWalletId!].nem) }));

    const invoice = this.route.snapshot.queryParamMap.get('invoice') || '';
    const invoiceData = Invoice.parse(decodeURI(invoice));

    if (invoiceData) {
      this.forms.recipient = invoiceData.data.addr;
      this.forms.message = invoiceData.data.msg;

      if (invoiceData.data.assets) {
        for (const asset of invoiceData.data.assets) {
          this.addTransferAsset(asset.id, asset.amount);
        }
      }
    }
  }

  public back() {
    this._router.back(['']);
  }

  public addTransferAsset(id: string, amount?: number) {
    if (!id) {
      return;
    }
    if (this.forms.transferAssets.find(asset => asset.id === id)) {
      return;
    }
    this.forms.transferAssets.push(
      {
        id: id,
        amount: amount,
        balance$: this.balance$.pipe(
          mergeMap(state => from(state.assets)),
          filter(asset => asset.assetId.toString() === id)
        )
      }
    );
  }

  public deleteTransferAsset(index: number) {
    this.forms.transferAssets.splice(index, 1);
  }

  public shareInvoice() {
    const invoice = new Invoice();
    invoice.data.addr = this.forms.recipient;
    invoice.data.msg = this.forms.message;
    invoice.data.assets = this.forms.transferAssets.map(
      (asset) => {
        return { id: asset.id, amount: asset.amount || 0 };
      }
    );

    const url = location.href + '?invoice=' + encodeURI(invoice.stringify());

    if (!(navigator as any).share) {
      this.share.copy(url);
      this.snackBar.open(this.translation.copyCompleted[this.lang], undefined, { duration: 6000 });
      return;
    }
    this.share.share(url, 'LCNEM Wallet');
  }

  public async transfer() {
    const account = await this.nem.getAccount().catch(
      () => {
        this.snackBar.open(this.translation.importRequired[this.lang], undefined, { duration: 6000 });
        throw Error();
      }
    );
    const message = await this.nem.createMessage(this.forms.message, this.forms.encryption, this.forms.recipient).catch(
      () => {
        this.snackBar.open(this.translation.noPublicKey[this.lang], undefined, { duration: 6000 });
        throw Error();
      }
    );
    const transaction = TransferTransaction.createWithAssets(
      TimeWindow.createWithDeadline(),
      new Address(this.forms.recipient!),
      await this.nem.createAssetTransferable(this.forms.transferAssets.map(asset => ({ id: asset.id, amount: asset.amount || 0 }))),
      message
    );

    const result = await this.dialog.open(
      TransferDialogComponent,
      {
        data: {
          transaction: transaction,
          message: this.forms.message
        }
      }
    ).afterClosed().toPromise();

    if (!result) {
      return;
    }

    const signed = account.signTransaction(transaction);
    this.announceTransaction(signed);
  }

  public announceTransaction(signed: SignedTransaction) {
    const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    const transactionHttp = new TransactionHttp(nodes);
    transactionHttp.announceTransaction(signed).subscribe(
      () => {
        this.snackBar.open(this.translation.completed[this.lang], undefined, { duration: 6000 });
        this.router.navigate(['']);
      },
      (error) => {
        this.snackBar.open(this.translation.error[this.lang], undefined, { duration: 6000 });
      },
      () => {
        dialog.close();
      }
    );
  }
}
