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
  doc,
  getDocs,
  query,
  updateDoc,
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
  AppLanguage,
  LanguageService
} from '../../services/language.service';


interface NotificationItem {

  id: string;

  reportId: string;

  type: string;

  title: string;

  message: string;

  read: boolean;

  createdAt: any;

}


@Component({
  selector:
    'app-notifications',

  standalone:
    true,

  imports: [
    CommonModule,
    NavComponent
  ],

  templateUrl:
    './notifications.component.html',

  styleUrl:
    './notifications.component.css'
})
export class NotificationsComponent
implements OnInit {

  notifications:
    NotificationItem[] = [];

  loading = true;


  constructor(
    private router: Router,
    public languageService:
      LanguageService
  ) {}


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
     INICIO
  ========================= */

  ngOnInit(): void {

    onAuthStateChanged(
      auth,
      async user => {

        if (
          !user
        ) {

          this.loading =
            false;

          return;

        }


        await this.loadNotifications(
          user.uid
        );

      }
    );

  }


  /* =========================
     CARGAR NOTIFICACIONES
  ========================= */

  async loadNotifications(
    userId: string
  ): Promise<void> {

    this.loading =
      true;


    try {

      const snapshot =
        await getDocs(
          query(
            collection(
              db,
              'notifications'
            ),
            where(
              'userId',
              '==',
              userId
            )
          )
        );


      this.notifications =
        snapshot.docs
          .map(
            item => {

              const data =
                item.data();


              return {

                id:
                  item.id,

                reportId:
                  data['reportId']
                  || '',

                type:
                  data['type']
                  || 'info',

                title:
                  data['title']
                  ||
                  this.t(
                    'notifications.defaultTitle'
                  ),

                message:
                  data['message']
                  || '',

                read:
                  Boolean(
                    data['read']
                  ),

                createdAt:
                  data['createdAt']
                  || null

              };

            }
          )
          .sort(
            (a, b) => {

              const timeA =
                a.createdAt
                  ?.toMillis?.()
                ?? 0;

              const timeB =
                b.createdAt
                  ?.toMillis?.()
                ?? 0;


              return (
                timeB -
                timeA
              );

            }
          );

    }

    catch (error) {

      console.error(
        'Error cargando notificaciones:',
        error
      );

    }

    finally {

      this.loading =
        false;

    }

  }


  /* =========================
     ABRIR NOTIFICACION
  ========================= */

  async openNotification(
    notification:
      NotificationItem
  ): Promise<void> {

    try {

      if (
        !notification.read
      ) {

        await updateDoc(
          doc(
            db,
            'notifications',
            notification.id
          ),
          {
            read:
              true
          }
        );


        notification.read =
          true;

      }


      if (
        notification.reportId
      ) {

        await this.router.navigate(
          [
            '/reporte',
            notification.reportId
          ]
        );

      }

    }

    catch (error) {

      console.error(
        error
      );

    }

  }


  /* =========================
     MARCAR TODAS COMO LEIDAS
  ========================= */

  async markAllAsRead():
    Promise<void> {

    const unread =
      this.notifications.filter(
        item =>
          !item.read
      );


    try {

      for (
        const notification
        of unread
      ) {

        await updateDoc(
          doc(
            db,
            'notifications',
            notification.id
          ),
          {
            read:
              true
          }
        );


        notification.read =
          true;

      }

    }

    catch (error) {

      console.error(
        'Error marcando notificaciones:',
        error
      );

    }

  }


  /* =========================
     CONTADOR
  ========================= */

  unreadCount():
    number {

    return this.notifications
      .filter(
        item =>
          !item.read
      )
      .length;

  }


  /* =========================
     ICONO
  ========================= */

  getIcon(
    type: string
  ): string {

    switch (
      type
    ) {

      case 'assigned':
        return '👷';

      case 'started':
        return '🛠️';

      case 'resolved':
        return '✅';

      default:
        return '🔔';

    }

  }


  /* =========================
     FECHA
  ========================= */

  formatDate(
    value: any
  ): string {

    if (
      !value
    ) {

      return this.t(
        'notifications.now'
      );

    }


    const date =
      typeof value?.toDate ===
      'function'

        ? value.toDate()

        : new Date(
            value
          );


    const locale =
      this.getLocale(
        this.languageService
          .getLanguage()
      );


    return new Intl.DateTimeFormat(
      locale,
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


  private getLocale(
    language:
      AppLanguage
  ): string {

    switch (
      language
    ) {

      case 'English':
        return 'en-US';

      case 'Português':
        return 'pt-BR';

      case 'Français':
        return 'fr-FR';

      case 'Русский':
        return 'ru-RU';

      default:
        return 'es-EC';

    }

  }

}