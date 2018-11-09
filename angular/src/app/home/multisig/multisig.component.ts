import { Component, OnInit } from '@angular/core';
import { MultisigService } from '../../services/multisig.service';
import { Address } from 'nem-library';
import { lang } from '../../../models/lang';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.component.html',
  styleUrls: ['./multisig.component.css']
})
export class MultisigComponent implements OnInit {
  public loading = true;
  public addresses: string[] = [];

  get lang() { return lang; }

  constructor(
    private multisig: MultisigService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  public async refresh(force?: boolean) {
    this.loading = true;
    await this.multisig.readMultisigAccounts(force);
    this.addresses = this.multisig.addresses.map(a => a.plain());

    this.loading = false;
  }

  public async onClick(address: string) {
    let a = new Address(address);
  }

  public translation = {
    empty: {
      en: "There is no multisig address.",
      ja: "マルチシグアドレスはありません。"
    }
  }
}
