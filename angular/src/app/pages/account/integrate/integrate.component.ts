import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { IntegrationService } from '../../../services/user/integration/integration.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Application } from '../../../../../../firebase/functions/src/models/application';
import { map, filter, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../../../services/reducer';

@Component({
  selector: 'app-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.css']
})
export class IntegrateComponent implements OnInit {
  get lang() { return this.language.code; }

  constructor(
    private route: ActivatedRoute,
    private language: LanguageService,
    private auth: AuthService,
    private store: Store<State>,
    private integration: IntegrationService
  ) { }

  public wallet$ = this.store.select(state => state.wallet);

  public loading$ = this.wallet$.pipe(map(state => state.loading));
  public currentWallet$ = this.wallet$.pipe(
    filter(state => state.currentWalletId !== undefined),
    map(state => state.entities[state.currentWalletId!])
  );

  public forms = {
    password: '',
    passwordConfirm: '',
    agree: false
  };
  public redirect = '';
  public application?: Application;

  public translation = {
    walletName: {
      en: 'Wallet name',
      ja: 'ウォレット名'
    } as any,
    walletNemAddress: {
      en: 'NEM address',
      ja: 'NEMアドレス'
    } as any,
    password: {
      en: 'Password',
      ja: 'パスワード'
    } as any,
    passwordConfirm: {
      en: 'Password confirmation',
      ja: 'パスワード確認'
    } as any,
    integrate: {
      en: 'Integrate',
      ja: '連携'
    } as any,
    reject: {
      en: 'Reject',
      ja: '拒否する'
    } as any,
    introductionImportAccount: {
      en: 'The above application is importing NEM account from LCNEM Wallet.',
      ja: '上記アプリは、NEMアカウントをLCNEM Walletからインポートしようとしています。'
    } as any,
    introductionTellPrivateKey: {
      en: 'We are going to tell the private key encrypted with the password to the above application.',
      ja: '上記アプリに、パスワードで暗号化された秘密鍵を伝達します。'
    } as any,
    introductionInputPassword: {
      en: 'Please input new password  for encrypting private key.',
      ja: '秘密鍵を暗号化するために使うパスワードを、新たに考えて入力してください。'
    } as any
  };

  ngOnInit() {
    this.load();
  }

  public async load(refresh?: boolean) {
    this.redirect = this.route.snapshot.queryParams.redirect || '';
    const clientToken = this.route.snapshot.queryParams.clientToken || '';

    const application = await this.integration.getApplication(clientToken);
    this.application = {
      name: application.name,
      owner: application.owner
    };
  }

  public async integrate() {
    const state = await this.wallet$.pipe(first()).toPromise();
    const wallet = await this.integration.createIntegration(
      this.auth.user!.uid,
      state.entities[state.currentWalletId!],
      this.forms.password
    );

    location.href = `${this.redirect}?wallet=${wallet}`;
  }

  public reject() {
    location.href = this.redirect;
  }
}
