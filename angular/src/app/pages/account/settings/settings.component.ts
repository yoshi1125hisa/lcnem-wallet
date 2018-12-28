import { FormControl } from '@angular/forms'
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PayStripeComponent } from '../../../components/pay-stripe/pay-stripe.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(
    private dialog: MatDialog,
    mode = new FormControl("over"),
  ) { }
  public openDialog() {

    this.dialog.open(PayStripeComponent).afterClosed().subscribe(
      (result) => {
        //resultでsuccessもらう。
        //有料プラン変更処理をかく。(trueを引数に入れる)
      }
    )
  }
}
