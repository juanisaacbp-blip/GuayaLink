import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  auth,
  db
} from '../../../main';

import {
  NavComponent
} from '../../shared/nav/nav.component';

import {
  LanguageService
} from '../../services/language.service';


@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    NavComponent
  ],

  templateUrl:
    './profile.component.html',

  styleUrl:
    './profile.component.css'
})
export class ProfileComponent
implements OnInit {

  userName = 'Usuario';

  userEmail = '';

  initials = 'U';

  totalReports = 0;

  resolvedReports = 0;

  supports = 0;

  points = 0;


  constructor(
    public languageService:
      LanguageService
  ) {}


  ngOnInit(): void {

    onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {
          return;
        }


        this.userEmail =
          user.email || '';


        this.userName =
          user.displayName ||
          user.email?.split('@')[0] ||
          this.t(
            'profile.user'
          );


        this.initials =
          this.createInitials(
            this.userName
          );


        await this.loadProfile(
          user.uid
        );


        await this.loadReportStats(
          user.uid
        );

      }
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
     PERFIL
  ========================= */

  async loadProfile(
    userId: string
  ): Promise<void> {

    try {

      const userDocument =
        await getDoc(
          doc(
            db,
            'users',
            userId
          )
        );


      if (
        userDocument.exists()
      ) {

        const data =
          userDocument.data();


        if (
          data['name']
        ) {

          this.userName =
            data['name'];


          this.initials =
            this.createInitials(
              this.userName
            );

        }


        this.points =
          Number(
            data['points'] ||
            0
          );

      }

    }

    catch (error) {

      console.error(
        'Error cargando perfil:',
        error
      );

    }

  }


  /* =========================
     ESTADISTICAS
  ========================= */

  async loadReportStats(
    userId: string
  ): Promise<void> {

    try {

      const reportsQuery =
        query(

          collection(
            db,
            'reports'
          ),

          where(
            'userId',
            '==',
            userId
          )

        );


      const snapshot =
        await getDocs(
          reportsQuery
        );


      let resolved = 0;

      let supportTotal = 0;


      snapshot.forEach(
        (document) => {

          const data =
            document.data();


          if (
            data['status'] ===
            'resuelto'
          ) {

            resolved++;

          }


          supportTotal +=
            Number(
              data['supportCount'] ||
              0
            );

        }
      );


      this.totalReports =
        snapshot.size;


      this.resolvedReports =
        resolved;


      this.supports =
        supportTotal;

    }

    catch (error) {

      console.error(
        'Error cargando estadísticas:',
        error
      );

    }

  }


  /* =========================
     INICIALES
  ========================= */

  createInitials(
    name: string
  ): string {

    const pieces =
      name
        .trim()
        .split(' ')
        .filter(Boolean);


    if (
      pieces.length === 0
    ) {

      return 'U';

    }


    if (
      pieces.length === 1
    ) {

      return pieces[0]
        .substring(
          0,
          2
        )
        .toUpperCase();

    }


    return (
      pieces[0][0] +
      pieces[1][0]
    ).toUpperCase();

  }

}