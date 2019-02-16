import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, from, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { debounceTime, filter, mergeMap, map, catchError, toArray, first, merge, retry } from 'rxjs/operators';
import { NamespaceHttp, AccountHttp, Address } from 'nem-library';
import { LanguageService } from '../../services/language/language.service';
import { nodes } from '../../classes/nodes';
import { AuthService } from '../../services/auth/auth.service';
import { Tuple } from '../../classes/tuple';
import { Store } from '@ngrx/store';
import * as fromContact from '../../services/user/contact/contact.reducer'
import { LoadContacts } from 'src/app/services/user/contact/contact.actions';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    }
  ],
})
export class AddressInputComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  public get lang() { return this.language.code; }

  @Input() placeholder?: string;
  @Input() required?: boolean;

  private subject$ = new BehaviorSubject<KeyboardEvent | undefined>(undefined)
  private filtered$ = this.subject$.asObservable().pipe(
    filter(event => !!event),
    filter(event => event!.keyCode < 37 || 40 < event!.keyCode),
    debounceTime(600)
  )

  public contacts$ = combineLatest(
    this.filtered$,
    this.contact$
  ).pipe(
    map(([event, contact]) => Tuple(event, contact.ids.map(id => contact.entities[id].nem).reduce((_, __) => _.concat(__)))),
    map(([event, nem]) => nem.filter(n => n.name.startsWith((<HTMLInputElement>event!.target).value)))
  )

  public namespace$ = this.filtered$.pipe(
    map(event => Tuple(event, new NamespaceHttp(nodes))),
    mergeMap(([event, namespaceHttp]) => namespaceHttp.getNamespace((<HTMLInputElement>event!.target).value)),
    catchError(e => of(null))
  )

  public suggests$ = combineLatest(
    this.contacts$,
    this.namespace$
  ).pipe(
    map(([contacts, namespace]) => namespace
      ? [{ name: namespace.name, address: namespace.owner.plain() }, ...contacts]
      : contacts),
  )

  public readonly pattern = "N[2-7A-Z]{39}"

  constructor(
    private language: LanguageService,
    private auth: AuthService,
    private contact$: Store<fromContact.State>
  ) { }

  ngOnInit() {
    this.load()
  }

  ngOnDestroy() {
    this.subject$.complete()
  }

  public load(refresh?: boolean) {
    this.auth.user$.pipe(
      filter(user => user !== null),
      first()
    ).subscribe(
      (user) => {
        this.contact$.dispatch(new LoadContacts({ userId: user!.uid, refresh }))
      }
    )
  }

  public onKeyup(event: KeyboardEvent) {
    if (this.value.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
      this.value = this.value.replace(/-/g, "");
    }
    this.subject$.next(event)
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
