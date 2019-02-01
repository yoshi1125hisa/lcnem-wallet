import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public orderCheque(
    data: {
      email: string
      nem: string
      currency: string
      amount: number
      method: string
      lang: string
    }
  ) {
    return this.http.post("/api/cheque/order-cheque", data);
  }

  public orderCash(
    data: {
      email: string
      nem: string
      currency: string
      amount: number
      method: string
      lang: string
    }
  ) {
    return this.http.post("/api/cheque/order-cash", data);
  }

  public deletePlan(
    data: {
      userId: string
    }
  ) {
    return this.http.post(
      "/api/change-plan",
      {
        ...data,
        plan: "Free"
      }
    )
  }

  public changePlan(
    data: {
      userId: string
      plan: string
      months: number
      data: string
      signature: string
    }
  ) {
    return this.http.post("/api/change-plan", data)
  }

  public faucet(
    data: {
      userId: string
      walletId: string
    }
  ) {
    return this.http.post("/api/faucet", data)
  }
}
