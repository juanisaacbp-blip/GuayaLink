import 'zone.js';

import {
  bootstrapApplication
} from '@angular/platform-browser';

import {
  provideRouter
} from '@angular/router';

import {
  initializeApp
} from 'firebase/app';

import {
  getAuth
} from 'firebase/auth';

import {
  getFirestore
} from 'firebase/firestore';

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from 'firebase/app-check';

import {
  AppComponent
} from './app/app.component';

import {
  routes
} from './app/app.routes';


const firebaseConfig = {

  apiKey:
    'AIzaSyAVuabvDrO_ZiSJe12oJRN3HQqaNmZay4E',

  authDomain:
    'guayalink-cc784.firebaseapp.com',

  projectId:
    'guayalink-cc784',

  storageBucket:
    'guayalink-cc784.firebasestorage.app',

  messagingSenderId:
    '351817286344',

  appId:
    '1:351817286344:web:e04ea37a8a56cb4a935bfd'

};


const firebaseApp =
  initializeApp(
    firebaseConfig
  );


/*
  ============================
  APP CHECK DEBUG
  ============================

  Solamente usamos el debug token
  cuando estamos trabajando en
  localhost.

  NO se activa cuando la aplicación
  esté publicada.
*/

const isLocalhost =

  window.location.hostname ===
  'localhost'

  ||

  window.location.hostname ===
  '127.0.0.1';


if (
  isLocalhost
) {

  (
    self as any
  ).FIREBASE_APPCHECK_DEBUG_TOKEN =
    true;

}


/*
  IMPORTANTE:

  Sustituye el texto de abajo
  por el Key ID / Site Key
  que acabas de crear en
  reCAPTCHA Enterprise.
*/

const recaptchaEnterpriseSiteKey =
  '6Lfxj78tAAAAAE0r3zjmXaVTWROKwECEXUFQa7gK';


export const appCheck =
  initializeAppCheck(
    firebaseApp,
    {

      provider:
        new ReCaptchaEnterpriseProvider(
          recaptchaEnterpriseSiteKey
        ),

      isTokenAutoRefreshEnabled:
        true

    }
  );


export const auth =
  getAuth(
    firebaseApp
  );


export const db =
  getFirestore(
    firebaseApp
  );


bootstrapApplication(
  AppComponent,
  {

    providers: [

      provideRouter(
        routes
      )

    ]

  }
)
.catch(
  error =>
    console.error(
      error
    )
);