import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import {
  onAuthStateChanged
} from 'firebase/auth';

import * as QRCode from 'qrcode';

import {
  auth,
  db
} from '../../../main';

import {
  NavComponent
} from '../../shared/nav/nav.component';


interface ReportDetail {

  id: string;

  userId: string;

  userEmail: string;

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

  supportCount: number;

  assignedWorkerName: string;

  assignedWorkerEmail: string;

  createdAt: any;

  assignedAt: any;

  startedAt: any;

  workerCompletedAt: any;

  citizenConfirmedAt: any;

  citizenRejectedAt: any;

  resolvedAt: any;

}


@Component({
  selector:
    'app-report-detail',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    NavComponent
  ],

  templateUrl:
    './report-detail.component.html',

  styleUrl:
    './report-detail.component.css'
})
export class ReportDetailComponent
implements OnInit {

  report:
    ReportDetail | null = null;

  loading =
    true;

  updating =
    false;

  currentUserId =
    '';

  qrVisible =
    false;

  qrLoading =
    false;

  qrDataUrl =
    '';

  qrReportUrl =
    '';

  qrErrorMessage =
    '';


  constructor(
    private route:
      ActivatedRoute
  ) {}


  ngOnInit():
  void {

    onAuthStateChanged(
      auth,
      async user => {

        this.currentUserId =
          user?.uid || '';

        await this.loadReport();

      }
    );

  }


  async loadReport():
  Promise<void> {

    const id =
      this.route.snapshot
        .paramMap
        .get(
          'id'
        );


    if (!id) {

      this.loading =
        false;

      return;

    }


    try {

      const snapshot =
        await getDoc(
          doc(
            db,
            'reports',
            id
          )
        );


      if (
        !snapshot.exists()
      ) {

        this.loading =
          false;

        return;

      }


      const data =
        snapshot.data();


      this.report = {

        id:
          snapshot.id,

        userId:
          data['userId'] || '',

        userEmail:
          data['userEmail'] || '',

        title:
          data['title'] || 'Reporte',

        category:
          data['category'] || 'Otro',

        description:
          data['description'] || '',

        location:
          data['location'] || 'Sin ubicación',

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
          data['status'] || 'pendiente',

        priority:
          data['priority'] || 'baja',

        progress:
          Number(
            data['progress'] || 0
          ),

        supportCount:
          Number(
            data['supportCount'] || 0
          ),

        assignedWorkerName:
          data['assignedWorkerName'] || '',

        assignedWorkerEmail:
          data['assignedWorkerEmail'] || '',

        createdAt:
          data['createdAt'] || null,

        assignedAt:
          data['assignedAt'] || null,

        startedAt:
          data['startedAt'] || null,

        workerCompletedAt:
          data['workerCompletedAt'] || null,

        citizenConfirmedAt:
          data['citizenConfirmedAt'] || null,

        citizenRejectedAt:
          data['citizenRejectedAt'] || null,

        resolvedAt:
          data['resolvedAt'] || null

      };


      this.prepareReportUrl();


    } catch (error) {

      console.error(
        'Error cargando reporte:',
        error
      );

    } finally {

      this.loading =
        false;

    }

  }


  /*
    ============================
    QR
    ============================
  */

  private prepareReportUrl():
  void {

    if (
      !this.report
    ) {

      return;

    }


    /*
      En la versión web se utiliza
      automáticamente el dominio
      donde está abierto GuayaLink.

      Ejemplo:
      https://tudominio.com/reporte/ID

      En localhost será:
      http://localhost:4200/reporte/ID
    */

    const origin =
      window.location.origin;


    this.qrReportUrl =
      `${origin}/reporte/${this.report.id}`;

  }


  async toggleQR():
  Promise<void> {

    if (
      this.qrVisible
    ) {

      this.qrVisible =
        false;

      return;

    }


    this.qrVisible =
      true;


    if (
      !this.qrDataUrl
    ) {

      await this.generateQR();

    }

  }


  private async generateQR():
  Promise<void> {

    if (
      !this.report
    ) {

      return;

    }


    this.qrLoading =
      true;

    this.qrErrorMessage =
      '';


    try {

      if (
        !this.qrReportUrl
      ) {

        this.prepareReportUrl();

      }


      this.qrDataUrl =
        await QRCode.toDataURL(
          this.qrReportUrl,
          {
            width:
              500,

            margin:
              2,

            errorCorrectionLevel:
              'H'
          }
        );


    } catch (error) {

      console.error(
        'Error generando QR:',
        error
      );


      this.qrErrorMessage =
        'No se pudo generar el código QR.';


    } finally {

      this.qrLoading =
        false;

    }

  }


  downloadQR():
  void {

    if (
      !this.qrDataUrl ||
      !this.report
    ) {

      return;

    }


    const link =
      document.createElement(
        'a'
      );


    link.href =
      this.qrDataUrl;


    link.download =
      `GuayaLink-Reporte-${this.report.id}.png`;


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );

  }


  async copyReportLink():
  Promise<void> {

    if (
      !this.qrReportUrl
    ) {

      return;

    }


    try {

      await navigator.clipboard.writeText(
        this.qrReportUrl
      );


      alert(
        'Enlace del reporte copiado.'
      );


    } catch (error) {

      console.error(
        'No se pudo copiar:',
        error
      );


      alert(
        'No se pudo copiar el enlace.'
      );

    }

  }


  /*
    ============================
    APOYAR REPORTE
    ============================
  */

  async supportReport():
  Promise<void> {

    if (
      !this.report ||
      !auth.currentUser
    ) {

      return;

    }


    this.updating =
      true;


    try {

      await updateDoc(
        doc(
          db,
          'reports',
          this.report.id
        ),
        {
          supportCount:
            increment(1)
        }
      );


      this.report.supportCount++;


    } catch (error) {

      console.error(
        error
      );


    } finally {

      this.updating =
        false;

    }

  }


  /*
    ============================
    CONFIRMAR SOLUCIÓN
    ============================
  */

  async confirmResolution():
  Promise<void> {

    if (
      !this.report ||
      !this.isOwner()
    ) {

      return;

    }


    const accepted =
      confirm(
        '¿Confirmas que el problema realmente fue solucionado?'
      );


    if (!accepted) {

      return;

    }


    this.updating =
      true;


    try {

      await updateDoc(
        doc(
          db,
          'reports',
          this.report.id
        ),
        {

          status:
            'resuelto',

          progress:
            100,

          resolvedAt:
            serverTimestamp(),

          citizenConfirmedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()

        }
      );


      this.report.status =
        'resuelto';

      this.report.progress =
        100;

      this.report.resolvedAt =
        new Date();

      this.report.citizenConfirmedAt =
        new Date();


    } catch (error) {

      console.error(
        error
      );


      alert(
        'No pudimos confirmar la solución.'
      );


    } finally {

      this.updating =
        false;

    }

  }


  /*
    ============================
    RECHAZAR SOLUCIÓN
    ============================
  */

  async rejectResolution():
  Promise<void> {

    if (
      !this.report ||
      !this.isOwner()
    ) {

      return;

    }


    const accepted =
      confirm(
        '¿El problema todavía existe? El reporte volverá a En proceso.'
      );


    if (!accepted) {

      return;

    }


    this.updating =
      true;


    try {

      await updateDoc(
        doc(
          db,
          'reports',
          this.report.id
        ),
        {

          status:
            'en_proceso',

          progress:
            70,

          citizenRejectedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()

        }
      );


      this.report.status =
        'en_proceso';

      this.report.progress =
        70;

      this.report.citizenRejectedAt =
        new Date();


    } catch (error) {

      console.error(
        error
      );


      alert(
        'No pudimos actualizar el reporte.'
      );


    } finally {

      this.updating =
        false;

    }

  }


  /*
    ============================
    PROPIETARIO
    ============================
  */

  isOwner():
  boolean {

    return !!this.report
      &&
      this.currentUserId ===
      this.report.userId;

  }


  /*
    ============================
    GOOGLE MAPS
    ============================
  */

  openMaps():
  void {

    if (
      !this.report ||
      this.report.latitude === null ||
      this.report.longitude === null
    ) {

      return;

    }


    window.open(
      `https://www.google.com/maps?q=${this.report.latitude},${this.report.longitude}`,
      '_blank',
      'noopener,noreferrer'
    );

  }


  /*
    ============================
    ESTADO
    ============================
  */

  getStatusLabel():
  string {

    if (
      !this.report
    ) {

      return '';

    }


    switch (
      this.report.status
    ) {

      case 'pendiente':

        return 'Pendiente';


      case 'asignado':

        return 'Asignado';


      case 'en_proceso':

        return 'En proceso';


      case 'pendiente_confirmacion':

        return 'Esperando confirmación';


      case 'resuelto':

        return 'Resuelto';


      default:

        return this.report.status;

    }

  }


  /*
    ============================
    PRIORIDAD
    ============================
  */

  getPriorityLabel():
  string {

    if (
      !this.report
    ) {

      return '';

    }


    switch (
      this.report.priority
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


  /*
    ============================
    FECHA
    ============================
  */

  formatDate(
    value: any
  ):
  string {

    if (
      !value
    ) {

      return 'Pendiente';

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

}