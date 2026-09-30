import {
  Routes
} from '@angular/router';

import {
  WelcomeComponent
} from './pages/welcome/welcome.component';

import {
  LoginComponent
} from './pages/login/login.component';

import {
  DashboardComponent
} from './pages/dashboard/dashboard.component';

import {
  MapComponent
} from './pages/map/map.component';

import {
  NewReportComponent
} from './pages/new-report/new-report.component';

import {
  ReportDetailComponent
} from './pages/report-detail/report-detail.component';

import {
  StatsComponent
} from './pages/stats/stats.component';

import {
  ProfileComponent
} from './pages/profile/profile.component';

import {
  NotificationsComponent
} from './pages/notifications/notifications.component';

import {
  SettingsComponent
} from './pages/settings/settings.component';

import {
  AdminDashboardComponent
} from './pages/admin-dashboard/admin-dashboard.component';

import {
  AdminAnalyticsComponent
} from './pages/admin-analytics/admin-analytics.component';

import {
  WorkerDashboardComponent
} from './pages/worker-dashboard/worker-dashboard.component';

import {
  roleGuard
} from './guards/role.guard';


export const routes:
Routes = [

  {
    path: '',

    component:
      WelcomeComponent
  },


  {
    path: 'login',

    component:
      LoginComponent
  },


  /*
    =========================
    CLIENTE
    =========================
  */

  {
    path: 'dashboard',

    component:
      DashboardComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  {
    path: 'mapa',

    component:
      MapComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  {
    path: 'nuevo-reporte',

    component:
      NewReportComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  {
    path: 'estadisticas',

    component:
      StatsComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  {
    path: 'perfil',

    component:
      ProfileComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  {
    path: 'notificaciones',

    component:
      NotificationsComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  {
    path: 'configuracion',

    component:
      SettingsComponent,

    canActivate: [
      roleGuard(
        'client'
      )
    ]
  },


  /*
    =========================
    ADMIN
    =========================
  */

  {
    path: 'admin',

    component:
      AdminDashboardComponent,

    canActivate: [
      roleGuard(
        'admin'
      )
    ]
  },


  {
    path: 'admin/analitica',

    component:
      AdminAnalyticsComponent,

    canActivate: [
      roleGuard(
        'admin'
      )
    ]
  },


  /*
    =========================
    TRABAJADOR
    =========================
  */

  {
    path: 'trabajador',

    component:
      WorkerDashboardComponent,

    canActivate: [
      roleGuard(
        'worker'
      )
    ]
  },


  /*
    =========================
    REPORTE
    =========================
  */

  {
    path: 'reporte/:id',

    component:
      ReportDetailComponent,

    canActivate: [
      roleGuard(
        'client',
        'admin',
        'worker'
      )
    ]
  },


  {
    path: '**',

    redirectTo: ''
  }

];