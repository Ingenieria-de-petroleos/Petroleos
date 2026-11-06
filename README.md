# Ingeniería de Petróleos · UNAL Medellín

Sitio web oficial del programa de Ingeniería de Petróleos de la Facultad de Minas, Universidad Nacional de Colombia, Sede Medellín. Integra la paleta oficial (Azul Petróleo, Dorado/Ámbar, Negro Crudo, Verde Facultad de Minas y Gris Arena), la malla curricular completa (172 créditos), capítulos estudiantiles y grupos técnicos (SPE UNALMED, ACIPET UNAL Medellín, EAGE UNALMED, ETSG UNAL), convenios universitarios, rutas intercampus, simulador interactivo de subsuelo y guía estudiantil.

## Módulos (páginas separadas)

| Página | Contenido |
| --- | --- |
| `index.html` | Landing page oficial con el explorador interactivo del subsuelo (flujo natural, perforación direccional, recobro mejorado EOR y transición CCUS), ficha del programa (172 créditos, 10 semestres, SNIES 119, acreditación de alta calidad Res. 3970 MEN), perfil del egresado, capítulos técnicos y acceso a Drive |
| `malla.html` | Malla curricular interactiva oficial (172 créditos, prerrequisitos interactivos por colores, componentes por semestre) y catálogo completo de asignaturas con filtros por agrupación y paginación |
| `intercampus.html` | Rutas intercampus (Robledo ➔ El Volador, El Volador ➔ Robledo, Río ➔ El Volador), cálculo de próxima salida en tiempo real, guía explicativa y láminas oficiales |
| `info.html` | Información general y guía estudiantil (P.A.P.A., bolsa de créditos SIA 172+86=258, horas de corresponsabilidad, citas SIA, simulador interactivo y preguntas frecuentes) |
| `convenios.html` | Convenios de la UNAL (Coursera, MATLAB, Microsoft 365) y beneficios para estudiantes (Autodesk, GitHub, JetBrains, Spotify): lista interactiva con pasos de activación |

## Arquitectura de datos

Los datos viven en `data/` como JSON, desacoplados de la lógica de presentación:

```
data/
  programa.json          ficha del programa (172 créditos), hitos, SNIES 119 y acreditación
  perfil.json            perfil del ingeniero de petróleos egresado
  grupos.json            capítulos estudiantiles y técnicos (SPE, ACIPET, EAGE, ETSG)
  intercampus.json       rutas, franjas horarias y conexiones intercampus
  convenios/
    indice.json          tipos y ficha corta de cada convenio
    <id>.json            detalle y pasos de activación
  info.json              guía estudiantil, PAPA, bolsa (172+86), corresponsabilidad, FAQs y glosario
  malla/
    componentes.json     componentes y agrupaciones oficiales (créditos exigidos)
    plan.json            organización por semestre (códigos de asignaturas y bolsas optativas/libre)
    asignaturas.json     catálogo completo: créditos, agrupación y prerrequisitos
```

Fuente de la malla: *Programa Curricular – Ingeniería de Petróleos*, Vicedecanatura Académica, Facultad de Minas, Universidad Nacional de Colombia Sede Medellín.

## Representación Estudiantil & Créditos

- **Representantes de Carrera:** Jean Pool Sossa Pineda (Principal) – Marcela Leonel Ruiz (Suplente)
  - WhatsApp: [+57 320 948 1903](https://wa.me/573209481903)
  - Instagram: [@jeanpoluz](https://www.instagram.com/jeanpoluz/)
  - Correo institucional: `jesossa@unal.edu.co`
  - Instagram Carrera: [@petroleos_repre](https://www.instagram.com/petroleos_repre/)
  - Canal oficial WhatsApp: [Canal de Ingeniería de Petróleos](https://whatsapp.com/channel/0029VbEEsdM65yD9mq9N473a)
  - Carpeta Drive de Recursos: [Carpeta de Recursos Drive](https://drive.google.com/drive/folders/13btKaAwohCnTAlaL8fCoXcSJdNkIVobu?usp=drive_link)
- **Creación y Desarrollo Web:** Santiago Escobar Arias · Representante Estudiantil de Ingeniería de Sistemas (WhatsApp: +57 312 377 2091 · Correo: `saescobara@unal.edu.co` · Instagram: `@s_escobar__`)

## Ver el sitio en local

Los datos se piden con `fetch`, así que se recomienda servir la carpeta con un servidor local:

```bash
python -m http.server 8000
# abre http://localhost:8000
```
