import { Component, OnInit, Inject } from '@angular/core';
import { lang } from 'src/models/lang';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {
  get lang() { return lang; }

  forms = {
    name: "",
    local: 0,
    import: 0,
    privateKey: "",
  }
  
  constructor(
  ) {
  }

  ngOnInit() {
  }

  translation = {
    create: {
      en: "Create a new wallet",
      ja: "新しいウォレットを作成"
    } as any,
    name: {
      en: "Name",
      ja: "名前"
    } as any,
    localOrCloud: {
      en: "",
      ja: "秘密鍵の管理"
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
      ja: "秘密鍵はこちらで保管します(初心者向け)。"
    } as any,
    localDescription: {
      en: "",
      ja: "秘密鍵はお客様管理となります(上級者向け)。リスクが低いです。"
    } as any
  }
}
