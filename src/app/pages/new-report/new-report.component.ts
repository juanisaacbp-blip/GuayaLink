import {
  CommonModule
} from '@angular/common';

import {
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../../main';

import {
  NavComponent
} from '../../shared/nav/nav.component';

import {
  GuayaLinkAIAnalysis,
  GuayaLinkAIService
} from '../../services/guayalink-ai.service';

import {
  LanguageService
} from '../../services/language.service';


interface DuplicateReport {

  id: string;

  title: string;

  category: string;

  distance: number;

  supportCount: number;

  description: string;

}


@Component({
  selector:
    'app-new-report',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    NavComponent
  ],

  templateUrl:
    './new-report.component.html',

  styleUrl:
    './new-report.component.css'
})
export class NewReportComponent {

  title = '';

  category =
    'Otro';

  description = '';

  location =
    '';


  latitude:
    number | null =
      null;

  longitude:
    number | null =
      null;


  categories = [
    'Calles',
    'Alumbrado',
    'Limpieza',
    'Transporte',
    'Seguridad',
    'Otro'
  ];


  suggestedCategory =
    '';


  priority:
    'baja' |
    'media' |
    'alta' |
    'urgente' =
      'baja';


  priorityScore =
    0;


  loading =
    false;

  locating =
    false;

  checkingDuplicates =
    false;

  aiLoading =
    false;


  errorMessage =
    '';

  successMessage =
    '';

  aiErrorMessage =
    '';


  selectedImage:
    string | null =
      null;

  selectedImageFile:
    File | null =
      null;

  selectedFileName =
    '';


  duplicate:
    DuplicateReport | null =
      null;


  aiAnalysis:
    GuayaLinkAIAnalysis | null =
      null;


  aiSource:
    'gemini' |
    'local' |
    null =
      null;


  constructor(
    private router:
      Router,

    private guayaLinkAI:
      GuayaLinkAIService,

    public languageService:
      LanguageService
  ) {

    this.location =
      this.t(
        'newReport.locationNotDetected'
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
     CATEGORIAS
  ========================= */

  getCategoryLabel(
    category: string
  ): string {

    switch (
      category
    ) {

      case 'Calles':

        return this.t(
          'newReport.categoryStreets'
        );


      case 'Alumbrado':

        return this.t(
          'newReport.categoryLighting'
        );


      case 'Limpieza':

        return this.t(
          'newReport.categoryCleaning'
        );


      case 'Transporte':

        return this.t(
          'newReport.categoryTransport'
        );


      case 'Seguridad':

        return this.t(
          'newReport.categorySecurity'
        );


      default:

        return this.t(
          'newReport.categoryOther'
        );

    }

  }


  /* =========================
     FOTO
  ========================= */

  selectPhoto(
    event: Event
  ): void {

    const input =
      event.target as
        HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    if (
      !file.type.startsWith(
        'image/'
      )
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorValidImage'
        );

      return;

    }


    const allowedTypes =
      [
        'image/jpeg',
        'image/png',
        'image/webp'
      ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorImageFormat'
        );

      return;

    }


    const maxSize =
      7 *
      1024 *
      1024;


    if (
      file.size >
      maxSize
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorImageSize'
        );

      return;

    }


    this.errorMessage =
      '';


    this.selectedFileName =
      file.name;


    this.selectedImageFile =
      file;


    const reader =
      new FileReader();


    reader.onload =
      () => {

        this.selectedImage =
          reader.result as
            string;

      };


    reader.readAsDataURL(
      file
    );


