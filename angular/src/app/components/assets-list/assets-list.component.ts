import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { Asset, AssetDefinition, XEM } from 'nem-library';
import { Observable, from } from 'rxjs';
import { map, mergeMap, filter, toArray, take, subscribeOn } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { AssetDefinitionService } from '../../services/nem/asset-definition/asset-definition.service';
import { RateService } from '../../services/rate/rate.service';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  public get lang() { return this.language.state.twoLetter }

  @Input() public title?: string
  @Input() public assets?: Asset[]
  @Input() nav = false

  @Output() clickAsset = new EventEmitter()

  public loading$ = this.assetDefinition.state$.pipe(map(state => state.loading))
  public currency$ = this.rate.state$.pipe(map(state => state.currency))
  public assets$: Observable<{
    name: string
    amount: number
    imageURL: string
    issuer?: string
    unit?: string
    rate?: number
    symbol?: string
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

    this.assets$ = from(this.assets).pipe(
      mergeMap(
        (asset) => {
          return this.assetDefinition.state$.pipe(
            map(state => state.definitions),
            mergeMap(definitions => from(definitions)),
            filter(definition => definition.id.equals(asset.assetId)),
            take(1),
            map(
              (definition) => {
                this.rate.state$.pipe(
                  map(
                    (rate) => {
                      const additionaldefinition = this.assetAdditionalDefinitions.find(a => a.name === name) || {}
                      const name = asset.assetId.toString()
                      return {
                        ...additionaldefinition,
                        name: name,
                        amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
                        imageURL: this.getImageURL(name),
                        rate: rate.rate["XEM"],
                        symbol: "XEM"
                      }
                    }
                  ),
                )
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
    this.load()
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
    currency: {
      en: "Currency",
      ja: "通貨"
    } as any
  };
}
