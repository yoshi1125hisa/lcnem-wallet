import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../services/api//stripe//stripe.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { AssetLevyType } from 'nem-library';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-pay-stripe',
  templateUrl: './pay-stripe.component.html',
  styleUrls: ['./pay-stripe.component.css']
})
export class PayStripeComponent implements OnInit {

  constructor(
    private stripe: StripeService,
  ) { }

  ngOnInit() {
  }

  var elements = this.stripe.elements();

  var card = elements.create('card', { style: style });
  card.mount('#card-element');

  card.addEventListener('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
}
