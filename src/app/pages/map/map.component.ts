import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  collection,
  getDocs
} from 'firebase/firestore';

import {
  db
} from '../../../main';

import {
  NavComponent
} from '../../shared/nav/nav.component';

import {
  LanguageService
} from '../../services/language.service';

import * as L from 'leaflet';

import 'leaflet.heat';


interface ReportMapItem {

  id: string;

  title: string;

  category: string;

  status: string;

  description: string;

  latitude: number;

  longitude: number;

  supportCount: number;

  priority: string;

}


interface ZoneRanking {

  name: string;

  reports: number;

  percentage: number;

}


interface MapCategory {

  value: string;

  labelKey: string;

}


@Component({
  selector: 'app-map',

  standalone: true,

  imports: [
    CommonModule,
    NavComponent
  ],

  templateUrl:
    './map.component.html',

  styleUrl:
    './map.component.css'
})
export class MapComponent
implements AfterViewInit, OnDestroy {

  private map!: L.Map;

  private markerLayer =
    L.layerGroup();

  private heatLayer: any =
    null;

  private userMarker:
    L.Marker | null =
      null;


  reports:
    ReportMapItem[] = [];

  filteredReports:
    ReportMapItem[] = [];

  zones:
    ZoneRanking[] = [];


  loading = true;

  locating = false;


  selectedCategory =
    'Todos';


  mapMode:
    'markers' |
    'heat' =
      'markers';


  categories:
    MapCategory[] = [

      {
        value: 'Todos',
        labelKey: 'map.categoryAll'
      },

      {
        value: 'Calles',
        labelKey: 'map.categoryStreets'
      },

      {
        value: 'Alumbrado',
        labelKey: 'map.categoryLighting'
      },

      {
        value: 'Limpieza',
        labelKey: 'map.categoryCleaning'
      },

      {
        value: 'Transporte',
        labelKey: 'map.categoryTransport'
      },

      {
        value: 'Seguridad',
        labelKey: 'map.categorySecurity'
      },

      {
        value: 'Otro',
        labelKey: 'map.categoryOther'
      }

    ];


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
     CICLO DE VIDA
  ========================= */

  async ngAfterViewInit():
    Promise<void> {

    this.createMap();

    await this.loadReports();

  }


  ngOnDestroy():
    void {

    if (
      this.map
    ) {

      this.map.remove();

    }

  }


  /* =========================
     CREAR MAPA
  ========================= */

  private createMap():
    void {

    this.map =
      L.map(
        'real-map',
        {
          zoomControl:
            false
        }
      )
        .setView(
          [
            -2.170998,
            -79.922359
          ],
          13
        );


    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom:
          19,

        attribution:
          '&copy; OpenStreetMap contributors'
      }
    )
      .addTo(
        this.map
      );


    L.control.zoom(
      {
        position:
          'bottomright'
      }
    )
      .addTo(
        this.map
      );


    this.markerLayer
      .addTo(
        this.map
      );


    setTimeout(
      () => {

        this.map.invalidateSize();

      },
      250
    );

  }


  /* =========================
     CARGAR REPORTES
  ========================= */

  async loadReports():
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


      const loadedReports:
        ReportMapItem[] = [];


      snapshot.forEach(
        documentSnapshot => {

          const data =
            documentSnapshot.data();


          const latitude =
            Number(
              data['latitude']
            );


          const longitude =
            Number(
              data['longitude']
            );


          if (
            !Number.isFinite(
              latitude
            ) ||
            !Number.isFinite(
              longitude
            )
          ) {

            return;

          }


          loadedReports.push(
            {

              id:
                documentSnapshot.id,

              title:
                data['title'] ||
                this.t(
                  'map.defaultReport'
                ),

              category:
                data['category'] ||
                'Otro',

              status:
                data['status'] ||
                'pendiente',

              description:
                data['description'] ||
                '',

              latitude,

              longitude,

              supportCount:
                Number(
                  data['supportCount'] ||
                  0
                ),

              priority:
                data['priority'] ||
                'baja'

            }
          );

        }
      );


      this.reports =
        loadedReports;


      this.calculateZones();


      this.filterReports(
        'Todos'
      );

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
     FILTROS
  ========================= */

  filterReports(
    category: string
  ): void {

    this.selectedCategory =
      category;


    if (
      category ===
      'Todos'
    ) {

      this.filteredReports =
        [
          ...this.reports
        ];

    }

    else {

      this.filteredReports =
        this.reports.filter(
          report =>
            report.category ===
            category
        );

    }


    this.updateMap();

  }


  /* =========================
     MODO DEL MAPA
  ========================= */

  setMapMode(
    mode:
      'markers' |
      'heat'
  ): void {

    this.mapMode =
      mode;


    this.updateMap();

  }


  private updateMap():
    void {

    this.markerLayer
      .clearLayers();


    if (
      this.heatLayer
    ) {

      this.map.removeLayer(
        this.heatLayer
      );

      this.heatLayer =
        null;

    }


    if (
      this.mapMode ===
      'heat'
    ) {

      this.drawHeatmap();

    }

    else {

      this.drawMarkers();

    }


    this.fitMapToReports();

  }


  /* =========================
     MARCADORES
  ========================= */

  private drawMarkers():
    void {

    this.filteredReports
      .forEach(
        report => {

          const icon =
            L.divIcon(
              {

                className:
                  'guayalink-marker-wrapper',

                html:
                  `
                    <div
                      class="
                        guayalink-marker
                        ${this.getMarkerClass(
                          report.priority
                        )}
                      "
                    >
                      <span>
                        ${this.getCategoryIcon(
                          report.category
                        )}
                      </span>
                    </div>
                  `,

                iconSize:
                  [
                    46,
                    46
                  ],

                iconAnchor:
                  [
                    23,
                    40
                  ],

                popupAnchor:
                  [
                    0,
                    -37
                  ]

              }
            );


          const marker =
            L.marker(
              [
                report.latitude,
                report.longitude
              ],
              {
                icon
              }
            );


          const safeTitle =
            this.escapeHtml(
              report.title
            );


          const safeDescription =
            this.escapeHtml(
              report.description
            );


          const safeCategory =
            this.escapeHtml(
              this.getCategoryLabel(
                report.category
              )
            );


          const priorityText =
            this.escapeHtml(
              this.t(
                'map.priority'
              )
            );


          const reportButtonText =
            this.escapeHtml(
              this.t(
                'map.viewReport'
              )
            );


          marker.bindPopup(
            `
              <div class="map-popup">

                <div class="popup-category">
                  ${safeCategory}
                </div>

                <h3>
                  ${safeTitle}
                </h3>

                <p>
                  ${safeDescription}
                </p>

                <div class="popup-meta">

                  <span>
                    ${priorityText}:
                    ${this.getPriorityLabel(
                      report.priority
                    )}
                  </span>

                  <span>
                    👍 ${report.supportCount}
                  </span>

                </div>

                <button
                  class="popup-report-button"
                  data-report-id="${report.id}"
                >
                  ${reportButtonText}
                </button>

              </div>
            `
          );


          marker.on(
            'popupopen',
            () => {

              setTimeout(
                () => {

                  const button =
                    document.querySelector(
                      `[data-report-id="${report.id}"]`
                    ) as
                      HTMLButtonElement |
                      null;


                  if (
                    button
                  ) {

                    button.onclick =
                      () => {

                        this.openReport(
                          report.id
                        );

                      };

                  }

                },
                0
              );

            }
          );


          marker.addTo(
            this.markerLayer
          );

        }
      );

  }


  /* =========================
     MAPA DE CALOR
  ========================= */

  private drawHeatmap():
    void {

    if (
      this.filteredReports.length ===
      0
    ) {

      return;

    }


    const points:
      [
        number,
        number,
        number
      ][] =
        this.filteredReports.map(
          report => {

            const intensity =
              Math.min(
                1,

                0.35 +

                (
                  report.supportCount *
                  0.08
                ) +

                this.priorityHeatWeight(
                  report.priority
                )
              );


            return [
              report.latitude,
              report.longitude,
              intensity
            ];

          }
        );


    const heat =
      (L as any).heatLayer(
        points,
        {
          radius:
            38,

          blur:
            30,

          maxZoom:
            17,

          minOpacity:
            0.3
        }
      );


    heat.addTo(
      this.map
    );


    this.heatLayer =
      heat;

  }


  private priorityHeatWeight(
    priority: string
  ): number {

    switch (
      priority
    ) {

      case 'urgente':
        return 0.5;

      case 'alta':
        return 0.35;

      case 'media':
        return 0.2;

      default:
        return 0.1;

    }

  }


  /* =========================
     AJUSTAR MAPA
  ========================= */

  private fitMapToReports():
    void {

    if (
      this.filteredReports.length ===
      0
    ) {

      this.map.setView(
        [
          -2.170998,
          -79.922359
        ],
        13
      );

      return;

    }


    if (
      this.filteredReports.length ===
      1
    ) {

      const report =
        this.filteredReports[0];


      this.map.setView(
        [
          report.latitude,
          report.longitude
        ],
        16
      );

      return;

    }


    const bounds =
      L.latLngBounds([]);


    this.filteredReports
      .forEach(
        report => {

          bounds.extend(
            [
              report.latitude,
              report.longitude
            ]
          );

        }
      );


    this.map.fitBounds(
      bounds,
      {
        padding:
          [
            55,
            55
          ],

        maxZoom:
          15
      }
    );


    setTimeout(
      () => {

        this.map.invalidateSize();

      },
      100
    );

  }


  /* =========================
     RANKING DE ZONAS
  ========================= */

  private calculateZones():
    void {

    const groups =
      new Map<
        string,
        number
      >();


    this.reports
      .forEach(
        report => {

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


    const total =
      this.reports.length;


    this.zones =
      Array.from(
        groups.entries()
      )
        .map(
          (
            [
              name,
              reports
            ]
          ) => {

            return {

              name,

              reports,

              percentage:
                total > 0
                  ? Math.round(
                      (
                        reports /
                        total
                      ) *
                      100
                    )
                  : 0

            };

          }
        )
        .sort(
          (a, b) =>
            b.reports -
            a.reports
        )
        .slice(
          0,
          6
        );

  }


  /* =========================
     ZONAS
  ========================= */

  private getApproximateZone(
    latitude: number,
    longitude: number
  ): string {

    const sectors =
      [

        {
          name:
            'Centro de Guayaquil',

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
            'Sur de Guayaquil',

          latitude:
            -2.2300,

          longitude:
            -79.9100
        }

      ];


    let nearest =
      sectors[0];


    let smallestDistance =
      Number.POSITIVE_INFINITY;


    sectors.forEach(
      sector => {

        const distance =
          this.calculateDistance(
            latitude,
            longitude,
            sector.latitude,
            sector.longitude
          );


        if (
          distance <
          smallestDistance
        ) {

          smallestDistance =
            distance;

          nearest =
            sector;

        }

      }
    );


    return nearest.name;

  }


  /* =========================
     UBICACION
  ========================= */

  goToMyLocation():
    void {

    if (
      !navigator.geolocation
    ) {

      alert(
        this.t(
          'map.geolocationUnsupported'
        )
      );

      return;

    }


    this.locating =
      true;


    navigator.geolocation
      .getCurrentPosition(

        position => {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;


          this.map.setView(
            [
              latitude,
              longitude
            ],
            17
          );


          if (
            this.userMarker
          ) {

            this.userMarker.remove();

          }


          const userIcon =
            L.divIcon(
              {

                className:
                  'user-marker-wrapper',

                html:
                  `
                    <div
                      class="user-location-marker"
                    >
                      <div></div>
                    </div>
                  `,

                iconSize:
                  [
                    34,
                    34
                  ],

                iconAnchor:
                  [
                    17,
                    17
                  ]

              }
            );


          this.userMarker =
            L.marker(
              [
                latitude,
                longitude
              ],
              {
                icon:
                  userIcon
              }
            );


          this.userMarker
            .addTo(
              this.map
            )
            .bindPopup(
              `<strong>${this.escapeHtml(
                this.t(
                  'map.yourLocation'
                )
              )}</strong>`
            )
            .openPopup();


          this.locating =
            false;

        },


        () => {

          this.locating =
            false;


          alert(
            this.t(
              'map.locationError'
            )
          );

        },


        {
          enableHighAccuracy:
            true,

          timeout:
            15000
        }

      );

  }


  /* =========================
     ABRIR REPORTE
  ========================= */

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


  /* =========================
     CATEGORIAS
  ========================= */

  getCategoryLabel(
    category: string
  ): string {

    const value =
      category
        .toLowerCase()
        .trim();


    if (
      value.includes(
        'calle'
      )
    ) {

      return this.t(
        'map.categoryStreets'
      );

    }


    if (
      value.includes(
        'alumbrado'
      )
    ) {

      return this.t(
        'map.categoryLighting'
      );

    }


    if (
      value.includes(
        'limpieza'
      ) ||
      value.includes(
        'basura'
      )
    ) {

      return this.t(
        'map.categoryCleaning'
      );

    }


    if (
      value.includes(
        'transporte'
      )
    ) {

      return this.t(
        'map.categoryTransport'
      );

    }


    if (
      value.includes(
        'seguridad'
      )
    ) {

      return this.t(
        'map.categorySecurity'
      );

    }


    return this.t(
      'map.categoryOther'
    );

  }


  getCategoryIcon(
    category: string
  ): string {

    const value =
      category.toLowerCase();


    if (
      value.includes(
        'calle'
      )
    ) {

      return '🛣️';

    }


    if (
      value.includes(
        'alumbrado'
      )
    ) {

      return '💡';

    }


    if (
      value.includes(
        'limpieza'
      )
    ) {

      return '🧹';

    }


    if (
      value.includes(
        'transporte'
      )
    ) {

      return '🚌';

    }


    if (
      value.includes(
        'seguridad'
      )
    ) {

      return '🛡️';

    }


    return '📍';

  }


  /* =========================
     PRIORIDAD
  ========================= */

  private getMarkerClass(
    priority: string
  ): string {

    switch (
      priority
    ) {

      case 'urgente':
        return 'marker-red';

      case 'alta':
        return 'marker-orange';

      case 'media':
        return 'marker-yellow';

      default:
        return 'marker-blue';

    }

  }


  getPriorityLabel(
    priority: string
  ): string {

    switch (
      priority
    ) {

      case 'urgente':

        return this.t(
          'priority.urgent'
        );


      case 'alta':

        return this.t(
          'priority.high'
        );


      case 'media':

        return this.t(
          'priority.medium'
        );


      default:

        return this.t(
          'priority.low'
        );

    }

  }


  /* =========================
     DISTANCIA
  ========================= */

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const radius =
      6371000;


    const toRadians =
      (
        value: number
      ) =>
        value *
        Math.PI /
        180;


    const deltaLat =
      toRadians(
        lat2 - lat1
      );


    const deltaLon =
      toRadians(
        lon2 - lon1
      );


    const a =

      Math.sin(
        deltaLat / 2
      ) ** 2 +

      Math.cos(
        toRadians(
          lat1
        )
      ) *

      Math.cos(
        toRadians(
          lat2
        )
      ) *

      Math.sin(
        deltaLon / 2
      ) ** 2;


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );


    return radius * c;

  }


  /* =========================
     SEGURIDAD HTML
  ========================= */

  private escapeHtml(
    value: string
  ): string {

    return value
      .replaceAll(
        '&',
        '&amp;'
      )
      .replaceAll(
        '<',
        '&lt;'
      )
      .replaceAll(
        '>',
        '&gt;'
      )
      .replaceAll(
        '"',
        '&quot;'
      )
      .replaceAll(
        "'",
        '&#039;'
      );

  }

}