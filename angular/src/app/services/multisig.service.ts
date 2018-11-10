import { Injectable } from '@angular/core';
import { Address, Transaction, AccountHttp } from 'nem-library';
import { WalletsService } from './wallets.service';
import { nodes } from '../../models/nodes';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MultisigService {
  public addresses?: Address[];

  constructor(
    private wallet: WalletsService
  ) {
    wallet.multisig = this;
  }

  public initialize() {
    this.addresses = undefined;
  }

  public async readMultisigAccounts(force?: boolean) {
    if(this.addresses && !force) {
      return;
    }
    if(!this.wallet.currentWallet) {
      return;
    }

    let accountHttp = new AccountHttp(nodes);
    let address = new Address(this.wallet.wallets![this.wallet.currentWallet!].nem);

    this.addresses = await accountHttp.status(address).pipe(
      map(value => value.cosignatoryOf.map(c => c.publicAccount!.address))
    ).toPromise();
  }
}
