import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Asset } from 'nem-library';
import { Observable, from, combineLatest, of } from 'rxjs';
import { map, mergeMap, filter, concatMap } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { Store } from '@ngrx/store';
import { LoadAssetDefinitions } from '../../services/dlt/asset-definition/asset-definition.actions';
import { LoadRates } from '../../services/rate/rate.actions';
import { State } from '../../services/reducer';
import { Tuple } from '../../classes/tuple';

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

  public assetDefinition$ = this.store.select(state => state.assetDefinition)
  public rate$ = this.store.select(state => state.rate)

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
    private store: Store<State>
  ) {

  }

  ngOnInit() {
    this.load()
  }

  public load() {
    if (!this.assets) {
      return
    }
    this.store.dispatch(new LoadRates({}))
    this.store.dispatch(new LoadAssetDefinitions({ assets: this.assets.map(asset => asset.assetId) }))

    this.assets$ = of(this.assets).pipe(
      concatMap(assets => combineLatest(
        this.assetDefinition$,
        this.rate$
      ).pipe(
        map(([assetDefinition, rate]) => Tuple(assets, assetDefinition, rate)),
      )
    ),
    filter(([assets, assetDefinition, rate]) => !assetDefinition.loading && !rate.loading),
      map(([assets, assetDefinition, rate]) => assets.map(
        (asset) => {
          const definition = assetDefinition.definitions.find(definition => definition.id.equals(asset.assetId))!
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
      ))
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
