import * as functions from 'firebase-functions';

import {
  TransferTransaction,
  TimeWindow,
  Address,
  AssetId,
  AssetHttp,
  EmptyMessage,
  Account,
  TransactionHttp
} from 'nem-library';

export async function issue(nem: string, currency: "JPY", amount: number) {
  const assetHttp = new AssetHttp()
  const asset = await assetHttp.getAssetTransferableWithRelativeAmount(new AssetId("lc", currency.toLowerCase()), amount).toPromise()

  const transaction = TransferTransaction.createWithAssets(
    TimeWindow.createWithDeadline(),
    new Address(nem),
    [asset],
    EmptyMessage
  )

  const account = Account.createWithPrivateKey(functions.config().nem.private_key)
  const signed = account.signTransaction(transaction)

  const transactionHttp = new TransactionHttp()
  return await transactionHttp.announceTransaction(signed).toPromise()
}
