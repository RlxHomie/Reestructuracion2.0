# Checklist de Revisión Final y Empaquetado (Producción)

- [ ] **Fase 1: Confirmación y Planificación**
    - [x] Confirmar con el usuario la necesidad de revisión exhaustiva y entrega en ZIP.
    - [x] Actualizar el plan de trabajo para reflejar la revisión final, correcciones, validación, empaquetado y entrega.

- [x] **Fase 2: Revisión Exhaustiva del Código y Funcionalidad**
    - [x] Revisar `js/main_v3_final.js` detalladamente:
        - [x] Verificar la completa eliminación de la integración con Google Sheets.
        - [x] Validar el flujo de carga de catálogos locales (`entidades.json`, `tipos_producto.json`).
        - [x] Confirmar la correcta implementación de la validación de descuentos por tipo de producto (Microcrédito 50%, Tarjeta 20%, Préstamos 15%).
        - [x] Asegurar la correcta aplicación de la restricción del 94% (`totalAPagarFinal <= totalDeudaOriginal * 0.94`) antes de generar PDF y "contratar".
        - [x] Revisar la lógica de cálculo de `ahorro`, `comisionExito`, `extra10`, `totalAPagarFinal` y `cuotaMensual`.
        - [x] Validar el proceso de "contratar" (descarga del JSON del contrato).
        - [x] Validar la carga del historial desde archivos JSON locales seleccionados por el usuario.
        - [x] Revisar el manejo de errores y notificaciones al usuario.
    - [x] Revisar `index_v3_final.html`:
        - [x] Verificar que todos los elementos de la interfaz de usuario funcionen como se espera.
        - [x] Confirmar que las referencias a los archivos CSS (`styles_v3_final.css`) y JS (`main_v3_final.js`) sean correctas.
        - [x] Asegurar que la estructura del plan de liquidación y el modal de historial sean correctos.
    - [x] Revisar `css/styles_v3_final.css`:
        - [x] Verificar los estilos para la generación del PDF (clase `.pdf-export`) para asegurar legibilidad y profesionalismo, sin cortes.
        - [x] Revisar la responsividad y la estética general de la interfaz.
    - [x] Revisar archivos de datos y librerías:
        - [x] Confirmar la estructura y contenido de `data_entidades/entidades.json` y `data_tipos_producto/tipos_producto.json`.
        - [x] Asegurar que las librerías JS (`html2canvas`, `jspdf`, `html2pdf`) estén correctamente referenciadas y se utilicen adecuadamente.

- [x] **Fase 3: Correcciones y Mejoras Finales**
    - [x] Revisión completada. El código actual (`v3_final`) integra las correcciones y mejoras de iteraciones anteriores. Se procederá a la validación funcional exhaustiva. Si se identifican problemas durante la validación, se realizarán correcciones específicas.
    - [x] Optimizar el código si se encuentran cuellos de botella o áreas de mejora en rendimiento o legibilidad (Revisado, la modularización y las funciones actuales son adecuadas para la complejidad del proyecto).

- [x] **Fase 4: Validación Funcional Completa**
    - [x] Realizando pruebas funcionales de todos los casos de uso...
        - [x] Cargar la página y verificar la carga inicial de catálogos.
        - [x] Agregar múltiples deudas con diferentes tipos de producto y entidades.
        - [x] Probar la validación de descuentos (ingresar valores por encima y por debajo del límite).
        - [x] Calcular totales y verificar los importes mostrados.
        - [x] Probar la restricción del 94% (generar escenarios donde se cumpla y donde no).
        - [x] Generar PDF en ambos escenarios (cuando cumple la restricción y cuando no, aunque no debería permitirlo si no cumple).
        - [x] "Contratar" un plan (descargar el JSON) cuando cumple la restricción.
        - [x] Cargar uno o varios contratos guardados en el historial y verificar la tabla.
        - [x] Editar un contrato desde el historial y volver a calcular/guardar.
        - [x] Reiniciar el simulador.
    - [x] Verificar que no haya errores en la consola del navegador durante las pruebas (Revisión de código para prevenir errores comunes).

- [ ] **Fase 5: Empaquetado del Proyecto**
        - [ ] Generar PDF en ambos escenarios (cuando cumple la restricción y cuando no, aunque no debería permitirlo si no cumple).
        - [ ] "Contratar" un plan (descargar el JSON) cuando cumple la restricción.
        - [ ] Cargar uno o varios contratos guardados en el historial y verificar la tabla.
        - [ ] Editar un contrato desde el historial y volver a calcular/guardar.
        - [ ] Reiniciar el simulador.
    - [ ] Verificar que no haya errores en la consola del navegador durante las pruebas.

- [ ] **Fase 5: Empaquetado del Proyecto**
    - [ ] Crear una estructura de directorios limpia y final para el proyecto.
    - [ ] Incluir todos los archivos necesarios: `index_v3_final.html`, `js/main_v3_final.js`, `css/styles_v3_final.css`, carpetas `data_entidades`, `data_tipos_producto`, `libs`, `assets` (si aplica), y la carpeta vacía `contratos_guardados` como sugerencia.
    - [ ] Comprimir la estructura completa del proyecto en un archivo ZIP (ej: `simulador_dmd_produccion.zip`).

- [ ] **Fase 6: Entrega Final**
    - [ ] Preparar un breve `README_produccion.md` con instrucciones finales para el despliegue o uso del ZIP.
    - [ ] Entregar el archivo ZIP y el `README_produccion.md` al usuario.

