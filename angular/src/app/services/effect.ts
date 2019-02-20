import { UserEffects } from "./user/user.effects";
import { RateEffects } from "./rate/rate.effects";
import { WalletEffects } from "./user/wallet/wallet.effects";
import { ContactEffects } from "./user/contact/contact.effects";
import { ApplicationEffects } from "./user/application/application.effects";
import { AssetDefinitionEffects } from "./dlt/asset-definition/asset-definition.effects";
import { BalanceEffects as NemBalanceEffects } from "./dlt/nem/balance/balance.effects";
import { HistoryEffects as NemHistoryEffects } from "./dlt/nem/history/history.effects";
import { MultisigEffects as NemMultisigEffects } from "./dlt/nem/multisig/multisig.effects";

export const effects = [
  UserEffects,
  RateEffects,
  WalletEffects,
  ContactEffects,
  ApplicationEffects,
  AssetDefinitionEffects,
  NemBalanceEffects,
  NemHistoryEffects,
  NemMultisigEffects
]