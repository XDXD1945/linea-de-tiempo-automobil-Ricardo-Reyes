# 🚗 Línea del Tiempo: La Evolución del Automóvil (1769 – 2026)

**Estudiante:** Ricardo Eleazar Reyes Améstica  
**Curso:** 1° Medio — Tecnología  
**Liceo:** Liceo Bicentenario de Excelencia Industrial Metodista  
**Profesor(a):** Javiera Ñate  

---

## 📄 Sobre el Trabajo

Este proyecto es una **línea del tiempo interactiva en formato página web** que busca resumir y analizar la evolución del automóvil. Recorre desde los primeros experimentos a vapor hasta las tecnologías más modernas como vehículos eléctricos de 800V y arquitecturas software-defined.

Pueden ver el sitio funcionando en el siguiente enlace:  
🔗 **[Ver Línea del Tiempo Web](https://xdxd1945.github.io/linea-de-tiempo-automobil-Ricardo-Reyes/)**

---

## 🛠️ ¿Cómo hice el proyecto?

### 1. ¿Por qué lo programé en HTML/CSS/JS y no usé Canva?
La verdad es que **no sé usar Canva** (las plantillas no se me dan muy bien), pero la **programación sí se me da bastante bien**. Como el fin de semana estaba algo aburrido y ya había terminado mis otras tareas, decidí hacerlo "en serio" usando código. Total, ¿por qué no?

### 2. Uso de IAs para recopilar y revisar información
Para armar el contenido sin pasar días recopilando datos manualmente, organicé un flujo con varias IAs:

1. **Búsqueda de datos:** Programé consultas automatizadas con un grupo de IAs para reunir referencias sobre cada auto (motores, velocidades aprox., fechas, materiales e hitos generales).
2. **Armado de la página:** Con esa información estructuré el código y dejé listas las fichas desplegables y las imágenes.
3. **Revisión general:** Al terminar, le pasé el proyecto a otro grupo de IAs para verificar que la información fuera coherente.

> *Nota sobre la información:* La historia de la tecnología suele tener distintas versiones según la fuente (por ejemplo, fechas exactas de patentes, cifras de potencia o atribuciones de invenciones). El objetivo aquí es dar una visión general y educativa, no ser enciclopedia definitiva.

---

## 📊 ¿Qué tiene la página?

* **15 momentos relevantes:** Muestra algunos de los avances más conocidos e importantes en la historia del automóvil.
* **Fichas desplegables:** Se puede hacer clic en las tarjetas para abrir más detalles sobre el funcionamiento de cada vehículo.
* **Filtros por categoría:** Permite filtrar por tipo de motor, seguridad, producción o tecnología.
* **Diseño adaptable:** Funciona tanto en celulares como en computadores.

---

## 💻 Herramientas utilizadas

* **HTML5:** Para la estructura de las tarjetas y los textos.
* **CSS3:** Para el diseño visual, los colores y los estilos.
* **JavaScript:** Para manejar los clics, los filtros y las fichas interactivas.
* **GitHub Pages:** Para publicar la página en internet de forma gratuita.

---

---

# 📖 GUÍA TÉCNICA DEL PROYECTO

## 🏗️ Estructura de Carpetas

```
linea-de-tiempo-automobil-Ricardo-Reyes/
├── index.html          # Página principal
├── styles.css          # Estilos globales
├── script.js           # Lógica interactiva
├── assets/
│   └── images/         # Imágenes de los autos (PNG/JPG)
├── README.md           # Este archivo
└── .github/
    └── workflows/      # CI/CD (si aplica)
```

---

## 📝 Estructura HTML: Cómo están organizadas las fichas

Cada **hito histórico** es una tarjeta con esta estructura base en `index.html`:

```html
<div class="timeline-item" data-category="motor-tipo" data-year="1886">
  <div class="card">
    <div class="card-header">
      <h3>1886 — Benz Patent Motorwagen</h3>
      <span class="year">1886</span>
    </div>
    
    <div class="card-content">
      <!-- Imagen del vehículo -->
      <img src="assets/images/benz-1886.jpg" alt="Benz Patent Motorwagen" class="card-image">
      
      <!-- Información técnica -->
      <div class="tech-specs">
        <p><strong>Motor:</strong> Monocilíndrico de 0.9L, 4-tiempos</p>
        <p><strong>Potencia:</strong> 0.75 CV (0.55 kW)</p>
        <p><strong>Velocidad:</strong> 16 km/h</p>
        <p><strong>Combustible:</strong> Gasolina</p>
      </div>
      
      <!-- Descripción expandible -->
      <div class="card-description">
        <p>Primer automóvil propulsado por motor de combustión interna...</p>
      </div>
    </div>
    
    <div class="card-footer">
      <button class="expand-btn">Más información</button>
    </div>
  </div>
</div>
```

**Atributos importantes:**
- `data-category`: Determina el filtro (ej: "propulsion-vapor", "electrico", "seguridad", etc.)
- `data-year`: Año del hito (usado para ordenar cronológicamente)

---

## 🎨 Estructura CSS: Cómo funcionan los estilos

Los estilos se organizan en **secciones lógicas** dentro de `styles.css`:

```css
/* 1. VARIABLES GLOBALES */
:root {
  --primary-color: #1a1a1a;
  --accent-color: #ff6b6b;
  --spacing: 1rem;
  --transition: all 0.3s ease;
}

/* 2. RESET Y BASE */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }

/* 3. LAYOUT PRINCIPAL */
.timeline-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }

/* 4. ESTILOS DE TARJETAS */
.card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: var(--transition); }
.card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }

/* 5. FILTROS Y CONTROLES */
.filter-btn { padding: 8px 16px; border: 1px solid var(--accent-color); background: transparent; }
.filter-btn.active { background: var(--accent-color); color: white; }

/* 6. RESPONSIVE */
@media (max-width: 768px) { .timeline-container { grid-template-columns: 1fr; } }
```

**Para agregar nuevos estilos:**
- Mantener variables CSS en `:root` para consistencia
- Usar clases descriptivas (ej: `.card-header`, `.tech-specs`)
- Siempre incluir versión mobile con `@media`

---

## ⚙️ JavaScript: Cómo funcionan los filtros e interactividad

El archivo `script.js` maneja la lógica interactiva:

### 1. **Sistema de Filtros**

```javascript
// Obtener todos los botones de filtro
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

// Al hacer clic en un filtro
filterButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const category = this.dataset.category;
    
    // Activar/desactivar botón
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Mostrar/ocultar tarjetas según categoría
    timelineItems.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
```

### 2. **Sistema de Fichas Desplegables**

```javascript
// Obtener todos los botones "Más información"
const expandButtons = document.querySelectorAll('.expand-btn');

expandButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.card');
    const description = card.querySelector('.card-description');
    
    // Alternar visibilidad
    description.classList.toggle('expanded');
    
    // Cambiar texto del botón
    this.textContent = description.classList.contains('expanded') 
      ? 'Ocultar' 
      : 'Más información';
  });
});
```

### 3. **Animación de Canvas de Fondo (si existe)**

```javascript
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Animar elementos en el fondo
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Lógica de animación aquí
  requestAnimationFrame(animate);
}

animate();

// Redimensionar canvas al cambiar ventana
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
```

---

## 🚀 CÓMO AGREGAR UN NUEVO HITO HISTÓRICO

### Paso 1: Preparar la imagen
Descarga o crea una imagen del vehículo y guárdala en `assets/images/` con un nombre descriptivo:
```
assets/images/tesla-model-s-2012.jpg
```

### Paso 2: Agregar el HTML en `index.html`
Busca la sección `<div class="timeline-container">` y añade una nueva tarjeta al final (o en orden cronológico):

```html
<div class="timeline-item" data-category="electrico" data-year="2012">
  <div class="card">
    <div class="card-header">
      <h3>2012 — Tesla Model S</h3>
      <span class="year">2012</span>
    </div>
    
    <div class="card-content">
      <img src="assets/images/tesla-model-s-2012.jpg" alt="Tesla Model S" class="card-image">
      
      <div class="tech-specs">
        <p><strong>Motor:</strong> Eléctrico AC 3-fase</p>
        <p><strong>Potencia:</strong> 416 CV</p>
        <p><strong>Batería:</strong> 75 kWh</p>
        <p><strong>Autonomía:</strong> 500 km (WLTP)</p>
      </div>
      
      <div class="card-description">
        <p>El Tesla Model S revolucionó el mercado de vehículos eléctricos de lujo. Fue el primer EV premium con autonomía superior a 400 km en un ciclo real...</p>
      </div>
    </div>
    
    <div class="card-footer">
      <button class="expand-btn">Más información</button>
    </div>
  </div>
</div>
```

### Paso 3: Asegúrate de que la categoría exista en los filtros
En `index.html`, busca los botones de filtro (`<div class="filters">`):

```html
<button class="filter-btn" data-category="all">Todos</button>
<button class="filter-btn" data-category="electrico">Eléctricos</button>
<button class="filter-btn" data-category="motor-combustion">Motor Combustión</button>
<!-- Agrega más si lo necesitas -->
```

### Paso 4: Verifica en local
Abre el proyecto en tu navegador (o usa Live Server en VS Code) y verifica que:
- ✅ La imagen se ve correctamente
- ✅ El texto se expande al hacer clic
- ✅ El filtro funciona
- ✅ El año está en el orden correcto

### Paso 5: Sube los cambios a GitHub
```bash
git add .
git commit -m "Agregar nuevo hito: Tesla Model S 2012"
git push origin main
```

GitHub Pages se actualizará automáticamente en unos segundos.

---

## 🔧 Estructura de Datos Recomendada para Nuevos Hitos

Cuando agregues un hito, mantén esta información estructurada:

```json
{
  "year": 2012,
  "name": "Tesla Model S",
  "category": "electrico",
  "image": "assets/images/tesla-model-s-2012.jpg",
  "specifications": {
    "motor": "Eléctrico AC 3-fase",
    "potencia": "416 CV",
    "velocidad_maxima": "225 km/h",
    "bateria": "75 kWh",
    "autonomia": "500 km"
  },
  "descripcion": "El Tesla Model S revolucionó el mercado de vehículos eléctricos de lujo..."
}
```

---

## 🐛 Solución de Problemas Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| Las imágenes no aparecen | Ruta incorrecta | Verifica que `src="assets/images/archivo.jpg"` exista |
| Los filtros no funcionan | Atributo `data-category` no coincide | Asegúrate que el `data-category` de la tarjeta coincida con el del botón |
| La página se ve rota en móvil | CSS responsive no funciona | Revisa que haya media queries para `@media (max-width: 768px)` |
| Los cambios no se ven en GitHub Pages | Caché del navegador | Recarga con `Ctrl+Shift+R` o borra caché |

---

## 📚 Recursos Útiles

- [MDN Web Docs: HTML](https://developer.mozilla.org/es/docs/Web/HTML)
- [MDN Web Docs: CSS](https://developer.mozilla.org/es/docs/Web/CSS)
- [MDN Web Docs: JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [GitHub Pages Docs](https://pages.github.com/)
- [Documentación de Canvas API](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)

---

*Trabajo realizado para la asignatura de Tecnología.*
