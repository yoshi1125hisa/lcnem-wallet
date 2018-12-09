import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router
  ) { }

  public back(commands: any[], extras?: NavigationExtras) {
    if(history.length > 1) {
      history.back()
    }
    this.router.navigate(commands, extras)
  }
}
