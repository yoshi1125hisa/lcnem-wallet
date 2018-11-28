import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Asset, AssetDefinition } from 'nem-library';
import { Store } from '@ngrx/store';
import { State } from '../../store/index';
import { Observable, of } from 'rxjs';
import { LoadAssetDefinitions } from '../../store/nem/asset-definition/asset-definition.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
  @Input() public title?: string;
  @Input() public assets?: Asset[];

  public loading$: Observable<boolean>;
  public assets$: Observable<{
    name: string,
    amount: number,
    imageURL: string,
    issuer?: string,
    unit?: string
  }>[] = [];

  constructor(
    private store: Store<State>
  ) {
    this.loading$ = this.store.select(state => state.nemAssetDefinition.loading);
  }

  ngOnInit() {
    if (!this.assets) {
      return;
    }

    this.store.dispatch(
      new LoadAssetDefinitions(
        {
          assetIds: this.assets.map(
            (asset) => {
              return asset.assetId;
            }
          )
        }
      )
    );

    const definitions$ = this.store.select(state => state.nemAssetDefinition.definitions);

    for (const asset of this.assets) {
      this.assets$.push(
        definitions$.pipe(
          map(
            (definitions) => {
              const name = asset.assetId.namespaceId + ":" + asset.assetId.name;
              const definition = definitions.find(
                (_definition) => {
                  return _definition.id.equals(asset.assetId);
                }
              );
              if (!definition) {
                return {
                  name: name,
                  amount: 0,
                  imageURL: this.getImageURL(name)
                };
              }

              return {
                ...this.assetAdditionalDefinitions.find(
                  (a) => {
                    return a.name == name;
                  }
                ),
                name: name,
                amount: asset.quantity / Math.pow(10, definition.properties.divisibility),
                imageURL: this.getImageURL(name)
              }
            }
          )
        )
      )
    }
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
}
