import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Asset, AssetDefinition } from 'nem-library';
import { GlobalDataService } from '../../services/global-data.service';
import { assetAdditionalDefinitions, AssetAdditionalDefinition } from '../../../models/asset-additional-definition';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  @Input() public assets?: Asset[];
  
  public _assets = new Array<{
    name: string,
    amount: number,
    imageUrl: string,
    issuer?: string,
    unit?: string
  }>();

  constructor(public global: GlobalDataService) { }

  ngOnInit() {
    this.initialize();
  }

  public async initialize() {
    if (!this.assets) {
      return;
    }
    for(let asset of this.assets) {
      let name = asset.assetId.namespaceId + ":" + asset.assetId.name;
      let definitions = this.global.account.currentWallet.assets.filter(a => a.name == name).map(a => a.definition);
      if (!definitions.length) {
        definitions = [await this.global.assetHttp.getAssetDefinition(asset.assetId).toPromise()];
      }
      let definition = definitions[0];

      let additionalDefinition = assetAdditionalDefinitions.find(a => a.name == name);

      this._assets!.push({
        name: name,
        amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
        imageUrl: AssetAdditionalDefinition.getImageUrl(name),
        issuer: additionalDefinition && additionalDefinition.issuer,
        unit: additionalDefinition && additionalDefinition.unit
      });
    }
  }
}
