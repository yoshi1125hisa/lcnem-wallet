import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GlobalDataService } from '../../../../app/services/global-data.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {
  forms = {
    local: 0,
    import: 0,
    privateKey: "",
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      content: string
    },
    public global: GlobalDataService
  ) { }

  ngOnInit() {
  }

  translation = {
    create: {
      
    } as any,
    cloud: {

    } as any,
    local: {

    } as any,
    generate: {

    } as any,
    import: {

    } as any,
    privateKey: {

    } as any
  }
}
