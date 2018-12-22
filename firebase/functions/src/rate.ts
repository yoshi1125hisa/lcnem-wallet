import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';

export const _rate = functions.https.onRequest((req, res) => {
    try {
        request.get(
            "https://data.fixer.io/api/latest",
            () => {
                const rates = res
                admin.firestore().doc("rates")
                    .update(rates)
                    .then(
                        () => {
                            res.status(200).send
                        }
                    )
            }
        )
    } catch (e) {
        console.error(e)
        res.status(400).send(e.message)
    }
});