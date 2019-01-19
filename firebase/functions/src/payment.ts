import {
  SignedTransaction,
  TransactionHttp,
  TransactionTypes,
  TransferTransaction
} from "nem-library";

export async function payment(signedTransaction: SignedTransaction, currency: "JPY") {
  const transactionHttp = new TransactionHttp()
  const result = await transactionHttp.announceTransaction(signedTransaction).toPromise()

  const transaction = await transactionHttp.getByHash(result.transactionHash.data || "").toPromise()
  if (transaction.type !== TransactionTypes.TRANSFER) {
    throw Error()
  }

  const transferTransaction = transaction as TransferTransaction
  if (!transferTransaction.containAssets()) {
    throw Error()
  }

  if (transferTransaction.recipient.plain() !== "NDTZECV7NU5QANKTVUHWLTSYTNZIQNJKAVNTC54U") {
    throw Error()
  }

  const assets = transferTransaction.assets()
  const asset = assets.find(asset => asset.assetId.toString() === `lc:${currency.toLowerCase()}`)
  if (!asset) {
    throw Error()
  }

  return asset.quantity / 1000
}