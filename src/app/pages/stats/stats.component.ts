import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

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


@Component({
  selector: 'app-stats',

  standalone: true,

  imports: [
    CommonModule,
    NavComponent
  ],

  templateUrl:
    './stats.component.html',

  styleUrl:
    './stats.component.css'
})
export class StatsComponent
implements OnInit {

  totalReports = 0;

  inProgress = 0;

  resolved = 0;

  resolutionRate = 0;


  streets = 0;

  lighting = 0;

  cleaning = 0;

  others = 0;


  bars = [
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ];


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

        await this.loadStats(
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
     CARGAR ESTADISTICAS
  ========================= */

  async loadStats(
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


      this.totalReports =
        snapshot.size;


      let inProgressCount = 0;

      let resolvedCount = 0;

      let streetsCount = 0;

      let lightingCount = 0;

      let cleaningCount = 0;

      let otherCount = 0;


      snapshot.forEach(
        (document) => {

          const data =
            document.data();


          const status =
            (
              data['status'] ||
              'pendiente'
            )
              .toLowerCase();


          if (
            status ===
            'en_proceso'
          ) {

            inProgressCount++;

          }


          if (
            status ===
            'resuelto'
          ) {

            resolvedCount++;

          }


          const category =
            (
              data['category'] ||
              ''
            )
              .toLowerCase()
              .trim();


          if (
            category.includes(
              'calle'
            )
          ) {

            streetsCount++;

          }

          else if (
            category.includes(
              'alumbrado'
            )
          ) {

            lightingCount++;

          }

          else if (
            category.includes(
              'limpieza'
            ) ||
            category.includes(
              'basura'
            )
          ) {

            cleaningCount++;

          }

          else {

            otherCount++;

          }

        }
      );


      this.inProgress =
        inProgressCount;


      this.resolved =
        resolvedCount;


      this.streets =
        streetsCount;


      this.lighting =
        lightingCount;


      this.cleaning =
        cleaningCount;


      this.others =
        otherCount;


      this.resolutionRate =
        this.totalReports > 0
          ? Math.round(
              (
                this.resolved /
                this.totalReports
              ) * 100
            )
          : 0;


      this.buildBars();

    }

    catch (error) {

      console.error(
        'Error cargando estadísticas:',
        error
      );

    }

  }


  /* =========================
     PORCENTAJES
  ========================= */

  percentage(
    amount: number
  ): number {

    if (
      this.totalReports === 0
    ) {

      return 0;

    }


    return Math.round(
      (
        amount /
        this.totalReports
      ) * 100
    );

  }


  /* =========================
     DONUT
  ========================= */

  getDonutBackground():
    string {

    if (
      this.totalReports === 0
    ) {

      return `
        conic-gradient(
          #334155 0% 100%
        )
      `;

    }


    const streetsPercent =
      (
        this.streets /
        this.totalReports
      ) * 100;


    const lightingPercent =
      (
        this.lighting /
        this.totalReports
      ) * 100;


    const cleaningPercent =
      (
        this.cleaning /
        this.totalReports
      ) * 100;


    const othersPercent =
      (
        this.others /
        this.totalReports
      ) * 100;


    const streetsEnd =
      streetsPercent;


    const lightingEnd =
      streetsEnd +
      lightingPercent;


    const cleaningEnd =
      lightingEnd +
      cleaningPercent;


    const othersEnd =
      cleaningEnd +
      othersPercent;


    return `
      conic-gradient(

        #2563eb
        0%
        ${streetsEnd}%,

        #f59e0b
        ${streetsEnd}%
        ${lightingEnd}%,

        #10b981
        ${lightingEnd}%
        ${cleaningEnd}%,

        #64748b
        ${cleaningEnd}%
        ${othersEnd}%

      )
    `;

  }


  /* =========================
     BARRAS
  ========================= */

  private buildBars():
    void {

    if (
      this.totalReports === 0
    ) {

      this.bars = [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ];

      return;

    }


    const value =
      Math.min(
        100,
        25 +
        (
          this.totalReports *
          8
        )
      );


    this.bars = [

      Math.max(
        15,
        value - 15
      ),

      Math.max(
        15,
        value - 25
      ),

      Math.max(
        15,
        value - 10
      ),

      value,

      Math.max(
        15,
        value - 20
      ),

      Math.min(
        100,
        value + 10
      ),

      Math.max(
        15,
        value - 5
      )

    ];

  }

}