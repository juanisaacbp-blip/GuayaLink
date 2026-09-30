import {
  Injectable
} from '@angular/core';

import {
  getApp
} from 'firebase/app';

import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  Schema
} from 'firebase/ai';


export type AICategory =
  | 'Calles'
  | 'Alumbrado'
  | 'Limpieza'
  | 'Transporte'
  | 'Seguridad'
  | 'Otro';


export type AIPriority =
  | 'baja'
  | 'media'
  | 'alta'
  | 'urgente';


export interface GuayaLinkAIAnalysis {

  categoria:
    AICategory;

  prioridad:
    AIPriority;

  nivelRiesgo:
    number;

  confianza:
    number;

  resumen:
    string;

  explicacion:
    string;

  accionRecomendada:
    string;

  factoresRiesgo:
    string[];

  requiereAtencionRapida:
    boolean;

}


@Injectable({
  providedIn: 'root'
})
export class GuayaLinkAIService {

  /*
    Primero usamos Flash-Lite.

    Es ideal para GuayaLink porque:
    - es rápido
    - tiene nivel gratuito
    - sirve perfectamente para
      clasificación y resúmenes
  */

  private readonly modelNames =
    [
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash'
    ];


  private currentModelName =
    '';


  private readonly schema =
    Schema.object({

      properties: {

        categoria:
          Schema.enumString({
            enum: [
              'Calles',
              'Alumbrado',
              'Limpieza',
              'Transporte',
              'Seguridad',
              'Otro'
            ]
          }),

        prioridad:
          Schema.enumString({
            enum: [
              'baja',
              'media',
              'alta',
              'urgente'
            ]
          }),

        nivelRiesgo:
          Schema.number(),

        confianza:
          Schema.number(),

        resumen:
          Schema.string(),

        explicacion:
          Schema.string(),

        accionRecomendada:
          Schema.string(),

        factoresRiesgo:
          Schema.array({
            items:
              Schema.string()
          }),

        requiereAtencionRapida:
          Schema.boolean()

      }

    });


  /*
    Gemini Developer API.

    Esto mantiene tu proyecto
    compatible con Spark / gratis.
  */

  private readonly ai =
    getAI(
      getApp(),
      {

        backend:
          new GoogleAIBackend()

      }
    );



  async analyzeReport(
    title: string,
    description: string,
    imageFile:
      File | null = null
  ):
  Promise<GuayaLinkAIAnalysis> {

    const prompt =
      `
Eres GuayaLink AI.

Analizas reportes ciudadanos sobre
problemas urbanos de Guayaquil, Ecuador.

REPORTE

Título:
${title}

Descripción:
${description}


Debes producir:

1. Categoría:
Calles, Alumbrado, Limpieza,
Transporte, Seguridad u Otro.

2. Prioridad:
baja, media, alta o urgente.

3. Nivel de riesgo:
número entero del 1 al 10.

4. Confianza:
número entre 0 y 100.

5. Resumen administrativo:
máximo 2 oraciones.

6. Explicación:
máximo 3 oraciones.

7. Acción recomendada:
una acción administrativa razonable.

8. Entre 1 y 4 factores de riesgo.

9. Indica si requiere atención rápida.


REGLAS:

- No inventes información.
- No inventes accidentes.
- No inventes personas lesionadas.
- No inventes dimensiones.
- No exageres el riesgo.
- Si existe una fotografía,
  úsala como evidencia adicional.
- Si algo no se observa claramente,
  no lo afirmes.
- Responde en español.
- Sé breve.
- La evaluación es orientativa.
      `.trim();


    let lastError:
      unknown =
      null;


    /*
      Cada modelo tendrá hasta
      2 intentos.
    */

    for (
      const modelName
      of this.modelNames
    ) {

      for (
        let attempt = 1;
        attempt <= 2;
        attempt++
      ) {

        try {

          console.log(
            `🤖 Intentando ${modelName} - intento ${attempt}/2`
          );


          const model =
            getGenerativeModel(
              this.ai,
              {

                model:
                  modelName,

                generationConfig: {

                  responseMimeType:
                    'application/json',

                  responseSchema:
                    this.schema,

                  /*
                    Nuestro reporte es corto.

                    No necesitamos una salida
                    gigantesca.
                  */

                  maxOutputTokens:
                    1200

                }

              }
            );


          let result;


          if (
            imageFile
          ) {

            const imagePart =
              await this.fileToGenerativePart(
                imageFile
              );


            result =
              await model.generateContent(
                [
                  prompt,
                  imagePart
                ]
              );

          } else {

            result =
              await model.generateContent(
                prompt
              );

          }


          const response =
            result.response;


          const text =
            response.text();


          console.log(
            `📥 ${modelName}:`,
            text
          );


          console.log(
            `Finish reason:`,
            response
              .candidates?.[0]
              ?.finishReason
          );


          if (
            !text ||
            !text.trim()
          ) {

            throw new Error(
              'Gemini devolvió una respuesta vacía.'
            );

          }


          const parsed =
            JSON.parse(
              text
            ) as
              GuayaLinkAIAnalysis;


          /*
            Si llegamos aquí,
            LA IA REAL FUNCIONÓ.
          */

          this.currentModelName =
            modelName;


          console.log(
            `✅ GUAYALINK AI FUNCIONÓ CON ${modelName}`
          );


          return this.validateAnalysis(
            parsed
          );


        } catch (
          error: any
        ) {

          lastError =
            error;


          console.warn(
            `⚠️ ${modelName} intento ${attempt} falló`,
            error
          );


          /*
            Esperamos antes del
            segundo intento.

            Esto ayuda cuando Gemini
            tiene saturación temporal.
          */

          if (
            attempt < 2
          ) {

            await this.wait(
              1800
            );

          }

        }

      }

    }


    console.error(
      '❌ Todos los modelos Gemini fallaron.',
      lastError
    );


    /*
      new-report.component.ts
      detectará este error y utilizará
      el respaldo local.
    */

    throw lastError;

  }



