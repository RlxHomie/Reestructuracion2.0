// utils.js (módulo de utilidades)
//////////////////////////////////////////

// Función de debounce
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Notificaciones mejoradas
function mostrarNotificacion(mensaje, tipo = "info") {
  const notificacionesAnteriores = document.querySelectorAll(".notificacion");
  notificacionesAnteriores.forEach(notif => {
    notif.classList.add("fadeOut");
    setTimeout(() => notif.remove(), 500);
  });

  const notif = document.createElement("div");
  notif.className = `notificacion ${tipo}`;
  notif.textContent = mensaje;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.transform = "translateY(0)";
    notif.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    notif.classList.add("fadeOut");
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}

// Confirmar acciones críticas
function confirmarAccion(mensaje, accionSi) {
  if (confirm(mensaje)) {
    accionSi();
  }
}

// Validación robusta de inputs numéricos
function validarInputNumerico(input, min = 0, max = Infinity, customMessage = null) {
  const valor = parseFloat(input.value);
  if (isNaN(valor) || valor < min || valor > max) {
    input.classList.add("error");
    const message = customMessage || `Valor inválido. Debe estar entre ${min} y ${max}.`;
    mostrarNotificacion(message, "error");
    // input.value = input.defaultValue || min; // No auto-corregir, dejar que el usuario lo haga
    setTimeout(() => input.classList.remove("error"), 1200);
    return false;
  }
  input.classList.remove("error");
  return true;
}

// Función para formatear números como moneda
function formatoMoneda(numero) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
}

// Función para mostrar/ocultar el indicador de carga
function toggleCargando(mostrar, mensaje = "Procesando...") {
  const indicador = document.getElementById("indicadorCarga");
  const mensajeCarga = document.getElementById("mensajeCarga");
  
  if (mostrar) {
    mensajeCarga.textContent = mensaje;
    indicador.style.display = "flex";
  } else {
    indicador.style.display = "none";
  }
}

//////////////////////////////////////////
// DataModule (Gestión de datos locales)
//////////////////////////////////////////
const DataModule = (function() {
  const LOCAL_ENTIDADES_PATH = "data_entidades/entidades.json";
  const LOCAL_TIPOS_PRODUCTO_PATH = "data_tipos_producto/tipos_producto.json";
  // Directorio conceptual para contratos guardados, el usuario gestionará los archivos aquí
  const LOCAL_CONTRATOS_DIR = "contratos_guardados/"; 

  let entidades = [];
  let tiposProducto = [];
  let datosCargados = false;
  let historialContratosEnMemoria = []; // Para el historial de la sesión actual

  // Límites de descuento por tipo de producto
  const limitesDescuento = {
    "Microcrédito": 50,
    "Tarjeta de Crédito": 20,
    "Préstamo Personal": 15,
    "Hipoteca": 15,
    "Línea de Crédito": 15,
    "Crédito al Consumo": 15,
    "Préstamo Rápido": 15,
    "Financiación de Vehículo": 15
    // Añadir otros tipos de producto con sus límites si es necesario
  };

  async function cargarCatalogosLocales() {
    toggleCargando(true, "Cargando catálogos locales...");
    try {
      const [entidadesResponse, tiposProductoResponse] = await Promise.all([
        fetch(LOCAL_ENTIDADES_PATH),
        fetch(LOCAL_TIPOS_PRODUCTO_PATH)
      ]);

      if (!entidadesResponse.ok) {
        throw new Error(`Error al cargar entidades: ${entidadesResponse.statusText} (ruta: ${LOCAL_ENTIDADES_PATH})`);
      }
      if (!tiposProductoResponse.ok) {
        throw new Error(`Error al cargar tipos de producto: ${tiposProductoResponse.statusText} (ruta: ${LOCAL_TIPOS_PRODUCTO_PATH})`);
      }

      entidades = await entidadesResponse.json();
      tiposProducto = await tiposProductoResponse.json();
      datosCargados = true;
      mostrarNotificacion("Catálogos locales cargados correctamente.", "success");
    } catch (error) {
      console.error("Error al cargar catálogos locales:", error);
      mostrarNotificacion(`Error al cargar catálogos: ${error.message}. Asegúrate de que los archivos existen en las rutas correctas.`, "error");
      // Usar valores por defecto o vacíos si falla la carga
      entidades = ["Error al cargar entidades"];
      tiposProducto = ["Error al cargar tipos"];
      datosCargados = false;
    }
    toggleCargando(false);
    return { entidades, tiposProducto };
  }

  function obtenerLimiteDescuento(tipoProducto) {
    return limitesDescuento[tipoProducto] !== undefined ? limitesDescuento[tipoProducto] : 100; // Default 100 si no está definido
  }
  
  // Funciones para manejar el historial en memoria (cargado por el usuario)
  function setHistorialEnMemoria(contratos) {
    historialContratosEnMemoria = contratos;
  }

  function getHistorialEnMemoria() {
    return historialContratosEnMemoria;
  }

  function getContratoDelHistorialEnMemoria(folio) {
    return historialContratosEnMemoria.find(c => c.folio === folio);
  }

  function agregarContratoAlHistorialEnMemoria(contrato) {
    // Evitar duplicados si se carga varias veces
    const existente = historialContratosEnMemoria.findIndex(c => c.folio === contrato.folio);
    if (existente !== -1) {
      historialContratosEnMemoria[existente] = contrato; // Actualizar si ya existe
    } else {
      historialContratosEnMemoria.push(contrato);
    }
  }

  return {
    cargarCatalogosLocales,
    getEntidades: () => entidades,
    getTiposProducto: () => tiposProducto,
    isDatosCargados: () => datosCargados,
    obtenerLimiteDescuento,
    setHistorialEnMemoria,
    getHistorialEnMemoria,
    getContratoDelHistorialEnMemoria,
    agregarContratoAlHistorialEnMemoria,
    LOCAL_CONTRATOS_DIR // Exponer para mensajes al usuario
  };
})();

