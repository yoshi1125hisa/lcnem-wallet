import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Asset, AssetDefinition } from 'nem-library';
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

let assetAdditionalDefinitions: AssetAdditionalDefinition[] = [
  {
    name: "nem:xem",
    issuer: "",
    unit: "XEM"
  },
  {
    name: "lc:jpy",
    issuer: "LCNEM, Inc.",
    unit: "JPY"
  },
  {
    name: "oshibori:point2019",
    issuer: "おしぼり.jp",
    unit: "JPY"
  },
  {
    name: "montoken:mot",
    issuer: "かえもん",
    unit: ""
  }
];

class AssetAdditionalDefinition {
  public name = "";
  public issuer = "";
  public unit = "";

  public static getImageUrl(name: string) {
    if (!assetAdditionalDefinitions.find(a => a.name == name)) {
      return "assets/data/mosaic.svg";
    }
    return "assets/data/" + name.replace(":", "/") + ".svg";
  }
}