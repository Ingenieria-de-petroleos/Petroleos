/* ==============================================================================
   PORTAL WEB OFICIAL · INGENIERÍA DE PETRÓLEOS · UNAL SEDE MEDELLÍN
   Arquitectura de software, maquetación y desarrollo integral por:
   Santiago Escobar Arias · Representante Estudiantil de Sistemas e Informática
   Canales Oficiales e Información de Ingeniería de Petróleos:
   Facultad de Minas — Universidad Nacional de Colombia, Sede Medellín
   ============================================================================== */

/**
 * sofIA — Asistente Virtual Inteligente de Ingeniería de Petróleos
 * Arquitectura modular autónoma en Vanilla JavaScript.
 * Procesa consultas sobre malla curricular, prerrequisitos, semilleros, alianzas,
 * cambio de carrera / traslados, creador de la plataforma, fechas del calendario y recursos en Drive.
 */
(() => {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURACIÓN, RECURSOS Y AVATAR HOLOGRÁFICO
  // ==========================================================================

  const SOFIA_CFG = {
    nombre: 'sofIA',
    titulo: 'Asistente Inteligente de Petróleos',
    institucion: 'Universidad Nacional de Colombia · Sede Medellín',
    facultad: 'Facultad de Minas',
    programa: 'Ingeniería de Petróleos',
    canalWhatsApp: 'https://whatsapp.com/channel/0029VbEEsdM65yD9mq9N473a',
    instagramRepre: 'https://www.instagram.com/petroleos_repre/',
    usuarioInstagram: '@petroleos_repre',
    driveRecursos: 'https://drive.google.com/drive/folders/13btKaAwohCnTAlaL8fCoXcSJdNkIVobu?usp=drive_link',
    asesoriaMinasCorreo: 'asesorestu_med@unal.edu.co',
    asesoriaMinasTel: '(+57 604) 430 9653',
    tramitesMinasUrl: 'https://minas.medellin.unal.edu.co/estudiantes/gestion-de-asuntos-estudiantiles/gae-solicitudes-estudiantiles',
    creadorNombre: 'Santiago Escobar Arias',
    creadorRol: 'Representante Estudiantil de Ingeniería de Sistemas e Informática · Creador de la Web',
    creadorWhatsApp: 'https://wa.me/573123772091',
    creadorCorreo: 'saescobara@unal.edu.co',
  };

  // SVG Holográfico de sofIA (Estilo Cortana / Inteligencia de Petróleos con azul profundo y dorado ámbar)
  const SOFIA_SVG_AVATAR = `<svg class="sofia-avatar-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="sofiaPetroleoGrad" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#D4AF37"/>
        <stop offset="45%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#0B1F3A"/>
      </linearGradient>
      <radialGradient id="sofiaPetroleoGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#0B1F3A" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#061120" stop-opacity="0"/>
      </radialGradient>
      <filter id="sofiaPetroleoFiltro" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#sofiaPetroleoGlow)" opacity="0.35"/>
    <circle cx="50" cy="50" r="42" stroke="url(#sofiaPetroleoGrad)" stroke-width="2.5" stroke-dasharray="6 3" opacity="0.85"/>
    <circle cx="50" cy="50" r="35" stroke="#D4AF37" stroke-width="1.2" opacity="0.6"/>
    <!-- Silueta holográfica estilizada -->
    <path d="M50 22 C41 22 34 29 34 39 C34 47 38 52 42 56 C44 58 45 61 45 64 L55 64 C55 61 56 58 58 56 C62 52 66 47 66 39 C66 29 59 22 50 22 Z" fill="url(#sofiaPetroleoGrad)" filter="url(#sofiaPetroleoFiltro)"/>
    <path d="M43 67 L57 67 L55 72 L45 72 Z" fill="#D4AF37" opacity="0.9"/>
    <path d="M46 74 L54 74 L53 77 L47 77 Z" fill="#F59E0B" opacity="0.75"/>
    <!-- Ojos digitales / Núcleo de datos -->
    <circle cx="44.5" cy="39" r="2.2" fill="#FFFFFF"/>
    <circle cx="55.5" cy="39" r="2.2" fill="#FFFFFF"/>
    <circle cx="50" cy="46" r="1.5" fill="#FFFFFF" opacity="0.8"/>
    <!-- Ondas de transmisión circulares -->
    <circle cx="50" cy="50" r="28" stroke="#FFFFFF" stroke-width="0.8" stroke-dasharray="2 6" opacity="0.5"/>
  </svg>`;

  // ==========================================================================
  // 2. BASE DE CONOCIMIENTO Y DATOS DINÁMICOS
  // ==========================================================================

  const datos = {
    asignaturas: [],
    componentes: null,
    plan: null,
    info: null,
    programa: null,
    perfil: null,
    grupos: [],
    convenios: null,
  };

  const indices = {
    materiasPorCodigo: new Map(),
    materiasPorNombre: new Map(),
    aliasMaterias: new Map(),
    materiasPorSemestre: new Map(),
    calendarioFilas: [],
  };

  const estadoSofia = {
    abierto: false,
    vozHabilitada: false,
    historial: [],
    cargando: true,
  };

  // Normalizador de texto para búsquedas tolerantes a acentos y mayúsculas
  function normalizar(texto) {
    if (!texto) return '';
    return texto
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Carga de datos JSON oficiales de Ingeniería de Petróleos
  async function cargarDatos() {
    try {
      const peticiones = [
        fetch('data/malla/asignaturas.json').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('data/malla/componentes.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/malla/plan.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/info.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/programa.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/perfil.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/grupos.json').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('data/convenios/alianzas-estrategicas.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ];

      const [asigs, comp, plan, info, prog, perfil, grupos, convenios] = await Promise.all(peticiones);

      datos.asignaturas = Array.isArray(asigs) ? asigs : [];
      datos.componentes = comp;
      datos.plan = plan;
      datos.info = info;
      datos.programa = prog;
      datos.perfil = perfil;
      datos.grupos = Array.isArray(grupos) ? grupos : [];
      datos.convenios = convenios;

      construirIndices();
      estadoSofia.cargando = false;
    } catch (err) {
      console.warn('[sofIA Petróleos] Advertencia al cargar datos:', err);
      estadoSofia.cargando = false;
    }
  }

  // Indexación y diccionario de sinónimos/alias de materias de Petróleos
  function construirIndices() {
    indices.materiasPorCodigo.clear();
    indices.materiasPorNombre.clear();
    indices.aliasMaterias.clear();
    indices.materiasPorSemestre.clear();
    indices.calendarioFilas = [];

    datos.asignaturas.forEach((asig) => {
      indices.materiasPorCodigo.set(asig.codigo, asig);
      indices.materiasPorNombre.set(normalizar(asig.nombre), asig);

      const sem = asig.semestre || 0;
      if (!indices.materiasPorSemestre.has(sem)) {
        indices.materiasPorSemestre.set(sem, []);
      }
      indices.materiasPorSemestre.get(sem).push(asig);
    });

    // Alias exhaustivos para las 68 materias de Ingeniería de Petróleos
    const ALIAS_MATERIAS = [
      [['calculo 1', 'calculo diferencial', 'diferencial'], 'Cálculo Diferencial'],
      [['geometria vectorial', 'vectorial'], 'Geometría Vectorial y Analítica'],
      [['introduccion a la ingenieria de petroleos', 'intro petroleos', 'intro a petroleos', 'introduccion'], 'Introducción a la Ingeniería de Petróleos'],
      [['quimica general', 'quimica 1', 'quimica'], 'Química General'],
      [['geologia fisica', 'geologia 1'], 'Geología Física'],
      [['calculo 2', 'calculo integral', 'integral'], 'Cálculo Integral'],
      [['algebra lineal', 'lineal'], 'Álgebra Lineal'],
      [['fisica 1', 'mecanica', 'fisica mecanica'], 'Física Mecánica'],
      [['procesos sedimentarios', 'geologia de yacimientos', 'sedimentarios'], 'Procesos Sedimentarios y Geología de Yacimientos'],
      [['quimica organica', 'organica'], 'Química Orgánica'],
      [['laboratorio de quimica organica', 'lab organica'], 'Laboratorio de Química Orgánica'],
      [['laboratorio de quimica general', 'lab quimica'], 'Laboratorio de Química General'],
      [['quimica analitica', 'analitica'], 'Química Analítica'],
      [['calculo 3', 'calculo en varias variables', 'varias variables', 'calculo vectorial'], 'Cálculo en Varias Variables'],
      [['ecuaciones diferenciales', 'ecuaciones', 'ed'], 'Ecuaciones Diferenciales'],
      [['fisica 2', 'electricidad y magnetismo', 'fisica electricidad', 'electromagnetismo', 'fem'], 'Física de Electricidad y Magnetismo'],
      [['termodinamica general', 'termo 1', 'termo general', 'termodinamica'], 'Termodinámica General'],
      [['ciencia de los materiales', 'materiales'], 'Ciencia de los Materiales'],
      [['estadistica 1', 'estadistica', 'probabilidad y estadistica'], 'Estadística I'],
      [['fisica 3', 'oscilaciones ondas y optica', 'ondas', 'optica', 'foo'], 'Física de Oscilaciones, Ondas y Óptica'],
      [['fenomenos de transporte', 'fenomenos', 'transporte'], 'Fenómenos de Transporte'],
      [['fundamentos de programacion', 'programacion', 'python', 'sistemas'], 'Fundamentos de Programación'],
      [['perforacion 1', 'perforacion i', 'perfo 1'], 'Perforación I'],
      [['matematicas especiales', 'especiales'], 'Matemáticas Especiales'],
      [['matematicas discretas', 'discretas'], 'Matemáticas Discretas'],
      [['metodos numericos', 'numericos'], 'Métodos Numéricos'],
      [['conversion de energia en sistemas termofluidicos', 'conversion de energia'], 'Conversión de Energía en Sistemas Termofluídicos'],
      [['equilibrio en sistemas reactivos y fenomenos de superficie', 'sistemas reactivos'], 'Equilibrio en Sistemas Reactivos y Fenómenos de Superficie'],
      [['termodinamica del equilibrio de fases', 'equilibrio de fases', 'termo 2', 'termodinamica fases'], 'Termodinámica del Equilibrio de Fases para Sistemas Multicomponentes'],
      [['geofisica', 'sismica'], 'Geofísica'],
      [['geoquimica'], 'Geoquímica'],
      [['petrologia sedimentaria', 'petrologia'], 'Petrología Sedimentaria'],
      [['geologia de colombia'], 'Geología de Colombia'],
      [['elementos de geologia estructural', 'geologia estructural', 'estructural'], 'Elementos de Geología Estructural'],
      [['fluidos de yacimiento', 'fluidos yacimientos', 'pvt', 'propiedades de fluidos'], 'Fluidos de Yacimiento'],
      [['perforacion 2', 'perforacion ii', 'perfo 2'], 'Perforación II'],
      [['fundamentos de proyectos en ingenieria', 'proyectos 1', 'fpi'], 'Fundamentos de Proyectos en Ingeniería'],
      [['propiedades de la roca yacimiento', 'roca yacimiento', 'petrofisica 1', 'petrofisica'], 'Propiedades de la Roca Yacimiento'],
      [['estructuracion y evaluacion de proyectos de ingenieria', 'evaluacion de proyectos', 'proyectos 2'], 'Estructuración y Evaluación de Proyectos de Ingeniería'],
      [['perforacion 3', 'perforacion iii', 'perfo 3'], 'Perforación III'],
      [['crudos y derivados', 'crudos'], 'Crudos y Derivados'],
      [['terminacion y reacondicionamiento de pozos', 'completamiento', 'terminacion de pozos', 'workover'], 'Terminación y Reacondicionamiento de Pozos'],
      [['perforacion direccional aplicada', 'perforacion direccional', 'direccional'], 'Perforación Direccional Aplicada'],
      [['combustibles y lubricantes minerales', 'combustibles y lubricantes'], 'Combustibles y lubricantes minerales'],
      [['depositos organicos en pozos productores', 'depositos organicos', 'asfaltenos'], 'Depósitos Orgánicos en Pozos Productores'],
      [['transporte y distribucion de gas', 'gas', 'gas natural'], 'Transporte y Distribución de Gas'],
      [['logistica del transporte y de hidrocarburos', 'logistica de hidrocarburos', 'oleoductos'], 'Logística del Transporte y de Hidrocarburos'],
      [['manejo de produccion de petroleo y gas', 'facilidades de superficie', 'manejo de produccion', 'produccion gas'], 'Manejo de Producción de Petróleo y Gas'],
      [['produccion por flujo natural', 'flujo natural', 'produccion 1'], 'Producción por Flujo Natural'],
      [['pruebas de presion y balance de materiales', 'pruebas de presion', 'balance de materia', 'well testing'], 'Pruebas de Presión y Balance de Materiales'],
      [['perfilaje de pozos', 'perfilaje', 'registros de pozos', 'registros geofisicos', 'well logging'], 'Perfilaje de Pozos'],
      [['levantamiento artificial', 'bombeo', 'gas lift', 'bcp', 'bes', 'produccion 2'], 'Levantamiento Artificial'],
      [['simulacion de yacimientos', 'simulacion', 'modelamiento yacimientos', 'eclipse', 'cmg'], 'Simulación de Yacimientos'],
      [['monitoreo de yacimientos', 'monitoreo'], 'Monitoreo de Yacimientos'],
      [['analisis petrofisicos especiales', 'petrofisica especial', 'scal'], 'Análisis Petrofísicos Especiales'],
      [['aspectos geomecanicos de la ingenieria de yacimientos', 'geomecanica'], 'Aspectos Geomecánicos de la Ingeniería de Yacimientos'],
      [['inyeccion de agua', 'recobro secundario', 'waterflooding'], 'Inyección de Agua'],
      [['operaciones de campo', 'campo'], 'Operaciones de Campo'],
      [['proyecto integrado de ingenieria', 'pii', 'proyecto integrado'], 'Proyecto Integrado de Ingeniería'],
      [['evaluacion de formaciones heterogeneas', 'formaciones heterogeneas'], 'Evaluación de Formaciones Heterogéneas'],
      [['seminario de dano de formacion', 'seminario dano'], 'Seminario de Daño de Formación'],
      [['topicos avanzados de pruebas de presion', 'pruebas de presion avanzadas'], 'Tópicos Avanzados de Pruebas de Presión'],
      [['yacimientos no convencionales', 'no convencionales', 'shale', 'fracking'], 'Yacimientos no Convencionales'],
      [['dano de formacion', 'dano'], 'Daño de Formación'],
      [['metodos de recobro mejorado', 'recobro mejorado', 'eor', 'ior'], 'Métodos de Recobro Mejorado'],
      [['trabajo de grado', 'tesis', 'grado', 'monografia'], 'Trabajo de Grado'],
      [['practica de extension', 'pasantia', 'practica profesional', 'practica'], 'Práctica de Extensión'],
      [['cursos de posgrado', 'materias de posgrado', 'posgrado'], 'Cursos de Posgrado'],
    ];

    ALIAS_MATERIAS.forEach(([aliases, nombreReal]) => {
      const match = datos.asignaturas.find((a) => normalizar(a.nombre) === normalizar(nombreReal));
      if (match) {
        aliases.forEach((alias) => indices.aliasMaterias.set(normalizar(alias), match));
      }
    });

    // Indexar calendario académico oficial de la Facultad de Minas
    if (datos.info?.guias) {
      const guiaCal = datos.info.guias.find((g) => g.id === 'calendario-academico');
      if (guiaCal?.calendario?.grupos) {
        guiaCal.calendario.grupos.forEach((grupo) => {
          if (Array.isArray(grupo.filas)) {
            grupo.filas.forEach((fila) => {
              indices.calendarioFilas.push({
                evento: fila.evento,
                eventoNorm: normalizar(fila.evento),
                fecha: fila.fecha,
                grupo: grupo.titulo,
              });
            });
          }
        });
      }
    }
  }

  // ==========================================================================
  // 3. MOTOR DE RESPUESTAS E INTENCIONES (NATURAL LANGUAGE PROCESSOR)
  // ==========================================================================

  function responderPregunta(consultaOriginal) {
    const pregunta = (consultaOriginal || '').trim();
    const preguntaNorm = normalizar(pregunta);

    if (!preguntaNorm) {
      return {
        texto: 'Por favor escribe tu consulta sobre el programa de Ingeniería de Petróleos, la malla curricular, materias, prerrequisitos, grupos estudiantiles, trámites o recursos de estudio.',
        chips: ['¿Qué es la malla curricular?', '¿Qué tipo de materias hay?', '¿Por qué estudiar Petróleos?'],
      };
    }

    // ------------------------------------------------------------------------
    // 1. Saludos y Presentación
    // ------------------------------------------------------------------------
    if (/^(hola|buen(as|os)?|saludos|hey|que tal|iniciar|comenzar|hi|hello)$/.test(preguntaNorm) || preguntaNorm.startsWith('hola sofia')) {
      return {
        texto: `¡Hola! Soy **${SOFIA_CFG.nombre}**, tu asistente inteligente del programa de **${SOFIA_CFG.programa}** de la **${SOFIA_CFG.facultad}** (UNAL Medellín).

Pregúntame con total confianza sobre:
- **Malla Curricular y prerrequisitos** de las 68 asignaturas.
- **Tipos de materias** y componentes (Fundamentación, Disciplinar, Libre Elección).
- **¿Por qué estudiar Petróleos?** y fortalezas en la transición energética.
- **¿Cómo hacer cambio de carrera / traslados?** ante la Facultad de Minas.
- **¿Quién es el creador de la web?**
- **Alianzas estratégicas** (ICETEX, Sapiencia, Metro Cívica, software técnico y petrolero).
- **Banco de Recursos / Drive oficial** de la carrera con parciales y guías de laboratorio.
- **Capítulo SPE y grupos estudiantiles**, fechas del calendario y trámites del SGS.

¿Sobre qué tema te gustaría consultar hoy?`,
        chips: [
          '¿Qué es la malla curricular?',
          '¿Qué tipo de materias hay?',
          '¿Por qué estudiar Petróleos?',
          '¿Quién es el creador de la web?',
          '¿Cómo hacer cambio de carrera?',
          '¿Cuáles son las alianzas?',
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 2. ¿Quién es el Creador de la Web? (Requisito clave)
    // ------------------------------------------------------------------------
    if (/creador|quien creo|quien hizo|quien desarrollo|desarrollador|autor|santiago escobar|santiago|quien construyo esta web|quien programo/.test(preguntaNorm)) {
      return {
        texto: `### Creador y Arquitecto de Software de la Plataforma 💻

Este portal web oficial, sus simuladores de avance, la malla curricular interactiva y yo (**${SOFIA_CFG.nombre}**) fuimos creados y desarrollados integralmente por:

👨‍💻 **${SOFIA_CFG.creadorNombre}**
- **Rol:** ${SOFIA_CFG.creadorRol}.
- **Propósito:** Brindar herramientas digitales de vanguardia, transparentes y gratuitas para fortalecer la vida académica, el seguimiento curricular y el bienestar de los estudiantes de la **Facultad de Minas**.
- **Canal de contacto directo:**
  - WhatsApp: [Chat con Santiago Escobar](${SOFIA_CFG.creadorWhatsApp}) \`(+57 312 377 2091)\`
  - Correo institucional: \`${SOFIA_CFG.creadorCorreo}\`

El proyecto cuenta con propiedad intelectual y derechos de autor conforme a la Ley 23 de 1982 y normativas de software de la UNAL Medellín.`,
        chips: ['Canal Oficial de Petróleos', '¿Qué es la malla curricular?', 'Banco de Recursos en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 3. ¿Qué es la Malla Curricular? / Malla en general
    // ------------------------------------------------------------------------
    if (/que es la malla|malla curricular|explicar la malla|como funciona la malla|ver la malla|entender la malla/.test(preguntaNorm)) {
      return {
        texto: `La **Malla Curricular de Ingeniería de Petróleos** (Plan Acuerdo 162 de 2018 del C. Académico y Acuerdos 29/2019, 66/2020 y 10/2022 del C. Facultad) es la ruta estructurada de **10 semestres** y **172 créditos** de la carrera:

- **Semáforo interactivo:** Al hacer clic en cualquier asignatura en la [Malla Curricular](malla.html), se iluminan en **amarillo** sus prerrequisitos y en **verde** las materias que te desbloquea a futuro.
- **Colores por componente:** Azul profundo para formación disciplinar, azul intermedio para fundamentación básica y dorado/ámbar para libre elección.
- **Sombrear mis materias vistas:** Si copiaste tu historia académica en [Mi Avance](avance.html), puedes activar el interruptor *"Sombreado de materias aprobadas"* para ver tu progreso reflejado en tiempo real sobre la malla.
- **Banco de materiales:** En la pestaña de Malla encuentras el acceso directo al [Banco de Recursos de Petróleos en Google Drive](${SOFIA_CFG.driveRecursos}) con parciales, talleres y guías de laboratorio.`,
        chips: ['¿Qué tipo de materias hay?', 'Prerrequisitos de Perforación I', 'Ver Banco en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 4. ¿Qué tipo de materias hay? (Componentes y Tipologías)
    // ------------------------------------------------------------------------
    if (/que tipo de materias|tipos de materias|componentes|agrupaciones|tipologia|creditos del plan|cuantos creditos son|como se dividen las materias/.test(preguntaNorm)) {
      return {
        texto: `En el plan curricular de **Ingeniería de Petróleos** existen **3 grandes componentes de formación** que totalizan **172 créditos**:

1. **Componente de Fundamentación (48 créditos):**
   - **Matemáticas, Probabilidad y Estadística (31 cr):** Cálculos I, II y III, Geometría Vectorial, Álgebra Lineal, Ecuaciones Diferenciales y Métodos Numéricos.
   - **Física (12 cr):** Física Mecánica, Electricidad y Magnetismo, Oscilaciones y Ondas.
   - **Química (5 cr):** Química General y sus laboratorios.

2. **Componente de Formación Disciplinar o Profesional (89 créditos):**
   - **Ingeniería Básica (12 cr):** Ciencia de Materiales, Programación, Fenómenos de Transporte.
   - **Termodinámica (6 cr):** Termodinámica General y Termodinámica del Equilibrio de Fases.
   - **Perforación y Producción (18 cr):** Perforación I, II, III, Flujo Natural y Levantamiento Artificial.
   - **Yacimientos y Evaluación de Formaciones (18 cr):** Fluidos de Yacimiento, Petrofísica, Pruebas de Presión, Perfilaje y Simulación.
   - **Geología (10 cr):** Geología Física, Procesos Sedimentarios, Geología Estructural y Geofísica.
   - **Proyectos en Ingeniería (10 cr):** FPI, Formulación de Proyectos y Proyecto Integrado.
   - **Optativas Disciplinares (9 cr):** Materias avanzadas en recobro mejorado, gas, no convencionales o geomecánica.
   - **Trabajo de Grado (6 cr):** En el décimo semestre.

3. **Componente de Libre Elección (35 créditos = 20% del plan):**
   - Créditos para profundizar en transición energética (CCUS, geotermia, hidrógeno), idiomas, materias de otras ingenierías o posgrados.`,
        chips: ['¿Por qué estudiar Petróleos?', 'Prerrequisitos de Simulación de Yacimientos', 'Ir a Mi Avance'],
      };
    }

    // ------------------------------------------------------------------------
    // 5. ¿Por qué estudiar Petróleos? / Fortalezas únicas (y mención si preguntan por Construcción)
    // ------------------------------------------------------------------------
    if (/por que estudiar construccion/.test(preguntaNorm)) {
      return {
        texto: `¡Pregunta interesante! Aunque estás en el portal de **Ingeniería de Petróleos**, con gusto te cuento sobre el pregrado hermano de **Construcción**:

- **Construcción** es un pregrado de la **Facultad de Arquitectura** (Campus El Volador, Bloque 24), uno de solo 6 en Colombia que otorga el título de *Arquitecto(a) Constructor(a)*.
- Cuenta con un **Laboratorio propio de Ensayos en el Bloque 25** y el respaldo de la **Escuela del Hábitat (CEHAP)**.
- Si te interesa la ingeniería de la energía y el subsuelo, aquí en **Ingeniería de Petróleos** (Facultad de Minas) lideramos la exploración, yacimientos y la transición energética hacia geotermia y CCUS.`,
        chips: ['¿Por qué estudiar Petróleos?', '¿Qué es la malla curricular?', '¿Cómo hacer cambio de carrera?'],
      };
    }

    if (/por que estudiar petroleos|por que estudiar ingenieria de petroleos|fortalezas|ventajas|campos de accion|perfil del egresado|a que se dedica|por que petroleos/.test(preguntaNorm)) {
      return {
        texto: `**¿Por qué estudiar Ingeniería de Petróleos en la UNAL Medellín?**

Nuestro programa en la **Facultad de Minas** es referente nacional e internacional por sus fortalezas distintivas:

1. **Protagonismo en la Transición Energética:**
   Los ingenieros de petróleos son los especialistas del subsuelo. Sus competencias son indispensables para liderar la **energía geotérmica profunda**, el almacenamiento geológico y captura de carbono (**CCUS**), el transporte de gas natural y el hidrógeno.

2. **Tradición y Prestigio de la Facultad de Minas:**
   Bajo el lema *«Trabajo y Rectitud»*, el programa cuenta con Acreditación de Alta Calidad del MEN (Res. 3970 de 2018) y reconocimiento directo de las principales empresas energéticas del mundo.

3. **Infraestructura de Laboratorios de Primer Nivel:**
   Laboratorios propios de Petrofísica, Lodos de Perforación y Cementos, Fluidos y Crudos Pesados, sumados a licencias de software industrial para simulación de yacimientos (Petrel, CMG, Eclipse, KAPPA).

4. **Capítulo SPE y Redes Internacionales:**
   Presencia del capítulo **SPE UNALMED (Society of Petroleum Engineers)**, que conecta a los estudiantes con congresos internacionales, becas técnicas, competencias de conocimientos (PetroBowl) y bolsas de empleo globales.`,
        chips: ['Semilleros y SPE', 'Ver Malla Curricular', '¿Quién es el creador de la web?'],
      };
    }

    // ------------------------------------------------------------------------
    // 6. ¿Cómo hacer cambio de carrera / Traslado de programa?
    // ------------------------------------------------------------------------
    if (/cambio de carrera|traslado|cambiarme de carrera|cambiarme de programa|traslado de programa|pasarme a|homologacion/.test(preguntaNorm)) {
      return {
        texto: `**¿Cómo solicitar Traslado de Programa Curricular (Cambio de carrera)?**

El trámite oficial de traslado se realiza ante la **Facultad de Minas** conforme al Estatuto Estudiantil (**Acuerdo 008 de 2008** del CSU):

1. **Requisitos Normativos Básicos:**
   - Tener la condición de estudiante activo en la UNAL.
   - Contar con un **P.A.P.A. competitivo** (cada carrera define puntos de corte según los cupos disponibles).
   - Tener suficiente **cupo de créditos disponibles** en el SIA para culminar el nuevo plan de estudios.
   - Haber cursado al menos el número de créditos exigido en tu programa de origen.

2. **Procedimiento de Radicación:**
   - La convocatoria se abre semestralmente según el Calendario Académico.
   - Se radica formalmente mediante el **SGS (Sistema de Gestión de Solicitudes)** de la Facultad de Minas:
     🔗 [Portal de Solicitudes GAE Minas](${SOFIA_CFG.tramitesMinasUrl})
   - Seleccionas la solicitud *«Traslado de programa curricular»*, adjuntas tu motivación académica y soportes.

3. **Acompañamiento y Asesoría:**
   - Si tienes dudas sobre tu cupo de créditos o materias convalidables, escribe desde tu correo institucional a **Asesoría Estudiantil de Minas**: \`${SOFIA_CFG.asesoriaMinasCorreo}\` (Campus Robledo, Bloque M4).`,
        chips: ['Portal Solicitudes SGS', 'Calendario académico', '¿Qué es el P.A.P.A.?'],
      };
    }

    // ------------------------------------------------------------------------
    // 7. Alianzas Estratégicas para el Bienestar
    // ------------------------------------------------------------------------
    if (/alianza|alianzas|convenio|convenios|sapiencia|icetex|metro|civica|beneficios de bienestar|becas/.test(preguntaNorm)) {
      return {
        texto: `**Alianzas Estratégicas y Convenios (UNAL Sede Medellín y Facultad de Minas):**

1. **Alianzas de Permanencia y Bienestar:**
   - **ICETEX:** Líneas de crédito tradicionales, condonables y subsidios de sostenimiento.
   - **Sapiencia (Alcaldía de Medellín):** Fondos de Presupuesto Participativo, Fondo EPM y Becas Medellín para matrícula y manutención.
   - **Metro de Medellín (Cívica Estudiante):** Tarifa preferencial con descuento superior al 50% en Metro, Metrocable, Tranvía y Metroplús.
   - **Auxilios de Bienestar UNAL:** Apoyo alimentario, bono de transporte y residencias estudiantiles (gestión en Bloque M4 Robledo / Bloque 11A Volador).

2. **Convenios de Software y Tecnología:**
   - **GitHub Student Developer Pack:** Cuentas Pro, GitHub Copilot gratuito y créditos en la nube (AWS, Azure, DigitalOcean).
   - **Autodesk Educación:** AutoCAD, Civil 3D y Revit gratis con correo \`@unal.edu.co\`.
   - **JetBrains & Microsoft 365:** Licencias completas para estudiantes.
   - **Software Petrolero y de Geociencias:** Acceso a simuladores de la industria (Petrel, CMG, Eclipse, KAPPA, Aspen HYSYS) en salas de cómputo de la Facultad de Minas.

Consulta todos los detalles en la sección [Convenios](convenios.html).`,
        chips: ['Ver sección Convenios', 'Auxilios de Bienestar', '¿Quién es el creador de la web?'],
      };
    }

    // ------------------------------------------------------------------------
    // 8. Unidad Compartida / Google Drive de Recursos
    // ------------------------------------------------------------------------
    if (/drive|unidad compartida|banco de recursos|material de estudio|parciales pasados|parciales viejos|talleres|apuntes|libros/.test(preguntaNorm)) {
      return {
        texto: `### Banco de Recursos y Materiales · Ingeniería de Petróleos 📚

Los talleres, parciales anteriores, memorias de cálculo, guías de laboratorio (petrofísica, lodos, fluidos) y libros guía están organizados en el **Google Drive Oficial de Recursos**:

🔗 **[Abrir Banco de Recursos de Petróleos en Google Drive](${SOFIA_CFG.driveRecursos})**

💡 *Recomendación:* Inicia sesión con tu correo institucional (\`@unal.edu.co\`) para tener acceso completo e inmediato a todas las carpetas organizadas por semestre y asignatura.`,
        chips: ['Ver Malla Curricular', 'Canal Oficial de WhatsApp', 'Prerrequisitos de materias'],
      };
    }

    // ------------------------------------------------------------------------
    // 9. Contacto de la Representación y Canales Oficiales
    // ------------------------------------------------------------------------
    if (/repre|representante|representacion|contacto|redes|instagram|canal|como me comunico|asesoria/.test(preguntaNorm)) {
      return {
        texto: `### Canales Oficiales de Contacto · Ingeniería de Petróleos 📣

Para estar al día con convocatorias, actividades académicas y soporte estudiantil:

1. **Canal Oficial de WhatsApp de Petróleos:**
   - Únete para recibir comunicados, ofertas de semilleros y avisos de la carrera:
   👉 **[Canal Oficial de WhatsApp](${SOFIA_CFG.canalWhatsApp})**

2. **Instagram Oficial de la Representación:**
   - Síguenos en **[${SOFIA_CFG.usuarioInstagram}](${SOFIA_CFG.instagramRepre})** para transmisiones, asambleas y eventos.

3. **Asesoría Estudiantil · Facultad de Minas:**
   - Correo oficial: \`${SOFIA_CFG.asesoriaMinasCorreo}\`
   - Teléfono: \`${SOFIA_CFG.asesoriaMinasTel}\`
   - Ubicación: Campus Robledo, Bloque M4.

4. **Soporte y Creador del Portal:**
   - Santiago Escobar Arias (Representante de Sistemas): [Chat de WhatsApp](${SOFIA_CFG.creadorWhatsApp}) · \`${SOFIA_CFG.creadorCorreo}\`.`,
        chips: ['Canal de WhatsApp', 'Banco de Recursos en Drive', 'Portal Solicitudes SGS'],
      };
    }

    // ------------------------------------------------------------------------
    // 10. Grupos de WhatsApp de estudio / de materias
    // ------------------------------------------------------------------------
    if (/grupo de whatsapp|grupos de whatsapp|wpp de materias|grupo de estudio|comunidad de wpp/.test(preguntaNorm)) {
      return {
        texto: `### Grupos de WhatsApp y Comunidades de Estudio 💬

- Los enlaces de los grupos de WhatsApp de materias se articulan y difunden a través del **[Canal Oficial de WhatsApp de Petróleos](${SOFIA_CFG.canalWhatsApp})**.
- Si administras el grupo de WhatsApp de alguna materia de Petróleos y deseas que lo vinculemos en la [Malla Curricular](malla.html), escribe al canal o contacta al creador del portal para sumarlo directamente a la ficha de la materia.`,
        chips: ['Canal Oficial de WhatsApp', 'Banco en Drive', 'Malla Curricular'],
      };
    }

    // ------------------------------------------------------------------------
    // 11. Semilleros y Grupos Estudiantiles (SPE UNALMED)
    // ------------------------------------------------------------------------
    if (/semillero|semilleros|spe|grupos estudiantiles|capitulo|investigacion|capitulos/.test(preguntaNorm)) {
      return {
        texto: `### Grupos Estudiantiles y Semilleros en Petróleos 🔬

En el pregrado de Ingeniería de Petróleos la vida extracurricular y técnica es muy activa:

1. **SPE UNALMED (Society of Petroleum Engineers · Student Chapter UNAL Medellín):**
   - **Enfoque:** Capítulo internacional de ingenieros de petróleos. Organiza simposios, cursos de software (Petrel, CMG), visitas técnicas a campos petroleros y preparación para el PetroBowl.
   - **Instagram:** [@spe_unalmed](https://www.instagram.com/spe_unalmed/)

2. **Grupos de Investigación y Laboratorios del Dpto. de Procesos y Energía:**
   - Investigaciones en **Recobro Mejorado (EOR/IOR)**, nanotecnología para crudos pesados, modelamiento de yacimientos, geotermia y captura de carbono (CCUS).
   - Laboratorios en el Campus Robledo con oportunidad de vincularte como auxiliar o tesista.`,
        chips: ['SPE UNALMED en Instagram', '¿Por qué estudiar Petróleos?', 'Banco de Recursos en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 12. Materias de último semestre / Décimo semestre en Petróleos
    // ------------------------------------------------------------------------
    if (/ultimo semestre|ultimos semestres|decimo semestre|semestre 10|10 semestre|materias para graduarme|terminar la carrera/.test(preguntaNorm)) {
      return {
        texto: `En el **10° y último semestre** de Ingeniería de Petróleos el plan está diseñado para que culmines con:

1. **Trabajo de Grado (\`3007486\` - 6 créditos):**
   Modalidades oficiales en la Facultad de Minas:
   - **Práctica de Extensión (\`3010687\`):** En operadoras (Ecopetrol, Frontera, Geopark) o compañías de servicios (SLB, Baker Hughes, Halliburton).
   - **Proyecto de Investigación:** En laboratorios de yacimientos, lodos o transición energética.
   - **Asignaturas de Posgrado (\`3007485\`):** Cursar materias de maestría en la Facultad de Minas.

2. **Créditos Disciplinares y Optativas Restantes:**
   Completar las optativas de profundización (Recobro Mejorado, Gas, No Convencionales).

3. **Créditos de Libre Elección:**
   Tener aprobados los **35 créditos** exigidos.

4. **Requisitos de Grado:**
   - Acreditar suficiencia de idioma extranjero (Inglés B1/B2 según tu cohorte).
   - Tener aprobados los **172 créditos** del plan de estudios.

Puedes monitorear tus créditos pendientes en la sección [Mi Avance](avance.html).`,
        chips: ['Prerrequisitos de Trabajo de Grado', 'Ir a Mi Avance', 'Ver Malla Curricular'],
      };
    }

    // ------------------------------------------------------------------------
    // 13. Prerrequisitos de materias específicas
    // ------------------------------------------------------------------------
    const esConsultaPrereq = /prerrequisit|prerequisit|requisito|que pide|que necesito para ver|para matricular|correquisit|abrir|correr/.test(preguntaNorm);
    const materiaEncontrada = buscarAsignaturaPorTexto(preguntaNorm);

    if (materiaEncontrada && (esConsultaPrereq || preguntaNorm.includes(normalizar(materiaEncontrada.nombre)))) {
      const preCodigos = materiaEncontrada.prerrequisitos || [];
      const correqCodigos = materiaEncontrada.correquisitos || [];

      let detallePrereq = '';
      if (preCodigos.length === 0) {
        detallePrereq = 'No tiene prerrequisitos. La puedes matricular desde tu primer semestre (según tu cupo de créditos y cita del SIA).';
      } else {
        const nombresPre = preCodigos.map((cod) => {
          const preMat = indices.materiasPorCodigo.get(cod);
          return preMat ? `• **${preMat.nombre}** (\`${cod}\`)` : `• Asignatura código \`${cod}\``;
        }).join('\n');
        detallePrereq = `**Prerrequisito(s) necesario(s):**\n${nombresPre}`;
      }

      let detalleCorreq = '';
      if (correqCodigos.length > 0) {
        const nombresCorreq = correqCodigos.map((cod) => {
          const cMat = indices.materiasPorCodigo.get(cod);
          return cMat ? `• **${cMat.nombre}** (\`${cod}\`)` : `• Asignatura código \`${cod}\``;
        }).join('\n');
        detalleCorreq = `\n\n**Correquisito(s) (simultáneos):**\n${nombresCorreq}`;
      }

      const semestreTxt = materiaEncontrada.semestre ? `Semestre sugerido: **${materiaEncontrada.semestre}°**` : 'Asignatura Optativa';
      const obligatoriaTxt = materiaEncontrada.obligatoria ? 'Obligatoria' : 'Optativa';

      const chipsPre = preCodigos
        .map((cod) => indices.materiasPorCodigo.get(cod))
        .filter(Boolean)
        .map((m) => `Prerrequisitos de ${m.nombre}`);

      return {
        texto: `### ${materiaEncontrada.nombre} (\`${materiaEncontrada.codigo}\`)

${detallePrereq}${detalleCorreq}

- **Créditos:** ${materiaEncontrada.creditos}
- **Tipología:** ${obligatoriaTxt} (${materiaEncontrada.agrupacion || 'General'})
- **Nivel:** ${semestreTxt}

Puedes consultar esta asignatura interactiva en la [Malla Curricular](malla.html).`,
        chips: chipsPre.length > 0 ? chipsPre.slice(0, 3) : ['Ver Malla Curricular', 'Banco de Recursos en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 14. Materias por semestre (Semestre 1 al 10)
    // ------------------------------------------------------------------------
    const matchSem = preguntaNorm.match(/semestre\s*([1-9]|10)\b|primer semestre|segundo semestre|tercer semestre|cuarto semestre|quinto semestre|sexto semestre|septimo semestre|octavo semestre|noveno semestre|decimo semestre/);
    if (matchSem) {
      let numSem = 0;
      if (matchSem[1]) {
        numSem = parseInt(matchSem[1], 10);
      } else {
        const ord = matchSem[0];
        if (ord.includes('primer')) numSem = 1;
        else if (ord.includes('segund')) numSem = 2;
        else if (ord.includes('tercer')) numSem = 3;
        else if (ord.includes('cuart')) numSem = 4;
        else if (ord.includes('quint')) numSem = 5;
        else if (ord.includes('sext')) numSem = 6;
        else if (ord.includes('septim')) numSem = 7;
        else if (ord.includes('octav')) numSem = 8;
        else if (ord.includes('noven')) numSem = 9;
        else if (ord.includes('decim')) numSem = 10;
      }

      if (numSem >= 1 && numSem <= 10) {
        const materiasSem = indices.materiasPorSemestre.get(numSem) || [];
        if (materiasSem.length > 0) {
          const listaTxt = materiasSem
            .map((asig) => {
              const preCount = asig.prerrequisitos?.length || 0;
              const preTxt = preCount === 0 ? '_Sin prereq_' : `_${preCount} prerrequisito(s)_`;
              return `• **${asig.nombre}** (\`${asig.codigo}\`, ${asig.creditos} cr) — ${preTxt}`;
            })
            .join('\n');

          const creditosTotal = materiasSem.reduce((acc, m) => acc + (m.creditos || 0), 0);

          return {
            texto: `### Asignaturas sugeridas para Semestre ${numSem}° (${creditosTotal} créditos en la ruta)

${listaTxt}

Puedes explorar sus relaciones en la [Malla Curricular](malla.html).`,
            chips: materiasSem.slice(0, 3).map((m) => `Prerrequisitos de ${m.nombre}`),
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // 15. Cancelación de materias o cancelación de semestre
    // ------------------------------------------------------------------------
    if (/cancelar materia|cancelacion de materias|cancelacion extemporanea|cancelar semestre|plazo cancelar|hasta cuando cancelar/.test(preguntaNorm)) {
      return {
        texto: `**Plazos y Condiciones para Cancelar Asignaturas en la Facultad de Minas (Pregrado):**

1. **Semana 3 (Cancelación sin pérdida de créditos):**
   - Es el periodo oficial en el SIA donde puedes retirar asignaturas y los créditos regresan intactos a tu bolsa para el siguiente semestre.

2. **Semana 8 (Cancelación ordinaria con pérdida de créditos):**
   - Puedes cancelar la materia en el SIA hasta esta semana. La materia no afectará tu promedio, pero esos créditos no se devuelven a tu cupo disponible.

3. **Cancelación Extemporánea (Por fuerza mayor o enfermedad):**
   - Si superaste la semana 8 y se te presentó una calamidad médica, psicológica o laboral comprobable, debes radicar la solicitud ante el **SGS de la Facultad de Minas**:
     🔗 [Portal Solicitudes SGS Minas](${SOFIA_CFG.tramitesMinasUrl})
   - Adjuntas los certificados médicos avalados por Bienestar Universitario (Bloque M4 / Robledo).`,
        chips: ['Portal Solicitudes SGS', 'Calendario académico', 'Asesoría Estudiantil'],
      };
    }

    // ------------------------------------------------------------------------
    // 16. Consultas del Calendario Académico
    // ------------------------------------------------------------------------
    if (/calendario|fechas|cuando empiezan clases|cuando terminan|semana de induccion|recesos|evaluacion docente/.test(preguntaNorm)) {
      if (indices.calendarioFilas.length > 0) {
        const palabrasClave = preguntaNorm.split(' ').filter((p) => p.length > 3);
        const coincidencias = indices.calendarioFilas.filter((f) =>
          palabrasClave.some((p) => f.eventoNorm.includes(p))
        );

        if (coincidencias.length > 0) {
          const listado = coincidencias
            .slice(0, 5)
            .map((c) => `• **${c.evento}:** ${c.fecha} _(${c.grupo})_`)
            .join('\n');

          return {
            texto: `**Fechas encontradas en el Calendario Académico Oficial:**\n\n${listado}\n\nPuedes revisar todas las fechas en la guía de [Información General](info.html).`,
            chips: ['Cancelar materias', 'Citas del SIA', 'Bolsa de créditos'],
          };
        }
      }

      return {
        texto: `El **Calendario Académico Oficial (2026-2S)** de la UNAL Sede Medellín establece los hitos clave para matrícula, inicio de clases, cancelaciones y cierre de actas.

Consulta la tabla completa de fechas discriminada por semanas en la sección de [Información General](info.html).`,
        chips: ['Plazos para cancelar materias', 'Citas del SIA', 'Bolsa de créditos'],
      };
    }

    // ------------------------------------------------------------------------
    // 17. P.A.P.A., Citas SIA y Bolsa de Créditos
    // ------------------------------------------------------------------------
    if (/papa|promedio|citas sia|dninfoa|bolsa de creditos|cupo de creditos|creditos adicionales|como calcular el papa/.test(preguntaNorm)) {
      return {
        texto: `**Conceptos Clave del Sistema Académico SIA:**

- **P.A.P.A. (Promedio Aritmético Ponderado Acumulado):**
  Se calcula multiplicando la calificación final de cada materia cursada (aprobada o reprobada) por sus créditos, sumando estos valores y dividiéndolos entre el total de créditos cursados.
  Determina tu orden de citación para matrícula, adjudicación de becas y requisitos de traslados.

- **Citas DNINFOA:**
  Se asignan en 4 grupos de prelación basados en tu P.A.P.A. del periodo anterior y avance de carrera:
  - *Grupo 1:* Estudiantes con mejores promedios y deportistas representativos.
  - *Grupos 2, 3 y 4:* Orden sucesivo de cita para inscripción de asignaturas.

- **Bolsa de Créditos:**
  Recibes un cupo inicial para tu plan (172 créditos en Petróleos). Si tu P.A.P.A. es sobresaliente, puedes solicitar créditos adicionales a la Vicedecanatura Académica de Minas vía SGS.

Calcula tu proyección en [Mi Avance](avance.html) o lee la guía completa en [Información General](info.html).`,
        chips: ['Ir a Mi Avance', '¿Cómo hacer cambio de carrera?', 'Ver Malla Curricular'],
      };
    }

    // ------------------------------------------------------------------------
    // 18. Horas de Corresponsabilidad
    // ------------------------------------------------------------------------
    if (/corresponsabilidad|horas de corresponsabilidad|servicio social|beneficiarios bienestar/.test(preguntaNorm)) {
      return {
        texto: `**Horas de Corresponsabilidad en la UNAL:**

Si eres beneficiario de apoyos socioeconómicos de Bienestar Universitario (Gestión Alimentaria, Residencias o Bonos de Transporte):
- Debes cumplir entre **20 y 40 horas** por semestre de actividades solidarias en dependencias de la universidad.
- En la Facultad de Minas puedes cumplirlas apoyando salas de cómputo, bibliotecas (Campus Robledo), laboratorios de petróleos o eventos académicos.
- El registro y legalización se realiza en el sistema de Bienestar Universitario.`,
        chips: ['Auxilios de Bienestar', 'Información General', 'Contacto Asesoría Minas'],
      };
    }

    // ------------------------------------------------------------------------
    // 19. Bus Intercampus (Robledo <-> Volador <-> Río)
    // ------------------------------------------------------------------------
    if (/bus intercampus|intercampus|ruta de bus|transporte entre campus|como ir a robledo|como ir al volador/.test(preguntaNorm)) {
      return {
        texto: `**Servicio de Bus Intercampus UNAL Sede Medellín:**

Conecta de forma gratuita a la comunidad universitaria entre los campus de la sede:
- **Ruta Robledo ↔ Volador:** Fundamental para estudiantes de la Facultad de Minas que tienen asignaturas de fundamentación o bienestar en El Volador.
- **Ruta Volador ↔ Campus del Río:** Conexión con laboratorios y posgrados.
- **Horarios:** Salidas continuas de lunes a viernes entre las **06:00 a.m. y las 08:30 p.m.** (cada 20 a 30 minutos según el tráfico).
- **Requisito:** Presentar carné institucional físico o digital en la aplicación móvil UNAL.

Consulta el mapa y paraderos en la pestaña de [Intercampus](intercampus.html).`,
        chips: ['Ver sección Intercampus', 'Convenio Metro Cívica', 'Información General'],
      };
    }

    // ------------------------------------------------------------------------
    // 20. Búsqueda en FAQs del portal
    // ------------------------------------------------------------------------
    if (datos.info?.faq && Array.isArray(datos.info.faq)) {
      const matchFaq = datos.info.faq.find((item) => {
        const pregNorm = normalizar(item.pregunta);
        const palabras = preguntaNorm.split(' ').filter((w) => w.length > 3);
        return palabras.filter((w) => pregNorm.includes(w)).length >= 2;
      });

      if (matchFaq) {
        return {
          texto: `**${matchFaq.pregunta}**\n\n${matchFaq.respuesta}`,
          chips: ['¿Qué es la malla curricular?', 'Banco de Recursos en Drive', 'Contacto de la Representación'],
        };
      }
    }

    // ------------------------------------------------------------------------
    // 21. Fallback / Respuesta por defecto inteligente
    // ------------------------------------------------------------------------
    return {
      texto: `No encontré una coincidencia exacta para tu consulta, pero estoy lista para orientarte en cualquiera de estos temas oficiales de **Ingeniería de Petróleos**:

- **Malla y Prerrequisitos:** Pregúntame por materias como *Perforación I*, *Simulación de Yacimientos*, *Fluidos de Yacimiento*, *Geología Física*, etc.
- **Tipos de materias:** Cómo se distribuyen los 172 créditos del plan.
- **¿Por qué estudiar Petróleos?** y fortalezas en la transición energética.
- **¿Quién es el creador de la web?**
- **¿Cómo hacer cambio de carrera / traslados?** ante la Facultad de Minas.
- **Banco de Recursos en Drive:** Parciales y talleres organizados por semestre.
- **Capítulo SPE y grupos de estudio.**`,
      chips: [
        '¿Qué es la malla curricular?',
        '¿Qué tipo de materias hay?',
        '¿Por qué estudiar Petróleos?',
        '¿Quién es el creador de la web?',
        '¿Cómo hacer cambio de carrera?',
        'Banco de Recursos en Drive',
      ],
    };
  }

  // Búsqueda inteligente de asignaturas por texto y alias
  function buscarAsignaturaPorTexto(textoNorm) {
    // 1. Por código numérico directo
    const matchCod = textoNorm.match(/\b(\d{7}|10000\d{2}-m)\b/i);
    if (matchCod) {
      const codigo = matchCod[1].toUpperCase();
      if (indices.materiasPorCodigo.has(codigo)) {
        return indices.materiasPorCodigo.get(codigo);
      }
    }

    // 2. Por alias exacto
    for (const [alias, asig] of indices.aliasMaterias.entries()) {
      if (textoNorm.includes(alias)) {
        return asig;
      }
    }

    // 3. Por nombre oficial de la asignatura
    for (const [nomNorm, asig] of indices.materiasPorNombre.entries()) {
      if (textoNorm.includes(nomNorm)) {
        return asig;
      }
    }

    return null;
  }

  // ==========================================================================
  // 4. GENERACIÓN DEL DOM Y ELEMENTOS DE INTERFAZ
  // ==========================================================================

  function crearElementosDOM() {
    if (document.getElementById('sofia-contenedor-global')) return;

    const contenedorGlobal = document.createElement('div');
    contenedorGlobal.id = 'sofia-contenedor-global';
    contenedorGlobal.className = 'sofia-flotante-wrap';

    // 1. Globo de bienvenida (tooltip)
    const globo = document.createElement('div');
    globo.className = 'sofia-globo-bienvenida';
    globo.id = 'sofia-globo';
    globo.setAttribute('role', 'status');
    globo.innerHTML = `
      <span class="sofia-globo-texto">👋 ¿Dudas con materias o trámites? <strong>Pregúntale a sofIA</strong></span>
      <button class="sofia-globo-cerrar" id="sofia-globo-cerrar" type="button" aria-label="Cerrar aviso">✕</button>
    `;

    // 2. Botón flotante circular
    const boton = document.createElement('button');
    boton.className = 'sofia-boton';
    boton.id = 'sofia-btn-toggle';
    boton.type = 'button';
    boton.setAttribute('aria-label', 'Abrir asistente virtual sofIA de Petróleos');
    boton.setAttribute('aria-expanded', 'false');
    boton.innerHTML = `
      <span class="sofia-boton__halo" aria-hidden="true"></span>
      ${SOFIA_SVG_AVATAR}
      <span class="sofia-boton__badge" title="sofIA en línea"></span>
    `;

    // 3. Ventana modal de conversación
    const ventana = document.createElement('section');
    ventana.className = 'sofia-ventana';
    ventana.id = 'sofia-ventana';
    ventana.setAttribute('aria-label', 'Chat con asistente virtual sofIA');
    ventana.hidden = true;

    ventana.innerHTML = `
      <header class="sofia-cabecera">
        <div class="sofia-cabecera__identidad">
          <div class="sofia-cabecera__avatar-wrap" aria-hidden="true">
            ${SOFIA_SVG_AVATAR}
          </div>
          <div class="sofia-cabecera__datos">
            <div class="sofia-cabecera__nombre-wrap">
              <h2 class="sofia-cabecera__nombre">sofIA</h2>
              <span class="sofia-cabecera__tag">UNAL</span>
            </div>
            <span class="sofia-cabecera__estado">
              <span class="sofia-cabecera__punto-estado" aria-hidden="true"></span>
              En línea · Asistente de Petróleos
            </span>
          </div>
        </div>
        <div class="sofia-cabecera__acciones">
          <button class="sofia-btn-icono" id="sofia-btn-limpiar" type="button" title="Reiniciar conversación" aria-label="Reiniciar conversación">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <button class="sofia-btn-icono" id="sofia-btn-cerrar" type="button" title="Cerrar chat" aria-label="Cerrar chat">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </header>

      <div class="sofia-mensajes" id="sofia-mensajes" role="log" aria-live="polite">
        <!-- Los mensajes se inyectan dinámicamente aquí -->
      </div>

      <form class="sofia-formulario" id="sofia-form" autocomplete="off">
        <input
          type="text"
          class="sofia-input"
          id="sofia-input"
          placeholder="Pregúntale a sofIA sobre la malla, materias, alianzas..."
          aria-label="Escribe tu consulta para sofIA"
          maxlength="240"
        />
        <button class="sofia-btn-enviar" id="sofia-btn-enviar" type="submit" aria-label="Enviar mensaje a sofIA">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>

      <div class="sofia-pie-aviso">
        sofIA consulta la base oficial del portal de Ingeniería de Petróleos UNAL.
      </div>
    `;

    contenedorGlobal.appendChild(globo);
    contenedorGlobal.appendChild(ventana);
    contenedorGlobal.appendChild(boton);
    document.body.appendChild(contenedorGlobal);

    vincularEventos();
    agregarMensajeInicial();
  }

  // ==========================================================================
  // 5. MANIPULACIÓN DEL DOM Y RENDER DE MENSAJES
  // ==========================================================================

  function agregarMensajeInicial() {
    const contenedor = document.getElementById('sofia-mensajes');
    if (!contenedor || contenedor.children.length > 0) return;

    const textoBienvenida = `¡Hola! Soy **${SOFIA_CFG.nombre}**, tu asistente holográfica de **${SOFIA_CFG.programa}** de la **${SOFIA_CFG.facultad}** (UNAL Medellín).

Estoy conectada a toda la información oficial: malla curricular, tipos de materias, prerrequisitos, grupos estudiantiles (SPE), alianzas de bienestar, cambio de carrera, creador de la plataforma, fechas del calendario y el Drive de estudio. ¿En qué te puedo colaborar hoy?`;

    const chipsIniciales = [
      '¿Qué es la malla curricular?',
      '¿Qué tipo de materias hay?',
      '¿Por qué estudiar Petróleos?',
      '¿Quién es el creador de la web?',
      '¿Cómo hacer cambio de carrera?',
      '¿Cuáles son las alianzas?',
      'Ver Banco en Drive',
    ];

    agregarMensajeAlDOM('bot', textoBienvenida, chipsIniciales);
    contenedor.scrollTop = 0;
  }

  function agregarMensajeAlDOM(remitente, textoMarkdown, chips = []) {
    const contenedor = document.getElementById('sofia-mensajes');
    if (!contenedor) return;

    const fila = document.createElement('div');
    fila.className = `sofia-mensaje-fila sofia-mensaje-fila--${remitente}`;

    if (remitente === 'bot') {
      const avatarWrap = document.createElement('div');
      avatarWrap.className = 'sofia-mensaje-avatar';
      avatarWrap.setAttribute('aria-hidden', 'true');
      avatarWrap.innerHTML = SOFIA_SVG_AVATAR;
      fila.appendChild(avatarWrap);
    }

    const burbuja = document.createElement('div');
    burbuja.className = 'sofia-burbuja';
    burbuja.innerHTML = formatearMarkdown(textoMarkdown);

    if (chips && chips.length > 0) {
      const contenedorChips = document.createElement('div');
      contenedorChips.className = 'sofia-chips-contenedor';
      chips.forEach((chipTexto) => {
        const chipBtn = document.createElement('button');
        chipBtn.className = 'sofia-chip';
        chipBtn.type = 'button';
        chipBtn.textContent = chipTexto;
        chipBtn.addEventListener('click', () => {
          procesarConsultaUsuario(chipTexto);
        });
        contenedorChips.appendChild(chipBtn);
      });
      burbuja.appendChild(contenedorChips);
    }

    fila.appendChild(burbuja);
    contenedor.appendChild(fila);
    contenedor.scrollTop = contenedor.scrollHeight;
  }

  function mostrarIndicadorEscribiendo() {
    const contenedor = document.getElementById('sofia-mensajes');
    if (!contenedor) return;

    const fila = document.createElement('div');
    fila.className = 'sofia-mensaje-fila sofia-mensaje-fila--bot';
    fila.id = 'sofia-escribiendo-indicador';

    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'sofia-mensaje-avatar';
    avatarWrap.setAttribute('aria-hidden', 'true');
    avatarWrap.innerHTML = SOFIA_SVG_AVATAR;

    const burbuja = document.createElement('div');
    burbuja.className = 'sofia-burbuja sofia-escribiendo';
    burbuja.innerHTML = `
      <span class="sofia-escribiendo-punto"></span>
      <span class="sofia-escribiendo-punto"></span>
      <span class="sofia-escribiendo-punto"></span>
    `;

    fila.appendChild(avatarWrap);
    fila.appendChild(burbuja);
    contenedor.appendChild(fila);
    contenedor.scrollTop = contenedor.scrollHeight;
  }

  function removerIndicadorEscribiendo() {
    const el = document.getElementById('sofia-escribiendo-indicador');
    if (el) el.remove();
  }

  // Parseador ligero de Markdown seguro a HTML
  function formatearMarkdown(md) {
    if (!md) return '';
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Encabezados h3
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

    // Negritas e itálicas
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Código en línea
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Enlaces markdown [texto](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Listas con viñetas • o -
    html = html.replace(/^[•\-] (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Saltos de línea a párrafos
    const parrafos = html.split(/\n\n+/);
    return parrafos
      .map((p) => {
        p = p.trim();
        if (p.startsWith('<h3>') || p.startsWith('<ul>') || p.startsWith('<li>')) return p;
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
  }

  // ==========================================================================
  // 6. EVENTOS Y CONTROLADORES DE INTERFAZ
  // ==========================================================================

  function abrirSofia() {
    const ventana = document.getElementById('sofia-ventana');
    const btn = document.getElementById('sofia-btn-toggle');
    const globo = document.getElementById('sofia-globo');
    if (!ventana || !btn) return;

    ventana.hidden = false;
    void ventana.offsetWidth;
    ventana.classList.add('is-abierta');
    btn.setAttribute('aria-expanded', 'true');
    estadoSofia.abierto = true;

    if (globo) {
      globo.style.display = 'none';
      sessionStorage.setItem('petroleos.sofia.globo_oculto', '1');
    }

    setTimeout(() => {
      document.getElementById('sofia-input')?.focus();
      const contenedor = document.getElementById('sofia-mensajes');
      if (contenedor && contenedor.children.length > 1) {
        contenedor.scrollTop = contenedor.scrollHeight;
      }
    }, 200);
  }

  function cerrarSofia() {
    const ventana = document.getElementById('sofia-ventana');
    const btn = document.getElementById('sofia-btn-toggle');
    if (!ventana || !btn) return;

    ventana.classList.remove('is-abierta');
    btn.setAttribute('aria-expanded', 'false');
    estadoSofia.abierto = false;

    setTimeout(() => {
      if (!estadoSofia.abierto) {
        ventana.hidden = true;
      }
    }, 280);
  }

  function procesarConsultaUsuario(texto) {
    const consultaLimpia = (texto || '').trim();
    if (!consultaLimpia) return;

    agregarMensajeAlDOM('usuario', consultaLimpia);

    const input = document.getElementById('sofia-input');
    if (input) input.value = '';

    mostrarIndicadorEscribiendo();

    setTimeout(() => {
      removerIndicadorEscribiendo();
      const respuesta = responderPregunta(consultaLimpia);
      agregarMensajeAlDOM('bot', respuesta.texto, respuesta.chips);
    }, 320);
  }

  function vincularEventos() {
    const btnToggle = document.getElementById('sofia-btn-toggle');
    const btnCerrar = document.getElementById('sofia-btn-cerrar');
    const btnLimpiar = document.getElementById('sofia-btn-limpiar');
    const globoCerrar = document.getElementById('sofia-globo-cerrar');
    const globo = document.getElementById('sofia-globo');
    const formulario = document.getElementById('sofia-form');
    const contenedorMensajes = document.getElementById('sofia-mensajes');

    btnToggle?.addEventListener('click', () => {
      if (estadoSofia.abierto) {
        cerrarSofia();
      } else {
        abrirSofia();
      }
    });

    btnCerrar?.addEventListener('click', cerrarSofia);

    globo?.addEventListener('click', (e) => {
      if (e.target.id === 'sofia-globo-cerrar') return;
      abrirSofia();
    });

    globoCerrar?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (globo) globo.style.display = 'none';
      sessionStorage.setItem('petroleos.sofia.globo_oculto', '1');
    });

    btnLimpiar?.addEventListener('click', () => {
      if (contenedorMensajes) {
        contenedorMensajes.innerHTML = '';
        agregarMensajeInicial();
      }
    });

    formulario?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('sofia-input');
      if (input && input.value) {
        procesarConsultaUsuario(input.value);
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && estadoSofia.abierto) {
        cerrarSofia();
      }
    });

    if (sessionStorage.getItem('petroleos.sofia.globo_oculto') === '1' && globo) {
      globo.style.display = 'none';
    }
  }

  // ==========================================================================
  // 7. INICIALIZACIÓN Y API PÚBLICA (WINDOW.SOFIA)
  // ==========================================================================

  function moduloSofia() {
    cargarDatos();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', crearElementosDOM);
    } else {
      crearElementosDOM();
    }
  }

  moduloSofia();

  // Exposición controlada en window para integración con otros módulos
  window.sofIA = {
    abrir: abrirSofia,
    cerrar: cerrarSofia,
    preguntar: procesarConsultaUsuario,
    responder: responderPregunta,
    inicializar: cargarDatos,
  };
})();
