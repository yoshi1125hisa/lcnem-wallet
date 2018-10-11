export let assetAdditionalDefinitions: AssetAdditionalDefinition[] = [
  {
    name: "nem:xem",
    issuer: "",
    unit: "XEM"
  },
  {
    name: "lc:jpy",
    issuer: "LCNEM, Inc.",
    unit: "JPY"
  },
  {
    name: "oshibori:point2019",
    issuer: "おしぼり.jp",
    unit: "JPY"
  },
  {
    name: "montoken:mot",
    issuer: "かえもん",
    unit: ""
  }
];

export class AssetAdditionalDefinition {
  public name = "";
  public issuer = "";
  public unit = "";

  public static getImageUrl(name: string) {
    if (!assetAdditionalDefinitions.find(a => a.name == name)) {
      return "assets/data/mosaic.svg";
    }
    return "assets/data/" + name.replace(":", "/") + ".svg";
  }
}