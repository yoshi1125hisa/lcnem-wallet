import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { console.log("api")}

  public deposit(
    data: {
      email: string,
      nem: string,
      currency: string,
      amount: number,
      method: string,
      lang: string
    }
  ) {
    return this.http.post("/api/deposit", data);
  }

  public withdraw(
    data: {
      email: string,
      nem: string,
      currency: string,
      amount: number,
      method: string,
      lang: string
    }
  ) {
    return this.http.post("/api/withdraw", data);
  }
}
