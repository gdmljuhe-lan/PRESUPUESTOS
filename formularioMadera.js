// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender', y la variable 'despieceList'
// (y despieceStorageKey) estén definidas en el script principal (analiticosgdml.html)

/**
 * Muestra el formulario de Madera con estilo Glassmorphism Rústico.
 * @param {Object | null} itemData - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es una nueva fila.
 */
function mostrarFormularioMadera(itemData = null) {
  // 🔹 Cierra cualquier modal anterior
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }
  
  // --- LÓGICA DE EDICIÓN/ADICIÓN Y ESTADO DEL MATERIAL ---
  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO","ACRILICO",
    "ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH","TELA/VINIPIEL",
    "EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];
  
  // 🚨 LISTA DE MATERIALES ACTUALIZADA
  const materiales = [
    "MDF", "PINO", "TRIPLAY", "LAMINADO", "TRIPLAY FLEXIBLE", "MELAMINA",
    "MDF ENCHAPADO", "CUBRECANTOS", "ADHESIVO", "PANEL MULTIPERFORADO",
    "MDF CON LACA", "MDF ALTO BRILLO", "TABLA DE ROBLE", "TABLON BANAK",
    "OSB", "VIGA", "BASTON", "OTRO (PANEL)", "OTRO (BASTON, VIGA, ETC)"
  ];
  
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA MADERA'}` : 'FORMULARIO CATEGORÍA: MADERA';
  
  const listForCount = typeof despieceList !== 'undefined' ? despieceList : (typeof despieceStorageKey !== 'undefined' ? JSON.parse(localStorage.getItem(despieceStorageKey) || '[]') : []);
  const numFila = isEdit ? itemData.__tempIndex + 1 : listForCount.length + 1;
  // --- FIN LÓGICA DE EDICIÓN/ADICIÓN Y ESTADO DEL MATERIAL ---

  // 🔹 Fondo del modal (Estilo Glassmorphism Rústico)
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999", backdropFilter: "blur(8px)" // Glassmorphism
  });

  // 🔹 Modal principal (Estilo Glassmorphism Rústico/Natural)
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", // Fondo semitransparente
    color: "#E8EBE0", // Color de texto claro
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)", // Efecto Glassmorphism
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "700px", // Ancho optimizado
    maxHeight: "90vh", 
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });


  modal.innerHTML = `
    <style>
      /* Estilos Glassmorphism Rústico/Natural */
      .modal-header-metal {
        color: #D4A373; /* Accent terroso */
        font-weight: bold;
        text-shadow: 0 0 8px rgba(212, 163, 115, 0.3);
        font-size: 18px !important;
        text-align: center;
        margin-bottom: 25px;
      }
      
      /* Inputs y Selects */
      .metal-input {
        background: rgba(0, 0, 0, 0.25);
        color: #E8EBE0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px; 
        padding: 6px 10px; 
        transition: border-color 0.3s;
        text-transform: uppercase;
        font-size: 11px !important;
        height: auto;
        width: 100%;
        box-sizing: border-box; 
      }
      .metal-input:focus {
        background: rgba(0, 0, 0, 0.35);
        border-color: #D4A373;
        box-shadow: 0 0 5px rgba(212, 163, 115, 0.6);
        color: #fff;
        outline: none;
      }
      
      /* Etiquetas */
      label { 
        font-weight: 600; 
        color: #E8EBE0;
        font-size: 11px !important;
        margin-bottom: 4px;
        display: block;
      }
      
      /* Contenedor de cada campo */
      .form-group-compact {
        margin-bottom: 12px;
      }

      /* Grid Principal (2 Columnas) */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Grid para No. y Categoría (Sub-Grid) */
      .num-cat-row {
        display: grid;
        grid-template-columns: 4fr 8fr;
        gap: 10px;
        margin-bottom: 12px;
      }

      /* Grid de la Fila Final (6 Columnas) */
      .final-fields-grid {
        display: grid;
        /* Clave, Desc, Unidad, Cant, PU, Subtotal */
        grid-template-columns: 2fr 3fr 1fr 2fr 2fr 2fr; 
        gap: 10px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numMadera, #cantidadMadera, #subtotalMadera {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Botones */
      .btn-action-metal {
        font-size: 12px;
        border-radius: 8px;
        padding: 8px 20px;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
      }

      .btn-agregar-metal {
        background-color: #D4A373 !important;
        color: #2A302A !important;
        font-weight: bold;
      }
      .btn-agregar-metal:hover { background-color: #E8B986 !important; }
      
      .btn-cancelar-metal {
        background-color: rgba(255, 255, 255, 0.1) !important;
        color: #E8EBE0 !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      .btn-cancelar-metal:hover { background-color: rgba(255, 255, 255, 0.2) !important; }
      
      .text-center { text-align: center; }
      .d-none { display: none !important; }
    </style>

    <h4 class="modal-header-metal">${modalTitle}</h4>

    <form id="maderaForm">
      
      <div class="form-grid">
        
        <div>
          
          <div class="num-cat-row">
            <div>
              <label>No.</label>
              <input type="text" id="numMadera" class="metal-input" value="${numFila}" readonly data-original-item='${isEdit ? JSON.stringify(itemData) : ''}'>
            </div>
            <div>
              <label>Categoría</label>
              <select id="categoriaMadera" class="metal-input">
                ${categorias.map(cat => `<option value="${cat}" ${cat === (itemData?.categoria || 'MADERA') ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div class="form-group-compact">
            <label>Material</label>
            <select id="materialMadera" class="metal-input" required>
              <option value="">Seleccione...</option>
              ${materiales.map(m => `<option value="${m}" ${m === (itemData?.material || '') ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group-compact d-none" id="campoLargoPanel">
            <label>Largo panel (mm)</label>
            <input type="number" id="largoPanelMadera" class="metal-input" step="0.01" value="${itemData?.largoPanel || ''}">
          </div>

          <div class="form-group-compact d-none" id="campoAnchoPanel">
            <label>Ancho panel (mm)</label>
            <input type="number" id="anchoPanelMadera" class="metal-input" step="0.01" value="${itemData?.anchoPanel || ''}">
          </div>

          <div class="form-group-compact d-none" id="campoLargoMaterial">
            <label>Largo material (mm)</label>
            <input type="number" id="largoMaterialMadera" class="metal-input" step="0.01" value="${itemData?.largoMaterial || ''}">
          </div>
          
        </div>

        <div>
          <div class="form-group-compact d-none" id="campoNombrePieza">
            <label>Nombre de pieza</label>
            <input type="text" id="nombrePiezaMadera" class="metal-input" required value="${itemData?.nombrePieza || ''}">
          </div>

          <div class="form-group-compact d-none" id="campoLargoPieza">
            <label>Largo (mm)</label>
            <input type="number" id="largoMadera" class="metal-input" step="0.01" value="${itemData?.largo || ''}">
          </div>
          
          <div class="form-group-compact d-none" id="campoAnchoPieza">
            <label>Ancho (mm)</label>
            <input type="number" id="anchoMadera" class="metal-input" step="0.01" value="${itemData?.ancho || ''}">
          </div>
          
          <div class="form-group-compact d-none" id="campoNumPiezas">
            <label>No. piezas</label>
            <input type="number" id="numPiezasMadera" class="metal-input" step="1" min="1" value="${itemData?.numPiezas || 1}">
          </div>
        </div>
      </div>

      <div class="final-fields-grid">
        <div><label>Clave</label><input type="text" id="claveMadera" class="metal-input" value="${itemData?.clave || ''}"></div>
        <div><label>Descripción</label><input type="text" id="descripcionMadera" class="metal-input" list="descripcionOptions" value="${itemData?.descripcion || ''}"></div>
        <div><label>Unidad</label><input type="text" id="unidadMadera" class="metal-input" value="${itemData?.unidad || 'PZA'}"></div>
        <div><label>Cantidad</label><input type="number" id="cantidadMadera" class="metal-input" value="${(itemData?.cantidad || 0).toFixed(3)}" readonly></div>
        <div><label>P.U. ($)</label><input type="text" id="puMadera" class="metal-input" value="${formatCurrency(itemData?.pu || 0)}" placeholder="$0.00"></div>
        <div><label>Subtotal ($)</label><input type="text" id="subtotalMadera" class="metal-input" value="${formatCurrency(itemData?.subtotal || 0)}" readonly></div>
      </div>

      <div class="text-center" style="margin-top: 20px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalMadera">CANCELAR</button>
      </div>
    </form>
  `;

  // Crear el datalist para las sugerencias de descripción
  const datalist = document.createElement('datalist');
  datalist.id = 'descripcionOptions';
  modal.appendChild(datalist);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 🔹 Variables principales
  const numMaderaInput = document.getElementById("numMadera");
  const materialSelect = document.getElementById("materialMadera");
  const largoInput = document.getElementById("largoMadera");
  const anchoInput = document.getElementById("anchoMadera");
  const numPiezasInput = document.getElementById("numPiezasMadera");
  const largoPanelInput = document.getElementById("largoPanelMadera");
  const anchoPanelInput = document.getElementById("anchoPanelMadera");
  const largoMaterialInput = document.getElementById("largoMaterialMadera");
  const campoNombrePieza = document.getElementById("campoNombrePieza");
  const campoLargoPieza = document.getElementById("campoLargoPieza");
  const campoAnchoPieza = document.getElementById("campoAnchoPieza");
  const campoNumPiezas = document.getElementById("campoNumPiezas");
  const campoLargoPanel = document.getElementById("campoLargoPanel");
  const campoAnchoPanel = document.getElementById("campoAnchoPanel");
  const campoLargoMaterial = document.getElementById("campoLargoMaterial");
  const unidadInput = document.getElementById("unidadMadera");
  const inputPU = document.getElementById("puMadera");
  const inputSubtotal = document.getElementById("subtotalMadera");
  const inputCantidad = document.getElementById("cantidadMadera");

  // 🔹 Cerrar modal
  document.getElementById("cerrarModalMadera").onclick = () => overlay.remove();

  // 🔹 Navegación y cambio de categoría (con pase de itemData para edición)
  document.getElementById("categoriaMadera").addEventListener("change", (e) => {
    const raw = e.target.value.toUpperCase();
    const nuevaCat = raw.replace(/ /g, "").replace(/Í/g, "I").replace(/\//g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    overlay.remove();
    const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    
    const originalItemJson = numMaderaInput.getAttribute('data-original-item');
    const itemToPass = originalItemJson ? JSON.parse(originalItemJson) : null;

    if (typeof window[funcName] === "function") {
        window[funcName](itemToPass); 
    } else {
        alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
    }
  });

  // 🔹 Mostrar/ocultar campos y establecer unidad según material (Actualizado)
  function actualizarCampos() {
    const mat = materialSelect.value.toUpperCase();
    
    // Ocultar todos los campos dinámicos
    [campoNombrePieza, campoLargoPieza, campoAnchoPieza, campoNumPiezas, 
     campoLargoPanel, campoAnchoPanel, campoLargoMaterial].forEach(el => el.classList.add("d-none"));

    // Valor predeterminado de unidad si no se especifica (respeta la unidad de edición)
    unidadInput.value = itemData?.unidad || 'PZA';
    
    const materialesPanelArea = [
      "MDF", "PINO", "TRIPLAY", "LAMINADO", "TRIPLAY FLEXIBLE", "MELAMINA",
      "MDF ENCHAPADO", "PANEL MULTIPERFORADO", "MDF CON LACA", "MDF ALTO BRILLO",
      "TABLA DE ROBLE", "TABLON BANAK", "OSB"
    ];

    const materialesPanelAreaCustom = ["OTRO (PANEL)"];

    const materialesLineales = ["VIGA", "BASTON", "CUBRECANTOS"];

    const materialesLinealesCustom = ["OTRO (BASTON, VIGA, ETC)"];

    const materialesAdhesivo = ["ADHESIVO"];

    if (materialesPanelArea.includes(mat)) {
        // Estructura: No, Cat, Mat | Nombre, L, A, No. Piezas
        [campoNombrePieza, campoLargoPieza, campoAnchoPieza, campoNumPiezas].forEach(el => el.classList.remove("d-none"));
        unidadInput.value = 'm2';
    } else if (materialesPanelAreaCustom.includes(mat)) {
        // Estructura: No, Cat, Mat, L_P, A_P | Nombre, L, A, No. Piezas
        [campoNombrePieza, campoLargoPieza, campoAnchoPieza, campoNumPiezas, 
         campoLargoPanel, campoAnchoPanel].forEach(el => el.classList.remove("d-none"));
        unidadInput.value = 'm2';
    } else if (materialesLineales.includes(mat)) {
        // Estructura: No, Cat, Mat | Nombre, L, No. Piezas (Oculta Ancho de Pieza)
        [campoNombrePieza, campoLargoPieza, campoNumPiezas].forEach(el => el.classList.remove("d-none"));
        unidadInput.value = 'ml';
        if (mat === "CUBRECANTOS") unidadInput.value = itemData?.unidad || 'ml'; 
    } else if (materialesLinealesCustom.includes(mat)) {
        // Estructura: No, Cat, Mat, L_M | Nombre, L, No. Piezas (Oculta Ancho de Pieza)
        [campoNombrePieza, campoLargoPieza, campoNumPiezas, campoLargoMaterial].forEach(el => el.classList.remove("d-none"));
        unidadInput.value = 'ml';
    } else if (materialesAdhesivo.includes(mat)) {
        // Estructura: No, Cat, Mat | (Campos de pieza ocultos)
        // Se deja la unidad que tenía (PZA, LT, etc.)
        unidadInput.value = itemData?.unidad || 'PZA';
    }
    
    // Inicializa todos los inputs relevantes con el evento de cálculo
    [largoInput, anchoInput, numPiezasInput, largoPanelInput, anchoPanelInput, largoMaterialInput].forEach(el => {
        el?.removeEventListener("input", calcularCantidad);
        if (!el.closest('.d-none')) {
            el?.addEventListener("input", calcularCantidad);
        }
    });

    calcularCantidad(); // Recalcula la cantidad después de cambiar la estructura
  }

  // 🔹 Cálculo dinámico (Implementación de las fórmulas)
  function calcularCantidad() {
    const mat = materialSelect.value.toUpperCase();
    const largo = parseFloat(largoInput.value) || 0;
    const ancho = parseFloat(anchoInput.value) || 0;
    const piezas = parseFloat(numPiezasInput.value) || 1;
    const largoPanel = parseFloat(largoPanelInput.value) || 0;
    const anchoPanel = parseFloat(anchoPanelInput.value) || 0;
    const largoMaterial = parseFloat(largoMaterialInput.value) || 0;
    let cantidad = 0;
    
    // Grupos de materiales para cálculos
    const GRUPO_PANEL_297 = ["MDF", "TRIPLAY", "LAMINADO", "TRIPLAY FLEXIBLE", "MELAMINA", "MDF ENCHAPADO", "PANEL MULTIPERFORADO", "MDF CON LACA", "MDF ALTO BRILLO"];
    const GRUPO_PANEL_625 = ["PINO", "TABLA DE ROBLE", "TABLON BANAK", "OSB"];
    const GRUPO_BASTON = ["BASTON"];
    const GRUPO_VIGA_CUBRECANTOS = ["VIGA", "CUBRECANTOS"];
    const GRUPO_CUSTOM_PANEL = ["OTRO (PANEL)"];
    const GRUPO_CUSTOM_LINEAL = ["OTRO (BASTON, VIGA, ETC)"];
    
    // Constantes de cálculo
    const AREA_ESTANDAR_297 = 2976800; // 2.44m x 1.22m en mm^2
    const AREA_ESTANDAR_625 = 625000; // 2.5m x 0.25m en mm^2 (Ejemplo para tablones)
    const LARGO_BASTON_ESTANDAR = 5800; // Largo estándar del bastón en mm

    if (GRUPO_PANEL_297.includes(mat)) {
        // Largo (mm) x Ancho (mm) / 2976800 * No. Piezas
        cantidad = ((largo * ancho) / AREA_ESTANDAR_297) * piezas; 
    } else if (GRUPO_PANEL_625.includes(mat)) {
        // Largo (mm) x Ancho (mm) / 625000 * No. Piezas
        cantidad = ((largo * ancho) / AREA_ESTANDAR_625) * piezas;
    } else if (GRUPO_BASTON.includes(mat)) {
        // Largo (mm) / 5800 * No. Piezas
        cantidad = (largo / LARGO_BASTON_ESTANDAR) * piezas;
    } else if (GRUPO_VIGA_CUBRECANTOS.includes(mat)) {
        // Lineal: Largo (mm) / 1000 * No. Piezas (Resultado en ml)
        cantidad = (largo / 1000) * piezas;
    } else if (GRUPO_CUSTOM_PANEL.includes(mat) && largoPanel > 0 && anchoPanel > 0) {
        // Largo (mm) x Ancho (mm) / (Largo Panel x Ancho Panel) * No. Piezas
        const areaPanelCustom = largoPanel * anchoPanel;
        cantidad = ((largo * ancho) / areaPanelCustom) * piezas;
    } else if (GRUPO_CUSTOM_LINEAL.includes(mat) && largoMaterial > 0) {
        // Largo (mm) / Largo Material (mm) * No. Piezas
        cantidad = (largo / largoMaterial) * piezas;
    } else if (mat === "ADHESIVO") {
        // Adhesivo: Cantidad es 0 y se espera que el usuario la ingrese manualmente
        cantidad = 0; 
    }
    
    // Fallback si no se pudo calcular el área/longitud por falta de datos
    if (cantidad === 0 && !mat.includes("ADHESIVO")) {
        // Se usa la cantidad de piezas como fallback
        cantidad = 1.0 * piezas;
    }
    

    inputCantidad.value = cantidad.toFixed(3); 
    calcularSubtotal();
  }

  // 🔹 Cálculo de Subtotal
  function calcularSubtotal() {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    const pu = parseCurrency(inputPU.value);
    const subtotal = cantidad * pu;
    inputSubtotal.value = formatCurrency(subtotal);
  }
  
  // 🔹 Eventos de cálculo
  materialSelect.addEventListener("change", actualizarCampos);
  // Todos los inputs numéricos (excepto PU/Subtotal) llaman a calcularCantidad
  [largoInput, anchoInput, numPiezasInput, largoPanelInput, anchoPanelInput, largoMaterialInput].forEach(el => {
    el?.addEventListener("input", calcularCantidad);
  });

  inputPU.addEventListener("blur", () => {
    const val = parseCurrency(inputPU.value);
    inputPU.value = formatCurrency(val);
    calcularSubtotal();
  });
  inputPU.addEventListener("input", calcularSubtotal);


  // Llamada inicial para precargar los campos de edición y calcular
  if (itemData) {
      actualizarCampos(); 
  } else {
      actualizarCampos(); // Para inicializar la estructura al abrir un formulario nuevo
  }


  // 🔹 Navegación con teclado
  const inputs = modal.querySelectorAll("input:not([readonly]), select, button");
  inputs.forEach((el, i) => {
    el.addEventListener("keydown", e => {
      const isTextInput = el.tagName === "INPUT" && ["text", "number"].includes(el.type) && !el.readOnly;
      const cursorPos = isTextInput ? el.selectionStart : null;
      const textLength = isTextInput ? el.value.length : 0;

      if ((e.key === "ArrowRight" || e.key === "Enter") && e.target.type !== "submit") {
        if (!isTextInput || cursorPos === textLength) { // Navegar solo si está al final del texto
          e.preventDefault();
          inputs[i + 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" || (e.key === "Enter" && e.shiftKey)) {
        if (!isTextInput || cursorPos === 0) { // Navegar solo si está al inicio del texto
          e.preventDefault();
          inputs[i - 1]?.focus();
        }
      } else if (e.key === "ArrowDown") {
        if (!isTextInput || cursorPos === textLength) { // Navegar solo si está al final
          e.preventDefault();
          inputs[i + 1]?.focus();
        }
      } else if (e.key === "ArrowUp") {
        if (!isTextInput || cursorPos === 0) { // Navegar solo si está al inicio
          e.preventDefault();
          inputs[i - 1]?.focus();
        }
      }
    });
  });

  // 🔹 Nueva funcionalidad: Cargar datos de autocompletado desde localStorage (subidos en acumuladogdml.html)
  const MADERA_DATA_KEY = 'acumuladoMaderaData'; // Clave coincidente con acumuladogdml.html
  const maderaData = JSON.parse(localStorage.getItem(MADERA_DATA_KEY) || '[]');

  if (maderaData.length > 0) {
    // Llenar el datalist con las descripciones únicas (columna B)
    const uniqueDescripciones = [...new Set(maderaData.map(item => item.descripcion.trim()))];
    uniqueDescripciones.forEach(desc => {
      const option = document.createElement('option');
      option.value = desc;
      datalist.appendChild(option);
    });

    // Evento para autocompletar al cambiar/seleccionar en descripción
    const inputDescripcion = document.getElementById("descripcionMadera");
    inputDescripcion.addEventListener("input", () => {
      const valor = inputDescripcion.value.trim();
      // Buscar coincidencia exacta (case-insensitive) en los datos
      const match = maderaData.find(item => item.descripcion.trim().toUpperCase() === valor.toUpperCase());
      if (match) {
        // Autocompletar los campos
        document.getElementById("claveMadera").value = match.clave || '';
        document.getElementById("unidadMadera").value = match.unidad || '';
        inputPU.value = formatCurrency(match["P.U. ($)"] || 0);
        calcularSubtotal(); // Recalcular subtotal si es necesario
      }
    });

    // 🔹 Nueva funcionalidad: Limpiar campo descripción al hacer doble clic
    inputDescripcion.addEventListener("dblclick", () => {
      inputDescripcion.value = ''; // Limpiar el campo
      inputDescripcion.focus(); // Poner el foco para permitir edición inmediata
    });
  } else {
    // Opcional: Mostrar un mensaje si no hay datos cargados
    console.warn("No hay datos de madera cargados en localStorage. Sube un archivo en acumuladogdml.html.");
  }

  // 🔹 LÓGICA DE EDICIÓN Y ADICIÓN (Esta es la sección clave para la edición)
  document.getElementById("maderaForm").onsubmit = (e) => {
    e.preventDefault();
    
    // Recolectar datos del formulario
    const data = {
      // Si estamos en modo edición, usamos el ID original, si no, generamos uno nuevo.
      id: isEdit ? itemData.id : (typeof generateUUID === 'function' ? generateUUID() : 'temp-' + Date.now()),
      no: numFila, 
      categoria: "MADERA",
      material: materialSelect.value,
      nombrePieza: document.getElementById("nombrePiezaMadera").value,
      largo: parseFloat(largoInput.value) || 0,
      ancho: parseFloat(anchoInput.value) || 0,
      numPiezas: parseInt(numPiezasInput.value) || 1,
      largoPanel: parseFloat(largoPanelInput.value) || 0,
      anchoPanel: parseFloat(anchoPanelInput.value) || 0,
      largoMaterial: parseFloat(largoMaterialInput.value) || 0,
      clave: document.getElementById("claveMadera").value,
      descripcion: document.getElementById("descripcionMadera").value,
      unidad: unidadInput.value,
      cantidad: parseFloat(inputCantidad.value) || 0,
      pu: parseCurrency(inputPU.value),
      subtotal: parseCurrency(inputSubtotal.value),
    };

    const originalItemJson = numMaderaInput.getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;
    
    // ✅ LÓGICA DE EDICIÓN
    if (originalItem && typeof originalItem.__tempIndex === 'number') { 
        const indexToEdit = originalItem.__tempIndex;

        if (typeof updateDespieceStorageAndRender === 'function') {
            // Se asume que 'despieceList' o 'despieceStorageKey' están disponibles globalmente.
            const current = typeof despieceList !== 'undefined' ? despieceList : JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
            
            if (indexToEdit >= 0 && indexToEdit < current.length) {
                // Prepara la data para guardar, eliminando el índice temporal usado en la UI
                const dataToSave = { ...data };
                delete dataToSave.__tempIndex; 
                current[indexToEdit] = dataToSave; 
                
                // Llama a la función global para actualizar el almacenamiento y el renderizado
                updateDespieceStorageAndRender(current); 
                alert('ELEMENTO EDITADO CORRECTAMENTE.');
            } else {
                alert('Error al editar: Índice no válido.');
            }
        } else {
            alert('Error: La función updateDespieceStorageAndRender no está disponible.');
        }
    } else {
        // Lógica de Adición Nueva
        if (typeof agregarFilaDespiece === "function") {
            agregarFilaDespiece(data);
        }
    }
    
    overlay.remove();
  };
}