/**
 * PLATAFORMA DIGITAL · INGENIERÍA DE PETRÓLEOS (UNAL MEDELLÍN)
 * Desarrollado por: Santiago Escobar Arias · Representante de Sistemas
 * © 2026 Santiago Escobar Arias. Todos los derechos reservados.
 * Obra protegida por la Ley 23 de 1982 y Decisión 351 (CAN).
 */
/* =============================================
   MÓDULO INICIO · INGENIERÍA DE PETRÓLEOS
   - Carga programa.json al inicio
   - Carga perfil.json y grupos.json por intersección
   - Simulador interactivo de Dinámica del Subsuelo y Yacimientos
   ============================================= */

const ICONOS_PERFIL = {
  yacimientos: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><circle cx="12" cy="12" r="9"/>',
  perforacion: '<path d="m14 2-8 14h6l-2 6 10-12h-6l4-8z"/>',
  transicion: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>',
  gestion: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/><circle cx="12" cy="7" r="2"/>',
  ciencia: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
};

const ICONOS_RUTAS = {
  yacimientos: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18v-9h9"/>',
  perforacion: '<path d="M12 2L2 22h20L12 2z"/><line x1="12" y1="9" x2="12" y2="17"/>',
  produccion: '<path d="M3 12h4l3-9 4 18 3-9h4"/>',
  geologia: '<path d="M2 20h20"/><path d="m6 20 6-12 4 8 2-4 4 8"/>',
  transicion: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
};

const icono = (nombre) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_PERFIL[nombre] || ICONOS_PERFIL.ciencia}</svg>`;
const iconoRuta = (nombre) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_RUTAS[nombre] || ICONOS_RUTAS.yacimientos}</svg>`;

const ICONO_SELLO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/><path d="m9.5 9 1.8 1.8L15 7.2"/></svg>';


/* ---------- 1. Programa ---------- */

