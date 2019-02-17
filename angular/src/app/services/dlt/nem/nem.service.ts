import { Injectable } from '@angular/core';
import { XEM, AssetTransferable, AssetId, AccountHttp, Address, PlainMessage, SimpleWallet, Password, EncryptedMessage } from 'nem-library';
import { first, map, filter } from 'rxjs/operators';
import { nodes } from '../../../classes/nodes';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromWallet from '../../../services/user/wallet/wallet.reducer'
import * as fromBalance from '../../../services/dlt/nem/balance/balance.reducer'
import * as fromAssetDefinition from '../../../services/dlt/asset-definition/asset-definition.reducer'
import { LoadAssetDefinitions } from '../asset-definition/asset-definition.actions';

@Injectable({
  providedIn: 'root'
})
export class NemService {

  constructor(
    private auth: AuthService,
    private wallet$: Store<fromWallet.State>,
    private balance$: Store<fromBalance.State>,
    private assetDefinition$: Store<fromAssetDefinition.State>
  ) { }


  public async createAssetTransferable(
    assets: {
      id: string
      amount: number
    }[]
  ) {
    const assetIds = assets.map(
      (asset) => {
        const [namespace, name] = asset.id.split(":")
        return new AssetId(namespace, name)
      }
    )
    this.assetDefinition$.dispatch(new LoadAssetDefinitions({assets: assetIds}))
    

    const definitions = await this.assetDefinition$.pipe(
      filter(state => !state.loading),
      first(),
      map(state => state.definitions)
    ).toPromise()

    return assets.map(
      (asset) => {
        if (asset.id === "nem:xem") {
          return new XEM(asset.amount)
        }
        const definition = definitions.find(definition => definition.id.toString() === asset.id)!
        const amount = asset.amount * Math.pow(10, definition.properties.divisibility)

        return AssetTransferable.createWithAssetDefinition(definition, amount)
      }
    )
  }

  public async getAccount() {
    const user = await this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).toPromise()

    return await this.wallet$.pipe(
      map(state => state.entities[state.currentWalletId!].wallet),
      map(wallet => SimpleWallet.readFromWLT(wallet!).open(new Password(user!.uid))),
      first()
    ).toPromise()
  }

  public async createMessage(message: string, encryption: boolean, recipient?: string) {
    if (!encryption) {
      return PlainMessage.create(message)
    }

    if (!recipient) {
      throw Error()
    }

    const accountHttp = new AccountHttp(nodes)

    const publicAccount = await accountHttp.getFromAddress(new Address(recipient)).pipe(
      map(account => account.publicAccount)
    ).toPromise()

    if (!publicAccount || !publicAccount.hasPublicKey()) {
      throw Error()
    }

    const account = await this.getAccount()

    return account.encryptMessage(message, publicAccount)
  }
}
