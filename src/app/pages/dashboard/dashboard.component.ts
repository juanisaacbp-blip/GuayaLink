import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  collection,
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


interface Report {
  id: string;
  title: string;
  category: string;
  status: string;
  progress: number;
  supportCount: number;
}


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    NavComponent
  ],

  templateUrl:
    './dashboard.component.html',

  styleUrl:
    './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  loading = true;

  userName = 'Usuario';

  totalReports = 0;
  inProgressReports = 0;
  resolvedReports = 0;
  totalSupports = 0;

  reports: Report[] = [];


  constructor(
    public languageService:
      LanguageService
  ) {}


  ngOnInit(): void {

    onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {

          this.loading = false;

          return;

        }


        this.userName =
          user.displayName ||
          user.email?.split('@')[0] ||
          this.t('dashboard.user');


        await this.loadReports(
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
     CARGAR REPORTES
  ========================= */

  async loadReports(
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


      const loadedReports:
        Report[] = [];


      let inProgress = 0;

      let resolved = 0;

      let supports = 0;


      snapshot.forEach(
        (document) => {

          const data =
            document.data();


          const status =
            data['status'] ||
            'pendiente';


          if (
            status ===
            'en_proceso'
          ) {

            inProgress++;

          }


          if (
            status ===
            'resuelto'
          ) {

            resolved++;

          }


          supports +=
            Number(
              data['supportCount'] ||
              0
            );


          loadedReports.push(
            {

              id:
                document.id,

              title:
                data['title'] ||
                this.t(
                  'dashboard.defaultReport'
                ),

              category:
                data['category'] ||
                this.t(
                  'dashboard.noCategory'
                ),

              status:
                status,

              progress:
                Number(
                  data['progress'] ||
                  0
                ),

              supportCount:
                Number(
                  data['supportCount'] ||
                  0
                )

            }
          );

        }
      );


      this.reports =
        loadedReports;


      this.totalReports =
        loadedReports.length;


      this.inProgressReports =
        inProgress;


      this.resolvedReports =
        resolved;


      this.totalSupports =
        supports;

    }

    catch (error) {

      console.error(
        'Error cargando reportes:',
        error
      );

    }

    finally {

      this.loading =
        false;

    }

  }


  /* =========================
     ESTADOS
  ========================= */

  getStatusText(
    status: string
  ): string {

    switch (status) {

      case 'pendiente':

        return this.t(
          'status.pending'
        );


      case 'recibido':

        return this.t(
          'status.received'
        );


      case 'en_proceso':

        return this.t(
          'status.inProgress'
        );


      case 'resuelto':

        return this.t(
          'status.resolved'
        );


      default:

        return status;

    }

  }

}