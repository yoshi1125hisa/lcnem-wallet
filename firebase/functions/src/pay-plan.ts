import * as functions from 'firebase-functions';

export const payPlan = functions.https.onRequest(async (req, res) => {
  try {
    const plan = req.body.plan as string;
    const signedTransaction = req.body.signedTransaction as string;

    if(!plan || !signedTransaction) {
      throw Error("INVALID_PARAMETERS");
    }

    if(plan != "Standard") {
      throw Error("INVALID_PLAN");
    }
  } catch(e) {
    res.status(400).send(e.message);
  }
});
