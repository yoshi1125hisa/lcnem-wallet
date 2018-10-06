import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { Asset } from 'nem-library';
import { GlobalDataService } from '../../../services/global-data.service';
import { AssetAdditionalDefinition } from '../../../../models/asset-additional-definition';
@Component({
  selector: 'app-assets-dialog',
  templateUrl: './assets-dialog.component.html',
  styleUrls: ['./assets-dialog.component.css']
})
export class AssetsDialogComponent {
  @ViewChild('selectionList') selectionList?: MatSelectionList;

  public assets: {
    name: string,
    imageUrl: string,
    issuer?: string,
  }[];

  constructor(
    public global: GlobalDataService,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      assets: Asset[],
      initialSelection: string[]
    }
  ) {
    this.assets = this.data.assets.map(asset => {
      let name = asset.assetId.namespaceId + ":" + asset.assetId.name;
      let additionalDef = this.global.additionalDefinitions![name];
      return {
        name: name,
        imageUrl: additionalDef ? AssetAdditionalDefinition.getImageUrl(name) : AssetAdditionalDefinition.getImageUrl(),
        issuer: additionalDef && additionalDef.issuer,
      }
    });
  }

  public translation = {
    assets: {
      en: "Assets",
      ja: "アセット"
    } as any
  };
}
