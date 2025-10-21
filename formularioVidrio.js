// Se requiere que las funciones 'agregarFilaDespiece' y 'updateDespieceStorageAndRender'
// y la variable 'despieceStorageKey' estén definidas en el script principal.

/**
 * Muestra el formulario de Vidrio con estilo Glassmorphism Rústico/Natural (METAL).
 * @param {Object | null} itemData - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioVidrio(itemData = null) {
  // 🔹 Cierra cualquier modal anterior antes de abrir uno nuevo
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- FIN Funciones auxiliares ---

  // --- LÓGICA DE EDICIÓN/ADICIÓN ---
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.nombrePieza || 'PIEZA VIDRIO'}` : 'FORMULARIO CATEGORÍA: VIDRIO';
  
  // Determina el número de fila: usa el original si editas, calcula uno nuevo si añades.
  const numFila = isEdit ? itemData.no : (document.querySelectorAll("#despieceTable tbody tr").length + 1);

  // --- Fondo del modal (Estilo Glassmorphism Rústico) ---
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999", backdropFilter: "blur(8px)"
  });

  // --- Modal principal (Glassmorphism Rústico/Natural) ---
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", // Fondo semitransparente
    color: "#E8EBE0", // Color de texto claro (similar a Metal)
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)",
    padding: "30px",
    width: "850px",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO",
    "ACRILICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const materiales = ["CLARO", "EXTRA CLARO", "FILTRASOL", "OTRO (CRISTAL)"];

  const precios = {
    "CLARO": {
      "CRISTAL CLARO TEMPLADO 6 MM": 1289.45,
      "CRISTAL CLARO TEMPLADO 9 MM": 1862.32,
      "CRISTAL CLARO TEMPLADO 12 MM": 3568.57
    },
    "EXTRA CLARO": {
      "CRISTAL EXTRA CLARO TEMPLADO 6 MM": 3217.24,
      "CRISTAL EXTRA CLARO TEMPLADO 9.5 MM": 5507.66
    },
    "FILTRASOL": {
      "FILTRASOL 6 MM": 1425.59,
      "FILTRASOL 9.5 MM": 4787.33
    }
  };

  const espesores = {
    "CLARO": ["6 MM", "9 MM", "12 MM"],
    "EXTRA CLARO": ["6 MM", "9.5 MM"],
    "FILTRASOL": ["6 MM", "9.5 MM"]
  };
  
  // Se añade un campo de input oculto para el espesor para manejar el dato original si es 'OTRO'
  const espesorData = itemData?.espesor || (itemData?.material === 'CLARO' ? '6 MM' : '');
  const largoMaterialData = itemData?.largoMaterial || 0;
  const anchoMaterialData = itemData?.anchoMaterial || 0;


  modal.innerHTML = `
    <style>
      /* Estilos Glassmorphism Rústico/Natural (METAL) */
      .form-control-sm {
        background: rgba(0, 0, 0, 0.25);
        color: #E8EBE0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        text-transform: uppercase;
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
      }
      select option { color: #000; }
      
      /* Campos de solo lectura */
      #numVidrio, #cantidadVidrio, #subtotalVidrio { 
        color: #C8C8C8 !important; 
        font-weight: bold; 
        background: rgba(0, 0, 0, 0.15) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      /* Botón de Acción (AGREGAR/GUARDAR) */
      .btn-info { 
        background-color: #D4A373 !important; 
        border: 1px solid #D4A373 !important;
        color: #000 !important; 
        font-weight: bold;
      }
      .btn-info:hover { background-color: #C19160 !important; }
      
      /* Botón Secundario (CANCELAR) */
      .btn-secondary { 
        background-color: rgba(255, 255, 255, 0.1) !important; 
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        color: #E8EBE0 !important;
      }
    </style>

    <h4 class="text-center mb-3" style="color:#D4A373; font-weight:bold; text-shadow: 0 0 8px rgba(212, 163, 115, 0.3);">${modalTitle}</h4>

    <form id="vidrioForm">
      <div class="row mb-3">
        <div class="col-md-6">
          <label>No.</label>
          <input type="text" id="numVidrio" class="form-control form-control-sm" value="${numFila}" readonly>
        </div>
        <div class="col-md-6">
          <label>Categoría</label>
          <select id="categoriaVidrio" class="form-control form-control-sm">
            ${categorias.map(cat => `<option value="${cat}" ${cat === 'VIDRIO' ? 'selected' : ''}>${cat}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label>Material</label>
          <select id="materialVidrio" class="form-control form-control-sm" required>
            <option value="">Seleccione...</option>
            ${materiales.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
          
          <input type="hidden" id="espesorDataInput" value="${espesorData}">
          <input type="hidden" id="largoMaterialDataInput" value="${largoMaterialData}">
          <input type="hidden" id="anchoMaterialDataInput" value="${anchoMaterialData}">


          <div class="mb-2 d-none" id="campoEspesor">
            <label>Espesor</label>
            <select id="espesorVidrio" class="form-control form-control-sm"></select>
          </div>

          <div class="mb-2 d-none" id="campoLargoMaterial">
            <label>Largo de material (mm)</label>
            <input type="number" id="largoMaterialVidrio" class="form-control form-control-sm" step="0.01">
          </div>

          <div class="mb-2 d-none" id="campoAnchoMaterial">
            <label>Ancho de material (mm)</label>
            <input type="number" id="anchoMaterialVidrio" class="form-control form-control-sm" step="0.01">
          </div>
        </div>

        <div class="col-md-6">
          <label>Nombre de la pieza</label>
          <input type="text" id="nombrePiezaVidrio" class="form-control form-control-sm" required>
          <label>Largo (mm)</label>
          <input type="number" id="largoVidrio" class="form-control form-control-sm" step="0.01">
          <label>Ancho (mm)</label>
          <input type="number" id="anchoVidrio" class="form-control form-control-sm" step="0.01">
          <label>No. piezas</label>
          <input type="number" id="numPiezasVidrio" class="form-control form-control-sm" step="1" min="1" value="1">
        </div>
      </div>

      <div class="row mb-3 border-top pt-3">
        <div class="col-md-2"><label>Clave</label><input type="text" id="claveVidrio" class="form-control form-control-sm"></div>
        <div class="col-md-3"><label>Descripción</label><input type="text" id="descripcionVidrio" class="form-control form-control-sm"></div>
        <div class="col-md-1"><label>Unidad</label><input type="text" id="unidadVidrio" class="form-control form-control-sm"></div>
        <div class="col-md-2"><label>Cantidad</label><input type="number" id="cantidadVidrio" class="form-control form-control-sm" readonly></div>
        <div class="col-md-2"><label>P.U. ($)</label><input type="text" id="puVidrio" class="form-control form-control-sm" placeholder="$0.00"></div>
        <div class="col-md-2"><label>Subtotal ($)</label><input type="text" id="subtotalVidrio" class="form-control form-control-sm" value="$0.00" readonly></div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-info btn-sm text-white px-4">${submitButtonText}</button>
        <button type="button" class="btn btn-secondary btn-sm px-4" id="cerrarModalVidrio">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- OBTENCIÓN DE ELEMENTOS Y ASIGNACIÓN DE HANDLERS ---
  const materialSelect = document.getElementById("materialVidrio");
  const espesorSelect = document.getElementById("espesorVidrio");
  const largo = document.getElementById("largoVidrio");
  const ancho = document.getElementById("anchoVidrio");
  const largoMat = document.getElementById("largoMaterialVidrio");
  const anchoMat = document.getElementById("anchoMaterialVidrio");
  const piezas = document.getElementById("numPiezasVidrio");
  const cantidad = document.getElementById("cantidadVidrio");
  const pu = document.getElementById("puVidrio");
  const subtotal = document.getElementById("subtotalVidrio");
  const descripcion = document.getElementById("descripcionVidrio");
  const unidad = document.getElementById("unidadVidrio");
  const campoEspesor = document.getElementById("campoEspesor");
  const campoLargoMaterial = document.getElementById("campoLargoMaterial");
  const campoAnchoMaterial = document.getElementById("campoAnchoMaterial");
  const nombrePieza = document.getElementById("nombrePiezaVidrio");
  const clave = document.getElementById("claveVidrio");

  // === AUXILIARES PARA EDICIÓN ===
  
  // 1. Llenar campos con data si estamos editando
  function actualizarCampos() {
    if (!itemData) return;
    
    // Asignación de valores directos
    nombrePieza.value = itemData.nombrePieza || '';
    largo.value = itemData.largo || '';
    ancho.value = itemData.ancho || '';
    piezas.value = itemData.numPiezas || 1;
    clave.value = itemData.clave || '';
    
    descripcion.value = itemData.descripcion || '';
    unidad.value = itemData.unidad || '';
    cantidad.value = (itemData.cantidad || 0).toFixed(3);
    pu.value = formatCurrency(itemData.pu || 0);
    subtotal.value = formatCurrency(itemData.subtotal || 0);

    // Si hay datos de material, seleccionarlo y disparar el cambio
    if (itemData.material) {
        materialSelect.value = itemData.material;
        materialSelect.dispatchEvent(new Event('change'));
        
        // Esperar a que el evento 'change' en materialSelect llene el espesorSelect
        setTimeout(() => {
            const mat = itemData.material.toUpperCase();
            
            if (["CLARO","EXTRA CLARO","FILTRASOL"].includes(mat) && itemData.espesor) {
                // Seleccionar el espesor original
                espesorSelect.value = itemData.espesor;
                // Disparar change para asegurar que descripcion y PU se actualicen si es necesario
                espesorSelect.dispatchEvent(new Event('change'));
            } else if (mat.includes("OTRO")) {
                largoMat.value = itemData.largoMaterial || 0;
                anchoMat.value = itemData.anchoMaterial || 0;
            }
            calcularCantidad();
        }, 50); 
    }
  }

  // 2. Obtener la data actual del formulario
  function getCurrentFormData() {
    // Si estamos editando, incluimos el índice temporal para la actualización
    const baseData = {
      no: numFila,
      categoria: "VIDRIO",
      material: materialSelect.value,
      espesor: espesorSelect.value,
      largoMaterial: parseFloat(largoMat.value) || 0,
      anchoMaterial: parseFloat(anchoMat.value) || 0,
      nombrePieza: nombrePieza.value,
      largo: parseFloat(largo.value) || 0,
      ancho: parseFloat(ancho.value) || 0,
      numPiezas: parseInt(piezas.value) || 1,
      clave: clave.value,
      descripcion: descripcion.value,
      unidad: unidad.value,
      cantidad: parseFloat(cantidad.value) || 0,
      pu: parseCurrency(pu.value),
      subtotal: parseCurrency(subtotal.value)
    };

    return isEdit ? { ...baseData, __tempIndex: itemData.__tempIndex } : baseData;
  }
  
  // === MANEJO DE EVENTOS ===
  document.getElementById("cerrarModalVidrio").onclick = () => overlay.remove();

  // === CAMBIO DE CATEGORÍA (dinámico como en MÁRMOL) ===
  document.getElementById("categoriaVidrio").addEventListener("change", (e) => {
    const nuevaCat = e.target.value.toUpperCase().replace(/ /g,'').replace(/\//g,'');
    overlay.remove();
    const funcion = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    if (typeof window[funcion] === "function") {
      window[funcion](itemData); // Pasar itemData para mantener el contexto de edición
    } else {
      alert(`El formulario para la categoría "${e.target.value}" no está disponible.`);
    }
  });

  // === Lógica de cálculo y cambio de material ===
  materialSelect.addEventListener("change", () => {
    const mat = materialSelect.value.toUpperCase();
    campoLargoMaterial.classList.add("d-none");
    campoAnchoMaterial.classList.add("d-none");
    campoEspesor.classList.add("d-none");
    descripcion.value = "";
    unidad.value = "";
    pu.value = "$0.00";
    espesorSelect.innerHTML = "";

    if (["CLARO","EXTRA CLARO","FILTRASOL"].includes(mat)) {
      campoEspesor.classList.remove("d-none");
      espesores[mat].forEach(e => {
        const opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;
        espesorSelect.appendChild(opt);
      });
      // Seleccionar el primer elemento por defecto o si está en edición, se hace en actualizarCampos
      if (!isEdit) espesorSelect.dispatchEvent(new Event('change'));
    } else if (mat.includes("OTRO")) {
      campoLargoMaterial.classList.remove("d-none");
      campoAnchoMaterial.classList.remove("d-none");
      unidad.value = "M2";
    }
    calcularCantidad();
  });

  espesorSelect.addEventListener("change", () => {
    const mat = materialSelect.value.toUpperCase();
    const esp = espesorSelect.value;
    if (precios[mat]) {
      // Buscar la descripción que coincida con el espesor
      const desc = Object.keys(precios[mat]).find(d => d.includes(esp)); 
      if (desc) {
        descripcion.value = desc;
        unidad.value = "M2";
        pu.value = formatCurrency(precios[mat][desc]);
      }
    }
    calcularCantidad();
  });

  [largo, ancho, piezas, largoMat, anchoMat].forEach(i => i.addEventListener("input", calcularCantidad));
  pu.addEventListener("blur", () => { pu.value = formatCurrency(parseCurrency(pu.value)); calcularSubtotal(); });
  pu.addEventListener("input", calcularSubtotal);

  // Función de cálculo central
  function calcularCantidad() {
    const mat = materialSelect.value.toUpperCase();
    const l = parseFloat(largo.value) || 0;
    const a = parseFloat(ancho.value) || 0;
    const p = parseFloat(piezas.value) || 1;
    const lm = parseFloat(largoMat.value) || 0;
    const am = parseFloat(anchoMat.value) || 0;
    let c = 0;

    if (["CLARO","EXTRA CLARO","FILTRASOL"].includes(mat))
      // M2 = (Largo * Ancho / 1,000,000) * No. Piezas
      c = (l * a / 1000000) * p;
    else if (mat.includes("OTRO")) {
      if (lm > 0 && am > 0) 
        // Área usada / Área de material * No. Piezas
        c = (l * a / (lm * am)) * p;
      else 
        // Si no hay material, usa M2 por defecto (aunque no debería ocurrir)
        c = (l * a / 1000000) * p; 
    }
    cantidad.value = c.toFixed(3);
    calcularSubtotal();
  }

  function calcularSubtotal() {
    const val = (parseFloat(cantidad.value) || 0) * parseCurrency(pu.value);
    subtotal.value = formatCurrency(val);
  }

  // Si estamos en modo edición, inicializamos los campos con los datos
  if(isEdit) {
      actualizarCampos();
  } else {
    // Si es nueva fila, dispara el evento para inicializar espesor y precios si el material ya está seleccionado
    if (materialSelect.value) materialSelect.dispatchEvent(new Event('change'));
  }


  // === Guardar fila (LÓGICA DE EDICIÓN/ADICIÓN) ===
  document.getElementById("vidrioForm").onsubmit = (e) => {
    e.preventDefault();
    const data = getCurrentFormData();
    
    // Lógica de Edición
    if (isEdit) {
      if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
        const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
        const indexToEdit = itemData.__tempIndex;

        if (indexToEdit >= 0 && indexToEdit < current.length) {
            // Eliminar el índice temporal antes de guardar
            const dataToSave = { ...data };
            delete dataToSave.__tempIndex; 
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
      } else {
          alert('Error: La función agregarFilaDespiece no está disponible.');
      }
    }
    
    overlay.remove();
  };
}