import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Application } from '../../../../../../firebase/functions/src/models/application';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';
import { SimpleWallet, Password } from 'nem-library';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  constructor(
    private firestore: AngularFirestore
  ) {
  }

  public async getApplication(clientToken: string) {
    const [ownerId, applicationId] = clientToken.split(':');

    const applicationDocument = await this.firestore.collection('users').doc(ownerId).collection('applications').doc(applicationId).get().toPromise();
    if (!applicationDocument.exists) {
      throw Error();
    }
    return applicationDocument.data() as Application;
  }

  public async createIntegration(userId: string, wallet: Wallet, password: string) {
    if (!wallet.wallet) {
      throw Error();
    }

    return SimpleWallet.createWithPrivateKey(
      userId,
      new Password(password),
      SimpleWallet.readFromWLT(wallet.wallet).open(new Password(userId)).privateKey
    ).writeWLTFile();
  }
}
