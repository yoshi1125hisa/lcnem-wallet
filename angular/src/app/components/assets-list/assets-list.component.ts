import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { Asset, AssetDefinition, XEM } from 'nem-library';
import { Observable, from, combineLatest, of } from 'rxjs';
import { map, mergeMap, filter, toArray, take, first } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { AssetDefinitionService } from '../../services/nem/asset-definition/asset-definition.service';
import { RateService } from '../../services/rate/rate.service';
import { Tuple } from '../../classes/tuple';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  get lang() { return this.language.state.twoLetter }

  @Input() public title?: string
  @Input() public assets?: Asset[]
  @Input() nav = false

  @Output() clickAsset = new EventEmitter()

  public quoteCurrency$ = this.rate.state$.pipe(map(state => state.currency))
  public assets$: Observable<{
    name: string
    amount: number
    imageURL: string
    issuer?: string
    unit?: string
    rate?: number
    unitRate?: number
  }[]> = new Observable()



  constructor(
    private rate: RateService,
    private language: LanguageService,
    private assetDefinition: AssetDefinitionService
  ) {

  }


  ngOnInit() {
    this.load()
  }

  public load() {
    if (!this.assets) {
      return
    }
    this.assetDefinition.loadAssetDefinitions(this.assets.map(asset => asset.assetId))
    this.rate.loadRate()

    this.assets$ = combineLatest(
      of(this.assets),
      this.rate.state$.pipe(
        filter(state => state.loading == false),
        first()
      ),
      this.assetDefinition.state$.pipe(
        filter(state => state.loading == false),
        map(state => state.definitions),
        first()
      )
    ).pipe(
      mergeMap(
        ([assets, rate, definitions]) => {
          return from(assets).pipe(
            map(asset => Tuple(asset, definitions.find(d => d.id.equals(asset.assetId))!)),
            map(
              ([asset, definition]) => {
                const name = asset.assetId.toString()
                const additionalDefinition = this.assetAdditionalDefinitions.find(a => a.name === name) || { name: "", issuer: "", unit: "" }
                const unitRate = rate.rate[rate.currency] && rate.rate[additionalDefinition.unit] / rate.rate[rate.currency]
                const amount = asset.quantity / Math.pow(10, definition.properties.divisibility)
                return {
                  ...additionalDefinition,
                  name: name,
                  amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
                  imageURL: this.getImageURL(name),
                  rate: amount * unitRate,
                  unitRate: unitRate
                }
              }
            )
          )
        }
      ),
      toArray()
    )
  }

  public getImageURL(name: string) {
    if (!this.assetAdditionalDefinitions.find(a => a.name == name)) {
      return "assets/data/mosaic.svg";
    }
    return "assets/data/" + name.replace(":", "/") + ".svg";
  }

  public changeCurrency(currency: string) {
    this.rate.changeCurrency(currency)
  }

  public readonly assetAdditionalDefinitions = [
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

  public translation = {
    quoteCurrency: {
      en: "Currency",
      ja: "通貨変更"
    } as any
  };
}