//////////////////////////////////////////
// SimuladorModule
//////////////////////////////////////////
const SimuladorModule = (function() {
  const btnAgregarFila = document.getElementById("btnAgregarFila");
  const btnCalcular = document.getElementById("btnCalcular");
  const btnReAnalizar = document.getElementById("btnReAnalizar");
  const tablaDeudas = document.getElementById("tablaDeudas");
  const nombreDeudorInput = document.getElementById("nombreDeudor");
  const numCuotasInput = document.getElementById("numCuotas");
  const resultadoFinal = document.getElementById("resultadoFinal");
  const resultadoTotalAPagarElement = document.getElementById("resultadoTotalAPagar");
  
  let contadorFilas = 0;
  let resultadoCalculado = null;
  let folioEditando = null; // Folio del contrato que se está editando

  function inicializar() {
    btnAgregarFila.addEventListener("click", function() {
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 200);
      agregarFila();
    });
    
    btnCalcular.addEventListener("click", function() {
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 200);
      calcularTotales();
    });
    
    btnReAnalizar.addEventListener("click", function() {
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 200);
      reAnalizar();
    });
    
    document.getElementById("btnExportarJSON").addEventListener("click", function() {
        this.classList.add("clicked");
        setTimeout(() => this.classList.remove("clicked"), 200);
        exportarContratoJSON();
    });

    document.getElementById("btnDescargarPlan").addEventListener("click", function() {
      if (!resultadoCalculado) {
          mostrarNotificacion("Primero calcula un plan para poder descargarlo.", "warning");
          return;
      }
      if (!validarRestriccion94()) return;
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 200);
      generarPDF();
    });

    document.getElementById("btnContratar").addEventListener("click", function() {
      if (!resultadoCalculado) {
          mostrarNotificacion("Primero calcula un plan para poder contratarlo.", "warning");
          return;
      }
      if (!validarRestriccion94()) return;
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 200);
      confirmarAccion(folioEditando ? "¿Confirmas la actualización de este contrato? El archivo original deberá ser reemplazado manualmente." : "¿Estás seguro de que quieres contratar este plan? Se generará un archivo JSON para guardar.", () => {
          contratarPlanLocal();
      });
    });

    const btnMostrarHistorial = document.getElementById("btnMostrarHistorial");
    btnMostrarHistorial.addEventListener("click", () => {
      cargarHistorialDesdeArchivos();
    });

    const btnCerrarHistorial = document.getElementById("btnCerrarHistorial");
    btnCerrarHistorial.addEventListener("click", () => {
      document.getElementById("historialContainer").style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target == document.getElementById("historialContainer")) {
        document.getElementById("historialContainer").style.display = "none";
      }
    });

    agregarFila();
    
    DataModule.cargarCatalogosLocales()
      .then(() => {
        actualizarSelectoresEnFilas();
      })
      .catch(error => {
        console.error("Error al inicializar catálogos:", error);
        actualizarSelectoresEnFilas(); // Intentar actualizar con lo que haya
      });
  }
  
  function actualizarSelectoresEnFilas() {
    const filas = tablaDeudas.querySelectorAll("tr");
    filas.forEach(fila => {
      const selectorTipoProducto = fila.querySelector(".selector-tipo-producto");
      const selectorEntidad = fila.querySelector(".selector-entidad");
      
      if (selectorTipoProducto) {
        actualizarSelector(selectorTipoProducto, DataModule.getTiposProducto());
      }
      if (selectorEntidad) {
        actualizarSelector(selectorEntidad, DataModule.getEntidades());
      }
    });
  }
  
  function actualizarSelector(selector, opciones) {
    const valorActual = selector.value;
    selector.innerHTML = "";
    const opcionDefecto = document.createElement("option");
    opcionDefecto.value = "";
    opcionDefecto.textContent = "Seleccionar...";
    selector.appendChild(opcionDefecto);
    
    (opciones || []).forEach(opcion => {
      const nuevaOpcion = document.createElement("option");
      nuevaOpcion.value = opcion;
      nuevaOpcion.textContent = opcion;
      selector.appendChild(nuevaOpcion);
    });
    selector.value = valorActual;
  }

  function agregarFila(datosFila = {}) {
    contadorFilas++;
    const nuevaFila = tablaDeudas.insertRow();
    nuevaFila.id = `fila-${contadorFilas}`;

    const celdasInfo = [
        { placeholder: "Número de Contrato", tipo: "text", clase: "input-contrato", valor: datosFila.numeroContrato || "" },
        { tipo: "select", clase: "selector-tipo-producto", opciones: DataModule.getTiposProducto(), valor: datosFila.tipoProducto || "" },
        { tipo: "select", clase: "selector-entidad", opciones: DataModule.getEntidades(), valor: datosFila.entidad || "" },
        { placeholder: "0.00", tipo: "number", clase: "input-importe", valor: datosFila.importeDeuda || "", step: "0.01" },
        { placeholder: "0", tipo: "number", clase: "input-descuento", valor: datosFila.porcentajeDescuento || "", min: "0", max: "100" }, // Max se validará dinámicamente
        { tipo: "text", clase: "input-importe-descuento", valor: datosFila.importeConDescuento ? formatoMoneda(datosFila.importeConDescuento).replace(/[^0-9.,-]+/g, "").replace(".", "").replace(",", ".") : "0.00", readonly: true },
    ];

    celdasInfo.forEach(info => {
        const celda = nuevaFila.insertCell();
        if (info.tipo === "select") {
            const select = document.createElement("select");
            select.className = info.clase;
            actualizarSelector(select, info.opciones);
            select.value = info.valor;
            if (info.clase === "selector-tipo-producto") {
                select.addEventListener("change", () => validarDescuentoParaFila(nuevaFila));
            }
            celda.appendChild(select);
        } else {
            const input = document.createElement("input");
            input.type = info.tipo;
            input.placeholder = info.placeholder;
            input.className = info.clase;
            input.value = info.valor;
            if (info.readonly) input.readOnly = true;
            if (info.step) input.step = info.step;
            // No establecer min/max para descuento aquí, se hará dinámicamente
            if (info.clase === "input-descuento") {
                input.addEventListener("input", () => validarDescuentoParaFila(nuevaFila));
            }
            celda.appendChild(input);
        }
    });

    const celdaAccion = nuevaFila.insertCell();
    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>`;
    btnEliminar.className = "btn-eliminar";
    btnEliminar.onclick = () => eliminarFila(nuevaFila.id);
    celdaAccion.appendChild(btnEliminar);

    if (DataModule.isDatosCargados()) {
        actualizarSelector(nuevaFila.querySelector(".selector-tipo-producto"), DataModule.getTiposProducto());
        actualizarSelector(nuevaFila.querySelector(".selector-entidad"), DataModule.getEntidades());
        if(datosFila.tipoProducto) nuevaFila.querySelector(".selector-tipo-producto").value = datosFila.tipoProducto;
        if(datosFila.entidad) nuevaFila.querySelector(".selector-entidad").value = datosFila.entidad;
    }
    validarDescuentoParaFila(nuevaFila); // Validar al agregar
    if (resultadoCalculado) calcularTotales(); 
  }

  function validarDescuentoParaFila(fila) {
    const tipoProductoSelect = fila.querySelector(".selector-tipo-producto");
    const descuentoInput = fila.querySelector(".input-descuento");
    if (!tipoProductoSelect || !descuentoInput) return true;

    const tipoProducto = tipoProductoSelect.value;
    const limite = DataModule.obtenerLimiteDescuento(tipoProducto);
    
    descuentoInput.max = limite; // Actualizar el atributo max para referencia visual si es útil
    return validarInputNumerico(descuentoInput, 0, limite, `El descuento para ${tipoProducto || 'este producto'} no puede exceder ${limite}%.`);
  }

  function eliminarFila(idFila) {
    confirmarAccion("¿Seguro que quieres eliminar esta deuda?", () => {
      const fila = document.getElementById(idFila);
      if (fila) {
        fila.remove();
        mostrarNotificacion("Deuda eliminada", "info");
        if (tablaDeudas.rows.length === 0) agregarFila();
        if (resultadoCalculado) calcularTotales();
      }
    });
  }

  function calcularTotales() {
    let totalDeudaOriginal = 0;
    let totalDeudaConDescuento = 0;
    const detallesDeudas = [];

    if (!nombreDeudorInput.value.trim()) {
        mostrarNotificacion("Por favor, ingresa el nombre del cliente.", "error");
        nombreDeudorInput.focus();
        return;
    }

    const filas = tablaDeudas.rows;
    if (filas.length === 0) {
        mostrarNotificacion("No hay deudas para calcular.", "warning");
        return;
    }

    let datosValidos = true;
    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const numeroContrato = fila.cells[0].querySelector("input").value.trim();
        const tipoProducto = fila.cells[1].querySelector("select").value;
        const entidad = fila.cells[2].querySelector("select").value;
        const importeDeudaInput = fila.cells[3].querySelector("input");
        const porcentajeDescuentoInput = fila.cells[4].querySelector("input");
        const importeConDescuentoOutput = fila.cells[5].querySelector("input");

        if (!validarInputNumerico(importeDeudaInput, 0.01) || !validarDescuentoParaFila(fila)) {
            datosValidos = false;
            continue; 
        }
        if (!numeroContrato || !tipoProducto || !entidad) {
            mostrarNotificacion("Completa todos los campos de cada deuda (Contrato, Tipo, Entidad).", "error");
            datosValidos = false;
            continue;
        }

        const importeDeuda = parseFloat(importeDeudaInput.value);
        const porcentajeDescuento = parseFloat(porcentajeDescuentoInput.value);
        const importeDescuentoCalculado = importeDeuda * (1 - porcentajeDescuento / 100);
        
        importeConDescuentoOutput.value = formatoMoneda(importeDescuentoCalculado).replace(/[^0-9.,-]+/g, "").replace(".", "").replace(",", ".");

        totalDeudaOriginal += importeDeuda;
        totalDeudaConDescuento += importeDescuentoCalculado;

        detallesDeudas.push({
            numeroContrato,
            tipoProducto,
            entidad,
            importeDeuda,
            porcentajeDescuento,
            importeConDescuento: importeDescuentoCalculado
        });
    }

    if (!datosValidos) {
        mostrarNotificacion("Corrige los errores en los campos marcados antes de calcular.", "error");
        resultadoFinal.style.display = "none";
        document.getElementById("planContainerOuter").style.display = "none";
        return;
    }

    if (detallesDeudas.length === 0) {
        mostrarNotificacion("No hay deudas válidas para calcular.", "warning");
        resultadoFinal.style.display = "none";
        document.getElementById("planContainerOuter").style.display = "none";
        return;
    }

    const ahorroCalculado = totalDeudaOriginal - totalDeudaConDescuento;
    const comisionExito = 0.20 * ahorroCalculado + 0.21 * (0.20 * ahorroCalculado);
    const extra10 = 0.10 * totalDeudaOriginal + 0.21 * (0.10 * totalDeudaOriginal);
    const totalAPagarFinal = totalDeudaConDescuento + comisionExito + extra10;
    
    const numCuotas = parseInt(numCuotasInput.value);
    const cuotaMensualFinal = totalAPagarFinal / numCuotas;
    const porcentajeAhorroSobreOriginal = totalDeudaOriginal > 0 ? (ahorroCalculado / totalDeudaOriginal) * 100 : 0;

    resultadoTotalAPagarElement.textContent = `Total a Pagar (con comisiones): ${formatoMoneda(totalAPagarFinal)}`;
    resultadoFinal.style.display = "block";

    resultadoCalculado = {
        nombreDeudor: nombreDeudorInput.value.trim(),
        numCuotas,
        totalDeudaOriginal,
        totalDeudaConDescuento,
        ahorroCalculado,
        porcentajeAhorroSobreOriginal,
        comisionExito,
        extra10,
        totalAPagarFinal,
        cuotaMensualFinal,
        detalles: detallesDeudas,
        folio: folioEditando || `FOLIO-${Date.now()}`,
        fecha: new Date().toLocaleDateString("es-ES")
    };

    mostrarPlanLiquidacion(resultadoCalculado);
    mostrarNotificacion("Cálculo completado. Revisa el plan de liquidación.", "success");
    if (!validarRestriccion94()) {
        mostrarNotificacion("ATENCIÓN: El plan actual NO CUMPLE la restricción del 94% y no podrá ser contratado.", "warning");
    }
  }

  function mostrarPlanLiquidacion(datos) {
    document.getElementById("plan-nombre-deudor").textContent = datos.nombreDeudor;
    document.getElementById("plan-num-deudas").textContent = datos.detalles.length;
    document.getElementById("plan-deuda-total").textContent = formatoMoneda(datos.totalDeudaOriginal);
    document.getElementById("plan-folio").textContent = datos.folio;
    document.getElementById("plan-fecha").textContent = datos.fecha;

    document.getElementById("plan-lo-que-debes").textContent = formatoMoneda(datos.totalDeudaOriginal);
    document.getElementById("plan-lo-que-pagarias").textContent = formatoMoneda(datos.totalAPagarFinal);
    document.getElementById("plan-ahorro").textContent = `${formatoMoneda(datos.ahorroCalculado)} (${datos.porcentajeAhorroSobreOriginal.toFixed(2)}%)`;

    document.getElementById("plan-duracion").textContent = `${datos.numCuotas} meses`;
    document.getElementById("plan-cuota-mensual").textContent = formatoMoneda(datos.cuotaMensualFinal);
    document.getElementById("plan-descuento-total").textContent = `${datos.porcentajeAhorroSobreOriginal.toFixed(2)}%`;

    const tablaBody = document.getElementById("plan-tabla-body");
    tablaBody.innerHTML = "";
    datos.detalles.forEach(deuda => {
        const fila = tablaBody.insertRow();
        fila.insertCell().textContent = deuda.entidad;
        fila.insertCell().textContent = formatoMoneda(deuda.importeDeuda);
        fila.insertCell().textContent = formatoMoneda(deuda.importeConDescuento);
    });

    actualizarGrafico(datos.totalDeudaConDescuento, datos.ahorroCalculado);
    document.getElementById("planContainerOuter").style.display = "block";
    document.getElementById("btnEditarContrato").style.display = folioEditando ? "inline-flex" : "none";
    document.getElementById("btnContratar").textContent = folioEditando ? "Actualizar Contrato" : "Contratar Plan";

    document.getElementById("planContainerOuter").scrollIntoView({ behavior: "smooth" });
  }

  let myChart = null;
  function actualizarGrafico(pagarias, ahorras) {
    const ctx = document.getElementById("myChart").getContext("2d");
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Lo que pagarías (sin comisiones)", "Te ahorras"],
            datasets: [{
                label: "Resumen de Deuda",
                data: [pagarias, ahorras],
                backgroundColor: ["#0071e3", "#34c759"],
                borderColor: ["#FFFFFF", "#FFFFFF"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || "";
                            if (label) { label += ": "; }
                            if (context.parsed !== null) { label += formatoMoneda(context.parsed); }
                            return label;
                        }
                    }
                }
            }
        }
    });
  }

  function reAnalizar() {
    confirmarAccion("¿Seguro que quieres reiniciar el simulador? Se perderán los datos no guardados.", () => {
        reAnalizarSinConfirmacion();
        mostrarNotificacion("Simulador reiniciado.", "info");
    });
  }
  
  function reAnalizarSinConfirmacion() {
    nombreDeudorInput.value = "";
    numCuotasInput.value = "12";
    tablaDeudas.innerHTML = "";
    contadorFilas = 0;
    agregarFila();
    resultadoFinal.style.display = "none";
    document.getElementById("planContainerOuter").style.display = "none";
    resultadoCalculado = null;
    folioEditando = null;
    document.getElementById("btnEditarContrato").style.display = "none";
    document.getElementById("btnContratar").textContent = "Contratar Plan";
    nombreDeudorInput.focus();
  }

  function validarRestriccion94() {
    if (!resultadoCalculado) return true; // No hay nada que validar si no hay cálculo
    const { totalAPagarFinal, totalDeudaOriginal } = resultadoCalculado;
    // La restricción es: totalAPagarFinal DEBE SER MENOR O IGUAL A totalDeudaOriginal * 0.94
    if (totalAPagarFinal > (totalDeudaOriginal * 0.94)) {
        mostrarNotificacion("RESTRICCIÓN NO CUMPLIDA: El total a pagar (con comisiones) excede el 94% de la deuda original. No se puede contratar.", "error");
        return false;
    }
    return true;
  }

  function descargarJSON(data, filename) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        mostrarNotificacion("Error al generar JSON para descarga: " + error.message, "error");
        console.error("Error al generar JSON:", error);
        return false;
    }
  }

  function exportarContratoJSON() {
    if (!resultadoCalculado) {
        mostrarNotificacion("Primero calcula un plan para poder exportarlo.", "warning");
        return;
    }
    // No aplicar restricción del 94% para simple exportación, solo para contratar/PDF.
    // if (!validarRestriccion94()) return; 

    if(descargarJSON(resultadoCalculado, `contrato_${resultadoCalculado.folio}.json`)){
        mostrarNotificacion("Contrato exportado como JSON. Guárdalo en la carpeta '" + DataModule.LOCAL_CONTRATOS_DIR + "'.", "success");
    }
  }
  
  function contratarPlanLocal() {
    if (!resultadoCalculado) return; // Ya validado antes de llamar
    if (!validarRestriccion94()) return; // Doble chequeo crucial

    toggleCargando(true, folioEditando ? "Actualizando datos del contrato..." : "Procesando contratación local...");
    
    const nombreArchivo = `contrato_${resultadoCalculado.folio}.json`;
    if (descargarJSON(resultadoCalculado, nombreArchivo)) {
        DataModule.agregarContratoAlHistorialEnMemoria(resultadoCalculado); // Actualizar historial en memoria
        mostrarNotificacion(
            `¡Plan ${folioEditando ? 'actualizado' : 'contratado'} con éxito! El archivo '${nombreArchivo}' ha sido preparado para descarga. ` +
            `Por favor, guárdalo en la carpeta '${DataModule.LOCAL_CONTRATOS_DIR}' de tu repositorio. ` +
            `Si estás actualizando, reemplaza el archivo existente.`, 
            "success",
            10000 // Notificación más larga
        );
        if (folioEditando) {
            // Podrías querer recargar el historial si se actualiza un archivo
        } else {
            // Si es nuevo, podría limpiarse el formulario o no, según preferencia
        }
    } else {
      mostrarNotificacion("Error al preparar el archivo JSON del contrato.", "error");
    }
    toggleCargando(false);
  }

  function generarPDF() {
    // La validación del 94% y resultadoCalculado se hace en el event listener
    toggleCargando(true, "Generando PDF...");
    const elementoPlan = document.getElementById("plan-de-liquidacion");
    const nombreArchivo = `Plan_Liquidacion_${resultadoCalculado.nombreDeudor.replace(/\s+/g, "_")}_${resultadoCalculado.folio}.pdf`;

    const actionsOriginalDisplay = document.querySelector(".plan-actions").style.display;
    document.querySelector(".plan-actions").style.display = "none";
    elementoPlan.classList.add("pdf-export");

    // Forzar recálculo de estilos para el PDF
    window.getComputedStyle(elementoPlan).getPropertyValue('margin');

    html2pdf().from(elementoPlan).set({
        margin: [5, 5, 5, 5], // Reducir márgenes para más espacio
        filename: nombreArchivo,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            logging: false, 
            useCORS: true, 
            width: elementoPlan.scrollWidth, // Usar scrollWidth para capturar todo el ancho
            windowWidth: elementoPlan.scrollWidth,
            height: elementoPlan.scrollHeight, // Usar scrollHeight para capturar todo el alto
            windowHeight: elementoPlan.scrollHeight
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"], before: ".page-break-before" } // Clase para forzar saltos si es necesario
    }).save().then(() => {
        toggleCargando(false);
        mostrarNotificacion("PDF generado y descargado.", "success");
    }).catch(err => {
        toggleCargando(false);
        mostrarNotificacion("Error al generar PDF: " + err.message, "error");
        console.error("Error PDF: ", err);
    }).finally(() => {
        document.querySelector(".plan-actions").style.display = actionsOriginalDisplay;
        elementoPlan.classList.remove("pdf-export");
    });
  }

  function cargarHistorialDesdeArchivos() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.multiple = true;
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        if (files.length === 0) {
            mostrarNotificacion("No se seleccionaron archivos.", "info");
            return;
        }
        toggleCargando(true, "Cargando contratos seleccionados...");
        const contratosCargados = [];
        for (const file of files) {
            try {
                const fileContent = await file.text();
                const contratoData = JSON.parse(fileContent);
                // Validar estructura básica del contrato si es necesario
                if (contratoData.folio && contratoData.nombreDeudor) {
                    contratosCargados.push(contratoData);
                    DataModule.agregarContratoAlHistorialEnMemoria(contratoData); // Añadir/actualizar en memoria
                } else {
                    mostrarNotificacion(`Archivo '${file.name}' no parece ser un contrato válido. Omitido.`, "warning");
                }
            } catch (e) {
                mostrarNotificacion(`Error al leer o parsear el archivo '${file.name}': ${e.message}`, "error");
            }
        }
        
        if (contratosCargados.length > 0) {
            DataModule.setHistorialEnMemoria(DataModule.getHistorialEnMemoria()); // Actualiza la referencia por si acaso
            popularTablaHistorial(DataModule.getHistorialEnMemoria());
            document.getElementById("historialContainer").style.display = "flex";
            mostrarNotificacion(`${contratosCargados.length} contrato(s) cargado(s) en el historial.`, "success");
        } else if (files.length > 0) {
            mostrarNotificacion("No se pudieron cargar contratos válidos de los archivos seleccionados.", "error");
        }
        toggleCargando(false);
        document.body.removeChild(fileInput); // Limpiar input
    });
    document.body.appendChild(fileInput);
    fileInput.click();
  }

  function popularTablaHistorial(historial) {
    const historialBody = document.getElementById("historialBody");
    historialBody.innerHTML = "";
    if (historial && historial.length > 0) {
        historial.sort((a,b) => (a.fecha < b.fecha) ? 1 : -1); // Ordenar por fecha descendente (más reciente primero)
        historial.forEach(item => {
            const fila = historialBody.insertRow();
            fila.insertCell().textContent = item.folio;
            fila.insertCell().textContent = item.fecha;
            fila.insertCell().textContent = item.nombreDeudor;
            fila.insertCell().textContent = item.detalles ? item.detalles.length : 0;
            fila.insertCell().textContent = formatoMoneda(item.totalDeudaOriginal);
            fila.insertCell().textContent = formatoMoneda(item.totalDeudaConDescuento); 
            fila.insertCell().textContent = formatoMoneda(item.ahorroCalculado);
            fila.insertCell().textContent = formatoMoneda(item.totalAPagarFinal);
            
            const accionesCelda = fila.insertCell();
            const btnVer = document.createElement("button");
            btnVer.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 4a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> Ver/Editar`;
            btnVer.className = "btn-secondary btn-small";
            btnVer.onclick = () => cargarContratoParaEdicionDesdeHistorial(item.folio);
            accionesCelda.appendChild(btnVer);
        });
    } else {
        historialBody.innerHTML = "<tr><td colspan=\"9\">No hay contratos en el historial cargado. Selecciona archivos para poblarlo.</td></tr>";
    }
  }

  function cargarContratoParaEdicionDesdeHistorial(folio) {
    const contrato = DataModule.getContratoDelHistorialEnMemoria(folio);
    if (contrato) {
        cargarDatosContratoEnFormulario(contrato);
        document.getElementById("historialContainer").style.display = "none";
    } else {
        mostrarNotificacion(`Contrato con folio ${folio} no encontrado en el historial cargado. Intenta recargar el historial.`, "error");
    }
  }
  
  function cargarDatosContratoEnFormulario(contrato) {
    reAnalizarSinConfirmacion(); // Limpia el formulario
    nombreDeudorInput.value = contrato.nombreDeudor;
    numCuotasInput.value = contrato.numCuotas;
    folioEditando = contrato.folio; // Marcar que estamos editando este folio

    tablaDeudas.innerHTML = ""; // Limpiar filas existentes
    contadorFilas = 0;
    if (contrato.detalles && contrato.detalles.length > 0) {
        contrato.detalles.forEach(detalle => {
            agregarFila({
                numeroContrato: detalle.numeroContrato,
                tipoProducto: detalle.tipoProducto,
                entidad: detalle.entidad,
                importeDeuda: detalle.importeDeuda,
                porcentajeDescuento: detalle.porcentajeDescuento,
                // El importeConDescuento se recalculará, no es necesario pasarlo aquí
            });
        });
    }
    if (tablaDeudas.rows.length === 0) agregarFila(); // Asegurar al menos una fila si no hay detalles

    calcularTotales(); // Recalcular y mostrar el plan
    document.getElementById("btnEditarContrato").style.display = "inline-flex"; // Mostrar botón de editar (aunque la acción es la misma que contratar)
    document.getElementById("btnContratar").textContent = "Actualizar Contrato";
    mostrarNotificacion(`Contrato ${contrato.folio} cargado para edición.`, "info");
    nombreDeudorInput.focus();
  }

  document.addEventListener("DOMContentLoaded", inicializar);

  return {
    // Exponer funciones si es necesario para debugging o pruebas externas
  };
})();

