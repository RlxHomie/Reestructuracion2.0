# Instrucciones para el Despliegue/Uso del Simulador (Nombres Estándar)

Este archivo ZIP (`simulador_dmd_estandar.zip`) contiene la versión final y verificada del Simulador de Reestructuración de Deudas, utilizando nombres de archivo estándar y lista para su uso o despliegue.

## Contenido del ZIP:

Al descomprimir el archivo, encontrarás la siguiente estructura de carpetas y archivos:

```
/
|-- index.html                 (Archivo principal para abrir en el navegador)
|-- css/
|   |-- styles.css             (Hoja de estilos principal)
|-- js/
|   |-- main.js                (Lógica principal de la aplicación)
|-- data_entidades/
|   |-- entidades.json         (Listado de entidades financieras)
|-- data_tipos_producto/
|   |-- tipos_producto.json    (Listado de tipos de producto)
|-- libs/                        (Librerías JavaScript externas)
|   |-- html2canvas.min.js
|   |-- jspdf.umd.min.js
|   |-- html2pdf.bundle.min.js
|-- assets/                      (Recursos gráficos)
|   |-- DMD-LOGO.png           (Logo de la empresa - *asegúrate de tenerlo aquí*)
|   |-- favicon.png            (Favicon - *asegúrate de tenerlo aquí*)
|-- contratos_guardados/         (Carpeta para almacenar los JSON de contratos generados)
|-- README_estandar.md         (Este archivo de instrucciones)
|-- todo_standard_names_review.md (Checklist de la revisión final con nombres estándar)
```

## Instrucciones de Uso/Despliegue:

1.  **Descomprimir:** Extrae el contenido del archivo `simulador_dmd_estandar.zip` en la ubicación deseada de tu servidor web o en una carpeta local si lo vas a usar directamente desde el sistema de archivos.

2.  **Verificar Assets:**
    *   Asegúrate de que los archivos `DMD-LOGO.png` y `favicon.png` estén presentes en la carpeta `assets/`. Si no lo están, por favor, cópialos allí desde tu repositorio original o desde donde los tengas almacenados. El simulador los buscará en esa ruta.

3.  **Uso Local (sin servidor web):**
    *   Simplemente abre el archivo `index.html` en un navegador web moderno (Chrome, Firefox, Edge, Safari).
    *   La aplicación cargará los datos desde los archivos JSON locales (`entidades.json`, `tipos_producto.json`).
    *   Cuando "contrates" un plan (Guardar Contrato JSON), se generará un archivo JSON que deberás guardar manualmente. Te recomendamos guardarlo dentro de la carpeta `contratos_guardados/` para mantener un orden y poder usar la función de "Ver Historial" para cargarlos posteriormente.

4.  **Despliegue en un Servidor Web (Recomendado para producción):**
    *   Sube toda la estructura de carpetas y archivos descomprimida al directorio raíz de tu sitio web o a una subcarpeta específica.
    *   Accede al simulador a través de la URL correspondiente (ej: `http://tuservidor.com/simulador/index.html`).
    *   El funcionamiento será el mismo que en local respecto a la carga de datos y guardado de contratos (el usuario descargará el JSON y deberá gestionarlo).

## Puntos Importantes:

*   **Datos de Catálogos:** Si necesitas actualizar las entidades financieras o los tipos de producto, simplemente edita los archivos `data_entidades/entidades.json` y `data_tipos_producto/tipos_producto.json` respectivamente. La aplicación los leerá al cargar.
*   **Contratos Guardados:** La carpeta `contratos_guardados/` se proporciona como una sugerencia de organización. La aplicación permite al usuario seleccionar archivos JSON de contratos desde cualquier ubicación de su sistema para cargarlos en el historial.
*   **Navegadores:** Se recomienda el uso de navegadores modernos para una compatibilidad óptima.

Si tienes alguna pregunta o necesitas asistencia adicional durante el despliegue, no dudes en consultar.

