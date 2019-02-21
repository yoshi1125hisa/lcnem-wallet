import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public changePlan(
    data: {
      userId: string
      plan: string
      months: number
      data: string
      signature: string
    }
  ) {
    return this.http.post('/api/change-plan', data);
  }

  public faucet(
    data: {
      userId: string
      walletId: string
    }
  ) {
    return this.http.post('/api/faucet', data);
  }
}
