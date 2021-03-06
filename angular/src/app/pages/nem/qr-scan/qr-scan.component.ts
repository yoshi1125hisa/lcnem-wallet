import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelectChange, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Observable, Subject } from 'rxjs';
import { filter, map, first, takeUntil } from 'rxjs/operators';
import { RouterService } from '../../../services/router/router.service';
import { Invoice } from '../../../classes/invoice';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.css']
})
export class QrScanComponent implements OnInit {

  public get lang() { return this.language.code; }

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private _router: RouterService,
    private language: LanguageService
  ) { }
  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  public processing = false;
  public selectedDevice?: MediaDeviceInfo;
  public availableDevices: MediaDeviceInfo[] = [];

  public noCamera$!: Observable<boolean>;
  public permission$!: Observable<boolean>;

  private unsubscribe$ = new Subject();

  public translation = {
    noCamera: {
      en: 'Cameras not found.',
      ja: 'カメラが見つかりません。'
    } as any,
    noPermission: {
      en: 'Permissions required.',
      ja: 'カメラ許可が必要です。'
    } as any,
    pleaseSelect: {
      en: 'Please select the device.',
      ja: 'カメラデバイスを選択してください。'
    } as any,
    scan: {
      en: 'Scan QR-code',
      ja: 'QRコードをスキャン'
    } as any,
    selectCamera: {
      en: 'Select camera',
      ja: 'カメラを選択'
    } as any,
    unexpected: {
      en: 'Unexpected QR-code',
      ja: '予期されないQRコードです'
    } as any
  };

  ngOnInit() {
    this.noCamera$ = this.scanner.camerasNotFound.asObservable();
    this.permission$ = this.scanner.permissionResponse.asObservable();

    this.scanner.camerasFound.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (devices) => {
        this.availableDevices = devices;
      }
    );

    this.scanner.scanSuccess.pipe(
      takeUntil(this.unsubscribe$),
      filter(_ => !this.processing),
      map(result => decodeURI(result))
    ).subscribe(
      (result: string) => {
        this.processing = true;

        if (result[0] == 'N' && result.replace(/-/g, '').trim().length == 40) {
          const invoice = new Invoice();
          invoice.data.addr = result;
          result = invoice.stringify();
        }

        const invoice = Invoice.parse(result);
        if (invoice) {
          this.router.navigate(
            ['nem', 'transfer'],
            {
              queryParams: {
                invoice: result
              }
            }
          );

          return;
        }

        window.alert(`${this.translation.unexpected[this.lang]}: "${result}"`);
        this.processing = false;
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public back() {
    this._router.back(['']);
  }

  public selectionChange(event: MatSelectChange) {
    this.selectedDevice = this.availableDevices[event.value];
  }
}
