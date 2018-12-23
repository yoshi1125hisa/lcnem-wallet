export type Currency = "USD" | "JPY"

export interface Rate {
    currency: Currency
    jpy: number
    usd: number
    xem: number
    btc: number
    eth: number
}