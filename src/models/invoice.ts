export class Invoice {
  public v = 2;
  public type = 2;
  public data = {
    addr: "",
    msg: "",
    name: "LCNEM Wallet",
    amount: 0
  }

  public stringify() {
    return JSON.stringify(this);
  }

  public static parse(json: string) {
    let invoice: Invoice;
    try {
      invoice = JSON.parse(json);
    } catch {
      return null;
    }
    if (invoice.v != 2) {
      return null;
    }
    if (invoice.type != 2) {
      return null;
    }
    if (invoice.data == null) {
      return null;
    }

    return invoice;
  }
};