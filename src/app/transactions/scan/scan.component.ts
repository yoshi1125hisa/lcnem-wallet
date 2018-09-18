import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../services/global-data.service';
import { Invoice } from '../../../models/invoice';


@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  @ViewChild('scanner')
  scanner?: ZXingScannerComponent;

  noCamera = false;
  hasPermission = false;

  availableDevices?: MediaDeviceInfo[];
  selected?: number;

  resultText?: string;

  constructor(
    public global: GlobalDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.global.auth.authState.subscribe((user) => {
      if (user == null) {
        this.router.navigate(["/login"]);
        return;
      }
      this.global.initialize().then(() => {
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

        this.scanner.scanComplete.subscribe((result: any) => {
          this.resultText = result.getText();
          let invoice = Invoice.read(this.resultText);
          if (invoice == null) {
            return;
          }
          this.router.navigate(["/transactions/transfer"], { queryParams: { invoice: this.resultText } });
        });
      });
    });
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
    },
    noPermission: {
      en: "Permissions required.",
      ja: "カメラ許可が必要です。"
    },
    scan: {
      en: "Scan QR-code",
      ja: "QRコードをスキャン"
    },
    selectCamera: {
      en: "Select camera",
      ja: "カメラを選択"
    }
  } as { [key: string]: { [key: string]: string } };
}
