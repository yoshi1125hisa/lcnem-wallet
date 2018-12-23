import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { Asset, AssetDefinition } from 'nem-library';
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, filter, toArray, take } from 'rxjs/operators';
import { LanguageService } from '../../services/language/language.service';
import { AssetDefinitionService } from '../../services/nem/asset-definition/asset-definition.service';
import { RateService } from 'src/app/services/rate/rate.service';

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
  public assets$: Observable<{
    name: string
    amount: number
    imageURL: string
    issuer?: string
    unit?: string
    rate?: number
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
                const name = asset.assetId.toString()
                const additionaldefinition = this.assetAdditionalDefinitions.find(a => a.name === name) || {}
                return {
                  ...additionaldefinition,
                  name: name,
                  amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
                  imageURL: this.getImageURL(name),

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

  public getRate(name: string) {
    return 1
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
}
