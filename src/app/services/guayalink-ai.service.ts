import { Injectable } from '@angular/core';

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
    Modelos disponibles para intentar
    el análisis.

    Si uno falla, GuayaLink intenta
    automáticamente el siguiente.
  */

  private readonly modelNames = [
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash'
  ];


  private currentModelName =
    '';


  /*
    Respuesta estructurada que debe
    devolver Gemini.
  */

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

    Se mantiene integrado mediante
    Firebase AI Logic.
  */

  private readonly ai =
    getAI(
      getApp(),
      {
        backend:
          new GoogleAIBackend()
      }
    );


  /*
    ================================
    ANALIZAR REPORTE
    ================================
  */

  async analyzeReport(
    title: string,
    description: string,
    imageFile:
      File | null = null
  ):
  Promise<GuayaLinkAIAnalysis> {

    const hasImage =
      !!imageFile;


    const prompt =
      `
Eres GuayaLink AI, el sistema de análisis inteligente
de reportes ciudadanos de GuayaLink.

GuayaLink permite a ciudadanos de Guayaquil, Ecuador,
reportar problemas urbanos para que posteriormente
puedan ser revisados por administradores y trabajadores.

Tu trabajo es analizar SOLO la evidencia entregada
por el ciudadano.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REPORTE DEL CIUDADANO

Título:
${title}

Descripción:
${description}

Fotografía adjunta:
${hasImage ? 'Sí' : 'No'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEBES ANALIZAR:

1. CATEGORÍA

Selecciona exactamente una:

- Calles
- Alumbrado
- Limpieza
- Transporte
- Seguridad
- Otro


2. PRIORIDAD

Selecciona exactamente una:

- baja
- media
- alta
- urgente


Utiliza estas reglas:

BAJA

Usa "baja" cuando el problema tenga poco impacto
inmediato y no exista evidencia clara de peligro.

Ejemplos generales:

- problema principalmente estético
- suciedad menor
- desperfecto pequeño
- problema que puede esperar una atención normal


MEDIA

Usa "media" cuando el problema afecte claramente
a ciudadanos o servicios, pero no exista evidencia
de peligro importante o inmediato.

Ejemplos generales:

- deterioro moderado de una vía
- alumbrado que no funciona
- acumulación considerable de basura
- problema de transporte que causa molestias
- situación que requiere atención pero puede esperar


ALTA

Usa "alta" cuando exista un riesgo considerable,
una afectación importante o posibilidad razonable
de que el problema cause daños si continúa.

Ejemplos generales:

- obstáculo importante en una vía
- hueco peligroso
- infraestructura severamente dañada
- zona insegura
- problema que afecta seriamente circulación,
  acceso o seguridad


URGENTE

Usa "urgente" SOLAMENTE cuando exista evidencia
clara de peligro inmediato o una situación que
requiera intervención rápida.

Ejemplos generales:

- riesgo inmediato para personas
- infraestructura que aparenta estar a punto de fallar
- vía completamente bloqueada en una situación peligrosa
- condición claramente peligrosa observada
- situación que razonablemente requiere atención inmediata

IMPORTANTE:

No marques un reporte como urgente solamente porque
el ciudadano utilice palabras como:

"urgente"
"grave"
"peligroso"
"emergencia"

Debes evaluar el contexto y la evidencia disponible.


3. NIVEL DE RIESGO

Devuelve un número entero del 1 al 10.

Guía:

1-2 = riesgo muy bajo
3-4 = riesgo bajo/moderado
5-6 = riesgo considerable
7-8 = riesgo alto
9-10 = riesgo crítico o inmediato


4. CONFIANZA

Número entero entre 0 y 100.

La confianza representa qué tan segura es la
clasificación basada en la información disponible.

Si la descripción es ambigua o la fotografía
no permite confirmar claramente el problema,
reduce la confianza.


5. RESUMEN ADMINISTRATIVO

Máximo 2 oraciones.

Resume lo que realmente fue reportado.

No inventes información.


6. EXPLICACIÓN

Máximo 3 oraciones.

Explica de forma breve por qué seleccionaste:

- categoría
- prioridad
- nivel de riesgo


7. ACCIÓN RECOMENDADA

Sugiere una acción administrativa razonable.

Ejemplos:

- realizar inspección
- asignar equipo correspondiente
- verificar condición reportada
- programar reparación
- revisar el área

No inventes autoridades específicas si no
son necesarias.


8. FACTORES DE RIESGO

Devuelve entre 1 y 4 factores.

Deben estar relacionados únicamente con la
información proporcionada.


9. ATENCIÓN RÁPIDA

requiereAtencionRapida debe ser true solamente
si la prioridad es:

- alta
- urgente

En cualquier otro caso debe ser false.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGLAS IMPORTANTES

- No inventes información.
- No inventes accidentes.
- No inventes personas lesionadas.
- No inventes víctimas.
- No inventes dimensiones.
- No inventes daños no visibles.
- No inventes información que no esté en el texto
  o fotografía.
- No exageres el riesgo.
- No reduzcas un riesgo evidente.
- No clasifiques algo como urgente únicamente
  por palabras alarmantes.
- Analiza el significado completo del reporte.
- Si existe fotografía, úsala como evidencia adicional.
- El texto y la fotografía deben analizarse juntos.
- Si texto e imagen parecen contradecirse,
  disminuye la confianza.
- Si algo no se observa claramente, no lo afirmes.
- Una fotografía no demuestra automáticamente
  que exista peligro.
- La evaluación es orientativa.
- Responde en español.
- Sé breve y profesional.

Devuelve únicamente la estructura solicitada.
      `.trim();


    let lastError:
      unknown =
      null;


    /*
      Intentamos varios modelos.

      Cada uno tiene dos intentos
      antes de pasar al siguiente.
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
            `🤖 GuayaLink AI: ${modelName} - intento ${attempt}/2`
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

                  maxOutputTokens:
                    1200

                }

              }
            );


          let result;


          /*
            Si existe imagen enviamos:

            - prompt
            - fotografía

            Si no existe, solamente texto.
          */

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
            `📥 Respuesta de ${modelName}:`,
            text
          );


          console.log(
            'Finish reason:',
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
            Validamos la respuesta para
            evitar valores inesperados.
          */

          const validated =
            this.validateAnalysis(
              parsed
            );


          /*
            Aplicamos una segunda capa
            de coherencia.

            Esto evita contradicciones
            como prioridad baja con
            riesgo 10.
          */

          const coherent =
            this.enforceConsistency(
              validated
            );


          this.currentModelName =
            modelName;


          console.log(
            `✅ GUAYALINK AI FUNCIONÓ CON ${modelName}`
          );


          console.log(
            '📊 Análisis final:',
            coherent
          );


          return coherent;

        } catch (
          error: any
        ) {

          lastError =
            error;


          console.warn(
            `⚠️ ${modelName} intento ${attempt} falló`,
            error
          );


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
      El componente new-report tiene
      un sistema local de respaldo,
      por lo que lanzamos el error.
    */

    throw lastError;

  }


  /*
    ================================
    MODELO UTILIZADO
    ================================
  */

  getModelName():
  string {

    return (
      this.currentModelName
      ||
      'gemini'
    );

  }


  /*
    ================================
    ESPERA PARA REINTENTOS
    ================================
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
    ================================
    CONVERTIR FOTO PARA GEMINI
    ================================
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
    ================================
    VALIDACIÓN DE RESPUESTA
    ================================
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
        prioridad === 'alta'
        ||
        prioridad === 'urgente'

    };

  }


  /*
    ================================
    COHERENCIA PRIORIDAD / RIESGO
    ================================

    Esta función no reemplaza a la IA.

    Simplemente evita respuestas
    contradictorias.
  */

  private enforceConsistency(
    analysis:
      GuayaLinkAIAnalysis
  ):
  GuayaLinkAIAnalysis {

    let priority =
      analysis.prioridad;


    let risk =
      analysis.nivelRiesgo;


    /*
      Una prioridad urgente debería
      tener un nivel de riesgo alto.
    */

    if (
      priority ===
      'urgente'
    ) {

      risk =
        Math.max(
          risk,
          8
        );

    }


    /*
      Una prioridad alta debería
      tener riesgo considerable.
    */

    if (
      priority ===
      'alta'
    ) {

      risk =
        Math.max(
          risk,
          6
        );

    }


    /*
      Si el riesgo devuelto es extremadamente
      bajo, evitamos prioridades muy altas.
    */

    if (
      risk <= 2
      &&
      (
        priority === 'alta'
        ||
        priority === 'urgente'
      )
    ) {

      priority =
        'media';

    }


    /*
      Si Gemini devuelve riesgo crítico
      pero prioridad baja, corregimos
      la contradicción.
    */

    if (
      risk >= 9
      &&
      priority === 'baja'
    ) {

      priority =
        'alta';

    }


    /*
      Riesgo muy alto + prioridad media
      se eleva a alta, pero NO se fuerza
      automáticamente a urgente.

      Urgente debe depender de la evidencia
      analizada por Gemini.
    */

    if (
      risk >= 8
      &&
      priority === 'media'
    ) {

      priority =
        'alta';

    }


    return {

      ...analysis,

      prioridad:
        priority,

      nivelRiesgo:
        risk,

      requiereAtencionRapida:
        priority === 'alta'
        ||
        priority === 'urgente'

    };

  }

}