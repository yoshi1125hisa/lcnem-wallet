import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GlobalDataService } from '../../../../app/services/global-data.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {
  forms = {
    local: 0,
    import: 0,
    privateKey: "",
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      content: string
    },
    public global: GlobalDataService
  ) { }

  ngOnInit() {
  }

  translation = {
    create: {

    } as any,
    cloud: {
      en: "Cloud",
      ja: "クラウド"
    } as any,
    local: {
      en: "Local",
      ja: "ローカル"
    } as any,
    generate: {
      en: "Generate",
      ja: "生成"
    } as any,
    import: {
      en: "Import",
      ja: "インポート"
    } as any,
    privateKey: {
      en: "Private key",
      ja: "秘密鍵"
    } as any,
    cloudDescription: {
      en: "",
      ja: "秘密鍵をこちらで保管します"
    } as any,
    localDescription: {
      en: "",
      ja: "秘密鍵は、お客様管理となります"
    } as any
  }
}
