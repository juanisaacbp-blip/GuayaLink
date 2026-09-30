import {
  Injectable
} from '@angular/core';


export type AppLanguage =
  | 'Español'
  | 'English'
  | 'Português'
  | 'Français'
  | 'Русский';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLanguage:
    AppLanguage =
    'Español';


  private translations:
    Record<
      AppLanguage,
      Record<string, string>
    > = {


    /* =====================================================
       ESPAÑOL
    ===================================================== */

    Español: {

      /* NAV */

      'nav.home': 'Inicio',
      'nav.map': 'Mapa',
      'nav.impact': 'Impacto',
      'nav.profile': 'Perfil',


      /* SETTINGS */

      'settings.eyebrow': 'PREFERENCIAS',
      'settings.title': 'Configuración',
      'settings.subtitle': 'Personaliza tu experiencia en GuayaLink.',
      'settings.experience': 'EXPERIENCIA',
      'settings.preferences': 'Preferencias de la aplicación',
      'settings.darkMode': 'Modo oscuro',
      'settings.darkModeDescription': 'Cambia la apariencia de GuayaLink',
      'settings.language': 'Idioma',
      'settings.languageDescription': 'Selecciona el idioma de la plataforma',
      'settings.privacy': 'Privacidad',
      'settings.privacyDescription': 'Controla el nivel de privacidad de tu cuenta',
      'settings.standard': 'Estándar',
      'settings.high': 'Alta',
      'settings.account': 'CUENTA',
      'settings.session': 'Sesión',
      'settings.sessionDescription': 'Puedes cerrar tu sesión actual de forma segura.',
      'settings.logout': 'Cerrar sesión',
      'settings.logoutError': 'No se pudo cerrar la sesión.',


      /* DASHBOARD */

      'dashboard.user': 'Usuario',
      'dashboard.welcome': 'BIENVENIDO A GUAYALINK',
      'dashboard.hello': 'Hola',
      'dashboard.description': 'Reporta problemas, sigue su progreso y ayuda a mejorar tu comunidad.',
      'dashboard.notifications': 'Notificaciones',
      'dashboard.newReport': 'Nuevo reporte',
      'dashboard.citizenImpact': 'IMPACTO CIUDADANO',
      'dashboard.communityMoves': 'Tu comunidad se mueve contigo.',
      'dashboard.impactDescription': 'Cada reporte ayuda a detectar y resolver problemas de la ciudad.',
      'dashboard.reports': 'Reportes',
      'dashboard.inProgress': 'En proceso',
      'dashboard.resolved': 'Resueltos',
      'dashboard.supports': 'Apoyos',
      'dashboard.quickAccess': 'ACCESO RÁPIDO',
      'dashboard.whatDoYouWant': '¿Qué quieres hacer?',
      'dashboard.newReportDescription': 'Informa un problema en segundos',
      'dashboard.exploreMap': 'Explorar mapa',
      'dashboard.exploreMapDescription': 'Mira incidencias cerca de ti',
      'dashboard.yourReports': 'TUS REPORTES',
      'dashboard.recentActivity': 'Actividad reciente',
      'dashboard.viewMap': 'Ver mapa',
      'dashboard.noReportsTitle': 'Todavía no tienes reportes',
      'dashboard.noReportsDescription': 'Cuando envíes tu primer reporte, su progreso aparecerá aquí.',
      'dashboard.firstReport': 'Crear mi primer reporte',
      'dashboard.defaultReport': 'Reporte ciudadano',
      'dashboard.noCategory': 'Sin categoría',


      /* STATUS */

      'status.pending': 'Pendiente',
      'status.received': 'Recibido',
      'status.inProgress': 'En proceso',
      'status.resolved': 'Resuelto',


      /* PROFILE */

      'profile.user': 'Usuario',
      'profile.eyebrow': 'TU PERFIL',
      'profile.citizen': 'Ciudadano GuayaLink',
      'profile.participation': 'Participación ciudadana',
      'profile.reportsCreated': 'reportes creados',
      'profile.reports': 'Reportes',
      'profile.resolved': 'Resueltos',
      'profile.supports': 'Apoyos',
      'profile.points': 'Puntos',
      'profile.account': 'CUENTA',
      'profile.space': 'Tu espacio GuayaLink',
      'profile.notifications': 'Notificaciones',
      'profile.notificationsDescription': 'Revisa novedades sobre tus reportes',
      'profile.impact': 'Mi impacto',
      'profile.impactDescription': 'Consulta tus estadísticas ciudadanas',
      'profile.settings': 'Configuración',
      'profile.settingsDescription': 'Administra los datos de tu cuenta',


      /* STATS */

      'stats.contribution': 'TU CONTRIBUCIÓN',
      'stats.title': 'Mi impacto',
      'stats.description': 'Mira cómo tus reportes ayudan a mover la ciudad y qué tan rápido se van resolviendo.',
      'stats.resolutionRate': 'Tasa de resolución',
      'stats.basedOnReports': 'basada en tus reportes',
      'stats.reports': 'Reportes',
      'stats.inProgress': 'En proceso',
      'stats.resolved': 'Resueltos',
      'stats.distribution': 'DISTRIBUCIÓN',
      'stats.byCategory': 'Reportes por categoría',
      'stats.streets': 'Calles',
      'stats.streetsDescription': 'Infraestructura vial',
      'stats.lighting': 'Alumbrado',
      'stats.lightingDescription': 'Iluminación pública',
      'stats.cleaning': 'Limpieza',
      'stats.cleaningDescription': 'Residuos y limpieza',
      'stats.others': 'Otros',
      'stats.othersDescription': 'Otros tipos de incidencia',
      'stats.activity': 'ACTIVIDAD',
      'stats.evolution': 'Evolución de reportes',
      'stats.realData': 'Datos reales',
      'stats.noData': 'Todavía no hay datos suficientes. Crea reportes para comenzar a ver tu evolución.',
      'stats.autoUpdate': 'Tus estadísticas se actualizan automáticamente conforme envías y resuelves reportes.',


      /* MAP */

      'map.title': 'Mapa ciudadano',
      'map.description': 'Visualiza los problemas reportados y las zonas con mayor concentración.',
      'map.searching': 'Buscando...',
      'map.myLocation': '◎ Mi ubicación',
      'map.reportsMode': 'Reportes',
      'map.heatMap': 'Mapa de calor',
      'map.loading': 'Cargando mapa...',
      'map.reportSingular': 'reporte',
      'map.reportPlural': 'reportes',
      'map.lowerConcentration': 'Menor concentración',
      'map.higherConcentration': 'Mayor concentración',
      'map.urbanAnalysis': 'ANÁLISIS URBANO',
      'map.topZones': 'Zonas con más reportes',
      'map.zoneDescription': 'Sectores aproximados calculados según la ubicación de los reportes.',
      'map.noRanking': 'Todavía no existen suficientes reportes para generar el ranking.',
      'map.ofTotalReports': 'del total de reportes',
      'map.visibleReports': 'Reportes visibles',
      'map.selectReport': 'Selecciona un reporte para ver todos sus detalles.',
      'map.viewReport': 'Ver reporte',
      'map.priority': 'Prioridad',
      'map.defaultReport': 'Reporte ciudadano',
      'map.yourLocation': 'Tu ubicación',
      'map.geolocationUnsupported': 'Tu navegador no permite obtener la ubicación.',
      'map.locationError': 'No pudimos obtener tu ubicación.',

      'map.categoryAll': 'Todos',
      'map.categoryStreets': 'Calles',
      'map.categoryLighting': 'Alumbrado',
      'map.categoryCleaning': 'Limpieza',
      'map.categoryTransport': 'Transporte',
      'map.categorySecurity': 'Seguridad',
      'map.categoryOther': 'Otro',


      /* PRIORITY */

      'priority.urgent': 'Urgente',
      'priority.high': 'Alta',
      'priority.medium': 'Media',
      'priority.low': 'Baja',


      /* NEW REPORT */

      'newReport.title': 'Nuevo reporte',
      'newReport.subtitle': 'Reporta un problema y deja que GuayaLink AI ayude a analizarlo.',
      'newReport.titleLabel': 'Título',
      'newReport.titlePlaceholder': 'Ej: Bache profundo frente a una escuela',
      'newReport.descriptionLabel': 'Descripción',
      'newReport.descriptionPlaceholder': 'Describe qué está pasando, dónde está y por qué puede ser un problema...',
      'newReport.photoEvidence': 'Evidencia fotográfica',
      'newReport.addPhoto': 'Añadir foto',
      'newReport.photoAIHint': 'GuayaLink AI también puede analizar la imagen',
      'newReport.photoAlt': 'Evidencia del reporte',
      'newReport.removePhoto': 'Quitar foto',

      'newReport.aiDescription': 'Analiza categoría, prioridad, nivel de riesgo y acción recomendada.',
      'newReport.analyzeAI': 'Analizar con IA',
      'newReport.analyzing': 'Analizando...',
      'newReport.aiResultTitle': 'Análisis del reporte',
      'newReport.localFallback': 'Respaldo local',
      'newReport.category': 'Categoría',
      'newReport.priority': 'Prioridad',
      'newReport.riskLevel': 'Nivel de riesgo',
      'newReport.confidence': 'Confianza',
      'newReport.estimatedRisk': 'Riesgo estimado',
      'newReport.adminSummary': 'RESUMEN ADMINISTRATIVO',
      'newReport.whyPriority': '¿POR QUÉ ESTA PRIORIDAD?',
      'newReport.recommendedAction': 'ACCIÓN RECOMENDADA',
      'newReport.detectedFactors': 'FACTORES DETECTADOS',
      'newReport.fastAttention': 'GuayaLink AI recomienda atención prioritaria.',
      'newReport.aiDisclaimer': 'El análisis de IA es orientativo. La prioridad final puede ser revisada por un administrador.',

      'newReport.finalCategory': 'Categoría final',
      'newReport.location': 'Ubicación',
      'newReport.locationNotDetected': 'Ubicación todavía no detectada',
      'newReport.locationDuplicateHint': 'Se utiliza también para detectar reportes duplicados.',
      'newReport.gettingLocation': 'Obteniendo ubicación...',
      'newReport.useLocation': '◎ Usar mi ubicación',

      'newReport.possibleDuplicate': 'POSIBLE REPORTE DUPLICADO',
      'newReport.duplicateFound': 'Ya existe un reporte parecido cerca',
      'newReport.supports': 'apoyos',
      'newReport.supportExisting': 'Apoyar reporte existente',
      'newReport.createAnyway': 'Crear uno nuevo de todos modos',

      'newReport.publish': 'Publicar reporte',
      'newReport.checkingDuplicates': 'Buscando reportes similares...',
      'newReport.publishing': 'Publicando...',

      'newReport.categoryStreets': 'Calles',
      'newReport.categoryLighting': 'Alumbrado',
      'newReport.categoryCleaning': 'Limpieza',
      'newReport.categoryTransport': 'Transporte',
      'newReport.categorySecurity': 'Seguridad',
      'newReport.categoryOther': 'Otro',

      'newReport.errorValidImage': 'Selecciona una imagen válida.',
      'newReport.errorImageFormat': 'Usa una imagen JPG, PNG o WEBP.',
      'newReport.errorImageSize': 'Para el análisis con IA usa una imagen menor a 7 MB.',
      'newReport.errorNoGeolocation': 'Tu navegador no permite obtener ubicación.',
      'newReport.errorLocationPermission': 'Necesitas permitir el acceso a tu ubicación.',
      'newReport.errorLocation': 'No pudimos obtener tu ubicación.',
      'newReport.aiNeedTitle': 'Escribe primero un título para que GuayaLink AI pueda analizarlo.',
      'newReport.aiNeedDescription': 'Describe un poco mejor el problema antes de analizarlo.',
      'newReport.aiFallback': 'No pudimos conectar con Gemini. GuayaLink usó su análisis local de respaldo.',
      'newReport.errorLogin': 'Necesitas iniciar sesión para publicar un reporte.',
      'newReport.errorTitle': 'Escribe un título para el reporte.',
      'newReport.errorDescription': 'Describe el problema.',
      'newReport.errorNeedLocation': 'Primero debes obtener la ubicación del problema.',
      'newReport.errorDuplicateCheck': 'No pudimos verificar el reporte.',
      'newReport.errorPublish': 'No se pudo publicar el reporte.',
      'newReport.errorSupport': 'No se pudo apoyar el reporte existente.',
      'newReport.success': 'Reporte publicado correctamente.',
      'newReport.existingReport': 'Reporte existente',

      'newReport.localExplanation': 'Evaluación generada por el sistema local de respaldo según las palabras y categoría detectadas.',
      'newReport.localUrgentAction': 'Revisión prioritaria por parte del administrador.',
      'newReport.localNormalAction': 'Revisar el reporte y asignarlo al área correspondiente.',


      /* NOTIFICATIONS */

      'notifications.title': 'Notificaciones',
      'notifications.subtitle': 'Aquí verás actualizaciones sobre tus reportes.',
      'notifications.markAllRead': 'Marcar todas como leídas',
      'notifications.unreadSingular': 'notificación sin leer',
      'notifications.unreadPlural': 'notificaciones sin leer',
      'notifications.loading': 'Cargando notificaciones...',
      'notifications.emptyTitle': 'Todavía no tienes notificaciones',
      'notifications.emptyDescription': 'Cuando cambie el estado de uno de tus reportes, aparecerá aquí.',
      'notifications.defaultTitle': 'Notificación',
      'notifications.now': 'Ahora'

    },


    /* =====================================================
       ENGLISH
    ===================================================== */

    English: {

      'nav.home': 'Home',
      'nav.map': 'Map',
      'nav.impact': 'Impact',
      'nav.profile': 'Profile',

      'settings.eyebrow': 'PREFERENCES',
      'settings.title': 'Settings',
      'settings.subtitle': 'Customize your GuayaLink experience.',
      'settings.experience': 'EXPERIENCE',
      'settings.preferences': 'Application preferences',
      'settings.darkMode': 'Dark mode',
      'settings.darkModeDescription': 'Change the appearance of GuayaLink',
      'settings.language': 'Language',
      'settings.languageDescription': 'Select the platform language',
      'settings.privacy': 'Privacy',
      'settings.privacyDescription': 'Control the privacy level of your account',
      'settings.standard': 'Standard',
      'settings.high': 'High',
      'settings.account': 'ACCOUNT',
      'settings.session': 'Session',
      'settings.sessionDescription': 'You can safely sign out of your current session.',
      'settings.logout': 'Sign out',
      'settings.logoutError': 'Unable to sign out.',

      'dashboard.user': 'User',
      'dashboard.welcome': 'WELCOME TO GUAYALINK',
      'dashboard.hello': 'Hello',
      'dashboard.description': 'Report problems, track their progress and help improve your community.',
      'dashboard.notifications': 'Notifications',
      'dashboard.newReport': 'New report',
      'dashboard.citizenImpact': 'CITIZEN IMPACT',
      'dashboard.communityMoves': 'Your community moves with you.',
      'dashboard.impactDescription': 'Every report helps detect and solve problems in the city.',
      'dashboard.reports': 'Reports',
      'dashboard.inProgress': 'In progress',
      'dashboard.resolved': 'Resolved',
      'dashboard.supports': 'Supports',
      'dashboard.quickAccess': 'QUICK ACCESS',
      'dashboard.whatDoYouWant': 'What would you like to do?',
      'dashboard.newReportDescription': 'Report a problem in seconds',
      'dashboard.exploreMap': 'Explore map',
      'dashboard.exploreMapDescription': 'View incidents near you',
      'dashboard.yourReports': 'YOUR REPORTS',
      'dashboard.recentActivity': 'Recent activity',
      'dashboard.viewMap': 'View map',
      'dashboard.noReportsTitle': 'You do not have any reports yet',
      'dashboard.noReportsDescription': 'When you submit your first report, its progress will appear here.',
      'dashboard.firstReport': 'Create my first report',
      'dashboard.defaultReport': 'Citizen report',
      'dashboard.noCategory': 'No category',

      'status.pending': 'Pending',
      'status.received': 'Received',
      'status.inProgress': 'In progress',
      'status.resolved': 'Resolved',

      'profile.user': 'User',
      'profile.eyebrow': 'YOUR PROFILE',
      'profile.citizen': 'GuayaLink Citizen',
      'profile.participation': 'Citizen participation',
      'profile.reportsCreated': 'reports created',
      'profile.reports': 'Reports',
      'profile.resolved': 'Resolved',
      'profile.supports': 'Supports',
      'profile.points': 'Points',
      'profile.account': 'ACCOUNT',
      'profile.space': 'Your GuayaLink space',
      'profile.notifications': 'Notifications',
      'profile.notificationsDescription': 'Check updates about your reports',
      'profile.impact': 'My impact',
      'profile.impactDescription': 'View your citizen statistics',
      'profile.settings': 'Settings',
      'profile.settingsDescription': 'Manage your account information',

      'stats.contribution': 'YOUR CONTRIBUTION',
      'stats.title': 'My impact',
      'stats.description': 'See how your reports help improve the city and how quickly they are being resolved.',
      'stats.resolutionRate': 'Resolution rate',
      'stats.basedOnReports': 'based on your reports',
      'stats.reports': 'Reports',
      'stats.inProgress': 'In progress',
      'stats.resolved': 'Resolved',
      'stats.distribution': 'DISTRIBUTION',
      'stats.byCategory': 'Reports by category',
      'stats.streets': 'Streets',
      'stats.streetsDescription': 'Road infrastructure',
      'stats.lighting': 'Lighting',
      'stats.lightingDescription': 'Public lighting',
      'stats.cleaning': 'Cleaning',
      'stats.cleaningDescription': 'Waste and cleaning',
      'stats.others': 'Others',
      'stats.othersDescription': 'Other types of incidents',
      'stats.activity': 'ACTIVITY',
      'stats.evolution': 'Report evolution',
      'stats.realData': 'Real data',
      'stats.noData': 'There is not enough data yet. Create reports to start seeing your progress.',
      'stats.autoUpdate': 'Your statistics update automatically as you submit and resolve reports.',

      'map.title': 'Citizen map',
      'map.description': 'View reported problems and the areas with the highest concentration.',
      'map.searching': 'Searching...',
      'map.myLocation': '◎ My location',
      'map.reportsMode': 'Reports',
      'map.heatMap': 'Heat map',
      'map.loading': 'Loading map...',
      'map.reportSingular': 'report',
      'map.reportPlural': 'reports',
      'map.lowerConcentration': 'Lower concentration',
      'map.higherConcentration': 'Higher concentration',
      'map.urbanAnalysis': 'URBAN ANALYSIS',
      'map.topZones': 'Areas with the most reports',
      'map.zoneDescription': 'Approximate areas calculated from report locations.',
      'map.noRanking': 'There are not enough reports yet to generate the ranking.',
      'map.ofTotalReports': 'of total reports',
      'map.visibleReports': 'Visible reports',
      'map.selectReport': 'Select a report to view all its details.',
      'map.viewReport': 'View report',
      'map.priority': 'Priority',
      'map.defaultReport': 'Citizen report',
      'map.yourLocation': 'Your location',
      'map.geolocationUnsupported': 'Your browser does not support location access.',
      'map.locationError': 'We could not get your location.',

      'map.categoryAll': 'All',
      'map.categoryStreets': 'Streets',
      'map.categoryLighting': 'Lighting',
      'map.categoryCleaning': 'Cleaning',
      'map.categoryTransport': 'Transport',
      'map.categorySecurity': 'Safety',
      'map.categoryOther': 'Other',

      'priority.urgent': 'Urgent',
      'priority.high': 'High',
      'priority.medium': 'Medium',
      'priority.low': 'Low',

      'newReport.title': 'New report',
      'newReport.subtitle': 'Report a problem and let GuayaLink AI help analyze it.',
      'newReport.titleLabel': 'Title',
      'newReport.titlePlaceholder': 'Example: Deep pothole in front of a school',
      'newReport.descriptionLabel': 'Description',
      'newReport.descriptionPlaceholder': 'Describe what is happening, where it is and why it may be a problem...',
      'newReport.photoEvidence': 'Photo evidence',
      'newReport.addPhoto': 'Add photo',
      'newReport.photoAIHint': 'GuayaLink AI can also analyze the image',
      'newReport.photoAlt': 'Report evidence',
      'newReport.removePhoto': 'Remove photo',

      'newReport.aiDescription': 'Analyzes category, priority, risk level and recommended action.',
      'newReport.analyzeAI': 'Analyze with AI',
      'newReport.analyzing': 'Analyzing...',
      'newReport.aiResultTitle': 'Report analysis',
      'newReport.localFallback': 'Local fallback',
      'newReport.category': 'Category',
      'newReport.priority': 'Priority',
      'newReport.riskLevel': 'Risk level',
      'newReport.confidence': 'Confidence',
      'newReport.estimatedRisk': 'Estimated risk',
      'newReport.adminSummary': 'ADMINISTRATIVE SUMMARY',
      'newReport.whyPriority': 'WHY THIS PRIORITY?',
      'newReport.recommendedAction': 'RECOMMENDED ACTION',
      'newReport.detectedFactors': 'DETECTED FACTORS',
      'newReport.fastAttention': 'GuayaLink AI recommends priority attention.',
      'newReport.aiDisclaimer': 'The AI analysis is advisory. The final priority may be reviewed by an administrator.',

      'newReport.finalCategory': 'Final category',
      'newReport.location': 'Location',
      'newReport.locationNotDetected': 'Location not detected yet',
      'newReport.locationDuplicateHint': 'It is also used to detect duplicate reports.',
      'newReport.gettingLocation': 'Getting location...',
      'newReport.useLocation': '◎ Use my location',

      'newReport.possibleDuplicate': 'POSSIBLE DUPLICATE REPORT',
      'newReport.duplicateFound': 'A similar report already exists nearby',
      'newReport.supports': 'supports',
      'newReport.supportExisting': 'Support existing report',
      'newReport.createAnyway': 'Create a new one anyway',

      'newReport.publish': 'Publish report',
      'newReport.checkingDuplicates': 'Searching for similar reports...',
      'newReport.publishing': 'Publishing...',

      'newReport.categoryStreets': 'Streets',
      'newReport.categoryLighting': 'Lighting',
      'newReport.categoryCleaning': 'Cleaning',
      'newReport.categoryTransport': 'Transport',
      'newReport.categorySecurity': 'Safety',
      'newReport.categoryOther': 'Other',

      'newReport.errorValidImage': 'Select a valid image.',
      'newReport.errorImageFormat': 'Use a JPG, PNG or WEBP image.',
      'newReport.errorImageSize': 'For AI analysis, use an image smaller than 7 MB.',
      'newReport.errorNoGeolocation': 'Your browser does not support location access.',
      'newReport.errorLocationPermission': 'You need to allow access to your location.',
      'newReport.errorLocation': 'We could not get your location.',
      'newReport.aiNeedTitle': 'Enter a title first so GuayaLink AI can analyze it.',
      'newReport.aiNeedDescription': 'Describe the problem in a little more detail before analyzing it.',
      'newReport.aiFallback': 'We could not connect to Gemini. GuayaLink used its local fallback analysis.',
      'newReport.errorLogin': 'You need to sign in to publish a report.',
      'newReport.errorTitle': 'Enter a title for the report.',
      'newReport.errorDescription': 'Describe the problem.',
      'newReport.errorNeedLocation': 'You must first get the location of the problem.',
      'newReport.errorDuplicateCheck': 'We could not verify the report.',
      'newReport.errorPublish': 'The report could not be published.',
      'newReport.errorSupport': 'The existing report could not be supported.',
      'newReport.success': 'Report published successfully.',
      'newReport.existingReport': 'Existing report',

      'newReport.localExplanation': 'Evaluation generated by the local fallback system based on the detected words and category.',
      'newReport.localUrgentAction': 'Priority review by an administrator.',
      'newReport.localNormalAction': 'Review the report and assign it to the appropriate area.',


      /* NOTIFICATIONS */

      'notifications.title': 'Notifications',
      'notifications.subtitle': 'You will see updates about your reports here.',
      'notifications.markAllRead': 'Mark all as read',
      'notifications.unreadSingular': 'unread notification',
      'notifications.unreadPlural': 'unread notifications',
      'notifications.loading': 'Loading notifications...',
      'notifications.emptyTitle': 'You do not have any notifications yet',
      'notifications.emptyDescription': 'When the status of one of your reports changes, it will appear here.',
      'notifications.defaultTitle': 'Notification',
      'notifications.now': 'Now'

    },


    /* =====================================================
       PORTUGUÊS
    ===================================================== */

    Português: {

      'nav.home': 'Início',
      'nav.map': 'Mapa',
      'nav.impact': 'Impacto',
      'nav.profile': 'Perfil',

      'settings.eyebrow': 'PREFERÊNCIAS',
      'settings.title': 'Configurações',
      'settings.subtitle': 'Personalize sua experiência no GuayaLink.',
      'settings.experience': 'EXPERIÊNCIA',
      'settings.preferences': 'Preferências do aplicativo',
      'settings.darkMode': 'Modo escuro',
      'settings.darkModeDescription': 'Altere a aparência do GuayaLink',
      'settings.language': 'Idioma',
      'settings.languageDescription': 'Selecione o idioma da plataforma',
      'settings.privacy': 'Privacidade',
      'settings.privacyDescription': 'Controle o nível de privacidade da sua conta',
      'settings.standard': 'Padrão',
      'settings.high': 'Alta',
      'settings.account': 'CONTA',
      'settings.session': 'Sessão',
      'settings.sessionDescription': 'Você pode encerrar sua sessão atual com segurança.',
      'settings.logout': 'Sair',
      'settings.logoutError': 'Não foi possível encerrar a sessão.',

      'dashboard.user': 'Usuário',
      'dashboard.welcome': 'BEM-VINDO AO GUAYALINK',
      'dashboard.hello': 'Olá',
      'dashboard.description': 'Reporte problemas, acompanhe o progresso e ajude a melhorar sua comunidade.',
      'dashboard.notifications': 'Notificações',
      'dashboard.newReport': 'Novo relatório',
      'dashboard.citizenImpact': 'IMPACTO CIDADÃO',
      'dashboard.communityMoves': 'Sua comunidade se move com você.',
      'dashboard.impactDescription': 'Cada relatório ajuda a detectar e resolver problemas da cidade.',
      'dashboard.reports': 'Relatórios',
      'dashboard.inProgress': 'Em andamento',
      'dashboard.resolved': 'Resolvidos',
      'dashboard.supports': 'Apoios',
      'dashboard.quickAccess': 'ACESSO RÁPIDO',
      'dashboard.whatDoYouWant': 'O que você quer fazer?',
      'dashboard.newReportDescription': 'Informe um problema em segundos',
      'dashboard.exploreMap': 'Explorar mapa',
      'dashboard.exploreMapDescription': 'Veja ocorrências perto de você',
      'dashboard.yourReports': 'SEUS RELATÓRIOS',
      'dashboard.recentActivity': 'Atividade recente',
      'dashboard.viewMap': 'Ver mapa',
      'dashboard.noReportsTitle': 'Você ainda não tem relatórios',
      'dashboard.noReportsDescription': 'Quando enviar seu primeiro relatório, o progresso aparecerá aqui.',
      'dashboard.firstReport': 'Criar meu primeiro relatório',
      'dashboard.defaultReport': 'Relatório cidadão',
      'dashboard.noCategory': 'Sem categoria',

      'status.pending': 'Pendente',
      'status.received': 'Recebido',
      'status.inProgress': 'Em andamento',
      'status.resolved': 'Resolvido',

      'profile.user': 'Usuário',
      'profile.eyebrow': 'SEU PERFIL',
      'profile.citizen': 'Cidadão GuayaLink',
      'profile.participation': 'Participação cidadã',
      'profile.reportsCreated': 'relatórios criados',
      'profile.reports': 'Relatórios',
      'profile.resolved': 'Resolvidos',
      'profile.supports': 'Apoios',
      'profile.points': 'Pontos',
      'profile.account': 'CONTA',
      'profile.space': 'Seu espaço GuayaLink',
      'profile.notifications': 'Notificações',
      'profile.notificationsDescription': 'Veja novidades sobre seus relatórios',
      'profile.impact': 'Meu impacto',
      'profile.impactDescription': 'Consulte suas estatísticas cidadãs',
      'profile.settings': 'Configurações',
      'profile.settingsDescription': 'Gerencie os dados da sua conta',

      'stats.contribution': 'SUA CONTRIBUIÇÃO',
      'stats.title': 'Meu impacto',
      'stats.description': 'Veja como seus relatórios ajudam a melhorar a cidade e com que rapidez estão sendo resolvidos.',
      'stats.resolutionRate': 'Taxa de resolução',
      'stats.basedOnReports': 'baseada nos seus relatórios',
      'stats.reports': 'Relatórios',
      'stats.inProgress': 'Em andamento',
      'stats.resolved': 'Resolvidos',
      'stats.distribution': 'DISTRIBUIÇÃO',
      'stats.byCategory': 'Relatórios por categoria',
      'stats.streets': 'Ruas',
      'stats.streetsDescription': 'Infraestrutura viária',
      'stats.lighting': 'Iluminação',
      'stats.lightingDescription': 'Iluminação pública',
      'stats.cleaning': 'Limpeza',
      'stats.cleaningDescription': 'Resíduos e limpeza',
      'stats.others': 'Outros',
      'stats.othersDescription': 'Outros tipos de ocorrências',
      'stats.activity': 'ATIVIDADE',
      'stats.evolution': 'Evolução dos relatórios',
      'stats.realData': 'Dados reais',
      'stats.noData': 'Ainda não há dados suficientes. Crie relatórios para começar a ver sua evolução.',
      'stats.autoUpdate': 'Suas estatísticas são atualizadas automaticamente conforme você envia e resolve relatórios.',

      'map.title': 'Mapa cidadão',
      'map.description': 'Visualize os problemas relatados e as áreas com maior concentração.',
      'map.searching': 'Procurando...',
      'map.myLocation': '◎ Minha localização',
      'map.reportsMode': 'Relatórios',
      'map.heatMap': 'Mapa de calor',
      'map.loading': 'Carregando mapa...',
      'map.reportSingular': 'relatório',
      'map.reportPlural': 'relatórios',
      'map.lowerConcentration': 'Menor concentração',
      'map.higherConcentration': 'Maior concentração',
      'map.urbanAnalysis': 'ANÁLISE URBANA',
      'map.topZones': 'Áreas com mais relatórios',
      'map.zoneDescription': 'Áreas aproximadas calculadas de acordo com a localização dos relatórios.',
      'map.noRanking': 'Ainda não há relatórios suficientes para gerar o ranking.',
      'map.ofTotalReports': 'do total de relatórios',
      'map.visibleReports': 'Relatórios visíveis',
      'map.selectReport': 'Selecione um relatório para ver todos os detalhes.',
      'map.viewReport': 'Ver relatório',
      'map.priority': 'Prioridade',
      'map.defaultReport': 'Relatório cidadão',
      'map.yourLocation': 'Sua localização',
      'map.geolocationUnsupported': 'Seu navegador não permite obter a localização.',
      'map.locationError': 'Não foi possível obter sua localização.',

      'map.categoryAll': 'Todos',
      'map.categoryStreets': 'Ruas',
      'map.categoryLighting': 'Iluminação',
      'map.categoryCleaning': 'Limpeza',
      'map.categoryTransport': 'Transporte',
      'map.categorySecurity': 'Segurança',
      'map.categoryOther': 'Outro',

      'priority.urgent': 'Urgente',
      'priority.high': 'Alta',
      'priority.medium': 'Média',
      'priority.low': 'Baixa',

      'newReport.title': 'Novo relatório',
      'newReport.subtitle': 'Reporte um problema e deixe o GuayaLink AI ajudar a analisá-lo.',
      'newReport.titleLabel': 'Título',
      'newReport.titlePlaceholder': 'Ex: Buraco profundo em frente a uma escola',
      'newReport.descriptionLabel': 'Descrição',
      'newReport.descriptionPlaceholder': 'Descreva o que está acontecendo, onde está e por que pode ser um problema...',
      'newReport.photoEvidence': 'Evidência fotográfica',
      'newReport.addPhoto': 'Adicionar foto',
      'newReport.photoAIHint': 'O GuayaLink AI também pode analisar a imagem',
      'newReport.photoAlt': 'Evidência do relatório',
      'newReport.removePhoto': 'Remover foto',

      'newReport.aiDescription': 'Analisa categoria, prioridade, nível de risco e ação recomendada.',
      'newReport.analyzeAI': 'Analisar com IA',
      'newReport.analyzing': 'Analisando...',
      'newReport.aiResultTitle': 'Análise do relatório',
      'newReport.localFallback': 'Análise local',
      'newReport.category': 'Categoria',
      'newReport.priority': 'Prioridade',
      'newReport.riskLevel': 'Nível de risco',
      'newReport.confidence': 'Confiança',
      'newReport.estimatedRisk': 'Risco estimado',
      'newReport.adminSummary': 'RESUMO ADMINISTRATIVO',
      'newReport.whyPriority': 'POR QUE ESTA PRIORIDADE?',
      'newReport.recommendedAction': 'AÇÃO RECOMENDADA',
      'newReport.detectedFactors': 'FATORES DETECTADOS',
      'newReport.fastAttention': 'O GuayaLink AI recomenda atenção prioritária.',
      'newReport.aiDisclaimer': 'A análise de IA é orientativa. A prioridade final pode ser revisada por um administrador.',

      'newReport.finalCategory': 'Categoria final',
      'newReport.location': 'Localização',
      'newReport.locationNotDetected': 'Localização ainda não detectada',
      'newReport.locationDuplicateHint': 'Também é utilizada para detectar relatórios duplicados.',
      'newReport.gettingLocation': 'Obtendo localização...',
      'newReport.useLocation': '◎ Usar minha localização',

      'newReport.possibleDuplicate': 'POSSÍVEL RELATÓRIO DUPLICADO',
      'newReport.duplicateFound': 'Já existe um relatório semelhante por perto',
      'newReport.supports': 'apoios',
      'newReport.supportExisting': 'Apoiar relatório existente',
      'newReport.createAnyway': 'Criar um novo mesmo assim',

      'newReport.publish': 'Publicar relatório',
      'newReport.checkingDuplicates': 'Procurando relatórios semelhantes...',
      'newReport.publishing': 'Publicando...',

      'newReport.categoryStreets': 'Ruas',
      'newReport.categoryLighting': 'Iluminação',
      'newReport.categoryCleaning': 'Limpeza',
      'newReport.categoryTransport': 'Transporte',
      'newReport.categorySecurity': 'Segurança',
      'newReport.categoryOther': 'Outro',

      'newReport.errorValidImage': 'Selecione uma imagem válida.',
      'newReport.errorImageFormat': 'Use uma imagem JPG, PNG ou WEBP.',
      'newReport.errorImageSize': 'Para a análise com IA, use uma imagem menor que 7 MB.',
      'newReport.errorNoGeolocation': 'Seu navegador não permite obter a localização.',
      'newReport.errorLocationPermission': 'Você precisa permitir o acesso à sua localização.',
      'newReport.errorLocation': 'Não foi possível obter sua localização.',
      'newReport.aiNeedTitle': 'Escreva primeiro um título para que o GuayaLink AI possa analisá-lo.',
      'newReport.aiNeedDescription': 'Descreva melhor o problema antes de analisá-lo.',
      'newReport.aiFallback': 'Não foi possível conectar ao Gemini. O GuayaLink utilizou sua análise local de backup.',
      'newReport.errorLogin': 'Você precisa entrar na sua conta para publicar um relatório.',
      'newReport.errorTitle': 'Escreva um título para o relatório.',
      'newReport.errorDescription': 'Descreva o problema.',
      'newReport.errorNeedLocation': 'Primeiro você precisa obter a localização do problema.',
      'newReport.errorDuplicateCheck': 'Não foi possível verificar o relatório.',
      'newReport.errorPublish': 'Não foi possível publicar o relatório.',
      'newReport.errorSupport': 'Não foi possível apoiar o relatório existente.',
      'newReport.success': 'Relatório publicado com sucesso.',
      'newReport.existingReport': 'Relatório existente',

      'newReport.localExplanation': 'Avaliação gerada pelo sistema local de backup de acordo com as palavras e a categoria detectadas.',
      'newReport.localUrgentAction': 'Revisão prioritária por um administrador.',
      'newReport.localNormalAction': 'Revisar o relatório e atribuí-lo à área correspondente.',


      /* NOTIFICATIONS */

      'notifications.title': 'Notificações',
      'notifications.subtitle': 'Aqui você verá atualizações sobre seus relatórios.',
      'notifications.markAllRead': 'Marcar todas como lidas',
      'notifications.unreadSingular': 'notificação não lida',
      'notifications.unreadPlural': 'notificações não lidas',
      'notifications.loading': 'Carregando notificações...',
      'notifications.emptyTitle': 'Você ainda não tem notificações',
      'notifications.emptyDescription': 'Quando o status de um dos seus relatórios mudar, ele aparecerá aqui.',
      'notifications.defaultTitle': 'Notificação',
      'notifications.now': 'Agora'

    },


    /* =====================================================
       FRANÇAIS
    ===================================================== */

    Français: {

      'nav.home': 'Accueil',
      'nav.map': 'Carte',
      'nav.impact': 'Impact',
      'nav.profile': 'Profil',

      'settings.eyebrow': 'PRÉFÉRENCES',
      'settings.title': 'Paramètres',
      'settings.subtitle': 'Personnalisez votre expérience GuayaLink.',
      'settings.experience': 'EXPÉRIENCE',
      'settings.preferences': 'Préférences de l’application',
      'settings.darkMode': 'Mode sombre',
      'settings.darkModeDescription': 'Modifiez l’apparence de GuayaLink',
      'settings.language': 'Langue',
      'settings.languageDescription': 'Sélectionnez la langue de la plateforme',
      'settings.privacy': 'Confidentialité',
      'settings.privacyDescription': 'Contrôlez le niveau de confidentialité de votre compte',
      'settings.standard': 'Standard',
      'settings.high': 'Élevée',
      'settings.account': 'COMPTE',
      'settings.session': 'Session',
      'settings.sessionDescription': 'Vous pouvez vous déconnecter de votre session actuelle en toute sécurité.',
      'settings.logout': 'Se déconnecter',
      'settings.logoutError': 'Impossible de se déconnecter.',

      'dashboard.user': 'Utilisateur',
      'dashboard.welcome': 'BIENVENUE SUR GUAYALINK',
      'dashboard.hello': 'Bonjour',
      'dashboard.description': 'Signalez des problèmes, suivez leur progression et contribuez à améliorer votre communauté.',
      'dashboard.notifications': 'Notifications',
      'dashboard.newReport': 'Nouveau signalement',
      'dashboard.citizenImpact': 'IMPACT CITOYEN',
      'dashboard.communityMoves': 'Votre communauté avance avec vous.',
      'dashboard.impactDescription': 'Chaque signalement aide à détecter et résoudre les problèmes de la ville.',
      'dashboard.reports': 'Signalements',
      'dashboard.inProgress': 'En cours',
      'dashboard.resolved': 'Résolus',
      'dashboard.supports': 'Soutiens',
      'dashboard.quickAccess': 'ACCÈS RAPIDE',
      'dashboard.whatDoYouWant': 'Que voulez-vous faire ?',
      'dashboard.newReportDescription': 'Signalez un problème en quelques secondes',
      'dashboard.exploreMap': 'Explorer la carte',
      'dashboard.exploreMapDescription': 'Consultez les incidents près de chez vous',
      'dashboard.yourReports': 'VOS SIGNALEMENTS',
      'dashboard.recentActivity': 'Activité récente',
      'dashboard.viewMap': 'Voir la carte',
      'dashboard.noReportsTitle': 'Vous n’avez encore aucun signalement',
      'dashboard.noReportsDescription': 'Lorsque vous enverrez votre premier signalement, sa progression apparaîtra ici.',
      'dashboard.firstReport': 'Créer mon premier signalement',
      'dashboard.defaultReport': 'Signalement citoyen',
      'dashboard.noCategory': 'Sans catégorie',

      'status.pending': 'En attente',
      'status.received': 'Reçu',
      'status.inProgress': 'En cours',
      'status.resolved': 'Résolu',

      'profile.user': 'Utilisateur',
      'profile.eyebrow': 'VOTRE PROFIL',
      'profile.citizen': 'Citoyen GuayaLink',
      'profile.participation': 'Participation citoyenne',
      'profile.reportsCreated': 'signalements créés',
      'profile.reports': 'Signalements',
      'profile.resolved': 'Résolus',
      'profile.supports': 'Soutiens',
      'profile.points': 'Points',
      'profile.account': 'COMPTE',
      'profile.space': 'Votre espace GuayaLink',
      'profile.notifications': 'Notifications',
      'profile.notificationsDescription': 'Consultez les nouveautés de vos signalements',
      'profile.impact': 'Mon impact',
      'profile.impactDescription': 'Consultez vos statistiques citoyennes',
      'profile.settings': 'Paramètres',
      'profile.settingsDescription': 'Gérez les informations de votre compte',

      'stats.contribution': 'VOTRE CONTRIBUTION',
      'stats.title': 'Mon impact',
      'stats.description': 'Découvrez comment vos signalements contribuent à améliorer la ville et à quelle vitesse ils sont résolus.',
      'stats.resolutionRate': 'Taux de résolution',
      'stats.basedOnReports': 'basé sur vos signalements',
      'stats.reports': 'Signalements',
      'stats.inProgress': 'En cours',
      'stats.resolved': 'Résolus',
      'stats.distribution': 'RÉPARTITION',
      'stats.byCategory': 'Signalements par catégorie',
      'stats.streets': 'Voirie',
      'stats.streetsDescription': 'Infrastructure routière',
      'stats.lighting': 'Éclairage',
      'stats.lightingDescription': 'Éclairage public',
      'stats.cleaning': 'Propreté',
      'stats.cleaningDescription': 'Déchets et nettoyage',
      'stats.others': 'Autres',
      'stats.othersDescription': 'Autres types d’incidents',
      'stats.activity': 'ACTIVITÉ',
      'stats.evolution': 'Évolution des signalements',
      'stats.realData': 'Données réelles',
      'stats.noData': 'Il n’y a pas encore assez de données. Créez des signalements pour commencer à voir votre évolution.',
      'stats.autoUpdate': 'Vos statistiques sont mises à jour automatiquement lorsque vous envoyez et résolvez des signalements.',

      'map.title': 'Carte citoyenne',
      'map.description': 'Visualisez les problèmes signalés et les zones où ils sont les plus concentrés.',
      'map.searching': 'Recherche...',
      'map.myLocation': '◎ Ma position',
      'map.reportsMode': 'Signalements',
      'map.heatMap': 'Carte de chaleur',
      'map.loading': 'Chargement de la carte...',
      'map.reportSingular': 'signalement',
      'map.reportPlural': 'signalements',
      'map.lowerConcentration': 'Faible concentration',
      'map.higherConcentration': 'Forte concentration',
      'map.urbanAnalysis': 'ANALYSE URBAINE',
      'map.topZones': 'Zones avec le plus de signalements',
      'map.zoneDescription': 'Zones approximatives calculées selon la localisation des signalements.',
      'map.noRanking': 'Il n’y a pas encore assez de signalements pour générer le classement.',
      'map.ofTotalReports': 'du total des signalements',
      'map.visibleReports': 'Signalements visibles',
      'map.selectReport': 'Sélectionnez un signalement pour voir tous ses détails.',
      'map.viewReport': 'Voir le signalement',
      'map.priority': 'Priorité',
      'map.defaultReport': 'Signalement citoyen',
      'map.yourLocation': 'Votre position',
      'map.geolocationUnsupported': 'Votre navigateur ne permet pas d’obtenir votre position.',
      'map.locationError': 'Impossible d’obtenir votre position.',

      'map.categoryAll': 'Tous',
      'map.categoryStreets': 'Voirie',
      'map.categoryLighting': 'Éclairage',
      'map.categoryCleaning': 'Propreté',
      'map.categoryTransport': 'Transport',
      'map.categorySecurity': 'Sécurité',
      'map.categoryOther': 'Autre',

      'priority.urgent': 'Urgente',
      'priority.high': 'Élevée',
      'priority.medium': 'Moyenne',
      'priority.low': 'Faible',

      'newReport.title': 'Nouveau signalement',
      'newReport.subtitle': 'Signalez un problème et laissez GuayaLink AI vous aider à l’analyser.',
      'newReport.titleLabel': 'Titre',
      'newReport.titlePlaceholder': 'Ex : Nid-de-poule profond devant une école',
      'newReport.descriptionLabel': 'Description',
      'newReport.descriptionPlaceholder': 'Décrivez ce qui se passe, où cela se trouve et pourquoi cela peut poser problème...',
      'newReport.photoEvidence': 'Preuve photographique',
      'newReport.addPhoto': 'Ajouter une photo',
      'newReport.photoAIHint': 'GuayaLink AI peut également analyser l’image',
      'newReport.photoAlt': 'Preuve du signalement',
      'newReport.removePhoto': 'Supprimer la photo',

      'newReport.aiDescription': 'Analyse la catégorie, la priorité, le niveau de risque et l’action recommandée.',
      'newReport.analyzeAI': 'Analyser avec l’IA',
      'newReport.analyzing': 'Analyse...',
      'newReport.aiResultTitle': 'Analyse du signalement',
      'newReport.localFallback': 'Analyse locale',
      'newReport.category': 'Catégorie',
      'newReport.priority': 'Priorité',
      'newReport.riskLevel': 'Niveau de risque',
      'newReport.confidence': 'Confiance',
      'newReport.estimatedRisk': 'Risque estimé',
      'newReport.adminSummary': 'RÉSUMÉ ADMINISTRATIF',
      'newReport.whyPriority': 'POURQUOI CETTE PRIORITÉ ?',
      'newReport.recommendedAction': 'ACTION RECOMMANDÉE',
      'newReport.detectedFactors': 'FACTEURS DÉTECTÉS',
      'newReport.fastAttention': 'GuayaLink AI recommande une attention prioritaire.',
      'newReport.aiDisclaimer': 'L’analyse de l’IA est indicative. La priorité finale peut être révisée par un administrateur.',

      'newReport.finalCategory': 'Catégorie finale',
      'newReport.location': 'Localisation',
      'newReport.locationNotDetected': 'Localisation pas encore détectée',
      'newReport.locationDuplicateHint': 'Elle est également utilisée pour détecter les signalements en double.',
      'newReport.gettingLocation': 'Obtention de la position...',
      'newReport.useLocation': '◎ Utiliser ma position',

      'newReport.possibleDuplicate': 'SIGNALEMENT POTENTIELLEMENT EN DOUBLE',
      'newReport.duplicateFound': 'Un signalement similaire existe déjà à proximité',
      'newReport.supports': 'soutiens',
      'newReport.supportExisting': 'Soutenir le signalement existant',
      'newReport.createAnyway': 'Créer quand même un nouveau signalement',

      'newReport.publish': 'Publier le signalement',
      'newReport.checkingDuplicates': 'Recherche de signalements similaires...',
      'newReport.publishing': 'Publication...',

      'newReport.categoryStreets': 'Voirie',
      'newReport.categoryLighting': 'Éclairage',
      'newReport.categoryCleaning': 'Propreté',
      'newReport.categoryTransport': 'Transport',
      'newReport.categorySecurity': 'Sécurité',
      'newReport.categoryOther': 'Autre',

      'newReport.errorValidImage': 'Sélectionnez une image valide.',
      'newReport.errorImageFormat': 'Utilisez une image JPG, PNG ou WEBP.',
      'newReport.errorImageSize': 'Pour l’analyse IA, utilisez une image de moins de 7 Mo.',
      'newReport.errorNoGeolocation': 'Votre navigateur ne permet pas d’obtenir votre position.',
      'newReport.errorLocationPermission': 'Vous devez autoriser l’accès à votre position.',
      'newReport.errorLocation': 'Impossible d’obtenir votre position.',
      'newReport.aiNeedTitle': 'Saisissez d’abord un titre pour que GuayaLink AI puisse l’analyser.',
      'newReport.aiNeedDescription': 'Décrivez un peu mieux le problème avant de l’analyser.',
      'newReport.aiFallback': 'Impossible de se connecter à Gemini. GuayaLink a utilisé son analyse locale de secours.',
      'newReport.errorLogin': 'Vous devez vous connecter pour publier un signalement.',
      'newReport.errorTitle': 'Saisissez un titre pour le signalement.',
      'newReport.errorDescription': 'Décrivez le problème.',
      'newReport.errorNeedLocation': 'Vous devez d’abord obtenir la localisation du problème.',
      'newReport.errorDuplicateCheck': 'Impossible de vérifier le signalement.',
      'newReport.errorPublish': 'Impossible de publier le signalement.',
      'newReport.errorSupport': 'Impossible de soutenir le signalement existant.',
      'newReport.success': 'Signalement publié avec succès.',
      'newReport.existingReport': 'Signalement existant',

      'newReport.localExplanation': 'Évaluation générée par le système local de secours selon les mots et la catégorie détectés.',
      'newReport.localUrgentAction': 'Examen prioritaire par un administrateur.',
      'newReport.localNormalAction': 'Examiner le signalement et l’attribuer au service approprié.',


      /* NOTIFICATIONS */

      'notifications.title': 'Notifications',
      'notifications.subtitle': 'Vous verrez ici les mises à jour de vos signalements.',
      'notifications.markAllRead': 'Tout marquer comme lu',
      'notifications.unreadSingular': 'notification non lue',
      'notifications.unreadPlural': 'notifications non lues',
      'notifications.loading': 'Chargement des notifications...',
      'notifications.emptyTitle': 'Vous n’avez encore aucune notification',
      'notifications.emptyDescription': 'Lorsque le statut de l’un de vos signalements changera, il apparaîtra ici.',
      'notifications.defaultTitle': 'Notification',
      'notifications.now': 'Maintenant'

    },


    /* =====================================================
       РУССКИЙ
    ===================================================== */

    Русский: {

      'nav.home': 'Главная',
      'nav.map': 'Карта',
      'nav.impact': 'Вклад',
      'nav.profile': 'Профиль',

      'settings.eyebrow': 'НАСТРОЙКИ',
      'settings.title': 'Настройки',
      'settings.subtitle': 'Настройте GuayaLink под себя.',
      'settings.experience': 'ИНТЕРФЕЙС',
      'settings.preferences': 'Настройки приложения',
      'settings.darkMode': 'Тёмная тема',
      'settings.darkModeDescription': 'Измените внешний вид GuayaLink',
      'settings.language': 'Язык',
      'settings.languageDescription': 'Выберите язык платформы',
      'settings.privacy': 'Конфиденциальность',
      'settings.privacyDescription': 'Управляйте уровнем конфиденциальности аккаунта',
      'settings.standard': 'Стандартная',
      'settings.high': 'Высокая',
      'settings.account': 'АККАУНТ',
      'settings.session': 'Сессия',
      'settings.sessionDescription': 'Вы можете безопасно выйти из текущей сессии.',
      'settings.logout': 'Выйти',
      'settings.logoutError': 'Не удалось выйти из аккаунта.',

      'dashboard.user': 'Пользователь',
      'dashboard.welcome': 'ДОБРО ПОЖАЛОВАТЬ В GUAYALINK',
      'dashboard.hello': 'Привет',
      'dashboard.description': 'Сообщайте о проблемах, следите за их решением и помогайте улучшать свой город.',
      'dashboard.notifications': 'Уведомления',
      'dashboard.newReport': 'Новое сообщение',
      'dashboard.citizenImpact': 'ВКЛАД ЖИТЕЛЯ',
      'dashboard.communityMoves': 'Ваш вклад помогает вашему городу.',
      'dashboard.impactDescription': 'Каждое сообщение помогает обнаруживать и решать городские проблемы.',
      'dashboard.reports': 'Сообщения',
      'dashboard.inProgress': 'В процессе',
      'dashboard.resolved': 'Решено',
      'dashboard.supports': 'Поддержка',
      'dashboard.quickAccess': 'БЫСТРЫЙ ДОСТУП',
      'dashboard.whatDoYouWant': 'Что вы хотите сделать?',
      'dashboard.newReportDescription': 'Сообщите о проблеме за несколько секунд',
      'dashboard.exploreMap': 'Открыть карту',
      'dashboard.exploreMapDescription': 'Посмотрите проблемы рядом с вами',
      'dashboard.yourReports': 'ВАШИ СООБЩЕНИЯ',
      'dashboard.recentActivity': 'Последняя активность',
      'dashboard.viewMap': 'Открыть карту',
      'dashboard.noReportsTitle': 'У вас пока нет сообщений',
      'dashboard.noReportsDescription': 'После создания первого сообщения его статус появится здесь.',
      'dashboard.firstReport': 'Создать первое сообщение',
      'dashboard.defaultReport': 'Сообщение жителя',
      'dashboard.noCategory': 'Без категории',

      'status.pending': 'Ожидает',
      'status.received': 'Получено',
      'status.inProgress': 'В процессе',
      'status.resolved': 'Решено',

      'profile.user': 'Пользователь',
      'profile.eyebrow': 'ВАШ ПРОФИЛЬ',
      'profile.citizen': 'Житель GuayaLink',
      'profile.participation': 'Гражданское участие',
      'profile.reportsCreated': 'создано сообщений',
      'profile.reports': 'Сообщения',
      'profile.resolved': 'Решено',
      'profile.supports': 'Поддержка',
      'profile.points': 'Баллы',
      'profile.account': 'АККАУНТ',
      'profile.space': 'Ваше пространство GuayaLink',
      'profile.notifications': 'Уведомления',
      'profile.notificationsDescription': 'Следите за обновлениями ваших сообщений',
      'profile.impact': 'Мой вклад',
      'profile.impactDescription': 'Посмотрите свою гражданскую статистику',
      'profile.settings': 'Настройки',
      'profile.settingsDescription': 'Управляйте данными своего аккаунта',

      'stats.contribution': 'ВАШ ВКЛАД',
      'stats.title': 'Мой вклад',
      'stats.description': 'Посмотрите, как ваши сообщения помогают улучшать город и насколько быстро решаются проблемы.',
      'stats.resolutionRate': 'Процент решения',
      'stats.basedOnReports': 'на основе ваших сообщений',
      'stats.reports': 'Сообщения',
      'stats.inProgress': 'В процессе',
      'stats.resolved': 'Решено',
      'stats.distribution': 'РАСПРЕДЕЛЕНИЕ',
      'stats.byCategory': 'Сообщения по категориям',
      'stats.streets': 'Дороги',
      'stats.streetsDescription': 'Дорожная инфраструктура',
      'stats.lighting': 'Освещение',
      'stats.lightingDescription': 'Уличное освещение',
      'stats.cleaning': 'Уборка',
      'stats.cleaningDescription': 'Мусор и уборка',
      'stats.others': 'Другое',
      'stats.othersDescription': 'Другие виды проблем',
      'stats.activity': 'АКТИВНОСТЬ',
      'stats.evolution': 'Динамика сообщений',
      'stats.realData': 'Реальные данные',
      'stats.noData': 'Пока недостаточно данных. Создайте сообщения, чтобы увидеть свою динамику.',
      'stats.autoUpdate': 'Статистика автоматически обновляется по мере создания и решения ваших сообщений.',

      'map.title': 'Карта города',
      'map.description': 'Просматривайте сообщения о проблемах и районы с их наибольшей концентрацией.',
      'map.searching': 'Поиск...',
      'map.myLocation': '◎ Моё местоположение',
      'map.reportsMode': 'Сообщения',
      'map.heatMap': 'Тепловая карта',
      'map.loading': 'Загрузка карты...',
      'map.reportSingular': 'сообщение',
      'map.reportPlural': 'сообщений',
      'map.lowerConcentration': 'Меньшая концентрация',
      'map.higherConcentration': 'Большая концентрация',
      'map.urbanAnalysis': 'АНАЛИЗ ГОРОДА',
      'map.topZones': 'Районы с наибольшим числом сообщений',
      'map.zoneDescription': 'Приблизительные районы рассчитаны на основе расположения сообщений.',
      'map.noRanking': 'Пока недостаточно сообщений для создания рейтинга.',
      'map.ofTotalReports': 'от общего числа сообщений',
      'map.visibleReports': 'Видимые сообщения',
      'map.selectReport': 'Выберите сообщение, чтобы посмотреть все подробности.',
      'map.viewReport': 'Открыть сообщение',
      'map.priority': 'Приоритет',
      'map.defaultReport': 'Сообщение жителя',
      'map.yourLocation': 'Ваше местоположение',
      'map.geolocationUnsupported': 'Ваш браузер не поддерживает определение местоположения.',
      'map.locationError': 'Не удалось определить ваше местоположение.',

      'map.categoryAll': 'Все',
      'map.categoryStreets': 'Дороги',
      'map.categoryLighting': 'Освещение',
      'map.categoryCleaning': 'Уборка',
      'map.categoryTransport': 'Транспорт',
      'map.categorySecurity': 'Безопасность',
      'map.categoryOther': 'Другое',

      'priority.urgent': 'Срочный',
      'priority.high': 'Высокий',
      'priority.medium': 'Средний',
      'priority.low': 'Низкий',

      'newReport.title': 'Новое сообщение',
      'newReport.subtitle': 'Сообщите о проблеме, а GuayaLink AI поможет её проанализировать.',
      'newReport.titleLabel': 'Название',
      'newReport.titlePlaceholder': 'Например: глубокая яма перед школой',
      'newReport.descriptionLabel': 'Описание',
      'newReport.descriptionPlaceholder': 'Опишите, что происходит, где находится проблема и почему она может быть опасной...',
      'newReport.photoEvidence': 'Фотография',
      'newReport.addPhoto': 'Добавить фото',
      'newReport.photoAIHint': 'GuayaLink AI также может проанализировать изображение',
      'newReport.photoAlt': 'Фотография проблемы',
      'newReport.removePhoto': 'Удалить фото',

      'newReport.aiDescription': 'Определяет категорию, приоритет, уровень риска и рекомендуемое действие.',
      'newReport.analyzeAI': 'Анализировать с ИИ',
      'newReport.analyzing': 'Анализ...',
      'newReport.aiResultTitle': 'Анализ сообщения',
      'newReport.localFallback': 'Локальный анализ',
      'newReport.category': 'Категория',
      'newReport.priority': 'Приоритет',
      'newReport.riskLevel': 'Уровень риска',
      'newReport.confidence': 'Уверенность',
      'newReport.estimatedRisk': 'Оценка риска',
      'newReport.adminSummary': 'КРАТКОЕ ОПИСАНИЕ',
      'newReport.whyPriority': 'ПОЧЕМУ ТАКОЙ ПРИОРИТЕТ?',
      'newReport.recommendedAction': 'РЕКОМЕНДУЕМОЕ ДЕЙСТВИЕ',
      'newReport.detectedFactors': 'ОБНАРУЖЕННЫЕ ФАКТОРЫ',
      'newReport.fastAttention': 'GuayaLink AI рекомендует приоритетное рассмотрение.',
      'newReport.aiDisclaimer': 'Анализ ИИ носит рекомендательный характер. Окончательный приоритет может быть изменён администратором.',

      'newReport.finalCategory': 'Итоговая категория',
      'newReport.location': 'Местоположение',
      'newReport.locationNotDetected': 'Местоположение ещё не определено',
      'newReport.locationDuplicateHint': 'Оно также используется для поиска похожих сообщений.',
      'newReport.gettingLocation': 'Определение местоположения...',
      'newReport.useLocation': '◎ Использовать моё местоположение',

      'newReport.possibleDuplicate': 'ВОЗМОЖНОЕ ПОВТОРНОЕ СООБЩЕНИЕ',
      'newReport.duplicateFound': 'Рядом уже есть похожее сообщение',
      'newReport.supports': 'поддержки',
      'newReport.supportExisting': 'Поддержать существующее сообщение',
      'newReport.createAnyway': 'Всё равно создать новое',

      'newReport.publish': 'Опубликовать сообщение',
      'newReport.checkingDuplicates': 'Поиск похожих сообщений...',
      'newReport.publishing': 'Публикация...',

      'newReport.categoryStreets': 'Дороги',
      'newReport.categoryLighting': 'Освещение',
      'newReport.categoryCleaning': 'Уборка',
      'newReport.categoryTransport': 'Транспорт',
      'newReport.categorySecurity': 'Безопасность',
      'newReport.categoryOther': 'Другое',

      'newReport.errorValidImage': 'Выберите корректное изображение.',
      'newReport.errorImageFormat': 'Используйте изображение JPG, PNG или WEBP.',
      'newReport.errorImageSize': 'Для анализа ИИ используйте изображение размером менее 7 МБ.',
      'newReport.errorNoGeolocation': 'Ваш браузер не поддерживает определение местоположения.',
      'newReport.errorLocationPermission': 'Необходимо разрешить доступ к местоположению.',
      'newReport.errorLocation': 'Не удалось определить ваше местоположение.',
      'newReport.aiNeedTitle': 'Сначала введите название, чтобы GuayaLink AI мог выполнить анализ.',
      'newReport.aiNeedDescription': 'Перед анализом опишите проблему немного подробнее.',
      'newReport.aiFallback': 'Не удалось подключиться к Gemini. GuayaLink использовал локальный резервный анализ.',
      'newReport.errorLogin': 'Чтобы опубликовать сообщение, необходимо войти в аккаунт.',
      'newReport.errorTitle': 'Введите название сообщения.',
      'newReport.errorDescription': 'Опишите проблему.',
      'newReport.errorNeedLocation': 'Сначала необходимо определить местоположение проблемы.',
      'newReport.errorDuplicateCheck': 'Не удалось проверить сообщение.',
      'newReport.errorPublish': 'Не удалось опубликовать сообщение.',
      'newReport.errorSupport': 'Не удалось поддержать существующее сообщение.',
      'newReport.success': 'Сообщение успешно опубликовано.',
      'newReport.existingReport': 'Существующее сообщение',

      'newReport.localExplanation': 'Оценка создана локальной резервной системой на основе обнаруженных слов и категории.',
      'newReport.localUrgentAction': 'Приоритетная проверка администратором.',
      'newReport.localNormalAction': 'Проверить сообщение и назначить его соответствующему отделу.',


      /* NOTIFICATIONS */

      'notifications.title': 'Уведомления',
      'notifications.subtitle': 'Здесь будут появляться обновления ваших сообщений.',
      'notifications.markAllRead': 'Отметить все как прочитанные',
      'notifications.unreadSingular': 'непрочитанное уведомление',
      'notifications.unreadPlural': 'непрочитанных уведомлений',
      'notifications.loading': 'Загрузка уведомлений...',
      'notifications.emptyTitle': 'У вас пока нет уведомлений',
      'notifications.emptyDescription': 'Когда статус одного из ваших сообщений изменится, уведомление появится здесь.',
      'notifications.defaultTitle': 'Уведомление',
      'notifications.now': 'Сейчас'

    }

  };


  constructor() {

    const savedLanguage =
      localStorage.getItem(
        'guayalink-language'
      );


    if (
      savedLanguage &&
      this.isValidLanguage(
        savedLanguage
      )
    ) {

      this.currentLanguage =
        savedLanguage;

    }


    this.updateHtmlLanguage();

  }


  getLanguage():
    AppLanguage {

    return this.currentLanguage;

  }


  setLanguage(
    language: AppLanguage
  ): void {

    this.currentLanguage =
      language;


    localStorage.setItem(
      'guayalink-language',
      language
    );


    this.updateHtmlLanguage();

  }


  t(
    key: string
  ): string {

    const selected =
      this.translations[
        this.currentLanguage
      ][key];


    if (
      selected
    ) {

      return selected;

    }


    const fallback =
      this.translations
        .Español[key];


    if (
      fallback
    ) {

      return fallback;

    }


    return key;

  }


  private isValidLanguage(
    language: string
  ): language is AppLanguage {

    return [
      'Español',
      'English',
      'Português',
      'Français',
      'Русский'
    ].includes(
      language
    );

  }


  private updateHtmlLanguage():
    void {

    const languageCodes:
      Record<
        AppLanguage,
        string
      > = {

      Español:
        'es',

      English:
        'en',

      Português:
        'pt',

      Français:
        'fr',

      Русский:
        'ru'

    };


    document.documentElement.lang =
      languageCodes[
        this.currentLanguage
      ];

  }

}