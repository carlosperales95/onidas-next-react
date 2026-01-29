export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      trainingLog: "Training Log",
      nutrition: "Nutrition",
      training: "Training",
      settings: "Settings",
      logout: "Logout",
      signIn: "Log In",
      profile: "My Profile",
    },
    // Landing Page
    landing: {
      hero: {
        title: "Turn Your Data Into",
        titleHighlight: "Winning Decisions",
        description:
          "Connect your Strava and wearables. Get AI-powered insights on training, recovery, nutrition, and supplements. Like having a coach, sports scientist, and nutritionist in your pocket.",
        startTrial: "Create an Account",
        signIn: "Log In",
      },
      benefits: {
        title: "Your Personal Performance Hub",
        subtitle: "Everything you need to optimize your athletic performance",
        smartTraining: {
          title: "Smart Training Guidance",
          description:
            "AI analyzes your activities to suggest what and how to train next. Know when to push hard and when to recover.",
        },
        dataInsights: {
          title: "Data-Driven Insights",
          description:
            "Track training load, fitness, and fatigue. Understand your trends and make informed decisions about your training.",
        },
        nutrition: {
          title: "Nutrition & Supplements",
          description:
            "Get personalized macro targets and supplement recommendations based on your sport, goals, and training load.",
        },
      },
      howItWorks: {
        title: "Simple to Get Started",
        step1: {
          title: "Connect Your Data",
          description: "Link your Strava account and wearables in seconds",
        },
        step2: {
          title: "Get Instant Insights",
          description: "AI analyzes your training and provides actionable recommendations",
        },
        step3: {
          title: "Train Smarter",
          description: "Follow personalized plans and optimize your performance",
        },
      },
      pricing: {
        title: "Simple, Transparent Pricing",
        free: {
          title: "Free",
          subtitle: "Perfect for getting started",
          price: "€0",
          perMonth: "/month",
          feature1: "Connect Strava account",
          feature2: "Basic activity tracking",
          feature3: "Weekly insights",
          cta: "Get Started",
        },
        pro: {
          title: "Pro",
          subtitle: "For serious athletes",
          price: "€7.99",
          perMonth: "/month",
          trial: "Includes 2 weeks free trial",
          badge: "Most Popular",
          feature1: "Everything in Free",
          feature2: "AI-powered training plans",
          feature3: "Advanced analytics & metrics",
          feature4: "Personalized nutrition guidance",
          feature5: "Supplement recommendations",
          cta: "Start Free Trial",
        },
      },
      cta: {
        title: "Ready to Optimize Your Performance?",
        subtitle: "Join athletes who are training smarter, not just harder",
        button: "Start Your Free Trial",
      },
      footer: {
        copyright: "© 2026 AthleteHub. All rights reserved.",
      },
    },
    // Dashboard
    dashboard: {
      welcome: "Welcome back",
      overview: "Here's your performance overview for this week",
      stravaSync: {
        title: "Import Your Strava History",
        description:
          "You've connected Strava! Import your past activities to build up your training history and get better insights.",
        button: "Import Now",
      },
      lastSync: "Last Strava Sync:",
      benchmarkInfo: "Benchmark Comparison: Your stats are compared with",
      athletes: "athletes",
      aged: "aged",
      benchmarkDescription: "The heatmap shows where you rank (percentile) compared to your peers.",
      stats: {
        totalDistance: "Total Distance",
        trainingTime: "Training Time",
        trainingVsLastWeek: "Training vs Last Week",
        activities: "Activities",
        avgHeartRate: "Avg Heart Rate",
      },
      trainingStatus: {
        title: "Your Current Status",
        formScore: "Form Score (Readiness)",
        outOf: "out of 100",
        readyToPerform: "Ready to perform",
        moderateReadiness: "Moderate readiness",
        needRecovery: "Need recovery",
        trainingLoadAnalysis: "Training Load Analysis",
        highRisk: "You're training significantly harder than usual. High injury risk - consider reducing volume.",
        moderateRisk: "Training load is elevated. Monitor how you feel and prioritize recovery.",
        lowRisk: "Training load is lower than usual. You may be ready to increase intensity.",
        optimal: "Training load is well balanced. Great job managing your workload!",
        fitness: "Fitness (CTL)",
        fitnessDesc: "Long-term training effect",
        fatigue: "Fatigue (ATL)",
        fatigueDesc: "Recent training stress",
        form: "Form Score",
        formDesc: "Fitness - Fatigue",
      },
    },
    // Auth
    auth: {
      login: {
        title: "Welcome Back",
        subtitle: "Sign in to your account to continue",
        email: "Email",
        password: "Password",
        button: "Sign In",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
      },
      signup: {
        title: "Create Account",
        subtitle: "Join AthleteHub to start your journey",
        name: "Full Name",
        email: "Email",
        password: "Password",
        button: "Sign Up",
        hasAccount: "Already have an account?",
        signIn: "Sign in",
      },
    },
    // Settings
    settings: {
      title: "Settings",
      integrations: {
        title: "Integrations",
        strava: {
          title: "Strava",
          description: "Connect your Strava account to sync your activities",
          connected: "Connected to Strava",
          connect: "Connect to Strava",
          connecting: "Connecting...",
          disconnect: "Disconnect",
          syncing: "Syncing...",
          importLatest: "Import Latest Data",
          lastSync: "Last synced",
          activities: "Activities",
          distance: "Distance",
          time: "Time",
          elevation: "Elevation",
          activityBreakdown: "Activity Breakdown",
        },
      },
    },
    // Training Log
    trainingLog: {
      title: "Training Log",
      noActivities: "No activities yet",
      noActivitiesDescription: "Connect your Strava account to import your activities",
      connectStrava: "Connect Strava",
      filters: {
        all: "All",
        run: "Run",
        ride: "Ride",
        swim: "Swim",
        other: "Other",
      },
      activity: {
        distance: "Distance",
        duration: "Duration",
        elevation: "Elevation",
        pace: "Pace",
        speed: "Speed",
        heartRate: "Heart Rate",
        power: "Power",
      },
    },
  },
  es: {
    // Navegación
    nav: {
      dashboard: "Panel",
      trainingLog: "Registro de Entrenamientos",
      nutrition: "Nutrición",
      training: "Entrenamiento",
      settings: "Configuración",
      logout: "Cerrar Sesión",
      signIn: "Acceder",
      profile: "Mi Perfil",
    },
    // Página de Inicio
    landing: {
      hero: {
        title: "Convierte Tus Datos En",
        titleHighlight: "Decisiones Ganadoras",
        description:
          "Conecta tu Strava y dispositivos wearables. Obtén información impulsada por IA sobre entrenamiento, recuperación, nutrición y suplementos. Como tener un entrenador, científico deportivo y nutricionista en tu bolsillo.",
        startTrial: "Crear una Cuenta",
        signIn: "Acceder",
      },
      benefits: {
        title: "Tu Centro de Rendimiento Personal",
        subtitle: "Todo lo que necesitas para optimizar tu rendimiento atlético",
        smartTraining: {
          title: "Guía Inteligente de Entrenamiento",
          description:
            "La IA analiza tus actividades para sugerir qué y cómo entrenar a continuación. Sabe cuándo esforzarte y cuándo recuperarte.",
        },
        dataInsights: {
          title: "Información Basada en Datos",
          description:
            "Rastrea carga de entrenamiento, fitness y fatiga. Comprende tus tendencias y toma decisiones informadas sobre tu entrenamiento.",
        },
        nutrition: {
          title: "Nutrición y Suplementos",
          description:
            "Obtén objetivos macro personalizados y recomendaciones de suplementos basadas en tu deporte, objetivos y carga de entrenamiento.",
        },
      },
      howItWorks: {
        title: "Simple Para Empezar",
        step1: {
          title: "Conecta Tus Datos",
          description: "Vincula tu cuenta de Strava y wearables en segundos",
        },
        step2: {
          title: "Obtén Información Instantánea",
          description: "La IA analiza tu entrenamiento y proporciona recomendaciones accionables",
        },
        step3: {
          title: "Entrena Más Inteligentemente",
          description: "Sigue planes personalizados y optimiza tu rendimiento",
        },
      },
      pricing: {
        title: "Precios Simples y Transparentes",
        free: {
          title: "Gratis",
          subtitle: "Perfecto para empezar",
          price: "€0",
          perMonth: "/mes",
          feature1: "Conectar cuenta de Strava",
          feature2: "Seguimiento básico de actividades",
          feature3: "Información semanal",
          cta: "Comenzar",
        },
        pro: {
          title: "Pro",
          subtitle: "Para atletas serios",
          price: "€7.99",
          perMonth: "/mes",
          trial: "Incluye 2 semanas de prueba gratuita",
          badge: "Más Popular",
          feature1: "Todo en Gratis",
          feature2: "Planes de entrenamiento con IA",
          feature3: "Análisis y métricas avanzadas",
          feature4: "Guía nutricional personalizada",
          feature5: "Recomendaciones de suplementos",
          cta: "Iniciar Prueba Gratuita",
        },
      },
      cta: {
        title: "¿Listo Para Optimizar Tu Rendimiento?",
        subtitle: "Únete a atletas que entrenan más inteligentemente, no solo más duro",
        button: "Inicia Tu Prueba Gratuita",
      },
      footer: {
        copyright: "© 2026 AthleteHub. Todos los derechos reservados.",
      },
    },
    // Panel
    dashboard: {
      welcome: "Bienvenido de nuevo",
      overview: "Aquí está tu resumen de rendimiento para esta semana",
      stravaSync: {
        title: "Importar Tu Historial de Strava",
        description:
          "¡Has conectado Strava! Importa tus actividades pasadas para construir tu historial de entrenamiento y obtener mejores resultados.",
        button: "Importar Ahora",
      },
      lastSync: "Última Sincronización de Strava:",
      benchmarkInfo: "Comparación de Referencias: Tus estadísticas se comparan con",
      athletes: "atletas",
      aged: "de edad",
      benchmarkDescription: "El mapa de calor muestra dónde te clasificas (percentil) en comparación con tus pares.",
      stats: {
        totalDistance: "Distancia Total",
        trainingTime: "Tiempo de Entrenamiento",
        trainingVsLastWeek: "Entrenamiento vs Semana Pasada",
        activities: "Actividades",
        avgHeartRate: "Frecuencia Cardíaca Promedio",
      },
      trainingStatus: {
        title: "Tu Estado Actual",
        formScore: "Puntuación de Forma (Preparación)",
        outOf: "de 100",
        readyToPerform: "Listo para rendir",
        moderateReadiness: "Preparación moderada",
        needRecovery: "Necesitas recuperación",
        trainingLoadAnalysis: "Análisis de Carga de Entrenamiento",
        highRisk:
          "Estás entrenando significativamente más duro de lo habitual. Alto riesgo de lesión - considera reducir el volumen.",
        moderateRisk: "La carga de entrenamiento está elevada. Monitorea cómo te sientes y prioriza la recuperación.",
        lowRisk:
          "La carga de entrenamiento es menor de lo habitual. Puede que estés listo para aumentar la intensidad.",
        optimal: "La carga de entrenamiento está bien equilibrada. ¡Buen trabajo manejando tu carga!",
        fitness: "Fitness (CTL)",
        fitnessDesc: "Efecto del entrenamiento a largo plazo",
        fatigue: "Fatiga (ATL)",
        fatigueDesc: "Estrés de entrenamiento reciente",
        form: "Puntuación de Forma",
        formDesc: "Fitness - Fatiga",
      },
    },
    // Autenticación
    auth: {
      login: {
        title: "Bienvenido de Nuevo",
        subtitle: "Inicia sesión en tu cuenta para continuar",
        email: "Correo Electrónico",
        password: "Contraseña",
        button: "Iniciar Sesión",
        noAccount: "¿No tienes una cuenta?",
        signUp: "Regístrate",
      },
      signup: {
        title: "Crear Cuenta",
        subtitle: "Únete a AthleteHub para comenzar tu viaje",
        name: "Nombre Completo",
        email: "Correo Electrónico",
        password: "Contraseña",
        button: "Registrarse",
        hasAccount: "¿Ya tienes una cuenta?",
        signIn: "Inicia sesión",
      },
    },
    // Configuración
    settings: {
      title: "Configuración",
      integrations: {
        title: "Integraciones",
        strava: {
          title: "Strava",
          description: "Conecta tu cuenta de Strava para sincronizar tus actividades",
          connected: "Conectado a Strava",
          connect: "Conectar con Strava",
          connecting: "Conectando...",
          disconnect: "Desconectar",
          syncing: "Sincronizando...",
          importLatest: "Importar Últimos Datos",
          lastSync: "Última sincronización",
          activities: "Actividades",
          distance: "Distancia",
          time: "Tiempo",
          elevation: "Elevación",
          activityBreakdown: "Desglose de Actividades",
        },
      },
    },
    // Registro de Entrenamiento
    trainingLog: {
      title: "Registro de Entrenamiento",
      noActivities: "Sin actividades todavía",
      noActivitiesDescription: "Conecta tu cuenta de Strava para importar tus actividades",
      connectStrava: "Conectar Strava",
      filters: {
        all: "Todas",
        run: "Correr",
        ride: "Ciclismo",
        swim: "Natación",
        other: "Otros",
      },
      activity: {
        distance: "Distancia",
        duration: "Duración",
        elevation: "Elevación",
        pace: "Ritmo",
        speed: "Velocidad",
        heartRate: "Frecuencia Cardíaca",
        power: "Potencia",
      },
    },
  },
}

export type TranslationKey = keyof typeof translations.en
