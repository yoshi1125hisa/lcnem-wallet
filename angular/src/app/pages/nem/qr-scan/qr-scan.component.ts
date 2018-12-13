import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelectChange } from '@angular/material';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { filter, map, first, takeUntil } from 'rxjs/operators';
import { RouterService } from '../../../services/router/router.service';
import { LoadingDialogComponent } from '../../../components/loading-dialog/loading-dialog.component';
import { Invoice } from '../../../classes/invoice';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.css']
})
export class QrScanComponent implements OnInit {
  @ViewChild("scanner") scanner!: ZXingScannerComponent;

  public get lang() { return this.language.state.twoLetter }

  public processing = false
  public availableDevices$!: Observable<MediaDeviceInfo[]>
  public noCamera$!: Observable<boolean>
  public permission$!: Observable<boolean>

  private unsubscribe$ = new Subject()

  public selectedDevice$ = new BehaviorSubject<MediaDeviceInfo | undefined>(undefined)

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _router: RouterService,
    private language: LanguageService
  ) { }

  ngOnInit() {
    this.availableDevices$ = this.scanner.camerasFound.asObservable()
    this.noCamera$ = this.scanner.camerasNotFound.asObservable()
    this.permission$ = this.scanner.permissionResponse.asObservable()

    this.scanner.scanSuccess.pipe(
      takeUntil(this.unsubscribe$),
      filter(_ => this.processing),
      map(result => decodeURI(result))
    ).subscribe(
      (result: string) => {
        this.processing = true;
        const dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true });

        if (result[0] == "N" && result.replace(/-/g, "").trim().length == 40) {
          const invoice = new Invoice()
          invoice.data.addr = result
          result = invoice.stringify()
        }

        const invoice = Invoice.parse(result)
        if (invoice) {
          this.router.navigate(
            ["transactions", "transfer"],
            {
              queryParams: {
                invoice: result
              }
            }
          )

          return
        }

        dialog.close()

        this.dialog.open(
          AlertDialogComponent,
          {
            data: {
              title: this.translation.unexpected[this.lang],
              content: result
            }
          }
        ).afterClosed().subscribe(
          () => {
            this.processing = false
          }
        )
      }
    )
  }

  ngOnDestroy() {
    this.selectedDevice$.complete()
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  public selectDevice(event: MatSelectChange) {
    this.availableDevices$.pipe(
      first(),
      map(devices => devices[event.value])
    ).subscribe(
      (device) => {
        this.selectedDevice$.next(device)
      }
    )
  }

  public back() {
    this._router.back([""])
  }

  public translation = {
    noCamera: {
      en: "Cameras not found.",
      ja: "カメラが見つかりません。"
    } as any,
    noPermission: {
      en: "Permissions required.",
      ja: "カメラ許可が必要です。"
    } as any,
    pleaseSelect: {
      en: "Please select the device.",
      ja: "カメラデバイスを選択してください。"
    } as any,
    scan: {
      en: "Scan QR-code",
      ja: "QRコードをスキャン"
    } as any,
    selectCamera: {
      en: "Select camera",
      ja: "カメラを選択"
    } as any,
    unexpected: {
      en: "Unexpected QR-code",
      ja: "予期されないQRコードです"
    } as any
  };
}
