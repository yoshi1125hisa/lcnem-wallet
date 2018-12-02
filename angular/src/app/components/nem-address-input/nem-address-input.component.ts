import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { NamespaceHttp, AccountHttp, Address } from 'nem-library';
import { nodes } from '../../models/nodes';
import { State } from '../../store';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../services/language.service';


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

  public pattern = "N[2-7A-Z]{39}"
  public hint = "";

  public suggests: {
    name: string,
    address: string
  }[] = [];

  constructor(
    private store: Store<State>,
    private language: LanguageService
  ) { }

  ngOnInit() {
  }

  public async onChange(keyCode: number) {
    if (!this.value) {
      return;
    }
    if(37 <= keyCode && keyCode <= 40) {
      return;
    }
    this.suggests = [];
    this.hint = "";

    const sleep = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 1000);
      })
    };
    await sleep();

    if (this.suggests.length) {
      return;
    }

    if (this.value.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
      this.value = this.value.replace(/-/g, "");

      try {
        let accountHttp = new AccountHttp(nodes);
        let result = await accountHttp.allTransactions(new Address(this.value)).toPromise();
        if(!result.length) {
          this.hint = this.translations.unknownAddress[this.lang];
        }
      } catch {

      }
    }

    try {
      let namespaceHttp = new NamespaceHttp(nodes);
      let result = await namespaceHttp.getNamespace(this.value).toPromise();
      this.suggests.push({
        name: this.value + ".nem",
        address: result.owner.plain()
      });
    } catch {
    }

    try {
      for (let id in this.contact.contacts!) {
        if (!this.contact.contacts![id].name.startsWith(this.value)) {
          continue;
        }
        for (let nem of this.contact.contacts![id].nem) {
          this.suggests.push({
            name: this.contact.contacts![id].name + " " + nem.name,
            address: nem.address
          });
        }
      }
    } catch {
    }
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
