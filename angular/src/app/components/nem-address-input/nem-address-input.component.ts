import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { NamespaceHttp, AccountHttp, Address } from 'nem-library';
import { nodes } from '../../models/nodes';
import { State } from '../../store';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../services/language.service';
import { Observable, of, from } from 'rxjs';
import { debounceTime, filter, mergeMap, map, catchError, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-nem-address-input',
  templateUrl: './nem-address-input.component.html',
  styleUrls: ['./nem-address-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NemAddressInputComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => NemAddressInputComponent),
    }
  ],
})
export class NemAddressInputComponent implements OnInit, ControlValueAccessor, Validator {
  public get lang() { return this.language.twoLetter; }

  @Input() placeholder?: string;
  @Input() required?: boolean;

  public hint$ = new Observable<string>();
  public suggests$ = new Observable<{
    name: string,
    address: string
  }[]>();

  public readonly pattern = "N[2-7A-Z]{39}";

  constructor(
    private store: Store<State>,
    private language: LanguageService
  ) { }

  ngOnInit() {
  }

  public onKeyup(
    event: {
      value: string;
      keyCode: number
    }
  ) {
    if (this.value.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
      this.value = this.value.replace(/-/g, "");
      event.value = this.value;
    }
    const filtered = of(event).pipe(
      filter(event => event.value ? true : false),
      filter(event => event.keyCode < 37 || 40 < event.keyCode),
      debounceTime(1000)
    );

    this.hint$ = filtered.pipe(
      mergeMap(
        (event) => {
          const accountHttp = new AccountHttp(nodes);
          const address = new Address(this.value);
          return accountHttp.allTransactions(address);
        }
      ),
      map(
        (transactions) => {
          if(!transactions.length) {
            return this.translations.unknownAddress[this.lang];
          }
          return "";
        }
      )
    )

    this.suggests$ = filtered.pipe(
      mergeMap(
        (event) => {
          return this.store.select(state => state.contact).pipe(
            mergeMap(
              (contact) => {
                return from(contact.ids as string[]).pipe(
                  filter(id => contact.entities[id].name.startsWith(event.value)),
                  map(id => contact.entities[id])
                )
              }
            ),
            mergeMap(
              (entity) => {
                return from(entity.nem).pipe(
                  map(
                    (nem) => {
                      return {
                        name: entity.name + " " + nem.name,
                        address: nem.address
                      }
                    }
                  )
                )
              }
            )
          )
        }
      ),
      toArray(),
      mergeMap(
        (suggests) => {
          const namespaceHttp = new NamespaceHttp(nodes);
          return namespaceHttp.getNamespace(this.value).pipe(
            map(
              (namespace) => {
                return [
                  ...suggests,
                  {
                    name: this.value + ".nem",
                    address: namespace.owner.plain()
                  }
                ]
              }
            ),
            catchError((e) => of(suggests))
          )
        }
      ),
      
    )
  }

  public translations = {
    unknownAddress: {
      en: "This is unused address. Please reconfirm.",
      ja: "使われたことのないアドレスです。間違いがないか確認してください。"
    } as any
  }

  //以下ngModelのため
  public _value: any;

  get value(): any {
    return this._value;
  }
  @Input('value')
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.onChangeCallback(value);
    }
  }

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  writeValue(text: string): void {
    if (text !== this.value) {
      this.value = text;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void { }

  //以下validationのため
  validate(control: AbstractControl): ValidationErrors | null {
    const address: string = control.value;
    if (!address) {
      return { required: true };
    }

    const patternRegex = new RegExp(this.pattern);
    if (!patternRegex.test(address)) {
      return { pattern: true };
    }

    return null;
  }
}
