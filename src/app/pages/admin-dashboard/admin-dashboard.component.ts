import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

import { signOut } from 'firebase/auth';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  auth,
  db
} from '../../../main';

interface Worker {
  uid: string;
  email: string;
  name: string;
}

interface AdminReport {
  id: string;

  title: string;
  category: string;
  description: string;

  status: string;

  priority: string;
  priorityScore: number;

  progress: number;

  userId: string;
  userEmail: string;

  location: string;

  assignedWorkerId: string;
  assignedWorkerEmail: string;
  assignedWorkerName: string;

  selectedWorkerId: string;

  supportCount: number;

  createdAt: any;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './admin-dashboard.component.html',
  styleUrl:
    './admin-dashboard.component.css'
})
export class AdminDashboardComponent
implements OnInit {

  reports:
    AdminReport[] = [];

  filteredReports:
    AdminReport[] = [];

  workers:
    Worker[] = [];

  loading = true;

  assigningId = '';

  searchText = '';

  statusFilter =
    'todos';

  priorityFilter =
    'todas';

  categoryFilter =
    'todas';

  workerFilter =
    'todos';

  sortOrder =
    'priority';

  categories = [
    'todas',
    'Calles',
    'Alumbrado',
    'Limpieza',
    'Transporte',
    'Seguridad',
    'Otro'
  ];

  statuses = [
    'todos',
    'pendiente',
    'asignado',
    'en_proceso',
    'resuelto'
  ];

  priorities = [
    'todas',
    'urgente',
    'alta',
    'media',
    'baja'
  ];

  constructor(
    private router: Router
  ) {}

  async ngOnInit():
  Promise<void> {

    await this.refresh();
  }

  async refresh():
  Promise<void> {

    this.loading = true;

    try {

      await Promise.all([
        this.loadWorkers(),
        this.loadReports()
      ]);

      this.applyFilters();

    } catch (error) {

      console.error(
        'Error cargando admin:',
        error
      );

    } finally {

      this.loading = false;
    }
  }

  private async loadWorkers():
  Promise<void> {

    const snapshot =
      await getDocs(
        query(
          collection(
            db,
            'users'
          ),
          where(
            'role',
            '==',
            'worker'
          )
        )
      );

    this.workers =
      snapshot.docs.map(
        worker => {

          const data =
            worker.data();

          return {
            uid:
              worker.id,

            email:
              data['email'] || '',

            name:
              data['name'] || ''
          };
        }
      );
  }

  private async loadReports():
  Promise<void> {

    const snapshot =
      await getDocs(
        collection(
          db,
          'reports'
        )
      );

    this.reports =
      snapshot.docs.map(
        report => {

          const data =
            report.data();

          return {
            id:
              report.id,

            title:
              data['title']
              || 'Reporte',

            category:
              data['category']
              || 'Otro',

            description:
              data['description']
              || '',

            status:
              data['status']
              || 'pendiente',

            priority:
              data['priority']
              || 'baja',

            priorityScore:
              Number(
                data['priorityScore']
                || 0
              ),

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

            location:
              data['location']
              || 'Sin ubicación',

            assignedWorkerId:
              data['assignedWorkerId']
              || '',

            assignedWorkerEmail:
              data['assignedWorkerEmail']
              || '',

            assignedWorkerName:
              data['assignedWorkerName']
              || '',

            selectedWorkerId:
              data['assignedWorkerId']
              || '',

            supportCount:
              Number(
                data['supportCount']
                || 0
              ),

            createdAt:
              data['createdAt']
              || null
          };
        }
      );
  }

  applyFilters():
  void {

    let result =
      [...this.reports];

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    if (search) {

      result =
        result.filter(
          report => {

            const text =
              `
                ${report.title}
                ${report.description}
                ${report.category}
                ${report.userEmail}
                ${report.location}
                ${report.assignedWorkerEmail}
                ${report.assignedWorkerName}
              `
                .toLowerCase();

            return text.includes(
              search
            );
          }
        );
    }

    if (
      this.statusFilter !==
      'todos'
    ) {

      result =
        result.filter(
          report =>
            report.status ===
            this.statusFilter
        );
    }

    if (
      this.priorityFilter !==
      'todas'
    ) {

      result =
        result.filter(
          report =>
            report.priority ===
            this.priorityFilter
        );
    }

    if (
      this.categoryFilter !==
      'todas'
    ) {

      result =
        result.filter(
          report =>
            report.category ===
            this.categoryFilter
        );
    }

    if (
      this.workerFilter ===
      'sin_asignar'
    ) {

      result =
        result.filter(
          report =>
            !report.assignedWorkerId
        );

    } else if (
      this.workerFilter !==
      'todos'
    ) {

      result =
        result.filter(
          report =>
            report.assignedWorkerId ===
            this.workerFilter
        );
    }

    result.sort(
      (a, b) => {

        if (
          this.sortOrder ===
          'priority'
        ) {

          const priorityDifference =
            this.priorityWeight(
              b.priority
            ) -
            this.priorityWeight(
              a.priority
            );

          if (
            priorityDifference !==
            0
          ) {

            return priorityDifference;
          }

          return (
            this.getTimestamp(
              b.createdAt
            ) -
            this.getTimestamp(
              a.createdAt
            )
          );
        }

        if (
          this.sortOrder ===
          'newest'
        ) {

          return (
            this.getTimestamp(
              b.createdAt
            ) -
            this.getTimestamp(
              a.createdAt
            )
          );
        }

        if (
          this.sortOrder ===
          'oldest'
        ) {

          return (
            this.getTimestamp(
              a.createdAt
            ) -
            this.getTimestamp(
              b.createdAt
            )
          );
        }

        return 0;
      }
    );

    this.filteredReports =
      result;
  }

  clearFilters():
  void {

    this.searchText = '';

    this.statusFilter =
      'todos';

    this.priorityFilter =
      'todas';

    this.categoryFilter =
      'todas';

    this.workerFilter =
      'todos';

    this.sortOrder =
      'priority';

    this.applyFilters();
  }

  exportCSV():
  void {

    if (
      this.filteredReports.length ===
      0
    ) {

      alert(
        'No hay reportes para exportar.'
      );

      return;
    }

    const headers = [
      'ID',
      'Título',
      'Descripción',
      'Categoría',
      'Prioridad',
      'Puntaje de prioridad',
      'Estado',
      'Progreso',
      'Ubicación',
      'Ciudadano',
      'Trabajador',
      'Apoyos',
      'Fecha'
    ];

    const rows =
      this.filteredReports.map(
        report => [

          report.id,

          report.title,

          report.description,

          report.category,

          this.getPriorityLabel(
            report.priority
          ),

          report.priorityScore,

          this.getStatus(
            report.status
          ),

          `${report.progress}%`,

          report.location,

          report.userEmail ||
          'Sin correo',

          this.getWorkerName(
            report
          ),

          report.supportCount,

          this.formatDate(
            report.createdAt
          )
        ]
      );

    const csvRows = [
      headers,
      ...rows
    ];

    const csvContent =
      csvRows
        .map(
          row =>
            row
              .map(
                value =>
                  this.escapeCSV(
                    String(
                      value ?? ''
                    )
                  )
              )
              .join(',')
        )
        .join('\r\n');

    const blob =
      new Blob(
        [
          '\uFEFF',
          csvContent
        ],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );

    this.downloadBlob(
      blob,
      this.getExportFileName(
        'csv'
      )
    );
  }

  exportPDF():
  void {

    if (
      this.filteredReports.length ===
      0
    ) {

      alert(
        'No hay reportes para exportar.'
      );

      return;
    }

    const pdf =
      new jsPDF({
        orientation:
          'landscape',

        unit:
          'mm',

        format:
          'a4'
      });

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      20
    );

    pdf.text(
      'GuayaLink - Reportes',
      14,
      17
    );

    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(
      10
    );

    pdf.text(
      `Generado: ${this.getCurrentDateLabel()}`,
      14,
      24
    );

    pdf.text(
      `Reportes exportados: ${this.filteredReports.length}`,
      14,
      30
    );

    pdf.text(
      this.getActiveFiltersText(),
      14,
      36
    );

    const body =
      this.filteredReports.map(
        report => [

          report.title,

          report.category,

          this.getPriorityLabel(
            report.priority
          ),

          this.getStatus(
            report.status
          ),

          report.location,

          report.userEmail ||
          'Sin correo',

          this.getWorkerName(
            report
          ),

          String(
            report.supportCount
          ),

          this.formatDate(
            report.createdAt
          )
        ]
      );

    autoTable(
      pdf,
      {
        startY:
          43,

        head: [[
          'Título',
          'Categoría',
          'Prioridad',
          'Estado',
          'Ubicación',
          'Ciudadano',
          'Trabajador',
          'Apoyos',
          'Fecha'
        ]],

        body,

        styles: {
          fontSize:
            7,

          cellPadding:
            2,

          overflow:
            'linebreak'
        },

        headStyles: {
          fillColor:
            [31, 78, 121],

          textColor:
            [255, 255, 255]
        },

        alternateRowStyles: {
          fillColor:
            [248, 251, 255]
        },

        columnStyles: {
          0: {
            cellWidth:
              31
          },

          1: {
            cellWidth:
              20
          },

          2: {
            cellWidth:
              18
          },

          3: {
            cellWidth:
              20
          },

          4: {
            cellWidth:
              42
          },

          5: {
            cellWidth:
              36
          },

          6: {
            cellWidth:
              32
          },

          7: {
            cellWidth:
              15
          },

          8: {
            cellWidth:
              29
          }
        },

        margin: {
          left:
            10,

          right:
            10
        }
      }
    );

    pdf.save(
      this.getExportFileName(
        'pdf'
      )
    );
  }

  private escapeCSV(
    value: string
  ): string {

    const safeValue =
      value.replace(
        /"/g,
        '""'
      );

    return `"${safeValue}"`;
  }

  private downloadBlob(
    blob: Blob,
    fileName: string
  ): void {

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        'a'
      );

    anchor.href =
      url;

    anchor.download =
      fileName;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    document.body.removeChild(
      anchor
    );

    URL.revokeObjectURL(
      url
    );
  }

  private getWorkerName(
    report: AdminReport
  ): string {

    if (
      !report.assignedWorkerId
    ) {

      return 'Sin asignar';
    }

    return (
      report.assignedWorkerName ||
      report.assignedWorkerEmail ||
      'Trabajador asignado'
    );
  }

  private getExportFileName(
    extension:
      'pdf' |
      'csv'
  ): string {

    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        '0'
      );

    const hours =
      String(
        now.getHours()
      ).padStart(
        2,
        '0'
      );

    const minutes =
      String(
        now.getMinutes()
      ).padStart(
        2,
        '0'
      );

    return (
      `GuayaLink-Reportes-` +
      `${year}-${month}-${day}-` +
      `${hours}-${minutes}.` +
      extension
    );
  }

  private getCurrentDateLabel():
  string {

    return new Intl.DateTimeFormat(
      'es-EC',
      {
        dateStyle:
          'medium',

        timeStyle:
          'short'
      }
    ).format(
      new Date()
    );
  }

  private getActiveFiltersText():
  string {

    const filters:
      string[] = [];

    if (
      this.statusFilter !==
      'todos'
    ) {

      filters.push(
        `Estado: ${this.getStatus(
          this.statusFilter
        )}`
      );
    }

    if (
      this.priorityFilter !==
      'todas'
    ) {

      filters.push(
        `Prioridad: ${this.getPriorityLabel(
          this.priorityFilter
        )}`
      );
    }

    if (
      this.categoryFilter !==
      'todas'
    ) {

      filters.push(
        `Categoría: ${this.categoryFilter}`
      );
    }

    if (
      this.workerFilter ===
      'sin_asignar'
    ) {

      filters.push(
        'Trabajador: Sin asignar'
      );

    } else if (
      this.workerFilter !==
      'todos'
    ) {

      const worker =
        this.workers.find(
          item =>
            item.uid ===
            this.workerFilter
        );

      filters.push(
        `Trabajador: ${
          worker?.name ||
          worker?.email ||
          'Seleccionado'
        }`
      );
    }

    if (
      this.searchText.trim()
    ) {

      filters.push(
        `Búsqueda: ${this.searchText.trim()}`
      );
    }

    if (
      filters.length ===
      0
    ) {

      return 'Filtros: Todos los reportes';
    }

    return (
      'Filtros: ' +
      filters.join(
        ' | '
      )
    );
  }

  private priorityWeight(
    priority: string
  ): number {

    switch (
      priority
    ) {

      case 'urgente':
        return 4;

      case 'alta':
        return 3;

      case 'media':
        return 2;

      case 'baja':
        return 1;

      default:
        return 0;
    }
  }

  private getTimestamp(
    value: any
  ): number {

    if (
      !value
    ) {

      return 0;
    }

    if (
      typeof value?.toMillis ===
      'function'
    ) {

      return value.toMillis();
    }

    const date =
      new Date(
        value
      );

    return date.getTime();
  }

  async assignWorker(
    report: AdminReport
  ): Promise<void> {

    if (
      !report.selectedWorkerId
    ) {

      alert(
        'Selecciona un trabajador.'
      );

      return;
    }

    const worker =
      this.workers.find(
        item =>
          item.uid ===
          report.selectedWorkerId
      );

    if (
      !worker
    ) {

      alert(
        'Trabajador no encontrado.'
      );

      return;
    }

    this.assigningId =
      report.id;

    try {

      await updateDoc(
        doc(
          db,
          'reports',
          report.id
        ),
        {
          assignedWorkerId:
            worker.uid,

          assignedWorkerEmail:
            worker.email,

          assignedWorkerName:
            worker.name,

          assignedAt:
            serverTimestamp(),

          status:
            'asignado',

          progress:
            25,

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
              'assigned',

            title:
              'Tu reporte fue asignado',

            message:
              `El reporte "${report.title}" fue asignado a un trabajador.`,

            read:
              false,

            createdAt:
              serverTimestamp()
          }
        );
      }

      await this.refresh();

    } catch (error) {

      console.error(
        'Error asignando:',
        error
      );

      alert(
        'No se pudo asignar el trabajador.'
      );

    } finally {

      this.assigningId =
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

  getStatus(
    status: string
  ): string {

    switch (
      status
    ) {

      case 'pendiente':
        return 'Pendiente';

      case 'asignado':
        return 'Asignado';

      case 'en_proceso':
        return 'En proceso';

      case 'pendiente_confirmacion':
        return 'Pendiente de confirmación';

      case 'resuelto':
        return 'Resuelto';

      default:
        return status;
    }
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

  countStatus(
    status: string
  ): number {

    return this.reports.filter(
      report =>
        report.status ===
        status
    ).length;
  }

  countPriority(
    priority: string
  ): number {

    return this.reports.filter(
      report =>
        report.priority ===
        priority
    ).length;
  }

  getUnassignedCount():
  number {

    return this.reports.filter(
      report =>
        !report.assignedWorkerId
    ).length;
  }

  formatDate(
    value: any
  ): string {

    if (
      !value
    ) {

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