  getModelName():
  string {

    return (
      this.currentModelName
      ||
      'gemini'
    );

  }



  /*
    Espera para reintentos
  */

  private wait(
    milliseconds:
      number
  ):
  Promise<void> {

    return new Promise(
      resolve => {

        setTimeout(
          resolve,
          milliseconds
        );

      }
    );

  }



  /*
    Convertir imagen
  */

  private async fileToGenerativePart(
    file: File
  ):
  Promise<{
    inlineData: {
      data: string;
      mimeType: string;
    };
  }> {

    const base64 =
      await new Promise<string>(
        (
          resolve,
          reject
        ) => {

          const reader =
            new FileReader();


          reader.onloadend =
            () => {

              const result =
                reader.result;


              if (
                typeof result !==
                'string'
              ) {

                reject(
                  new Error(
                    'No se pudo leer la imagen.'
                  )
                );

                return;

              }


              const commaIndex =
                result.indexOf(
                  ','
                );


              if (
                commaIndex === -1
              ) {

                reject(
                  new Error(
                    'Imagen inválida.'
                  )
                );

                return;

              }


              resolve(
                result.substring(
                  commaIndex + 1
                )
              );

            };


          reader.onerror =
            () => {

              reject(
                new Error(
                  'No se pudo leer la imagen.'
                )
              );

            };


          reader.readAsDataURL(
            file
          );

        }
      );


    return {

      inlineData: {

        data:
          base64,

        mimeType:
          file.type

      }

    };

  }



  /*
    Validación final
  */

  private validateAnalysis(
    analysis:
      GuayaLinkAIAnalysis
  ):
  GuayaLinkAIAnalysis {

    const categories:
      AICategory[] =
      [
        'Calles',
        'Alumbrado',
        'Limpieza',
        'Transporte',
        'Seguridad',
        'Otro'
      ];


    const priorities:
      AIPriority[] =
      [
        'baja',
        'media',
        'alta',
        'urgente'
      ];


    const categoria =
      categories.includes(
        analysis.categoria
      )
        ? analysis.categoria
        : 'Otro';


    const prioridad =
      priorities.includes(
        analysis.prioridad
      )
        ? analysis.prioridad
        : 'baja';


    const nivelRiesgo =
      Math.max(
        1,
        Math.min(
          10,
          Math.round(
            Number(
              analysis.nivelRiesgo
            ) || 1
          )
        )
      );


    const confianza =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            Number(
              analysis.confianza
            ) || 0
          )
        )
      );


    const factoresRiesgo =
      Array.isArray(
        analysis.factoresRiesgo
      )
        ? analysis
            .factoresRiesgo

            .map(
              factor =>
                String(
                  factor
                ).trim()
            )

            .filter(
              Boolean
            )

            .slice(
              0,
              4
            )

        : [];


    return {

      categoria,

      prioridad,

      nivelRiesgo,

      confianza,

      resumen:
        String(
          analysis.resumen
          || ''
        ).trim(),

      explicacion:
        String(
          analysis.explicacion
          || ''
        ).trim(),

      accionRecomendada:
        String(
          analysis.accionRecomendada
          || ''
        ).trim(),

      factoresRiesgo,

      requiereAtencionRapida:
        Boolean(
          analysis.requiereAtencionRapida
        )

    };

  }

}