import { Injectable } from '@angular/core';
import { Asset, AssetDefinition, AccountHttp, AssetHttp, PublicAccount, XEM, AssetId } from 'nem-library';
import { nodes } from 'src/models/nodes';
import { WalletsService } from './wallets.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  public assets?: Asset[];
  public definitions: {
    [id: string]: AssetDefinition
  } = {};

  constructor(
    private wallet: WalletsService
  ) { }

  public async readAssets(force?: boolean) {
    if(!this.wallet.currentWallet) {
      return;
    }
    if(this.assets && !force) {
      return;
    }

    let accountHttp = new AccountHttp(nodes);
    this.assets = await accountHttp.getAssetsOwnedByAddress(this.wallet.currentWallet.address).toPromise();
  }

  public async readDefinition(id: string, force?: boolean) {
    if(!this.wallet.currentWallet) {
      throw Error();
    }
    if(this.definitions[id] && !force) {
      return this.definitions[id];
    }

    if (id == "nem:xem") {
      this.definitions[id] = {
        creator: new PublicAccount(),
        id: XEM.MOSAICID,
        description: "",
        properties: {
          divisibility: XEM.DIVISIBILITY,
          initialSupply: XEM.INITIALSUPPLY,
          supplyMutable: XEM.SUPPLYMUTABLE,
          transferable: XEM.TRANSFERABLE
        }
      }
    } else {
      let assetHttp = new AssetHttp(nodes);
      let splited = id.split(":");
      let assetId = new AssetId(splited[0], splited[1])
      this.definitions[id] = await assetHttp.getAssetDefinition(assetId).toPromise();
    }

    return this.definitions[id];
  }
}
