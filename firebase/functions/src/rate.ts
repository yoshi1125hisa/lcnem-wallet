import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';

export const _rate = functions.https.onRequest((req, res) => {
    try {
        request.get(
            'http://data.fixer.io/api/' + 'latest' + functions.config().fixer.api_access_key,
            (error, res, body) => {
                const jsonResponse = JSON.parse(body)
                jsonResponse.data.findindex
            }
        )

        const btc = "1";
        const xem = "873";
        const eth = "1027";

        const ids = [btc, xem, eth]

        ids.map(
            id =>
                request.get({
                    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=' + id,
                    headers: {
                        'X-CMC_PRO_API_KEY': functions.config().coin_market_cap.api_key
                    }
                }, function (error, res, body) {
                    if (error) {
                    } else {
                        var jsonResponse = JSON.parse(body);
                        var name = jsonResponse.data.id.name
                        var price = jsonResponse.data.id.quote.USD.price;
                        var objectRiteral = [name, price]
                        admin.firestore().doc("rates").set({
                            rate: objectRiteral
                        })
                    }
                })
        )


    } catch (e) {
        console.error(e)
        res.status(400).send(e.message)
    }
});