function pintarPrograma(p) {
  $('#portada-cifras').innerHTML = p.cifras
    .map((c) => `<li>${esc(c.valor)}<small>${esc(c.texto)}</small></li>`)
    .join('');

  const acreditacion = p.acreditacion;
  $('#programa-contenido').innerHTML = `
    <div class="seccion-titulo">
      <p class="seccion-titulo__antetitulo">${esc(p.facultad)} · ${esc(p.sede)}</p>
      <h2 id="programa-titulo">Definición y Misión del Pregrado</h2>
      <p class="seccion-titulo__intro">Ingeniería de Petróleos · Rigor científico, soberanía energética y liderazgo en la transición sostenible</p>
    </div>

    <div class="programa__rejilla">
      <div class="programa__texto">
        <span class="programa__lema">Lema de la Facultad: ${esc(p.lema)}</span>
        <div class="programa__parrafos">
          ${p.descripcion.map((parrafo) => `<p>${esc(parrafo)}</p>`).join('')}
        </div>
      </div>
      <ul class="ficha">
        ${p.ficha.map((f) => `
          <li><span class="ficha__etiqueta">${esc(f.etiqueta)}</span><span class="ficha__valor">${esc(f.valor)}</span></li>`).join('')}
      </ul>
    </div>

    <!-- RUTAS CURRICULARES / CAMPOS DE APLICACIÓN -->
    <div class="rutas-curriculares" id="rutas-curriculares">
      <div class="seccion-titulo seccion-titulo--rutas">
        <p class="seccion-titulo__antetitulo">Campos de profundización y aplicación</p>
        <h3 class="rutas__titulo">Ejes Curriculares Estratégicos</h3>
        <p class="seccion-titulo__intro">El plan curricular articula cinco grandes áreas tecnológicas que preparan al ingeniero para los retos energéticos contemporáneos:</p>
      </div>

      <div class="rutas__grid">
        ${(p.rutas || []).map((ruta, idx) => `
          <article class="ruta-card" style="--color-ruta: ${ruta.color}">
            <div class="ruta-card__encabezado">
              <span class="ruta-card__numero">EJE 0${idx + 1}</span>
              <span class="ruta-card__icono">${iconoRuta(ruta.icono)}</span>
            </div>
            <h4 class="ruta-card__nombre">${esc(ruta.nombre)}</h4>
            <p class="ruta-card__descripcion">${esc(ruta.descripcion)}</p>
            <div class="ruta-card__pie">
              <a href="malla.html" class="ruta-card__enlace" title="Ver materias de ${esc(ruta.nombre)} en la malla">
                <span>Ver en la malla</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </article>`).join('')}
      </div>
    </div>

    <!-- ACREDITACIÓN DE CALIDAD -->
    <div class="acreditacion">
      <div class="acreditacion__cabecera">
        <span class="acreditacion__sello-icono">${ICONO_SELLO}</span>
        <div>
          <span class="acreditacion__antetitulo">Calidad Académica Certificada</span>
          <h3 class="acreditacion__estado">${esc(acreditacion.estado)}</h3>
        </div>
      </div>
      <div class="acreditacion__rejilla">
        ${acreditacion.hitos.map((h, i) => `
          <div class="acreditacion__tarjeta ${i === 0 ? 'acreditacion__tarjeta--renovacion' : ''}">
            <div class="acreditacion__tarjeta-encabezado">
              <span class="acreditacion__anio-badge">${esc(h.anio)}</span>
              <span class="acreditacion__hito-tipo">${i === 0 ? 'Reconocimiento Ministerial' : 'Normativa Curricular'}</span>
            </div>
            <p class="acreditacion__texto">${esc(h.texto)}</p>
          </div>`).join('')}
      </div>
      <div class="acreditacion__pie">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="acreditacion__info-icono" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p class="acreditacion__nota">${esc(acreditacion.nota)}</p>
      </div>
    </div>

    <p class="fuentes">Fuentes oficiales:
      ${p.fuentes.map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a>`).join(' · ')}
    </p>`;
}


/* ---------- 2. Perfil del egresado ---------- */

function pintarPerfil(perfil) {
  $('#perfil-contenido').innerHTML = `
    <div class="seccion-titulo">
      <p class="seccion-titulo__antetitulo">Competencias y Proyección</p>
      <h2 id="perfil-titulo">${esc(perfil.titulo)}</h2>
      <p class="seccion-titulo__intro">${esc(perfil.intro)}</p>
    </div>
    <ul class="perfil__tarjetas">
      ${perfil.rasgos.map((r) => `
        <li class="rasgo">
          <span class="rasgo__icono">${icono(r.icono)}</span>
          <h3>${esc(r.titulo)}</h3>
          <p>${esc(r.texto)}</p>
        </li>`).join('')}
    </ul>
    <p class="perfil__fuente">${esc(perfil.fuente)}</p>`;
}


/* ---------- 3. Capítulos y Grupos Estudiantiles (Diseño Petrolero Nódulo) ---------- */

function pintarGrupos(grupos) {
  const nodos = grupos.map((grupo) => {
    const destino = grupo.enlace ? `href="${esc(grupo.enlace)}" target="_blank" rel="noopener noreferrer"` : '';
    
    return `
      <li class="grupo-nodo" style="--color-nodo: ${esc(grupo.color)}; --color-nodo-acento: ${esc(grupo.colorAcento || '#D4AF37')};">
        <a class="grupo-nodo__enlace-ig" ${destino} aria-label="Visitar Instagram de ${esc(grupo.nombre)}" title="Clic para visitar Instagram de ${esc(grupo.nombre)}">
          <div class="grupo-nodo__capsula">
            <div class="grupo-nodo__anillos">
              <span class="grupo-nodo__onda grupo-nodo__onda--1"></span>
              <span class="grupo-nodo__onda grupo-nodo__onda--2"></span>
            </div>
            
            <div class="grupo-nodo__emblema">
              <img src="${esc(grupo.logo)}" alt="Logo de ${esc(grupo.nombre)}" class="grupo-nodo__emblema-img" loading="lazy">
            </div>

            <div class="grupo-nodo__hover-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="13" height="13" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span>${esc(grupo.usuarioIg || 'Ver Instagram')} ↗</span>
            </div>
          </div>
        </a>

        <div class="grupo-nodo__contenido">
          <span class="grupo-nodo__tipo">${esc(grupo.tipo)}</span>
          <h3 class="grupo-nodo__nombre">${esc(grupo.nombre)}</h3>
          ${grupo.subtitulo ? `<p class="grupo-nodo__subtitulo">${esc(grupo.subtitulo)}</p>` : ''}
          <p class="grupo-nodo__desc">${esc(grupo.descripcion)}</p>

          <div class="grupo-nodo__pie">
            <a class="grupo-nodo__btn-accion" ${destino}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span>Conectar en Instagram</span>
            </a>
          </div>
        </div>
      </li>`;
  }).join('');

  $('#grupos-contenido').innerHTML = `
    <div class="seccion-titulo">
      <p class="seccion-titulo__antetitulo">Comunidad & Liderazgo Técnico</p>
      <h2 id="grupos-titulo">Capítulos y Grupos Estudiantiles</h2>
      <p class="seccion-titulo__intro">Nuestra carrera cuenta con capítulos internacionales y colectivos pioneros en perforación, yacimientos, geociencias y transición energética. Explora y únete a sus iniciativas.</p>
    </div>
    <ul class="grupos__grid-nodos">${nodos}</ul>`;
}


/* ---------- 4. Simulador Interactivo de Subsuelo y Yacimientos ---------- */

const DATOS_MODOS_SIMULADOR = {
  'flujo-natural': {
    badge: 'RÉGIMEN OPERATIVO 01 · YACIMIENTO VIRGEN',
    titulo: 'Producción por Flujo Natural',
    desc: 'La energía natural del yacimiento (expansión volumétrica del gas en solución y empuje hidráulico del acuífero) impulsa el crudo y gas hacia la cabeza del pozo sin requerir asistencia mecánica externa.',
    profundidad: '9,450 ft (2,880 m)',
    presion: '3,820 psi',
    caudal: '3,250 BOPD',
    recobro: '28.4 %',
    claseVisual: 'modo-flujo-natural',
    materias: [
      'Fluidos de Yacimiento',
      'Producción por Flujo Natural',
      'Propiedades de la Roca Yacimiento'
    ]
  },
  'perforacion': {
    badge: 'RÉGIMEN OPERATIVO 02 · DRILLING & COMPLETION',
    titulo: 'Perforación Direccional y Navegación de Pozo',
    desc: 'Mediante telemetría en tiempo real (MWD/LWD), motores de fondo y sarta direccional, se navega con precisión milimétrica la zona de pago (pay zone) para maximizar el contacto con la formación productora.',
    profundidad: '12,680 ft (3,865 m)',
    presion: '5,140 psi',
    caudal: 'En fase de completamiento',
    recobro: 'Estimado 45.0 %',
    claseVisual: 'modo-perforacion',
    materias: [
      'Perforación I & II',
      'Perfilaje de Pozos',
      'Perforación Direccional Aplicada'
    ]
  },
  'recobro-eor': {
    badge: 'RÉGIMEN OPERATIVO 03 · IOR / EOR MEJORADO',
    titulo: 'Recobro Secundario & Mejorado (EOR)',
    desc: 'Inyección de agua tratada o fluidos químicos/gas para mantener la presión de reservorio y desplazar el crudo remanente atrapado en los poros capilares, incrementando sustancialmente las reservas recuperables.',
    profundidad: '10,120 ft (3,085 m)',
    presion: '4,450 psi (Inyección)',
    caudal: '4,850 BOPD',
    recobro: '54.2 %',
    claseVisual: 'modo-recobro-eor',
    materias: [
      'Inyección de Agua',
      'Simulación de Yacimientos',
      'Métodos de Recobro Mejorado'
    ]
  },
  'transicion': {
    badge: 'RÉGIMEN OPERATIVO 04 · DESCARBONIZACIÓN Y GEOTERMIA',
    titulo: 'Transición Energética, Geotermia & Almacenamiento CCUS',
    desc: 'Reutilización de formaciones profundas depletadas para capturar y almacenar CO2 de forma geológicamente permanente (CCUS), así como extracción de energía geotérmica de alta entalpía y vector de hidrógeno.',
    profundidad: '11,200 ft (3,413 m)',
    presion: '3,980 psi',
    caudal: '2.4 Mt CO2/año (Inyección)',
    recobro: 'Cero Emisiones Netas',
    claseVisual: 'modo-transicion',
    materias: [
      'Yacimientos no Convencionales',
      'Termodinámica General',
      'ETSG · Transición Energética'
    ]
  }
};

function configurarSimuladorSubsuelo() {
  const tabs = $$('.simulador-tab');
  const visualBox = $('#simulador-visual');
  if (!tabs.length || !visualBox) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const modo = tab.dataset.modo;
      if (!modo || !DATOS_MODOS_SIMULADOR[modo]) return;

      tabs.forEach((t) => {
        t.classList.remove('is-activa');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-activa');
      tab.setAttribute('aria-selected', 'true');

      actualizarSimulador(modo);
    });
  });
}

function actualizarSimulador(modo) {
  const datos = DATOS_MODOS_SIMULADOR[modo];
  if (!datos) return;

  const visualBox = $('#simulador-visual');
  if (visualBox) {
    visualBox.className = `simulador-visual ${datos.claseVisual}`;
  }

  const badge = $('#sim-badge');
  const titulo = $('#sim-titulo');
  const desc = $('#sim-desc');
  const prof = $('#sim-prof');
  const presion = $('#sim-presion');
  const caudal = $('#sim-caudal');
  const recobro = $('#sim-recobro');
  const materias = $('#sim-materias');

  if (badge) badge.textContent = datos.badge;
  if (titulo) titulo.textContent = datos.titulo;
  if (desc) desc.textContent = datos.desc;
  if (prof) prof.textContent = datos.profundidad;
  if (presion) presion.textContent = datos.presion;
  if (caudal) caudal.textContent = datos.caudal;
  if (recobro) recobro.textContent = datos.recobro;

  if (materias) {
    materias.innerHTML = datos.materias
      .map((m) => `<a href="malla.html" class="materia-chip">${esc(m)}</a>`)
      .join('');
  }
}


/* ---------- 5. Carga de datos diferida ---------- */

const SECCIONES = {
  perfil: () => cargarDatos('perfil').then(pintarPerfil),
  grupos: () => cargarDatos('grupos').then(pintarGrupos),
};

function cargarSeccion(seccion) {
  const cargar = SECCIONES[seccion.dataset.carga];
  if (cargar) {
    cargar().catch((error) => mostrarErrorDeCarga(seccion.querySelector('.contenedor'), error));
  }
}

// Carga inicial
cargarDatos('programa')
  .then(pintarPrograma)
  .catch((error) => mostrarErrorDeCarga($('#programa-contenido'), error));

configurarSimuladorSubsuelo();
iniciarGemeloDigital();

const porCargar = $$('[data-carga]');
if ('IntersectionObserver' in window) {
  const vigilante = new IntersectionObserver((entradas) => {
    entradas.filter((e) => e.isIntersecting).forEach((e) => {
      vigilante.unobserve(e.target);
      cargarSeccion(e.target);
    });
  }, { rootMargin: '400px 0px' });
  porCargar.forEach((seccion) => vigilante.observe(seccion));
} else {
  porCargar.forEach(cargarSeccion);
}


/* =========================================================
   6. GEMELO DIGITAL 3D INTERACTIVO (HERO PRO VISUAL)
   Simulación de reservorio, partículas de crudo y CCUS
   ========================================================= */

function iniciarGemeloDigital() {
  const canvas = $('#canvas-petro-digital');
  const consoleBox = $('#digital-twin-console');
  if (!canvas || !consoleBox) return;

  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let W = 0;
  let H = 0;

  function redimensionar() {
    W = canvas.parentElement.clientWidth || 520;
    H = canvas.parentElement.clientHeight || 290;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }

  redimensionar();
  window.addEventListener('resize', () => {
    redimensionar();
  });

  // Estado operativo: 'produccion' o 'ccus'
  let modoActual = 'produccion';
  let rotX = 0.15;
  let rotY = -0.3;
  let targetRotX = 0.15;
  let targetRotY = -0.3;

  // Interacción de mouse para paralaje 3D
  consoleBox.addEventListener('mousemove', (e) => {
    const rect = consoleBox.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetRotY = -0.3 + nx * 0.35;
    targetRotX = 0.15 - ny * 0.25;
  });

  consoleBox.addEventListener('mouseleave', () => {
    targetRotX = 0.15;
    targetRotY = -0.3;
  });

  // Conmutador de modo
  const btnProd = $('#btn-dt-produccion');
  const btnCcus = $('#btn-dt-ccus');
  const modoLabel = $('#dt-modo-label');
  const caudalVal = $('#dt-caudal');
  const recobroVal = $('#dt-recobro');
  const estadoVal = $('#dt-estado');
  const presionVal = $('#hud-presion');

  function setModo(nuevoModo) {
    modoActual = nuevoModo;
    if (nuevoModo === 'produccion') {
      btnProd?.classList.add('is-active');
      btnCcus?.classList.remove('is-active');
      if (modoLabel) modoLabel.textContent = 'PRODUCCIÓN ACTIVA (EOR)';
      if (caudalVal) caudalVal.textContent = '3,450 BOPD';
      if (recobroVal) recobroVal.textContent = '48.2 %';
      if (estadoVal) estadoVal.textContent = 'PAYZONE · ALTA PERM';
      if (presionVal) presionVal.textContent = '4,180 PSI';
    } else {
      btnCcus?.classList.add('is-active');
      btnProd?.classList.remove('is-active');
      if (modoLabel) modoLabel.textContent = 'INYECCIÓN CCUS ACTIVA';
      if (caudalVal) caudalVal.textContent = '2.4 Mt CO₂/año';
      if (recobroVal) recobroVal.textContent = 'PERMANENTE > 10k AÑOS';
      if (estadoVal) estadoVal.textContent = 'TRAMPA BASÁLTICA SELLADA';
      if (presionVal) presionVal.textContent = '3,890 PSI';
    }
  }

  btnProd?.addEventListener('click', () => setModo('produccion'));
  btnCcus?.addEventListener('click', () => setModo('ccus'));

  // Generador de partículas de fluidos (crudo dorado / CO2 esmeralda)
  const NUM_PARTICULAS = 90;
  const particulas = [];

  for (let i = 0; i < NUM_PARTICULAS; i++) {
    particulas.push({
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      radius: 1.5 + Math.random() * 2.2,
      lateralOffset: (Math.random() - 0.5) * 8,
      spreadAngle: Math.random() * Math.PI * 2,
      spreadDist: 10 + Math.random() * 55,
      seed: Math.random()
    });
  }

  // Puntos clave de la trayectoria del pozo (Curva direccional S 3D)
  function getWellPoint(t) {
    // t de 0 (superficie) a 1 (punta del pozo horizontal)
    if (t < 0.45) {
      // Tramo vertical desde superficie (Y: -90 a -10)
      const u = t / 0.45;
      return { x: 0, y: -90 + u * 80, z: 0 };
    } else if (t < 0.75) {
      // Curva de desviación / KOP hacia horizontal (Y: -10 a 35, X: 0 a 80)
      const u = (t - 0.45) / 0.3;
      const angle = (u * Math.PI) / 2;
      return {
        x: Math.sin(angle) * 75,
        y: -10 + Math.sin(angle) * 45,
        z: Math.sin(angle) * 20
      };
    } else {
      // Tramo horizontal lateral en el reservorio (X: 75 a 170)
      const u = (t - 0.75) / 0.25;
      return {
        x: 75 + u * 95,
        y: 35 + Math.sin(u * 3) * 2,
        z: 20 + u * 15
      };
    }
  }

  // Proyección 3D isométrica a 2D
  const FOV = 360;
  function proyectar(p3d) {
    // Rotar en Y
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = p3d.x * cosY + p3d.z * sinY;
    const z1 = -p3d.x * sinY + p3d.z * cosY;

    // Rotar en X
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = p3d.y * cosX - z1 * sinX;
    const z2 = p3d.y * sinX + z1 * cosX;

    const scale = FOV / (FOV + z2 + 180);
    return {
      x: W / 2 + x1 * scale,
      y: H / 2 + y2 * scale,
      scale: scale,
      z: z2
    };
  }

  let radarAng = 0;
  let waveTick = 0;

  function bucleRender() {
    ctx.clearRect(0, 0, W, H);

    // Suavizado del ángulo de rotación
    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;
    waveTick += 0.02;
    radarAng += 0.035;

    // 1. Dibujar Malla de Reservorio / Trampa Anticlinal
    ctx.lineWidth = 1;
    const colorMesh = modoActual === 'produccion' ? 'rgba(212, 175, 55, 0.16)' : 'rgba(46, 229, 157, 0.16)';
    ctx.strokeStyle = colorMesh;

    for (let depthLayer = 0; depthLayer <= 4; depthLayer++) {
      const yBase = 15 + depthLayer * 14;
      ctx.beginPath();
      for (let gx = -140; gx <= 180; gx += 25) {
        // Deformación anticlinal geológica
        const anticline = Math.exp(-Math.pow(gx / 70, 2)) * 24;
        const wave = Math.sin(gx * 0.05 + waveTick) * 2.5;
        const pt = proyectar({ x: gx, y: yBase - anticline + wave, z: (depthLayer - 2) * 35 });
        if (gx === -140) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // 2. Línea de Superficie y Torre
    const ptSuperficie = proyectar({ x: 0, y: -90, z: 0 });
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const ptSuelo1 = proyectar({ x: -130, y: -90, z: 0 });
    const ptSuelo2 = proyectar({ x: 130, y: -90, z: 0 });
    ctx.moveTo(ptSuelo1.x, ptSuelo1.y);
    ctx.lineTo(ptSuelo2.x, ptSuelo2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Silueta de Torre de Perforación en Superficie
    ctx.strokeStyle = '#FFE57F';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const ptCima = proyectar({ x: 0, y: -135, z: 0 });
    const ptPataI = proyectar({ x: -14, y: -90, z: 0 });
    const ptPataD = proyectar({ x: 14, y: -90, z: 0 });
    ctx.moveTo(ptPataI.x, ptPataI.y);
    ctx.lineTo(ptCima.x, ptCima.y);
    ctx.lineTo(ptPataD.x, ptPataD.y);
    // Cruces
    const ptCruzA = proyectar({ x: -8, y: -112, z: 0 });
    const ptCruzB = proyectar({ x: 8, y: -112, z: 0 });
    ctx.moveTo(ptCruzA.x, ptCruzA.y);
    ctx.lineTo(ptCruzB.x, ptCruzB.y);
    ctx.stroke();

    // Baliza de tope en la torre
    ctx.fillStyle = '#FF4D4D';
    ctx.beginPath();
    ctx.arc(ptCima.x, ptCima.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Trayectoria 3D de la sarta de perforación y revestidor
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = modoActual === 'produccion' ? 'rgba(212, 175, 55, 0.5)' : 'rgba(46, 229, 157, 0.5)';
    ctx.beginPath();
    for (let st = 0; st <= 1; st += 0.02) {
      const p3 = getWellPoint(st);
      const proj = proyectar(p3);
      if (st === 0) ctx.moveTo(proj.x, proj.y);
      else ctx.lineTo(proj.x, proj.y);
    }
    ctx.stroke();

    // Tubería interior metálica
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    for (let st = 0; st <= 1; st += 0.04) {
      const p3 = getWellPoint(st);
      const proj = proyectar(p3);
      if (st === 0) ctx.moveTo(proj.x, proj.y);
      else ctx.lineTo(proj.x, proj.y);
    }
    ctx.stroke();

    // 4. Perforaciones en el reservorio (zona de contacto horizontal)
    for (let pz = 0.76; pz <= 0.98; pz += 0.055) {
      const pPerf = getWellPoint(pz);
      const projPerf = proyectar(pPerf);
      ctx.fillStyle = modoActual === 'produccion' ? '#FFD700' : '#00E5FF';
      ctx.beginPath();
      ctx.arc(projPerf.x, projPerf.y, 2.5 * projPerf.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Motor de Partículas Dinámico de Fluidos
    particulas.forEach((p) => {
      // Avanzar progreso
      p.t += p.speed;
      if (p.t > 1) p.t = 0;

      let pos3d;
      let alpha = 1;

      if (modoActual === 'produccion') {
        // En producción: brotan de la roca, entran al pozo horizontal y suben a la superficie
        const wellT = 1 - p.t; // Fluyen de 1 a 0
        const basePoint = getWellPoint(wellT);
        
        if (wellT > 0.72) {
          // Fase de dispersión porosa en el yacimiento
          const disp = Math.sin(p.t * Math.PI) * p.spreadDist * (1 - p.t);
          pos3d = {
            x: basePoint.x + Math.cos(p.spreadAngle) * disp,
            y: basePoint.y + Math.sin(p.spreadAngle) * disp * 0.4,
            z: basePoint.z + Math.sin(p.spreadAngle) * disp
          };
          alpha = Math.min(1, p.t * 3);
        } else {
          // Dentro de la tubería subiendo hacia la torre
          pos3d = {
            x: basePoint.x + Math.sin(p.seed * 10) * p.lateralOffset * 0.3,
            y: basePoint.y,
            z: basePoint.z
          };
          alpha = Math.min(1, (1 - wellT) * 2.5);
        }

        const proj = proyectar(pos3d);
        const r = p.radius * proj.scale;
        
        // Gradiente brillante del crudo / hidrocarburos
        ctx.fillStyle = p.seed > 0.7 ? `rgba(255, 255, 255, ${alpha})` : p.seed > 0.3 ? `rgba(255, 229, 127, ${alpha})` : `rgba(212, 175, 55, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // En CCUS / Descarbonización: se inyectan desde superficie (0) hacia el reservorio (1)
        const wellT = p.t;
        const basePoint = getWellPoint(wellT);

        if (wellT < 0.72) {
          pos3d = {
            x: basePoint.x + Math.sin(p.seed * 10) * p.lateralOffset * 0.3,
            y: basePoint.y,
            z: basePoint.z
          };
          alpha = Math.min(1, wellT * 2);
        } else {
          // Dispersión y entrampamiento permanente en la roca basal
          const disp = ((wellT - 0.72) / 0.28) * p.spreadDist;
          pos3d = {
            x: basePoint.x + Math.cos(p.spreadAngle) * disp,
            y: basePoint.y + Math.sin(p.spreadAngle) * disp * 0.5,
            z: basePoint.z + Math.sin(p.spreadAngle) * disp
          };
          alpha = Math.max(0, 1 - (wellT - 0.72) / 0.28);
        }

        const proj = proyectar(pos3d);
        const r = (p.radius + 0.5) * proj.scale;

        // Partículas de CO2 supercrítico esmeralda / cian
        ctx.fillStyle = p.seed > 0.5 ? `rgba(0, 229, 255, ${alpha})` : `rgba(46, 229, 157, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(bucleRender);
  }

  bucleRender();
}