    this.resetAIResult();

  }


  removePhoto():
    void {

    this.selectedImage =
      null;

    this.selectedImageFile =
      null;

    this.selectedFileName =
      '';

    this.resetAIResult();

  }


  /* =========================
     UBICACION
  ========================= */

  getLocation():
    void {

    this.errorMessage =
      '';


    if (
      !navigator.geolocation
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorNoGeolocation'
        );

      return;

    }


    this.locating =
      true;


    navigator.geolocation
      .getCurrentPosition(

        position => {

          this.latitude =
            position.coords.latitude;

          this.longitude =
            position.coords.longitude;


          this.location =
            `${this.latitude.toFixed(6)}, ${this.longitude.toFixed(6)}`;


          this.locating =
            false;

        },


        error => {

          console.error(
            'Error de ubicación:',
            error
          );


          this.locating =
            false;


          if (
            error.code ===
            error.PERMISSION_DENIED
          ) {

            this.errorMessage =
              this.t(
                'newReport.errorLocationPermission'
              );

          }

          else {

            this.errorMessage =
              this.t(
                'newReport.errorLocation'
              );

          }

        },


        {
          enableHighAccuracy:
            true,

          timeout:
            10000,

          maximumAge:
            60000
        }

      );

  }


  /* =========================
     GUAYALINK AI
  ========================= */

  async analyzeWithAI():
    Promise<void> {

    this.aiErrorMessage =
      '';

    this.errorMessage =
      '';


    if (
      this.title.trim()
        .length < 3
    ) {

      this.aiErrorMessage =
        this.t(
          'newReport.aiNeedTitle'
        );

      return;

    }


    if (
      this.description.trim()
        .length < 10
    ) {

      this.aiErrorMessage =
        this.t(
          'newReport.aiNeedDescription'
        );

      return;

    }


    this.aiLoading =
      true;


    try {

      const analysis =
        await this.guayaLinkAI
          .analyzeReport(
            this.title.trim(),
            this.description.trim(),
            this.selectedImageFile
          );


      this.aiAnalysis =
        analysis;


      this.aiSource =
        'gemini';


      this.category =
        analysis.categoria;


      this.suggestedCategory =
        analysis.categoria;


      this.priority =
        analysis.prioridad;


      this.priorityScore =
        this.priorityToScore(
          analysis.prioridad,
          analysis.nivelRiesgo
        );

    }

    catch (error) {

      console.error(
        'GuayaLink AI falló:',
        error
      );


      this.analyzeLocally();


      this.aiAnalysis =
        this.buildLocalFallbackAnalysis();


      this.aiSource =
        'local';


      this.aiErrorMessage =
        this.t(
          'newReport.aiFallback'
        );

    }

    finally {

      this.aiLoading =
        false;

    }

  }


  private resetAIResult():
    void {

    this.aiAnalysis =
      null;

    this.aiSource =
      null;

    this.aiErrorMessage =
      '';

  }


  /* =========================
     ANALISIS LOCAL
  ========================= */

  analyzeLocally():
    void {

    const text =
      (
        this.title +
        ' ' +
        this.description
      )
        .toLowerCase()
        .normalize(
          'NFD'
        )
        .replace(
          /[\u0300-\u036f]/g,
          ''
        );


    const scores: {
      [key: string]:
        number;
    } = {

      Calles:
        0,

      Alumbrado:
        0,

      Limpieza:
        0,

      Transporte:
        0,

      Seguridad:
        0,

      Otro:
        0

    };


    const keywordGroups:
      Record<
        string,
        string[]
      > = {

      Calles: [
        'bache',
        'hueco',
        'calle',
        'asfalto',
        'pavimento',
        'acera',
        'vereda',
        'semaforo',
        'alcantarilla',
        'via rota'
      ],

      Alumbrado: [
        'poste',
        'luz',
        'lampara',
        'alumbrado',
        'oscuro',
        'apagada',
        'sin luz',
        'foco'
      ],

      Limpieza: [
        'basura',
        'desechos',
        'suciedad',
        'limpieza',
        'escombros',
        'contenedor',
        'mal olor',
        'desperdicios'
      ],

      Transporte: [
        'bus',
        'buseta',
        'parada',
        'transporte',
        'trafico',
        'congestion',
        'ruta',
        'taxi'
      ],

      Seguridad: [
        'robo',
        'asalto',
        'peligro',
        'inseguridad',
        'violencia',
        'accidente',
        'riesgo',
        'emergencia'
      ]

    };


    Object.entries(
      keywordGroups
    )
      .forEach(
        (
          [
            category,
            words
          ]
        ) => {

          words.forEach(
            word => {

              if (
                text.includes(
                  word
                )
              ) {

                scores[
                  category
                ] += 1;

              }

            }
          );

        }
      );


    let bestCategory =
      'Otro';

    let bestScore =
      0;


    Object.entries(
      scores
    )
      .forEach(
        (
          [
            category,
            score
          ]
        ) => {

          if (
            score >
            bestScore
          ) {

            bestScore =
              score;

            bestCategory =
              category;

          }

        }
      );


    this.suggestedCategory =
      bestCategory;


    if (
      bestCategory !==
      'Otro'
    ) {

      this.category =
        bestCategory;

    }


    this.calculateLocalPriority(
      text
    );

  }


  private calculateLocalPriority(
    text: string
  ):
    void {

    let score =
      0;


    const urgentWords =
      [
        'emergencia',
        'grave',
        'peligro',
        'accidente',
        'riesgo',
        'incendio'
      ];


    const highWords =
      [
        'grande',
        'profundo',
        'roto',
        'bloqueado',
        'sin luz',
        'inseguro',
        'urgente'
      ];


    urgentWords.forEach(
      word => {

        if (
          text.includes(
            word
          )
        ) {

          score += 4;

        }

      }
    );


    highWords.forEach(
      word => {

        if (
          text.includes(
            word
          )
        ) {

          score += 2;

        }

      }
    );


    if (
      this.category ===
      'Seguridad'
    ) {

      score += 3;

    }


    if (
      this.category ===
      'Calles'
    ) {

      score += 1;

    }


    this.priorityScore =
      score;


    if (
      score >= 8
    ) {

      this.priority =
        'urgente';

    }

    else if (
      score >= 5
    ) {

      this.priority =
        'alta';

    }

    else if (
      score >= 2
    ) {

      this.priority =
        'media';

    }

    else {

      this.priority =
        'baja';

    }

  }


  private buildLocalFallbackAnalysis():
    GuayaLinkAIAnalysis {

    let risk =
      2;


    if (
      this.priority ===
      'media'
    ) {

      risk =
        5;

    }


    if (
      this.priority ===
      'alta'
    ) {

      risk =
        7;

    }


    if (
      this.priority ===
      'urgente'
    ) {

      risk =
        9;

    }


    return {

      categoria:
        this.category as
          GuayaLinkAIAnalysis[
            'categoria'
          ],

      prioridad:
        this.priority,

      nivelRiesgo:
        risk,

      confianza:
        45,

      resumen:
        this.title.trim(),

      explicacion:
        this.t(
          'newReport.localExplanation'
        ),

      accionRecomendada:
        this.priority ===
        'urgente'
          ? this.t(
              'newReport.localUrgentAction'
            )
          : this.t(
              'newReport.localNormalAction'
            ),

      factoresRiesgo:
        [
          `${this.t(
            'newReport.category'
          )}: ${this.getCategoryLabel(
            this.category
          )}`,

          `${this.t(
            'newReport.priority'
          )}: ${this.getPriorityLabel()}`
        ],

      requiereAtencionRapida:
        this.priority ===
          'urgente'
        ||
        this.priority ===
          'alta'

    };

  }


  private priorityToScore(
    priority:
      'baja' |
      'media' |
      'alta' |
      'urgente',

    risk:
      number
  ):
    number {

    const base = {

      baja:
        1,

      media:
        4,

      alta:
        7,

      urgente:
        10

    };


    return (
      base[
        priority
      ] +
      risk
    );

  }


  /* =========================
     DUPLICADOS
  ========================= */

  private async findDuplicate():
    Promise<DuplicateReport | null> {

    if (
      this.latitude ===
        null
      ||
      this.longitude ===
        null
    ) {

      return null;

    }


    const snapshot =
      await getDocs(
        collection(
          db,
          'reports'
        )
      );


    let bestMatch:
      DuplicateReport | null =
        null;


    snapshot.forEach(
      documentSnapshot => {

        const data =
          documentSnapshot.data();


        if (
          data['status'] ===
          'resuelto'
        ) {

          return;

        }


        const lat =
          Number(
            data['latitude']
          );


        const lng =
          Number(
            data['longitude']
          );


        if (
          !Number.isFinite(
            lat
          )
          ||
          !Number.isFinite(
            lng
          )
        ) {

          return;

        }


        const distance =
          this.calculateDistance(
            this.latitude!,
            this.longitude!,
            lat,
            lng
          );


        if (
          distance >
          180
        ) {

          return;

        }


        const existingCategory =
          (
            data['category']
            || ''
          )
            .toLowerCase();


        const sameCategory =
          existingCategory ===
          this.category
            .toLowerCase();


        const similarity =
          this.textSimilarity(

            this.title +
            ' ' +
            this.description,

            (
              data['title']
              || ''
            )
            +
            ' '
            +
            (
              data[
                'description'
              ]
              || ''
            )

          );


        if (
          sameCategory
          ||
          similarity >=
          0.35
        ) {

          const candidate:
            DuplicateReport = {

            id:
              documentSnapshot.id,

            title:
              data['title']
              ||
              this.t(
                'newReport.existingReport'
              ),

            category:
              data['category']
              ||
              'Otro',

            description:
              data['description']
              || '',

            distance:
              Math.round(
                distance
              ),

            supportCount:
              Number(
                data['supportCount']
                || 0
              )

          };


          if (
            !bestMatch
            ||
            candidate.distance <
            bestMatch.distance
          ) {

            bestMatch =
              candidate;

          }

        }

      }
    );


    return bestMatch;

  }


  /* =========================
     PUBLICAR
  ========================= */

  async submit():
    Promise<void> {

    this.errorMessage =
      '';

    this.successMessage =
      '';

    this.duplicate =
      null;


    const user =
      auth.currentUser;


    if (
      !user
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorLogin'
        );

      return;

    }


    if (
      !this.title.trim()
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorTitle'
        );

      return;

    }


    if (
      !this.description.trim()
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorDescription'
        );

      return;

    }


    if (
      this.latitude ===
        null
      ||
      this.longitude ===
        null
    ) {

      this.errorMessage =
        this.t(
          'newReport.errorNeedLocation'
        );

      return;

    }


    if (
      !this.aiAnalysis
    ) {

      this.analyzeLocally();

    }


    this.checkingDuplicates =
      true;


    try {

      const duplicate =
        await this.findDuplicate();


      if (
        duplicate
      ) {

        this.duplicate =
          duplicate;

        return;

      }


      await this.createReport();

    }

    catch (error) {

      console.error(
        'Error verificando duplicados:',
        error
      );


      this.errorMessage =
        this.t(
          'newReport.errorDuplicateCheck'
        );

    }

    finally {

      this.checkingDuplicates =
        false;

    }

  }


  async createAnyway():
    Promise<void> {

    this.duplicate =
      null;

    await this.createReport();

  }


  private async createReport():
    Promise<void> {

    const user =
      auth.currentUser;


    if (
      !user
    ) {

      return;

    }


    this.loading =
      true;


    try {

      const report =
        await addDoc(
          collection(
            db,
            'reports'
          ),
          {

            userId:
              user.uid,

            userEmail:
              user.email
              ?? '',


            title:
              this.title.trim(),

            category:
              this.category,

            suggestedCategory:
              this.suggestedCategory,

            description:
              this.description.trim(),


            priority:
              this.priority,

            priorityScore:
              this.priorityScore,


            location:
              this.location,

            latitude:
              this.latitude,

            longitude:
              this.longitude,


            status:
              'pendiente',

            progress:
              0,

            supportCount:
              0,


            aiAnalyzed:
              !!this.aiAnalysis,

            aiSource:
              this.aiSource
              ?? 'local',

            aiModel:
              this.aiSource ===
              'gemini'
                ? this.guayaLinkAI
                    .getModelName()
                : 'local-rules-v1',

            aiRiskScore:
              this.aiAnalysis
                ?.nivelRiesgo
              ?? null,

            aiConfidence:
              this.aiAnalysis
                ?.confianza
              ?? null,

            aiSummary:
              this.aiAnalysis
                ?.resumen
              ?? '',

            aiReason:
              this.aiAnalysis
                ?.explicacion
              ?? '',

            aiRecommendedAction:
              this.aiAnalysis
                ?.accionRecomendada
              ?? '',

            aiRiskFactors:
              this.aiAnalysis
                ?.factoresRiesgo
              ?? [],

            aiNeedsFastAttention:
              this.aiAnalysis
                ?.requiereAtencionRapida
              ?? false,

            aiUsedImage:
              !!this.selectedImageFile,

            aiAnalyzedAt:
              this.aiAnalysis
                ? serverTimestamp()
                : null,


            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()

          }
        );


      this.successMessage =
        this.t(
          'newReport.success'
        );


      setTimeout(
        async () => {

          await this.router.navigate(
            [
              '/reporte',
              report.id
            ]
          );

        },
        600
      );

    }

    catch (error) {

      console.error(
        'Error publicando:',
        error
      );


      this.errorMessage =
        this.t(
          'newReport.errorPublish'
        );

    }

    finally {

      this.loading =
        false;

    }

  }


  /* =========================
     APOYAR DUPLICADO
  ========================= */

  async supportDuplicate():
    Promise<void> {

    if (
      !this.duplicate
    ) {

      return;

    }


    this.loading =
      true;


    try {

      await updateDoc(
        doc(
          db,
          'reports',
          this.duplicate.id
        ),
        {
          supportCount:
            increment(
              1
            )
        }
      );


      const reportId =
        this.duplicate.id;


      this.duplicate =
        null;


      await this.router.navigate(
        [
          '/reporte',
          reportId
        ]
      );

    }

    catch (error) {

      console.error(
        error
      );


      this.errorMessage =
        this.t(
          'newReport.errorSupport'
        );

    }

    finally {

      this.loading =
        false;

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
  ):
    number {

    const earthRadius =
      6371000;


    const toRadians =
      (
        value:
          number
      ) =>
        value *
        Math.PI /
        180;


    const deltaLat =
      toRadians(
        lat2 -
        lat1
      );


    const deltaLon =
      toRadians(
        lon2 -
        lon1
      );


    const a =
      Math.sin(
        deltaLat /
        2
      ) ** 2
      +
      Math.cos(
        toRadians(
          lat1
        )
      )
      *
      Math.cos(
        toRadians(
          lat2
        )
      )
      *
      Math.sin(
        deltaLon /
        2
      ) ** 2;


    const c =
      2 *
      Math.atan2(
        Math.sqrt(
          a
        ),
        Math.sqrt(
          1 -
          a
        )
      );


    return (
      earthRadius *
      c
    );

  }


  /* =========================
     SIMILITUD
  ========================= */

  private textSimilarity(
    first:
      string,

    second:
      string
  ):
    number {

    const clean =
      (
        value:
          string
      ) =>

        value
          .toLowerCase()
          .normalize(
            'NFD'
          )
          .replace(
            /[\u0300-\u036f]/g,
            ''
          )
          .replace(
            /[^a-z0-9\s]/g,
            ''
          )
          .split(
            /\s+/
          )
          .filter(
            word =>
              word.length >
              2
          );


    const firstWords =
      new Set(
        clean(
          first
        )
      );


    const secondWords =
      new Set(
        clean(
          second
        )
      );


    if (
      firstWords.size ===
        0
      ||
      secondWords.size ===
        0
    ) {

      return 0;

    }


    let matches =
      0;


    firstWords.forEach(
      word => {

        if (
          secondWords.has(
            word
          )
        ) {

          matches++;

        }

      }
    );


    return (
      matches /
      Math.max(
        firstWords.size,
        secondWords.size
      )
    );

  }


  /* =========================
     UI
  ========================= */

  getPriorityLabel():
    string {

    switch (
      this.priority
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


  getRiskClass():
    string {

    const risk =
      this.aiAnalysis
        ?.nivelRiesgo
      ?? 0;


    if (
      risk >= 8
    ) {

      return 'risk-critical';

    }


    if (
      risk >= 6
    ) {

      return 'risk-high';

    }


    if (
      risk >= 4
    ) {

      return 'risk-medium';

    }


    return 'risk-low';

  }

}