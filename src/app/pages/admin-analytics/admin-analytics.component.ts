import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  collection,
  getDocs
} from 'firebase/firestore';

import {
  signOut
} from 'firebase/auth';

import {
  auth,
  db
} from '../../../main';


interface AnalyticsReport {

  id: string;

  title: string;

  category: string;

  status: string;

  priority: string;

  latitude:
    number | null;

  longitude:
    number | null;

  assignedWorkerId: string;

  assignedWorkerName: string;

  assignedWorkerEmail: string;

  createdAt: any;

  resolvedAt: any;

}


interface CategoryStat {

  name: string;

  count: number;

  percentage: number;

}


interface PriorityStat {

  name: string;

  key: string;

  count: number;

  percentage: number;

}


interface ZoneStat {

  name: string;

  count: number;

  percentage: number;

}


interface WorkerStat {

  id: string;

  name: string;

  assigned: number;

  resolved: number;

}


@Component({
  selector:
    'app-admin-analytics',

  standalone:
    true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './admin-analytics.component.html',

  styleUrl:
    './admin-analytics.component.css'
})
export class AdminAnalyticsComponent
implements OnInit {

  reports:
    AnalyticsReport[] = [];


  categories:
    CategoryStat[] = [];

  priorities:
    PriorityStat[] = [];

  zones:
    ZoneStat[] = [];

  workers:
    WorkerStat[] = [];


  loading =
    true;


  totalReports =
    0;

  pendingReports =
    0;

  assignedReports =
    0;

  inProgressReports =
    0;

  resolvedReports =
    0;

  urgentReports =
    0;

  resolutionRate =
    0;


  topCategory =
    'Sin datos';

  topZone =
    'Sin datos';


  constructor(
    private router: Router
  ) {}


  async ngOnInit():
  Promise<void> {

    await this.loadAnalytics();

  }


  async loadAnalytics():
  Promise<void> {

    this.loading =
      true;


    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            'reports'
          )
        );


      this.reports =
        snapshot.docs.map(
          document => {

            const data =
              document.data();


            const latitude =
              Number(
                data['latitude']
              );


            const longitude =
              Number(
                data['longitude']
              );


            return {

              id:
                document.id,

              title:
                data['title']
                || 'Reporte',

              category:
                data['category']
                || 'Otro',

              status:
                data['status']
                || 'pendiente',

              priority:
                data['priority']
                || 'baja',

              latitude:
                Number.isFinite(
                  latitude
                )
                  ? latitude
                  : null,

              longitude:
                Number.isFinite(
                  longitude
                )
                  ? longitude
                  : null,

              assignedWorkerId:
                data['assignedWorkerId']
                || '',

              assignedWorkerName:
                data['assignedWorkerName']
                || '',

              assignedWorkerEmail:
                data['assignedWorkerEmail']
                || '',

              createdAt:
                data['createdAt']
                || null,

              resolvedAt:
                data['resolvedAt']
                || null

            };

          }
        );


      this.calculateGeneralStats();

      this.calculateCategories();

      this.calculatePriorities();

      this.calculateZones();

      this.calculateWorkers();


    } catch (error) {

      console.error(
        'Error cargando analítica:',
        error
      );

    } finally {

      this.loading =
        false;

    }

  }



  /*
    =========================
    ESTADISTICAS GENERALES
    =========================
  */

  private calculateGeneralStats():
  void {

    this.totalReports =
      this.reports.length;


    this.pendingReports =
      this.reports.filter(
        report =>
          report.status ===
          'pendiente'
      ).length;


    this.assignedReports =
      this.reports.filter(
        report =>
          report.status ===
          'asignado'
      ).length;


    this.inProgressReports =
      this.reports.filter(
        report =>
          report.status ===
          'en_proceso'
      ).length;


    this.resolvedReports =
      this.reports.filter(
        report =>
          report.status ===
          'resuelto'
      ).length;


    this.urgentReports =
      this.reports.filter(
        report =>
          report.priority ===
          'urgente'
      ).length;


    this.resolutionRate =
      this.totalReports > 0

        ? Math.round(
            (
              this.resolvedReports /
              this.totalReports
            ) *
            100
          )

        : 0;

  }



  /*
    =========================
    CATEGORIAS
    =========================
  */

  private calculateCategories():
  void {

    const names =
      [
        'Calles',
        'Alumbrado',
        'Limpieza',
        'Transporte',
        'Seguridad',
        'Otro'
      ];


    this.categories =
      names.map(
        name => {

          const count =
            this.reports.filter(
              report =>
                report.category ===
                name
            ).length;


          return {

            name,

            count,

            percentage:
              this.totalReports > 0

                ? Math.round(
                    (
                      count /
                      this.totalReports
                    ) *
                    100
                  )

                : 0

          };

        }
      );


    const sorted =
      [...this.categories]
        .sort(
          (a, b) =>
            b.count -
            a.count
        );


    if (
      sorted.length > 0 &&
      sorted[0].count > 0
    ) {

      this.topCategory =
        sorted[0].name;

    }

  }



  /*
    =========================
    PRIORIDADES
    =========================
  */

  private calculatePriorities():
  void {

    const priorityData =
      [

        {
          name:
            'Urgente',

          key:
            'urgente'
        },

        {
          name:
            'Alta',

          key:
            'alta'
        },

        {
          name:
            'Media',

          key:
            'media'
        },

        {
          name:
            'Baja',

          key:
            'baja'
        }

      ];


    this.priorities =
      priorityData.map(
        item => {

          const count =
            this.reports.filter(
              report =>
                report.priority ===
                item.key
            ).length;


          return {

            name:
              item.name,

            key:
              item.key,

            count,

            percentage:
              this.totalReports > 0

                ? Math.round(
                    (
                      count /
                      this.totalReports
                    ) *
                    100
                  )

                : 0

          };

        }
      );

  }



  /*
    =========================
    ZONAS
    =========================
  */

  private calculateZones():
  void {

    const groups =
      new Map<
        string,
        number
      >();


    this.reports.forEach(
      report => {

        if (
          report.latitude === null ||
          report.longitude === null
        ) {

          return;

        }


        const zone =
          this.getApproximateZone(
            report.latitude,
            report.longitude
          );


        groups.set(
          zone,
          (
            groups.get(
              zone
            ) || 0
          ) + 1
        );

      }
    );


    this.zones =
      Array.from(
        groups.entries()
      )
      .map(
        (
          [
            name,
            count
          ]
        ) => {

          return {

            name,

            count,

            percentage:
              this.totalReports > 0

                ? Math.round(
                    (
                      count /
                      this.totalReports
                    ) *
                    100
                  )

                : 0

          };

        }
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )
      .slice(
        0,
        5
      );


    if (
      this.zones.length > 0
    ) {

      this.topZone =
        this.zones[0].name;

    }

  }



  /*
    =========================
    TRABAJADORES
    =========================
  */

  private calculateWorkers():
  void {

    const groups =
      new Map<
        string,
        WorkerStat
      >();


    this.reports.forEach(
      report => {

        if (
          !report.assignedWorkerId
        ) {

          return;

        }


        const current =
          groups.get(
            report.assignedWorkerId
          );


        if (
          current
        ) {

          current.assigned++;


          if (
            report.status ===
            'resuelto'
          ) {

            current.resolved++;

          }


          return;

        }


        groups.set(
          report.assignedWorkerId,
          {

            id:
              report.assignedWorkerId,

            name:
              report.assignedWorkerName ||
              report.assignedWorkerEmail ||
              'Trabajador',

            assigned:
              1,

            resolved:
              report.status ===
              'resuelto'
                ? 1
                : 0

          }
        );

      }
    );


    this.workers =
      Array.from(
        groups.values()
      )
      .sort(
        (a, b) =>
          b.assigned -
          a.assigned
      );

  }



  /*
    =========================
    DONUT STATUS
    =========================
  */

  getStatusDonut():
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


    const pending =
      (
        this.pendingReports /
        this.totalReports
      ) * 100;


    const assigned =
      (
        this.assignedReports /
        this.totalReports
      ) * 100;


    const progress =
      (
        this.inProgressReports /
        this.totalReports
      ) * 100;


    const resolved =
      (
        this.resolvedReports /
        this.totalReports
      ) * 100;


    const pendingEnd =
      pending;


    const assignedEnd =
      pendingEnd +
      assigned;


    const progressEnd =
      assignedEnd +
      progress;


    const resolvedEnd =
      progressEnd +
      resolved;


    return `
      conic-gradient(
        #f59e0b
        0%
        ${pendingEnd}%,

        #8b5cf6
        ${pendingEnd}%
        ${assignedEnd}%,

        #3b82f6
        ${assignedEnd}%
        ${progressEnd}%,

        #10b981
        ${progressEnd}%
        ${resolvedEnd}%
      )
    `;

  }



  /*
    =========================
    FECHAS
    =========================
  */

  formatDate(
    value: any
  ): string {

    if (!value) {

      return 'Sin fecha';

    }


    const date =
      typeof value?.toDate ===
      'function'

        ? value.toDate()

        : new Date(
            value
          );


    return new Intl.DateTimeFormat(
      'es-EC',
      {
        dateStyle:
          'medium',

        timeStyle:
          'short'
      }
    ).format(
      date
    );

  }


  getRecentReports():
  AnalyticsReport[] {

    return [...this.reports]
      .sort(
        (a, b) =>
          this.timestamp(
            b.createdAt
          ) -
          this.timestamp(
            a.createdAt
          )
      )
      .slice(
        0,
        5
      );

  }


  private timestamp(
    value: any
  ): number {

    if (!value) {

      return 0;

    }


    if (
      typeof value?.toMillis ===
      'function'
    ) {

      return value.toMillis();

    }


    return new Date(
      value
    ).getTime();

  }



  /*
    =========================
    ZONAS APROXIMADAS
    =========================
  */

  private getApproximateZone(
    latitude: number,
    longitude: number
  ): string {

    const sectors =
      [

        {
          name:
            'Centro',

          latitude:
            -2.1894,

          longitude:
            -79.8891
        },

        {
          name:
            'Urdesa',

          latitude:
            -2.1646,

          longitude:
            -79.9147
        },

        {
          name:
            'Kennedy',

          latitude:
            -2.1693,

          longitude:
            -79.8987
        },

        {
          name:
            'Alborada',

          latitude:
            -2.1397,

          longitude:
            -79.8960
        },

        {
          name:
            'Sauces',

          latitude:
            -2.1266,

          longitude:
            -79.8988
        },

        {
          name:
            'Mapasingue',

          latitude:
            -2.1580,

          longitude:
            -79.9300
        },

        {
          name:
            'Ceibos',

          latitude:
            -2.1765,

          longitude:
            -79.9450
        },

        {
          name:
            'Garzota',

          latitude:
            -2.1455,

          longitude:
            -79.8910
        },

        {
          name:
            'Guasmo',

          latitude:
            -2.2570,

          longitude:
            -79.8950
        },

        {
          name:
            'Sur',

          latitude:
            -2.2300,

          longitude:
            -79.9100
        }

      ];


    let nearest =
      sectors[0];


    let distance =
      Number.POSITIVE_INFINITY;


    sectors.forEach(
      sector => {

        const current =
          this.distance(
            latitude,
            longitude,
            sector.latitude,
            sector.longitude
          );


        if (
          current <
          distance
        ) {

          distance =
            current;

          nearest =
            sector;

        }

      }
    );


    return nearest.name;

  }


  private distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const radius =
      6371000;


    const rad =
      (
        value: number
      ) =>
        value *
        Math.PI /
        180;


    const lat =
      rad(
        lat2 -
        lat1
      );


    const lon =
      rad(
        lon2 -
        lon1
      );


    const a =

      Math.sin(
        lat / 2
      ) ** 2 +

      Math.cos(
        rad(lat1)
      ) *

      Math.cos(
        rad(lat2)
      ) *

      Math.sin(
        lon / 2
      ) ** 2;


    return (
      radius *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );

  }



  /*
    =========================
    NAVEGACION
    =========================
  */

  openReport(
    id: string
  ): void {

    this.router.navigate(
      [
        '/reporte',
        id
      ]
    );

  }


  goOperations():
  void {

    this.router.navigateByUrl(
      '/admin'
    );

  }


  async logout():
  Promise<void> {

    await signOut(
      auth
    );


    await this.router.navigateByUrl(
      '/login'
    );

  }

}