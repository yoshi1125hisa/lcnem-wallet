import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Asset, AssetDefinition } from 'nem-library';
import { assetAdditionalDefinitions, AssetAdditionalDefinition } from '../../../models/asset-additional-definition';
import { BalanceService } from '../../services/balance.service';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  @Input() public title?: string;
  @Input() public assets?: Asset[];
  
  public _assets = new Array<{
    name: string,
    amount: number,
    imageUrl: string,
    issuer?: string,
    unit?: string
  }>();

  constructor(
    private balance: BalanceService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  public async refresh() {
    if (!this.assets) {
      return;
    }

    await Promise.all(this.assets.map(asset => this.balance.readDefinition(asset.assetId.namespaceId + ":" + asset.assetId.name)));
    
    for(let asset of this.assets) {
      let id = asset.assetId.namespaceId + ":" + asset.assetId.name;

      let definition = await this.balance.readDefinition(id);

      let additionalDefinition = assetAdditionalDefinitions.find(a => a.name == id);

      this._assets!.push({
        name: id,
        amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
        imageUrl: AssetAdditionalDefinition.getImageUrl(id),
        issuer: additionalDefinition && additionalDefinition.issuer,
        unit: additionalDefinition && additionalDefinition.unit
      });
    }
  }
}
