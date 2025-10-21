// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender'
// y la variable 'despieceStorageKey' estén definidas en el script principal (analiticosgdml.html)

/**
 * Muestra el formulario de Eléctrico con funcionalidad de adición/edición.
 * @param {Object | null} itemData - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es nueva fila.
 */
function mostrarFormularioElectrico(itemData = null) {
  // --- Helper Functions (Asegura el manejo de moneda correcto) ---
  function formatCurrency(value) {
    if (isNaN(value) || value === "") return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(str) {
    return parseFloat(String(str).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // -----------------------------------------------------------------

  // 🛑 Lógica para modo Edición o Agregar (Usamos __tempIndex para la edición robusta)
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'ACTUALIZAR' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA ELÉCTRICO'}` : 'FORMULARIO CATEGORÍA: ELÉCTRICO (NUEVO)';
  
  // Usamos un índice temporal simple si no tenemos el global despieceList para evitar dependencia.
  const numFila = isEdit ? itemData.__tempIndex + 1 : (document.querySelectorAll('#despieceTable tbody tr').length + 1);

  // 🔹 Cierra cualquier modal anterior
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // 🔹 Fondo del modal (Estilo Glassmorphism Rústico/Metal)
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999", backdropFilter: "blur(8px)" // Glassmorphism
  });

  // 🔹 Modal principal (Glassmorphism Rústico/Natural)
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", // Fondo semitransparente
    color: "#E8EBE0", // Color de texto claro
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)", // Efecto Glassmorphism
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "750px", // Ancho ajustado para el contenido
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELÉCTRICO","ACRÍLICO",
    "ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH","TELA/VINIPIEL",
    "EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const tiposComponente = [
    "SELECCIONAR",
    "SISTEMA LIVERPOOL",
    "SISTEMA ELECTRICO",
    "ACRILICO LUMINOSO (LUMIGRID)",
    "PERSONALIZADO"
  ];
  
  // 🔹 Contenido del Modal (SIN LARGO Y ANCHO)
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
      label { 
        font-weight: 600; 
        color: #E8EBE0;
        font-size: 11px !important;
        margin-bottom: 4px;
        display: block;
      }
      .form-group-compact { margin-bottom: 12px; }
      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numElectrico, #subtotalElectrico, #claveElectrico[readonly], #descripcionElectrico[readonly], #unidadElectrico[readonly], #puElectrico[readonly] {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* ESTRUCTURA DE LA GRILLA DE PRECIOS (6 COLUMNAS) */
      .final-fields-grid {
        display: grid;
        /* Proporciones: Clave(1), Desc(4), Unidad(1), Cant(2), PU(2), Sub(2) */
        grid-template-columns: 1fr 4fr 1fr 2fr 2fr 2fr; 
        gap: 10px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Estilos de botones */
      .btn-action-metal {
        font-size: 12px; border-radius: 8px; padding: 8px 20px; cursor: pointer; border: none; transition: background-color 0.2s; margin: 0 5px;
      }
      .btn-agregar-metal { background-color: #D4A373 !important; color: #2A302A !important; font-weight: bold; }
      .btn-agregar-metal:hover { background-color: #E8B986 !important; }
      .btn-cancelar-metal { background-color: rgba(255, 255, 255, 0.1) !important; color: #E8EBE0 !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; }
      .btn-cancelar-metal:hover { background-color: rgba(255, 255, 255, 0.2) !important; }
      
      .text-center { text-align: center; }
    </style>

    <h4 class="modal-header-metal">${modalTitle}</h4>
    
    <form id="electricoForm">
      
      <div class="row mb-3">
        <div class="col-md-3">
          <div class="form-group-compact">
            <label>No.</label>
            <input type="text" id="numElectrico" class="metal-input" value="${numFila}" readonly>
          </div>
        </div>
        <div class="col-md-5">
          <div class="form-group-compact">
            <label>Categoría</label>
            <select id="categoriaElectrico" class="metal-input">
              ${categorias.map(c => `<option value="${c}" ${c === (itemData?.categoria || "ELÉCTRICO") ? "selected" : ""}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="col-md-4">
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-12">
          <div class="form-group-compact">
            <label>Tipo de Componente (Material)</label>
            <select id="tipoComponenteElectrico" class="metal-input">
              ${tiposComponente.map(t => `<option value="${t}" ${t === (itemData?.tipoComponente || "SELECCIONAR") ? "selected" : ""}>${t}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      
      <div class="final-fields-grid">
        
        <div>
            <label>Clave</label>
            <input type="text" id="claveElectrico" class="metal-input" placeholder="Clave" value="${itemData?.clave || ''}">
        </div>
        
        <div>
          <label>Descripción</label>
          <input type="text" id="descripcionElectrico" class="metal-input" list="descripcionOptions" placeholder="Descripción detallada" value="${itemData?.descripcion || ''}">
          <datalist id="descripcionOptions"></datalist>
        </div>
        
        <div>
          <label>Unidad</label>
          <input type="text" id="unidadElectrico" class="metal-input" placeholder="PZA, M" value="${itemData?.unidad || ''}">
        </div>
        
        <div>
          <label>Cantidad</label>
          <input type="number" id="cantidadElectrico" class="metal-input" placeholder="0" min="0" value="${itemData?.cantidad || 0}" step="any">
        </div>
        
        <div>
          <label>P.U. ($)</label>
          <input type="text" id="puElectrico" class="metal-input" placeholder="$0.00" value="${isEdit ? formatCurrency(itemData.pu) : ''}">
        </div>
        
        <div>
          <label>Subtotal ($)</label>
          <input type="text" id="subtotalElectrico" class="metal-input" value="${isEdit ? formatCurrency(itemData.subtotal) : '$0.00'}" readonly>
        </div>
      </div>
      
      <div class="text-center" style="margin-top: 25px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalElectrico">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 🔹 Botón cerrar
  modal.querySelector("#cerrarModalElectrico").onclick = () => overlay.remove();

  // 🔹 Cambio de categoría
  modal.querySelector("#categoriaElectrico").addEventListener("change", e => {
    const rawCat = e.target.value;
    const normalized = rawCat.toUpperCase().replace(/ /g, '').replace(/\//g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    overlay.remove();
    const funcName = "mostrarFormulario" + normalized.charAt(0) + normalized.slice(1).toLowerCase();
    const itemToPass = isEdit ? itemData : null;
    if (typeof window[funcName] === "function" && rawCat !== "ELÉCTRICO") {
      window[funcName](itemToPass);
    } else if (rawCat === "ELÉCTRICO") {
      mostrarFormularioElectrico(itemToPass);
    }
  });

  // 🔹 Cálculo de subtotal
  const cantidadInput = modal.querySelector("#cantidadElectrico");
  const puInput = modal.querySelector("#puElectrico");
  const subtotalInput = modal.querySelector("#subtotalElectrico");
  const claveInput = modal.querySelector("#claveElectrico");
  const descInput = modal.querySelector("#descripcionElectrico");
  const unidadInput = modal.querySelector("#unidadElectrico");
  const tipoSelect = modal.querySelector("#tipoComponenteElectrico");

  puInput.addEventListener("blur", () => {
    const val = parseCurrency(puInput.value);
    puInput.value = formatCurrency(val);
    calcularSubtotal();
  });

  puInput.addEventListener("input", calcularSubtotal);
  cantidadInput.addEventListener("input", calcularSubtotal);

  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseCurrency(puInput.value);
    subtotalInput.value = formatCurrency(cantidad * pu);
  }

  if (isEdit) calcularSubtotal();

  // 🔹 Navegación con flechas
  const inputs = Array.from(modal.querySelectorAll("input:not([readonly]), select:not([readonly]), button"));
  inputs.forEach((input, index) => {
    input.addEventListener("keydown", e => {
      const isTextInput = input.tagName === "INPUT" && ["text", "number"].includes(input.type) && !input.readOnly;
      const cursorPos = isTextInput ? input.selectionStart : null;
      const textLength = isTextInput ? input.value.length : 0;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (!isTextInput || cursorPos === textLength) {
          e.preventDefault();
          inputs[index + 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" || (e.key === "Enter" && e.shiftKey)) {
        if (!isTextInput || cursorPos === 0) {
          e.preventDefault();
          inputs[index - 1]?.focus();
        }
      } else if (e.key === "ArrowDown") {
        if (!isTextInput || cursorPos === textLength) {
          e.preventDefault();
          inputs[index + 1]?.focus();
        }
      } else if (e.key === "ArrowUp") {
        if (!isTextInput || cursorPos === 0) {
          e.preventDefault();
          inputs[index - 1]?.focus();
        }
      }
    });
  });

  // 🔹 Cargar datos de autocompletado desde localStorage
  const ELECTRICO_DATA_KEY = 'acumuladoElectricoData';
  const electricoData = JSON.parse(localStorage.getItem(ELECTRICO_DATA_KEY) || '[]');
  const datalist = modal.querySelector("#descripcionOptions");

  if (electricoData.length > 0) {
    const uniqueDescripciones = [...new Set(electricoData.map(item => item.descripcion.trim()))];
    uniqueDescripciones.forEach(desc => {
      const option = document.createElement('option');
      option.value = desc;
      datalist.appendChild(option);
    });

    descInput.addEventListener("input", () => {
      if (tipoSelect.value !== "PERSONALIZADO") return;
      const valor = descInput.value.trim();
      const match = electricoData.find(item => item.descripcion.trim().toUpperCase() === valor.toUpperCase());
      if (match) {
        claveInput.value = match.clave || '';
        unidadInput.value = match.unidad || '';
        const precioCon16 = (match["P.U. ($)"] || 0) * 1.16;
        puInput.value = formatCurrency(precioCon16);
        calcularSubtotal();
      }
    });
  } else {
    console.warn("No hay datos de eléctrico cargados en localStorage. Sube un archivo en acumuladogdml.html.");
  }

  // 🔹 Doble clic para limpiar y permitir edición
  [claveInput, descInput, unidadInput, cantidadInput, puInput].forEach(input => {
    input.addEventListener("dblclick", () => {
      input.readOnly = false;
      input.value = '';
      input.focus();
      if (input === puInput) calcularSubtotal();
    });
  });

  // 🔹 Manejo de selección de Tipo de Componente
  tipoSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (selected === "ACRILICO LUMINOSO (LUMIGRID)") {
      claveInput.value = "000000";
      descInput.value = "PANEL ILUMINADO 3D-VC 1 CARAS 6500K 12V MCA. LUMIGRID";
      unidadInput.value = "M2";
      puInput.value = formatCurrency(12721.72);
      claveInput.readOnly = true;
      descInput.readOnly = true;
      unidadInput.readOnly = true;
      puInput.readOnly = true;
      calcularSubtotal();
    } else {
      claveInput.readOnly = false;
      descInput.readOnly = false;
      unidadInput.readOnly = false;
      puInput.readOnly = false;
      if (selected !== "PERSONALIZADO" && !isEdit) {
        claveInput.value = '';
        descInput.value = '';
        unidadInput.value = '';
        puInput.value = '';
        calcularSubtotal();
      }
    }
  });

  // Trigger inicial si en edición
  if (isEdit && itemData?.tipoComponente === "ACRILICO LUMINOSO (LUMIGRID)") {
    claveInput.value = "000000";
    descInput.value = "PANEL ILUMINADO 3D-VC 1 CARAS 6500K 12V MCA. LUMIGRID";
    unidadInput.value = "M2";
    puInput.value = formatCurrency(12721.72);
    claveInput.readOnly = true;
    descInput.readOnly = true;
    unidadInput.readOnly = true;
    puInput.readOnly = true;
    calcularSubtotal();
  }

  // 🔹 Guardar fila
  modal.querySelector("#electricoForm").onsubmit = e => {
    e.preventDefault();
    
    const selectedTipo = tipoSelect.value;

    // Solo agregar listas predefinidas en modo AGREGAR, no en edición
    if (!isEdit && (selectedTipo === "SISTEMA LIVERPOOL" || selectedTipo === "SISTEMA ELECTRICO")) {
      let predefinedItems = [];
      if (selectedTipo === "SISTEMA LIVERPOOL") {
        predefinedItems = [
          {clave: "MPLUMITIRA00035", descripcion: "TIRA DE LED BLANCO NEUTRO 4000K 24 V MOD: SSL2340K2B MCA. SIECLED", unidad: "PIEZA", cantidad: 0.65, pu: 2199.71, subtotal: 0.65 * 2199.71},
          {clave: "MPELECPERF00257", descripcion: "KIT PERFIL DE ALUMINIO RECTANGULAR PA1911G 2M", unidad: "KIT", cantidad: 1.50, pu: 679.08, subtotal: 1.50 * 679.08},
          {clave: "MPELECPERF00256", descripcion: "KIT PERFIL DE ALUMINIO ESQUINERO PA1616 2.5M", unidad: "KIT", cantidad: 1.20, pu: 679.08, subtotal: 1.20 * 679.08},
          {clave: "MPELECDRIV00012", descripcion: "DRIVER HLG-240H-24B MCA. MEAN WELL", unidad: "PIEZA", cantidad: 1.00, pu: 2809.61, subtotal: 1.00 * 2809.61},
          {clave: "MPELECDRIV00011", descripcion: "DRIVER HLG-100H-24A MCA. MEAN WELL", unidad: "PIEZA", cantidad: 1.00, pu: 2455.76, subtotal: 1.00 * 2455.76},
          {clave: "MPELECCABL00046", descripcion: "CABLE THW 18AWG BLANCO", unidad: "METRO", cantidad: 6.00, pu: 4.29, subtotal: 6.00 * 4.29},
          {clave: "MPELECCABL00057", descripcion: "CABLE THW 18AWG NEGRO", unidad: "METRO", cantidad: 6.00, pu: 4.29, subtotal: 6.00 * 4.29},
          {clave: "MPELECTUBO00309", descripcion: "TUBO FLEXIBLE DE ACERO 1/4\"", unidad: "METRO", cantidad: 5.00, pu: 20.27, subtotal: 5.00 * 20.27},
          {clave: "MPELECZAPA00340", descripcion: "ZAPATA HEMBRA AZUL CAL 16-14 AWG", unidad: "PIEZA", cantidad: 10.00, pu: 2.49, subtotal: 10.00 * 2.49},
          {clave: "MPELECZAPA00332", descripcion: "ZAPATA DE ESPADA AZUL 3/16\" 16-14 AWG", unidad: "PIEZA", cantidad: 10.00, pu: 2.49, subtotal: 10.00 * 2.49},
          {clave: "MPELECTUBO00311", descripcion: "TUBO FLEXIBLE DE ACERO 3/8\"", unidad: "METRO", cantidad: 5.00, pu: 17.96, subtotal: 5.00 * 17.96},
          {clave: "MPELECMONI00247", descripcion: "MONITOR 1/2\"", unidad: "PIEZA", cantidad: 1.00, pu: 6.00, subtotal: 1.00 * 6.00},
          {clave: "MPELECINTE00001", descripcion: "INTERRUPTOR BASCULANTE 2 POSICIONES BIPOLAR 16A/240V", unidad: "PIEZA", cantidad: 2.00, pu: 679.99, subtotal: 2.00 * 679.99},
          {clave: "MPELECCONE00127", descripcion: "CONECTOR FLEXIBLE CURVO 3/8\"", unidad: "PIEZA", cantidad: 2.00, pu: 18.66, subtotal: 2.00 * 18.66},
          {clave: "MPELECCAJA00079", descripcion: "CAJA GALVANIZADA 1/2\"", unidad: "PIEZA", cantidad: 5.00, pu: 10.00, subtotal: 5.00 * 10.00},
          {clave: "MPELECTAPA00296", descripcion: "TAPA CUADRADA GALVANIZADA 1/2\"", unidad: "PIEZA", cantidad: 1.00, pu: 60.00, subtotal: 1.00 * 60.00},
          {clave: "MPELECPAST00370", descripcion: "PASTILLA TERMOMAGNETICA 4 AMP CURVA B", unidad: "PIEZA", cantidad: 2.00, pu: 341.16, subtotal: 2.00 * 341.16},
          {clave: "MPELECCAJA00087", descripcion: "CAJA DE DISTRIBUCIÓN IP30 2 MODULOS", unidad: "PIEZA", cantidad: 1.00, pu: 69.95, subtotal: 1.00 * 69.95},
          {clave: "MPELECCHAL00097", descripcion: "CHALUPA GALVANIZADA 1/2\"", unidad: "PIEZA", cantidad: 4.00, pu: 110.00, subtotal: 4.00 * 110.00},
          {clave: "MPELECCONT00151", descripcion: "CONTACTO DUPLEX BLANCO", unidad: "PIEZA", cantidad: 1.00, pu: 58.00, subtotal: 1.00 * 58.00},
          {clave: "MPELECTAPA00418", descripcion: "TAPA PLASTICA PARA CONTACTO DUPLEX", unidad: "PIEZA", cantidad: 1.00, pu: 25.00, subtotal: 1.00 * 25.00},
          {clave: "MPELECCLAV00111", descripcion: "CLAVIJA ANGULADA 2P+T 15A 127V AMARILLA", unidad: "PIEZA", cantidad: 4.00, pu: 56.47, subtotal: 4.00 * 56.47},
          {clave: "MPELECCABL00055", descripcion: "CABLE THW 14AWG NEGRO", unidad: "METRO", cantidad: 6.00, pu: 9.18, subtotal: 6.00 * 9.18},
          {clave: "MPELECCABL00065", descripcion: "CABLE THW 16AWG BLANCO", unidad: "METRO", cantidad: 6.00, pu: 9.18, subtotal: 6.00 * 9.18},
          {clave: "MPELECCABL00050", descripcion: "CABLE THW 14AWG VERDE", unidad: "METRO", cantidad: 6.00, pu: 9.18, subtotal: 6.00 * 9.18},
          {clave: "MPELECABRA00022", descripcion: "ABRAZADERA DE UÑA 3/8\"", unidad: "PIEZA", cantidad: 10.00, pu: 2.49, subtotal: 10.00 * 2.49},
          {clave: "MPELECABRA00030", descripcion: "ABRAZADERA DE UÑA 1/4\"", unidad: "PIEZA", cantidad: 10.00, pu: 3.48, subtotal: 10.00 * 3.48},
          {clave: "MPELECCLEM00112", descripcion: "CLEMA CON PALANCA 24-12 AWG 5 CONDUCTORES WAGO 221-415", unidad: "PIEZA", cantidad: 4.00, pu: 58.00, subtotal: 4.00 * 58.00},
          {clave: "MPELECCONE00134", descripcion: "CONECTOR FLEXIBLE RECTO 3/8\"", unidad: "PIEZA", cantidad: 4.00, pu: 18.66, subtotal: 4.00 * 18.66}
        ];
      } else if (selectedTipo === "SISTEMA ELECTRICO") {
        predefinedItems = [
          {clave: "MPELECTIRA00007", descripcion: "TIRA DE LED BLANCO NEUTRO 4100K 24 V MOD: LDPB2216Z24240R 5M MCA. ILUMILEDS", unidad: "PIEZA", cantidad: 1.00, pu: 1257.27, subtotal: 1.00 * 1257.27},
          {clave: "MPELECFUEN00188", descripcion: "FUENTE DE ALIMENTACION 350 W 24 V", unidad: "PIEZA", cantidad: 1.00, pu: 1346.25, subtotal: 1.00 * 1346.25},
          {clave: "MPELECCABL00057", descripcion: "CABLE THW 18AWG NEGRO", unidad: "METRO", cantidad: 8.00, pu: 3.22, subtotal: 8.00 * 3.22},
          {clave: "MPELECCABL00065", descripcion: "CABLE THW 18AWG BLANCO", unidad: "METRO", cantidad: 6.00, pu: 3.22, subtotal: 6.00 * 3.22},
          {clave: "MPELECCONE00353", descripcion: "CONECTOR USO RUDO 1/2\"", unidad: "METRO", cantidad: 2.00, pu: 10.00, subtotal: 2.00 * 10.00},
          {clave: "MPELECCLAV00111", descripcion: "CLAVIJA ANGULADA 2P+T 15A 127V AMARILLA", unidad: "PIEZA", cantidad: 4.00, pu: 56.47, subtotal: 4.00 * 56.47},
          {clave: "MPELECMONI00247", descripcion: "MONITOR 1/2\"", unidad: "PIEZA", cantidad: 1.00, pu: 6.00, subtotal: 1.00 * 6.00},
          {clave: "MPELECZAPA00332", descripcion: "ZAPATA DE ESPADA AZUL 3/16\" 16-14 AWG", unidad: "PIEZA", cantidad: 10.00, pu: 2.49, subtotal: 10.00 * 2.49},
          {clave: "MPELECCLEM00112", descripcion: "CLEMA CON PALANCA 24-12 AWG 5 CONDUCTORES WAGO 221-415", unidad: "PIEZA", cantidad: 10.00, pu: 58.00, subtotal: 10.00 * 58.00},
          {clave: "MPELECCINC00102", descripcion: "CINCHO DE PLASTICO 15CM BLANCO", unidad: "PIEZA", cantidad: 40.00, pu: 0.50, subtotal: 40.00 * 0.50},
          {clave: "MPELECCAPU00092", descripcion: "CAPUCHON ROSCA AMARILLO/ROJO 12-10 AWG", unidad: "PIEZA", cantidad: 10.00, pu: 5.00, subtotal: 10.00 * 5.00},
          {clave: "MPELECTUBO00311", descripcion: "TUBO FLEXIBLE DE ACERO 3/8\"", unidad: "METRO", cantidad: 5.00, pu: 17.69, subtotal: 5.00 * 17.69}
        ];
      }

      if (typeof agregarFilaDespiece === "function") {
        predefinedItems.forEach(item => {
          const data = {
            id: typeof generateUUID === 'function' ? generateUUID() : 'temp-' + Date.now(),
            no: document.querySelectorAll('#despieceTable tbody tr').length + 1,
            categoria: "ELÉCTRICO",
            tipoComponente: selectedTipo,
            largo: 0,
            ancho: 0,
            clave: item.clave,
            descripcion: item.descripcion,
            unidad: item.unidad,
            cantidad: item.cantidad,
            pu: item.pu,
            subtotal: item.subtotal
          };
          agregarFilaDespiece(data);
        });
        // Única confirmación para la adición de elementos
        const message = selectedTipo === "SISTEMA LIVERPOOL" 
          ? "Elementos de SISTEMA LIVERPOOL agregados correctamente. VERIFICAR PRECIOS Y CANTIDADES."
          : "Elementos de SISTEMA ELECTRICO agregados correctamente.";
        alert(message);
      } else {
        alert("Error: La función agregarFilaDespiece no está disponible.");
      }
      overlay.remove();
      return;
    }

    // Obtener los datos limpios para guardar/actualizar
    const data = {
      id: isEdit ? itemData.id : (typeof generateUUID === 'function' ? generateUUID() : 'temp-' + Date.now()),
      no: numFila,
      categoria: "ELÉCTRICO",
      tipoComponente: tipoSelect.value,
      largo: 0,
      ancho: 0,
      clave: claveInput.value,
      descripcion: descInput.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseCurrency(puInput.value),
      subtotal: parseCurrency(subtotalInput.value) || 0
    };

    if (isEdit) {
      if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
        const currentList = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
        const indexToUpdate = itemData.__tempIndex;
        if (indexToUpdate >= 0 && indexToUpdate < currentList.length) {
          const dataToSave = { ...data };
          delete dataToSave.__tempIndex;
          currentList[indexToUpdate] = dataToSave;
          updateDespieceStorageAndRender(currentList);
          alert('ELEMENTO EDITADO CORRECTAMENTE.');
        } else {
          alert('Error al editar: Índice temporal no válido.');
        }
      } else {
        alert('Error: La función updateDespieceStorageAndRender o la variable despieceStorageKey no están disponibles.');
      }
    } else {
      if (typeof agregarFilaDespiece === "function") {
        agregarFilaDespiece(data);
        alert('ELEMENTO AGREGADO CORRECTAMENTE.');
      } else {
        alert('Error: La función agregarFilaDespiece no está disponible.');
      }
    }

    modal.remove();
    overlay.remove();
  };
}