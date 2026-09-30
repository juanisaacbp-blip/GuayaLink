import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../../main';


type UserRole =
  | 'client'
  | 'admin'
  | 'worker';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.component.html',

  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';

  password = '';

  confirmPassword = '';

  isRegisterMode = false;

  loading = false;

  errorMessage = '';

  successMessage = '';


  constructor(
    private router: Router
  ) {}


  private async createProfileIfNeeded(
    user: User
  ): Promise<void> {

    const reference =
      doc(
        db,
        'users',
        user.uid
      );


    const snapshot =
      await getDoc(
        reference
      );


    if (!snapshot.exists()) {

      await setDoc(
        reference,
        {
          uid:
            user.uid,

          email:
            user.email ?? '',

          name:
            '',

          role:
            'client',

          points:
            0,

          totalReports:
            0,

          createdAt:
            serverTimestamp()
        }
      );

    }

  }


  private async getRole(
    userId: string
  ): Promise<UserRole> {

    const snapshot =
      await getDoc(
        doc(
          db,
          'users',
          userId
        )
      );


    if (!snapshot.exists()) {

      return 'client';

    }


    const role =
      snapshot.data()['role'];


    if (
      role === 'admin' ||
      role === 'worker' ||
      role === 'client'
    ) {

      return role;

    }


    return 'client';

  }


  private async redirectByRole(
    userId: string
  ): Promise<void> {

    const role =
      await this.getRole(
        userId
      );


    if (role === 'admin') {

      await this.router.navigateByUrl(
        '/admin'
      );

      return;

    }


    if (role === 'worker') {

      await this.router.navigateByUrl(
        '/trabajador'
      );

      return;

    }


    await this.router.navigateByUrl(
      '/dashboard'
    );

  }


  async login(): Promise<void> {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      !this.email ||
      !this.password
    ) {

      this.errorMessage =
        'Completa tu correo y contraseña.';

      return;

    }


    this.loading = true;


    try {

      const credential =
        await signInWithEmailAndPassword(
          auth,
          this.email.trim(),
          this.password
        );


      await this.createProfileIfNeeded(
        credential.user
      );


      await this.redirectByRole(
        credential.user.uid
      );


    } catch (error: any) {

      console.error(
        'Error iniciando sesión:',
        error
      );


      switch (
        error.code
      ) {

        case 'auth/invalid-credential':

          this.errorMessage =
            'Correo o contraseña incorrectos.';

          break;


        case 'auth/invalid-email':

          this.errorMessage =
            'El correo no es válido.';

          break;


        default:

          this.errorMessage =
            'No se pudo iniciar sesión.';

          break;

      }

    } finally {

      this.loading = false;

    }

  }


  async register(): Promise<void> {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.errorMessage =
        'Completa todos los campos.';

      return;

    }


    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Las contraseñas no coinciden.';

      return;

    }


    if (
      this.password.length < 6
    ) {

      this.errorMessage =
        'La contraseña debe tener mínimo 6 caracteres.';

      return;

    }


    this.loading = true;


    try {

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          this.email.trim(),
          this.password
        );


      await setDoc(
        doc(
          db,
          'users',
          credential.user.uid
        ),
        {
          uid:
            credential.user.uid,

          email:
            credential.user.email ?? '',

          name:
            '',

          role:
            'client',

          points:
            0,

          totalReports:
            0,

          createdAt:
            serverTimestamp()
        }
      );


      this.successMessage =
        'Cuenta creada correctamente.';


      setTimeout(
        async () => {

          await this.router.navigateByUrl(
            '/dashboard'
          );

        },
        600
      );


    } catch (error: any) {

      console.error(
        'Error creando cuenta:',
        error
      );


      switch (
        error.code
      ) {

        case 'auth/email-already-in-use':

          this.errorMessage =
            'Ya existe una cuenta con ese correo.';

          break;


        case 'auth/invalid-email':

          this.errorMessage =
            'El correo no es válido.';

          break;


        default:

          this.errorMessage =
            'No se pudo crear la cuenta.';

          break;

      }

    } finally {

      this.loading = false;

    }

  }


  toggleMode(): void {

    this.isRegisterMode =
      !this.isRegisterMode;

    this.errorMessage = '';

    this.successMessage = '';

    this.password = '';

    this.confirmPassword = '';

  }

}