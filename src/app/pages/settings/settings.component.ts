import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  getAuth,
  signOut
} from 'firebase/auth';

import {
  NavComponent
} from '../../shared/nav/nav.component';

import {
  LanguageService,
  AppLanguage
} from '../../services/language.service';


@Component({
  selector: 'app-settings',

  standalone: true,

  imports: [
    FormsModule,
    NavComponent
  ],

  templateUrl:
    './settings.component.html',

  styleUrl:
    './settings.component.css'
})
export class SettingsComponent implements OnInit {

  private _dark = false;

  private _language:
    AppLanguage =
    'Español';

  private _privacy =
    'Estándar';


  constructor(
    private router: Router,
    public languageService:
      LanguageService
  ) {}


  ngOnInit(): void {

    const savedDark =
      localStorage.getItem(
        'guayalink-dark-mode'
      );

    const savedPrivacy =
      localStorage.getItem(
        'guayalink-privacy'
      );


    this._dark =
      savedDark === 'true';


    this._language =
      this.languageService
        .getLanguage();


    this._privacy =
      savedPrivacy ||
      'Estándar';


    this.applyTheme();

  }


  /* =========================
     MODO OSCURO
  ========================= */

  get dark(): boolean {

    return this._dark;

  }


  set dark(
    value: boolean
  ) {

    this._dark =
      value;


    localStorage.setItem(
      'guayalink-dark-mode',
      String(value)
    );


    this.applyTheme();

  }


  private applyTheme(): void {

    document.body
      .classList
      .toggle(
        'dark-theme',
        this._dark
      );

  }


  /* =========================
     IDIOMA
  ========================= */

  get language():
    AppLanguage {

    return this._language;

  }


  set language(
    value: AppLanguage
  ) {

    this._language =
      value;


    this.languageService
      .setLanguage(
        value
      );

  }


  /* =========================
     TRADUCCIONES
  ========================= */

  t(
    key: string
  ): string {

    return this.languageService
      .t(key);

  }


  /* =========================
     PRIVACIDAD
  ========================= */

  get privacy():
    string {

    return this._privacy;

  }


  set privacy(
    value: string
  ) {

    this._privacy =
      value;


    localStorage.setItem(
      'guayalink-privacy',
      value
    );

  }


  /* =========================
     CERRAR SESION
  ========================= */

  async logout():
    Promise<void> {

    try {

      const auth =
        getAuth();


      await signOut(
        auth
      );


      await this.router
        .navigateByUrl(
          '/'
        );

    }

    catch (error) {

      console.error(
        'Error al cerrar sesión:',
        error
      );


      alert(
        this.t(
          'settings.logoutError'
        )
      );

    }

  }

}