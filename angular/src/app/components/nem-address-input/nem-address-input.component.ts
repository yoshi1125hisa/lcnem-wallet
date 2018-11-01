import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { NamespaceHttp } from 'nem-library';
import { nodes } from '../../../models/nodes';

@Component({
  selector: 'app-nem-address-input',
  templateUrl: './nem-address-input.component.html',
  styleUrls: ['./nem-address-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NemAddressInputComponent),
    },
  ],
})
export class NemAddressInputComponent implements ControlValueAccessor {
  @Input() placeholder!: string;

  public suggests: {
    name: string,
    address: string
  }[] = [];

  constructor(
    private contact: ContactsService
  ) { }

  public async onChange() {
    if(this.value.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
      this.suggests.push({
        name: "",
        address: this.value.replace(/-/g, "")
      });
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
      for(let id in this.contact.contacts!) {
        if(!this.contact.contacts![id].name.startsWith(this.value)) {
          continue;
        }
        for(let nem of this.contact.contacts![id].nem) {
          this.suggests.push({
            name: this.contact.contacts![id].name + nem.name ? " " + nem.name : "",
            address: nem.address
          });
        }
      }
    } catch {
    }
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

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

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

  setDisabledState(isDisabled: boolean): void {}
}
