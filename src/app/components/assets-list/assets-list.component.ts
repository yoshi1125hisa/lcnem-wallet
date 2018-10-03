import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Asset } from 'nem-library';
import { GlobalDataService } from '../../services/global-data.service';
import { AssetAdditionalDefinition } from '../../../models/asset-additional-definition';

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

  constructor(public global: GlobalDataService) { }

  ngOnInit() {
    this.initialize();
  }

  public async initialize() {
    if (!this.assets) {
      return;
    }
    for (let i = 0; i < this.assets.length; i++) {
      try {
        let name = this.assets[i].assetId.namespaceId + ":" + this.assets[i].assetId.name;
        let def = this.global.definitions![name];
        if (!def) {
          def = await this.global.assetHttp.getAssetDefinition(this.assets[i].assetId).toPromise();
        }
        let additionalDef = this.global.additionalDefinitions![name];

        this._assets!.push({
          name: name,
          amount: this.assets[i].quantity / Math.pow(10, def.properties.divisibility),
          imageUrl: additionalDef ? AssetAdditionalDefinition.getImageUrl(name) : AssetAdditionalDefinition.getImageUrl(),
          issuer: additionalDef && additionalDef.issuer,
          unit: additionalDef && additionalDef.unit
        });
      } catch {

      }
    }
  }
}
