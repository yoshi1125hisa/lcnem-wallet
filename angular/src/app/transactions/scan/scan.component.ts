import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Invoice } from '../../../models/invoice';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { lang } from '../../../models/lang';
import { back } from '../../../models/back';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  public scanning = false;
  get lang() { return lang; }

  @ViewChild('scanner')
  scanner?: ZXingScannerComponent;

  noCamera = false;
  hasPermission = false;

  availableDevices?: MediaDeviceInfo[];
  selected?: number;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!this.scanner) {
      return;
    }

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;
      this.selected = 0;
    });

    this.scanner.camerasNotFound.subscribe(() => {
      this.noCamera = true;
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });

    this.scanner.scanSuccess.subscribe((result: string) => {
      if (this.scanning) {
        return;
      }
      this.scanning = true;
      let dialog = this.dialog.open(LoadingDialogComponent, { disableClose: true });

      let decoded = decodeURI(result);
      try {
        let invoice = Invoice.parse(decoded);
        if (!invoice && decoded[0] == "N" && decoded.replace(/-/g, "").trim().length == 40) {
          let invoiceData = new Invoice();
          invoiceData.data.addr = decoded;
          result = encodeURI(invoiceData.stringify());
        }

        if (invoice) {
          this.router.navigate(["transactions", "transfer"], {
            queryParams: {
              invoice: result
            }
          });
        }
      } catch {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: this.translation.unexpected[this.lang],
            content: decoded
          }
        }).afterClosed().subscribe(() => {
          this.scanning = false;
        });
      } finally {
        dialog.close();
      }
    });
  }

  public back() {
    back(() => this.router.navigate([""]));
  }

  public get selectedDevice() {
    if (this.selected === undefined) {
      return null;
    }
    if (this.availableDevices === undefined) {
      return null;
    }

    return this.availableDevices![this.selected!];
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
