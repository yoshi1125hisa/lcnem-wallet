import { Component, OnInit, Input } from '@angular/core';
import { MultisigService } from '../../services/multisig.service';
import { lang } from '../../../models/lang';
import { WalletsService } from '../../services/wallets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public loading = true;
  public addresses: string[] = [];

  get lang() { return lang; }

  @Input("refresh") refreshHome!: (force?: boolean) => void;

  constructor(
    private multisig: MultisigService,
    private wallet: WalletsService,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.refresh();
  }

  public async refresh(force?: boolean) {
    this.loading = true;
    await this.multisig.readMultisigAccounts(force);
    this.addresses = this.multisig.addresses!.map(a => a.plain());

    this.loading = false;
  }

  public async onClick(address: string) {
    this.wallet.wallets!["multisig"] = {
      name: "",
      local: true,
      nem: address,
      wallet: undefined
    }

    this.wallet.updateCurrentWallet("multisig");
    await this.refreshHome(true);
  }

  public translation = {
    empty: {
      en: "There is no multisig address.",
      ja: "マルチシグアドレスはありません。"
    }
  }
}
