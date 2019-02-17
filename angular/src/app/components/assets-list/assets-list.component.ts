import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Asset } from 'nem-library';
import { Observable, from, combineLatest, of } from 'rxjs';
import { map, mergeMap, filter, toArray, first } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { Tuple } from '../../classes/tuple';
import * as fromAssetDefinition from '../../services/dlt/asset-definition/asset-definition.reducer'
import * as fromRate from '../../services/rate/rate.reducer'
import { Store } from '@ngrx/store';
import { LoadAssetDefinitions } from '../../services/dlt/asset-definition/asset-definition.actions';
import { LoadRates } from '../../services/rate/rate.actions';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  get lang() { return this.language.code }

  @Input() public title?: string
  @Input() public assets?: Asset[]
  @Input() nav = false

  @Output() clickAsset = new EventEmitter()

  public quoteCurrency$ = this.rate$.pipe(map(state => state.currency))
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
    private language: LanguageService,
    private rate$: Store<fromRate.State>,
    private assetDefinition$: Store<fromAssetDefinition.State>
  ) {

  }

  ngOnInit() {
    this.load()
  }

  public load() {
    if (!this.assets) {
      return
    }
    this.rate$.dispatch(new LoadRates({}))
    this.assetDefinition$.dispatch(new LoadAssetDefinitions({ assets: this.assets.map(asset => asset.assetId) }))

    this.assets$ = combineLatest(
      from(this.assets).pipe(
        mergeMap(
          (asset) => {
            return this.assetDefinition$.pipe(
              map(state => state.definitions),
              mergeMap(definitions => from(definitions)),
              filter(definition => definition.id.equals(asset.assetId)),
              first(),
              map(definition => Tuple(asset, definition))
            )
          }
        ),
        toArray()
      ),
      this.rate$.pipe(
        filter(state => state.loading == false)
      )
    ).pipe(
      mergeMap(
        ([array, rate]) => {
          return from(array).pipe(
            map(
              ([asset, definition]) => {
                const name = asset.assetId.toString()
                const additionaldefinition = this.assetAdditionalDefinitions.find(a => a.name === name) || { name: "", issuer: "", unit: "" }
                const unitRate = rate.rate[rate.currency] && rate.rate[additionaldefinition.unit] / rate.rate[rate.currency]
                const amount = asset.quantity / Math.pow(10, definition.properties.divisibility)
                return {
                  ...additionaldefinition,
                  name: name,
                  amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
                  imageURL: this.getImageURL(name),
                  rate: amount * unitRate,
                  unitRate: unitRate
                }
              }
            ),
            toArray()
          )
        }
      )
    )
  }

  public getImageURL(name: string) {
    if (!this.assetAdditionalDefinitions.find(a => a.name == name)) {
      return "assets/data/mosaic.svg";
    }
    return "assets/data/" + name.replace(":", "/") + ".svg";
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
