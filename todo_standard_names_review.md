# Checklist: Revisión, Mejora y Entrega con Nombres Estándar

- [ ] **Fase 1: Confirmación y Planificación**
    - [x] Confirmar con el usuario la solicitud de revisión, mejora, renombrado a estándar y entrega en ZIP.
    - [x] Actualizar el plan de trabajo para reflejar estos pasos.
- [x] **Fase 2: Revisión Detallada de Archivos Actuales (`_v3_final`)**
    - [x] Revisar `js/main_v3_final.js`:
        - [x] Buscar posibles fallos lógicos o bugs no detectados previamente.
        - [x] Identificar áreas de mejora en claridad, eficiencia o manejo de errores.
        - [x] Confirmar que todas las funcionalidades descritas (carga local, validaciones, restricciones, PDF, historial) están robustas.
    - [x] Revisar `index_v3_final.html`:
        - [x] Verificar la estructura semántica y accesibilidad.
        - [x] Buscar posibles mejoras en la organización del contenido o la interfaz.
    - [x] Revisar `css/styles_v3_final.css`:
        - [x] Buscar posibles inconsistencias o áreas de mejora en los estilos.
        - [x] Asegurar que los estilos para PDF sean óptimos.

- [ ] **Fase 3: Correcciones y Mejoras**
    - [ ] Implementar las correcciones de fallos identificados.
    - [ ] Aplicar las mejoras propuestas para JS, HTML y CSS.
- [ ] **Fase 4: Renombrado a Nombres Estándar y Actualización de Referencias**
    - [ ] Renombrar `index_v3_final.html` a `index.html`.
    - [ ] Renombrar `js/main_v3_final.js` a `js/main.js`.
    - [ ] Renombrar `css/styles_v3_final.css` a `css/styles.css`.
    - [ ] Actualizar las referencias a `main.js` y `styles.css` dentro del nuevo `index.html`.

- [x] **Fase 5: Validación Funcional Completa (con nombres estándar)**
    - [x] Realizar pruebas funcionales exhaustivas de todos los casos de uso con la nueva estructura de nombres.
    - [x] Verificar que no haya errores en la consola del navegador.

- [ ] **Fase 6: Empaquetado del Proyecto**
    - [ ] Crear una estructura de directorios limpia y final para el proyecto con los nombres estándar.
    - [ ] Incluir todos los archivos necesarios: `index.html`, `js/main.js`, `css/styles.css`, carpetas `data_entidades`, `data_tipos_producto`, `libs`, `assets` (si el usuario los proporciona o si ya existen), y la carpeta vacía `contratos_guardados`.
    - [ ] Comprimir la estructura completa del proyecto en un archivo ZIP (ej: `simulador_dmd_estandar.zip`).

- [ ] **Fase 7: Entrega Final**
    - [ ] Preparar un `README_estandar.md` con instrucciones para el uso del ZIP con nombres estándar.
    - [ ] Entregar el archivo ZIP y el `README_estandar.md` al usuario.
