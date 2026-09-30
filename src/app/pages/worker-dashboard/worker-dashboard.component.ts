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
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

import {
  auth,
  db
} from '../../../main';


interface WorkerReport {

  id: string;

  title: string;

  category: string;

  description: string;

  location: string;

  latitude:
    number | null;

  longitude:
    number | null;

  status: string;

  priority: string;

  progress: number;

  userId: string;

  userEmail: string;

  assignedAt: any;

  startedAt: any;

  workerCompletedAt: any;

  resolvedAt: any;

  createdAt: any;

}


@Component({
  selector:
    'app-worker-dashboard',

  standalone:
    true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './worker-dashboard.component.html',

  styleUrl:
    './worker-dashboard.component.css'
})
export class WorkerDashboardComponent
implements OnInit {

  reports:
    WorkerReport[] = [];

  filteredReports:
    WorkerReport[] = [];

  loading = true;

  updatingId = '';

  workerEmail = '';


  activeTab:
    'asignado' |
    'en_proceso' |
    'pendiente_confirmacion' |
    'resuelto' =
      'asignado';


  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    onAuthStateChanged(
      auth,
      async user => {

        if (!user) {

          await this.router.navigateByUrl(
            '/login'
          );

          return;

        }


        this.workerEmail =
          user.email || '';


        await this.loadReports(
          user.uid
        );

      }
    );

  }


  async refresh():
  Promise<void> {

    const user =
      auth.currentUser;


    if (!user) {
      return;
    }


    await this.loadReports(
      user.uid
    );

  }


  async loadReports(
    workerId: string
  ): Promise<void> {

    this.loading =
      true;


    try {

      const snapshot =
        await getDocs(
          query(
            collection(
              db,
              'reports'
            ),
            where(
              'assignedWorkerId',
              '==',
              workerId
            )
          )
        );


      this.reports =
        snapshot.docs.map(
          item => {

            const data =
              item.data();


            return {

              id:
                item.id,

              title:
                data['title']
                || 'Reporte',

              category:
                data['category']
                || 'Otro',

              description:
                data['description']
                || '',

              location:
                data['location']
                || 'Sin ubicación',

              latitude:
                data['latitude'] !== undefined
                  ? Number(
                      data['latitude']
                    )
                  : null,

              longitude:
                data['longitude'] !== undefined
                  ? Number(
                      data['longitude']
                    )
                  : null,

              status:
                data['status']
                || 'asignado',

              priority:
                data['priority']
                || 'baja',

              progress:
                Number(
                  data['progress']
                  || 0
                ),

              userId:
                data['userId']
                || '',

              userEmail:
                data['userEmail']
                || '',

              assignedAt:
                data['assignedAt']
                || null,

              startedAt:
                data['startedAt']
                || null,

              workerCompletedAt:
                data['workerCompletedAt']
                || null,

              resolvedAt:
                data['resolvedAt']
                || null,

              createdAt:
                data['createdAt']
                || null

            };

          }
        );


      this.reports.sort(
        (a, b) =>
          this.getTimestamp(
            b.assignedAt ||
            b.createdAt
          )
          -
          this.getTimestamp(
            a.assignedAt ||
            a.createdAt
          )
      );


      this.applyTab();

    } catch (error) {

      console.error(
        'Error cargando trabajos:',
        error
      );

    } finally {

      this.loading =
        false;

    }

  }


  setTab(
    tab:
      'asignado' |
      'en_proceso' |
      'pendiente_confirmacion' |
      'resuelto'
  ): void {

    this.activeTab =
      tab;

    this.applyTab();

  }


  private applyTab():
  void {

    this.filteredReports =
      this.reports.filter(
        report =>
          report.status ===
          this.activeTab
      );

  }


  countStatus(
    status: string
  ): number {

    return this.reports.filter(
      report =>
        report.status ===
        status
    ).length;

  }


  async startWork(
    report: WorkerReport
  ): Promise<void> {

    this.updatingId =
      report.id;


    try {

      await updateDoc(
        doc(
          db,
          'reports',
          report.id
        ),
        {
          status:
            'en_proceso',

          progress:
            60,

          startedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()
        }
      );


      if (
        report.userId
      ) {

        await addDoc(
          collection(
            db,
            'notifications'
          ),
          {
            userId:
              report.userId,

            reportId:
              report.id,

            type:
              'started',

            title:
              'El trabajo ha comenzado',

            message:
              `Un trabajador empezó a resolver "${report.title}".`,

            read:
              false,

            createdAt:
              serverTimestamp()
          }
        );

      }


      report.status =
        'en_proceso';

      report.progress =
        60;

      report.startedAt =
        new Date();


      this.activeTab =
        'en_proceso';


      this.applyTab();

    } catch (error) {

      console.error(
        error
      );


      alert(
        'No se pudo iniciar el trabajo.'
      );

    } finally {

      this.updatingId =
        '';

    }

  }


  async resolveReport(
    report: WorkerReport
  ): Promise<void> {

    const confirmed =
      confirm(
        '¿Confirmas que terminaste el trabajo? El ciudadano deberá verificarlo.'
      );


    if (!confirmed) {
      return;
    }


    this.updatingId =
      report.id;


    try {

      await updateDoc(
        doc(
          db,
          'reports',
          report.id
        ),
        {
          status:
            'pendiente_confirmacion',

          progress:
            90,

          workerCompletedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()
        }
      );


      if (
        report.userId
      ) {

        await addDoc(
          collection(
            db,
            'notifications'
          ),
          {
            userId:
              report.userId,

            reportId:
              report.id,

            type:
              'awaiting_confirmation',

            title:
              'Confirma la solución',

            message:
              `El trabajador indicó que "${report.title}" ya fue solucionado. Confirma si el problema realmente fue resuelto.`,

            read:
              false,

            createdAt:
              serverTimestamp()
          }
        );

      }


      report.status =
        'pendiente_confirmacion';

      report.progress =
        90;

      report.workerCompletedAt =
        new Date();


      this.activeTab =
        'pendiente_confirmacion';


      this.applyTab();

    } catch (error) {

      console.error(
        error
      );


      alert(
        'No se pudo enviar el trabajo para confirmación.'
      );

    } finally {

      this.updatingId =
        '';

    }

  }


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


  openMaps(
    report: WorkerReport
  ): void {

    if (
      report.latitude === null ||
      report.longitude === null
    ) {

      alert(
        'Este reporte no tiene ubicación válida.'
      );

      return;

    }


    const url =
      `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;


    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

  }


  formatDate(
    value: any
  ): string {

    if (!value) {

      return 'Sin registrar';

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


  getPriorityLabel(
    priority: string
  ): string {

    switch (
      priority
    ) {

      case 'urgente':
        return 'Urgente';

      case 'alta':
        return 'Alta';

      case 'media':
        return 'Media';

      default:
        return 'Baja';

    }

  }


  private getTimestamp(
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