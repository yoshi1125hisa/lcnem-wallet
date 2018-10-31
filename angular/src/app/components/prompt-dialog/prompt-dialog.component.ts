import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.css']
})
export class PromptDialogComponent {
  public model: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      input: {
        maxlength: number,
        minlength: number,
        pattern: string,
        placeholder: string,
        value: any
      }
    }
  ) {
    if(!data) {
      data = {} as any;
    }
    if(!data.input) {
      data.input = {} as any;
    }
    this.model = data.input.value;
  }
}
