import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';

export const _rate = functions.https.onRequest(
  async (req, res) => {
    try {
      const rate = {}

      const currencyPromise = new Promise(
        (resolve, reject) => {
          request.get(
            functions.config().currency_layer.rate_api,
            (error, response, body) => {
              if (error) {
                reject(error)
                return
              }
              const jsonResponse = JSON.parse(body)
              rate['USD'] = 1
              rate['JPY'] = jsonResponse['quotes']['USDJPY']

              resolve(rate)
            }
          )
        }
      )

      const cryptoPromise = new Promise(
        (resolve, reject) => {
          request.get(
            {
              uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=' + "BTC,XEM,ETH",
              headers: {
                'X-CMC_PRO_API_KEY': functions.config().coin_market_cap.api_key
              }
            },
            (error, response, body) => {
              if (error) {
                reject(error)
                return
              }
              const jsonResponse = JSON.parse(body);
              rate['BTC'] = jsonResponse['data']['BTC']['quote']['USD']['price']
              rate['XEM'] = jsonResponse['data']['XEM']['quote']['USD']['price']
              rate['ETH'] = jsonResponse['data']['ETH']['quote']['USD']['price']

              resolve(rate)
            }
          )
        }
      )

      const rates = await Promise.all([currencyPromise, cryptoPromise])

      await admin.firestore().collection("rates").doc("rate").set(
        {
          ...rates[0],
          ...rates[1]
        }
      )

      res.status(200).send()
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)