import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Asset } from 'nem-library';
import { GlobalDataService } from '../../services/global-data.service';
import { MosaicAdditionalDefinition } from '../../../models/mosaic-additional-definition';

@Component({
  selector: 'app-mosaic-list',
  templateUrl: './mosaic-list.component.html',
  styleUrls: ['./mosaic-list.component.css']
})
export class MosaicListComponent implements OnInit {
  @Input() public title?: string;
  @Input() public mosaics?: Asset[];
  
  public _mosaics = new Array<{
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
    if (!this.mosaics) {
      return;
    }
    for (let i = 0; i < this.mosaics.length; i++) {
      try {
        let name = this.mosaics[i].assetId.namespaceId + ":" + this.mosaics[i].assetId.name;
        let def = this.global.definitions![name];
        if (!def) {
          def = await this.global.assetHttp.getAssetDefinition(this.mosaics[i].assetId).toPromise();
        }
        let additionalDef = this.global.additionalDefinitions![name];

        this._mosaics!.push({
          name: name,
          amount: this.mosaics[i].quantity / Math.pow(10, def.properties.divisibility),
          imageUrl: additionalDef ? MosaicAdditionalDefinition.getImageUrl(name) : MosaicAdditionalDefinition.getImageUrl(),
          issuer: additionalDef && additionalDef.issuer,
          unit: additionalDef && additionalDef.unit
        });
      } catch {

      }
    }
  }
}
