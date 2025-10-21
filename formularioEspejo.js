// Se asume que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender',
// 'generateUUID' y la variable 'despieceStorageKey' están definidas en el script principal.

/**
 * Muestra el formulario de Espejo con estilo Glassmorphism Rústico/Natural (METAL).
 * @param {Object | null} itemData - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es una nueva fila.
 */
function mostrarFormularioEspejo(itemData = null) {
  // 🔹 Cierra cualquier modal anterior antes de abrir uno nuevo
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(value) {
    if (isNaN(value) || value === "") return "$0.00";
    // Formato: $0,000.00
    return `$${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(str) {
    return parseFloat(String(str).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- Fin Funciones auxiliares ---

  // --- LÓGICA DE EDICIÓN/ADICIÓN ---
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number'; 
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA ESPEJO'}` : 'FORMULARIO CATEGORÍA: ESPEJO';

  // Determina el número de fila: usa el original si editas, calcula uno nuevo si añades.
  const despieceList = typeof despieceStorageKey !== 'undefined' ? JSON.parse(localStorage.getItem(despieceStorageKey) || '[]') : [];
  const numFila = isEdit ? itemData.no : despieceList.length + 1;

  const currentMaterial = itemData?.material?.toUpperCase() || '';
  const isOtro = currentMaterial.includes("OTRO");
  // --- Fin LÓGICA DE EDICIÓN/ADICIÓN ---

  // --- Listas y Precios (Actualizados según la solicitud) ---
  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELÉCTRICO","ACRÍLICO",
    "ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH","TELA/VINIPIEL",
    "EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const materiales = [
    "ESPEJO 4 MM CANTO PULIDO",
    "ESPEJO 6 MM CANTO PULIDO",
    "ESPEJO HUMO 6 MM CANTO PULIDO",
    "ESPEJO BRONCE 6 MM CANTO PULIDO",
    "ESPEJO FUME 6 MM CANTO PULIDO",
    "OTRO (ESPEJO)"
  ];

  const precios = {
    "ESPEJO 4 MM CANTO PULIDO": 1800,
    "ESPEJO 6 MM CANTO PULIDO": 2600,
    "ESPEJO HUMO 6 MM CANTO PULIDO": 5098.2,
    "ESPEJO BRONCE 6 MM CANTO PULIDO": 1762.32,
    "ESPEJO FUME 6 MM CANTO PULIDO": 21420.44
  };
  
  // Almacenar el item original (incluyendo __tempIndex) en el atributo data-original-item
  const originalItemDataAttr = isEdit ? `data-original-item='${JSON.stringify(itemData)}'` : '';


  // --- Estructura Modal (Adaptada a 2 columnas + 1 fila final) ---
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)", display: "flex", justifyContent: "center", 
    alignItems: "center", zIndex: "9999", backdropFilter: "blur(8px)"
  });

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", color: "#E8EBE0", borderRadius: "20px", 
    boxShadow: "0 4px 60px rgba(0,0,0,0.4)", backdropFilter: "blur(25px)", 
    border: "1px solid rgba(255, 255, 255, 0.1)", padding: "30px", width: "850px",
    maxHeight: "90vh", overflowY: "auto", 
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });


  // --- HTML del formulario (Grid Layout de 2 columnas y 1 fila final) ---
  modal.innerHTML = `
    <style>
      /* Estilos para el Glassmorphism Rústico/Natural (Metal) */
      .form-control-sm {
        background: rgba(0, 0, 0, 0.25);
        color: #E8EBE0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 6px 10px; 
        font-size: 11px !important; 
        width: 100%;
      }
      .form-control-sm:focus {
        background: rgba(0, 0, 0, 0.35);
        border-color: #D4A373;
        box-shadow: 0 0 5px rgba(212, 163, 115, 0.6);
        color: #fff;
      }
      label { 
        font-weight: 600; 
        color: #E8EBE0;
        font-size: 11px !important; 
        margin-bottom: 4px;
        display: block; /* Asegura que la etiqueta tome su propia línea */
      }
      select option { background-color: #3C473C; color: #E8EBE0; }
      
      /* Campos de solo lectura */
      #numEspejo, #cantidadEspejo, #subtotalEspejo {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Botones (Estilo Metal) */
      .btn-info { 
        background-color: #D4A373 !important;
        color: #2A302A !important; 
        font-weight: bold;
        border: none !important; 
        border-radius: 8px;
        transition: background-color 0.2s;
      }
      .btn-info:hover { background-color: #E8B986 !important; }

      .btn-secondary { 
        background-color: rgba(255, 255, 255, 0.1) !important; 
        color: #E8EBE0 !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important; 
        border-radius: 8px;
      }
      .btn-secondary:hover { background-color: rgba(255, 255, 255, 0.2) !important; }
      
      .d-none { display: none !important; }
      
      /* Título */
      .modal-title-metal {
        color: #D4A373;
        font-weight: bold;
        text-shadow: 0 0 8px rgba(212, 163, 115, 0.3);
        font-size: 18px !important;
      }
      
      /* Estructura del Formulario */
      .form-grid-2-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      .final-fields-grid {
        display: grid;
        grid-template-columns: 2fr 4fr 1fr 2fr 2fr 2fr; /* Clave, Desc, Unidad, Cantidad, P.U., Subtotal */
        gap: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 20px;
      }
      .input-group-compact { margin-bottom: 12px; }
    </style>

    <h4 class="text-center mb-4 modal-title-metal">
      ${modalTitle}
    </h4>

    <form id="espejoForm">
      <div class="form-grid-2-col">
        <div>
          <div class="row">
            <div class="col-4 input-group-compact">
              <label>No.</label>
              <input type="text" id="numEspejo" class="form-control form-control-sm" value="${numFila}" readonly ${originalItemDataAttr}>
            </div>
            <div class="col-8 input-group-compact">
              <label>Categoría</label>
              <select id="categoriaEspejo" class="form-control form-control-sm">
                ${categorias.map(cat => `<option value="${cat}" ${cat === (itemData?.categoria || 'ESPEJO') ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="input-group-compact">
            <label>Material</label>
            <select id="materialEspejo" class="form-control form-control-sm" required>
              <option value="">Seleccione...</option>
              ${materiales.map(m => `<option value="${m}" ${m.toUpperCase() === currentMaterial ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>

          <div class="input-group-compact ${isOtro ? '' : 'd-none'}" id="campoLargoMaterial">
            <label>Largo de material (mm)</label>
            <input type="number" id="largoMaterialEspejo" class="form-control form-control-sm" step="0.01" value="${itemData?.largoMaterial || ''}">
          </div>
          <div class="input-group-compact ${isOtro ? '' : 'd-none'}" id="campoAnchoMaterial">
            <label>Ancho de material (mm)</label>
            <input type="number" id="anchoMaterialEspejo" class="form-control form-control-sm" step="0.01" value="${itemData?.anchoMaterial || ''}">
          </div>
        </div>

        <div>
          <div class="input-group-compact">
            <label>Nombre de la pieza</label>
            <input type="text" id="nombrePiezaEspejo" class="form-control form-control-sm" required value="${itemData?.nombrePieza || ''}">
          </div>
          <div class="input-group-compact">
            <label>Largo (mm)</label>
            <input type="number" id="largoEspejo" class="form-control form-control-sm" step="0.01" value="${itemData?.largo || ''}">
          </div>
          <div class="input-group-compact">
            <label>Ancho (mm)</label>
            <input type="number" id="anchoEspejo" class="form-control form-control-sm" step="0.01" value="${itemData?.ancho || ''}">
          </div>
          <div class="input-group-compact">
            <label>No. piezas</label>
            <input type="number" id="numPiezasEspejo" class="form-control form-control-sm" step="1" min="1" value="${itemData?.numPiezas || 1}">
          </div>
        </div>
      </div>

      <div class="final-fields-grid">
        <div><label>Clave</label><input type="text" id="claveEspejo" class="form-control form-control-sm" value="${itemData?.clave || ''}"></div>
        <div><label>Descripción</label><input type="text" id="descripcionEspejo" class="form-control form-control-sm" value="${itemData?.descripcion || ''}"></div>
        <div><label>Unidad</label><input type="text" id="unidadEspejo" class="form-control form-control-sm" value="${itemData?.unidad || ''}"></div>
        <div><label>Cantidad</label><input type="number" id="cantidadEspejo" class="form-control form-control-sm" value="${(itemData?.cantidad || 0).toFixed(3)}" readonly></div>
        <div><label>P.U. ($)</label><input type="text" id="puEspejo" class="form-control form-control-sm" placeholder="$0.00" value="${formatCurrency(itemData?.pu || 0)}"></div>
        <div><label>Subtotal ($)</label><input type="text" id="subtotalEspejo" class="form-control form-control-sm" value="${formatCurrency(itemData?.subtotal || 0)}" readonly></div>
      </div>

      <div class="text-center mt-4">
        <button type="submit" class="btn btn-info btn-sm text-white px-4">${submitButtonText}</button>
        <button type="button" class="btn btn-secondary btn-sm px-4" id="cerrarModalEspejo">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 🔹 Botón Cerrar
  document.getElementById("cerrarModalEspejo").onclick = () => overlay.remove();

  // 🔹 Variables y elementos
  const materialSelect = document.getElementById("materialEspejo");
  const largo = document.getElementById("largoEspejo");
  const ancho = document.getElementById("anchoEspejo");
  const piezas = document.getElementById("numPiezasEspejo");
  const largoMat = document.getElementById("largoMaterialEspejo");
  const anchoMat = document.getElementById("anchoMaterialEspejo");
  const cantidad = document.getElementById("cantidadEspejo");
  const pu = document.getElementById("puEspejo");
  const subtotal = document.getElementById("subtotalEspejo");
  const descripcion = document.getElementById("descripcionEspejo");
  const unidad = document.getElementById("unidadEspejo");
  const numEspejoInput = document.getElementById("numEspejo");
  
  // --- Mostrar/ocultar campos según material y actualizar descripción/PU ---
  const actualizarCampos = (isInitialLoad = false) => {
    const mat = materialSelect.value.toUpperCase();
    
    // Ocultar campos de material por defecto
    campoLargoMaterial.classList.add("d-none");
    campoAnchoMaterial.classList.add("d-none");
    
    // Si no es "OTRO", actualizar Descripción, Unidad y PU
    if (precios[mat]) {
      descripcion.value = mat;
      unidad.value = "M2";
      pu.value = formatCurrency(precios[mat]);
      
      // Asegurarse de que los campos de material estén vacíos si no es OTRO
      if (!isInitialLoad || itemData?.material.toUpperCase() !== mat) {
        largoMat.value = '';
        anchoMat.value = '';
      }
      
    } else if (mat.includes("OTRO")) {
      campoLargoMaterial.classList.remove("d-none");
      campoAnchoMaterial.classList.remove("d-none");
      
      // Si no es edición o si el material ha cambiado, limpiar descripción y PU, dejar M2
      if (!isEdit || mat !== currentMaterial) {
        descripcion.value = "";
        pu.value = "$0.00";
      }
      unidad.value = "M2";

    } else {
      // Si no hay selección
      descripcion.value = "";
      unidad.value = "";
      pu.value = "$0.00";
    }
    
    calcularCantidad();
  }
  materialSelect.addEventListener("change", () => actualizarCampos());

  // --- Cálculos de Cantidad y Subtotal ---
  
  // Agregar listeners de input para todos los campos que afectan la cantidad
  [largo, ancho, piezas, largoMat, anchoMat].forEach(input => {
    input.addEventListener("input", calcularCantidad);
  });

  pu.addEventListener("blur", () => {
    const val = parseCurrency(pu.value);
    pu.value = formatCurrency(val);
    calcularSubtotal();
  });
  // Calcular subtotal al cambiar PU
  pu.addEventListener("input", calcularSubtotal);


  function calcularCantidad() {
    const mat = materialSelect.value.toUpperCase();
    const l = parseFloat(largo.value) || 0;
    const a = parseFloat(ancho.value) || 0;
    const p = parseFloat(piezas.value) || 1;
    const lm = parseFloat(largoMat.value) || 0;
    const am = parseFloat(anchoMat.value) || 0;
    let c = 0;

    // Lógica de cálculo (M2 estándar para materiales definidos)
    if (precios[mat]) {
      // (Largo * Ancho / 1000000) * No. Piezas
      c = (l * a / 1000000) * p; 
    } 
    // Lógica de cálculo (Ratio para OTRO)
    else if (mat.includes("OTRO")) {
      if (lm > 0 && am > 0) {
        // (Largo * Ancho / (Largo Material * Ancho Material)) * No. Piezas
        c = (l * a / (lm * am)) * p; 
      } else {
        // Si no hay medidas de material, usa M2 estándar como fallback
        c = (l * a / 1000000) * p; 
      }
    }
    
    cantidad.value = c.toFixed(3);
    calcularSubtotal();
  }

  function calcularSubtotal() {
    const val = (parseFloat(cantidad.value) || 0) * parseCurrency(pu.value);
    subtotal.value = formatCurrency(val);
  }

  // Inicializar campos si es modo edición o si hay una selección inicial
  if (isEdit || materialSelect.value) {
    // Si es edición, se usa isInitialLoad = true para no sobreescribir los campos OTRO
    actualizarCampos(true);
  } else {
    // Si no es edición y no hay material seleccionado, inicializa el campo de Unidad
    unidad.value = "M2";
  }


  // 🔹 Guardar fila (Lógica de Edición/Adición)
  document.getElementById("espejoForm").onsubmit = (e) => {
    e.preventDefault();
    
    const originalItemJson = numEspejoInput.getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    // Recolectar datos del formulario
    const data = {
      id: originalItem ? originalItem.id : (typeof generateUUID === 'function' ? generateUUID() : 'temp-' + Date.now()),
      no: numFila,
      categoria: "ESPEJO",
      material: materialSelect.value,
      nombrePieza: document.getElementById("nombrePiezaEspejo").value,
      largo: parseFloat(document.getElementById("largoEspejo").value) || 0,
      ancho: parseFloat(document.getElementById("anchoEspejo").value) || 0,
      numPiezas: parseInt(document.getElementById("numPiezasEspejo").value) || 1,
      // Campos condicionales para 'OTRO'
      largoMaterial: parseFloat(document.getElementById("largoMaterialEspejo").value) || 0,
      anchoMaterial: parseFloat(document.getElementById("anchoMaterialEspejo").value) || 0,
      clave: document.getElementById("claveEspejo").value,
      descripcion: descripcion.value,
      unidad: unidad.value,
      cantidad: parseFloat(document.getElementById("cantidadEspejo").value) || 0,
      pu: parseCurrency(pu.value),
      subtotal: parseCurrency(subtotal.value)
    };
    
    // ✅ LÓGICA DE EDICIÓN
    if (originalItem && typeof originalItem.__tempIndex === 'number') { 
        if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
          const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
          const indexToEdit = originalItem.__tempIndex; 

          if (indexToEdit >= 0 && indexToEdit < current.length) {
            const dataToSave = { ...data };
            delete dataToSave.__tempIndex; // Limpiar la clave temporal antes de guardar
            current[indexToEdit] = dataToSave; 
            updateDespieceStorageAndRender(current); 
            alert('ELEMENTO EDITADO CORRECTAMENTE.');
          } else {
            alert('Error al editar: Índice no válido.');
          }
        } else {
          alert('Error: La función updateDespieceStorageAndRender o la variable despieceStorageKey no están disponibles para la edición.');
        }
    } else {
      // Lógica de Adición Nueva
      if (typeof agregarFilaDespiece === "function") {
          agregarFilaDespiece(data);
      }
    }
    
    overlay.remove();
  };


  // 🔹 Cambio de categoría (Lógica de salto de formulario)
  document.getElementById("categoriaEspejo").addEventListener("change", (e) => {
    const raw = e.target.value.toUpperCase();
    
    // Normalización: Eliminar espacios y acentos
    const nuevaCat = raw
      .replace(/ /g, "")
      .replace(/\//g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); 
    
    overlay.remove();
    
    const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    
    const originalItemJson = numEspejoInput.getAttribute('data-original-item');
    const itemToPass = originalItemJson ? JSON.parse(originalItemJson) : null;
    
    if (typeof window[funcName] === "function") {
      window[funcName](itemToPass); 
    } else {
      alert(`El formulario para la categoría "${e.target.value}" no está disponible (se espera la función ${funcName}).`);
    }
  });

}