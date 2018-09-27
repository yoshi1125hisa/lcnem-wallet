import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { Mosaic } from 'nem-library';
import { GlobalDataService } from '../../../services/global-data.service';
import { MosaicAdditionalDefinition } from '../../../../models/mosaic-additional-definition';
@Component({
  selector: 'app-assets-dialog',
  templateUrl: './assets-dialog.component.html',
  styleUrls: ['./assets-dialog.component.css']
})
export class AssetsDialogComponent {
  @ViewChild('selectionList') selectionList?: MatSelectionList;

  public mosaics: {
    name: string,
    imageUrl: string,
    issuer?: string,
  }[];

  constructor(
    public global: GlobalDataService,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      mosaics: Mosaic[],
      initialSelection: string[]
    }
  ) {
    this.mosaics = this.data.mosaics.map(m => {
      let name = m.mosaicId.namespaceId + ":" + m.mosaicId.name;
      let additionalDef = this.global.additionalDefinitions![name];
      return {
        name: name,
        imageUrl: additionalDef ? MosaicAdditionalDefinition.getImageUrl(name) : MosaicAdditionalDefinition.getImageUrl(),
        issuer: additionalDef && additionalDef.issuer,
      }
    });
  }

  public translation = {
    mosaic: {
      en: "Assets",
      ja: "アセット"
    }
  } as { [key: string]: { [key: string]: string } };
}
