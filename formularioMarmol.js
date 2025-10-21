/**
 * Muestra el formulario de Mármol.
 * @param {Object | null} itemToEdit - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioMarmol(itemToEdit = null) {
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(value) {
    if (isNaN(value) || value === "") return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(str) {
    return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- FIN Funciones auxiliares ---

  // --- Fondo del modal ---
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex", justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
    backdropFilter: "blur(4px)"
  });

  // --- Ventana modal con estilo Metal (Dark Brown/Gray) ---
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "#202020",
    color: "#e8e8e8",
    borderRadius: "6px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.7)",
    padding: "30px",
    width: "850px",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid #444",
    fontFamily: "'Roboto', sans-serif"
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO",
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const materiales = [
    "SUPERFICIE SOLIDA",
    "MARMOL",
    "ADHESIVO SUPERFICIE SOLIDA",
    "OTRO"
  ];

  // LÓGICA DE NÚMERO DE FILA Y TÍTULO
  const isEdit = itemToEdit !== null;
  let numFila = isEdit ? itemToEdit.no : (document.querySelectorAll("#despieceTable tbody tr").length + 1);
  const modalTitle = isEdit ? "EDITAR PIEZA DE MÁRMOL" : "FORMULARIO CATEGORÍA: MÁRMOL";
  const buttonText = isEdit ? "GUARDAR CAMBIOS" : "AGREGAR";

  // --- Estructura HTML ---
  modal.innerHTML = `
    <style>
      .form-control-sm {
        background: #333;
        color: #e8e8e8;
        border: 1px solid #555;
        border-radius: 4px;
        transition: border-color 0.3s, box-shadow 0.3s;
        text-transform: uppercase;
      }
      .form-control-sm:focus {
        background: #444; 
        border-color: #f7931e;
        box-shadow: 0 0 5px rgba(247, 147, 30, 0.5);
        color: #fff;
      }
      label { 
        font-weight: 600; 
        color: #c0c0c0;
        font-size: 11px !important;
        margin-bottom: 4px;
        display: block;
      }
      select option { background-color: #202020; color: #e8e8e8; }
      #numMarmol, #cantidadMarmol, #subtotalMarmol {
        background: #303030 !important; 
        color: #aaaaaa !important; 
        font-weight: normal;
        opacity: 0.8;
      }
      .btn-action-metal {
        font-size: 12px;
        border-radius: 8px;
        padding: 8px 20px;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
        margin: 0 5px;
      }
      .btn-agregar-metal {
        background-color: #D4A373 !important;
        color: #2A302A !important;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }
      .btn-agregar-metal:hover { background-color: #E8B986 !important; }
      .btn-cancelar-metal {
        background-color: #555 !important;
        color: #E8EBE0 !important;
        border: 1px solid #444 !important;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }
      .btn-cancelar-metal:hover { background-color: #444 !important; }
      .modal-header-metal {
        color: #D4A373;
        font-weight: bold;
        text-shadow: 0 0 8px rgba(212, 163, 115, 0.3);
        font-size: 18px !important;
        text-align: center;
        margin-bottom: 25px;
      }
    </style>

    <h4 class="modal-header-metal" id="marmolModalTitle">${modalTitle}</h4>
    
    <form id="marmolForm">
      <div class="row mb-3">
        <div class="col-md-6">
          <div class="mb-3">
            <label>No.</label>
            <input type="text" id="numMarmol" class="form-control form-control-sm" value="${numFila}" readonly>
          </div>
          <div class="mb-3">
            <label>Categoría</label>
            <select id="categoriaMarmol" class="form-control form-control-sm">
              ${categorias.map(cat => `<option value="${cat}" ${cat === 'MARMOL' ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>
          </div>
          <div class="mb-3">
            <label>Material</label>
            <select id="materialMarmol" class="form-control form-control-sm" required>
              <option value="">Seleccione...</option>
              ${materiales.map(m => `<option value="${m}" ${isEdit && m === itemToEdit.material ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          <div class="mb-3 d-none" id="campoLargoMaterial">
            <label>Largo de material (mm)</label>
            <input type="number" id="largoMaterialMarmol" class="form-control form-control-sm" step="0.01">
          </div>
          <div class="mb-3 d-none" id="campoAnchoMaterial">
            <label>Ancho de material (mm)</label>
            <input type="number" id="anchoMaterialMarmol" class="form-control form-control-sm" step="0.01">
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="mb-3">
            <label>Nombre de la pieza</label>
            <input type="text" id="nombrePiezaMarmol" class="form-control form-control-sm" required value="${isEdit ? itemToEdit.nombrePieza || '' : ''}">
          </div>
          <div class="mb-3">
            <label>Largo (mm)</label>
            <input type="number" id="largoMarmol" class="form-control form-control-sm" step="0.01" value="${isEdit ? itemToEdit.largo || '' : ''}">
          </div>
          <div class="mb-3">
            <label>Ancho (mm)</label>
            <input type="number" id="anchoMarmol" class="form-control form-control-sm" step="0.01" value="${isEdit ? itemToEdit.ancho || '' : ''}">
          </div>
          <div class="mb-3">
            <label>No. piezas</label>
            <input type="number" id="numPiezasMarmol" class="form-control form-control-sm" step="1" min="1" value="${isEdit ? itemToEdit.numPiezas || 1 : 1}">
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-2">
          <label>Clave</label>
          <input type="text" id="claveMarmol" class="form-control form-control-sm" value="${isEdit ? itemToEdit.clave || '' : ''}">
        </div>
        <div class="col-md-4">
          <label>Descripción</label>
          <input type="text" id="descripcionMarmol" class="form-control form-control-sm" list="descripcionOptions" value="${isEdit ? itemToEdit.descripcion || '' : ''}">
          <datalist id="descripcionOptions"></datalist>
        </div>
        <div class="col-md-1">
          <label>Unidad</label>
          <input type="text" id="unidadMarmol" class="form-control form-control-sm" value="${isEdit ? itemToEdit.unidad || '' : ''}">
        </div>
        <div class="col-md-2">
          <label>Cantidad</label>
          <input type="number" id="cantidadMarmol" class="form-control form-control-sm" value="${isEdit ? (parseFloat(itemToEdit.cantidad) || 0).toFixed(3) : '0.000'}" readonly>
        </div>
        <div class="col-md-2">
          <label>P.U. ($)</label>
          <input type="text" id="puMarmol" class="form-control form-control-sm" value="${isEdit ? formatCurrency(itemToEdit.pu || 0) : '$0.00'}">
        </div>
        <div class="col-md-1">
          <label>Subtotal ($)</label>
          <input type="text" id="subtotalMarmol" class="form-control form-control-sm" value="${isEdit ? formatCurrency(itemToEdit.subtotal || 0) : '$0.00'}" readonly>
        </div>
      </div>

      <div class="text-center mt-4">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${buttonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalMarmol">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Variables principales
  const categoriaSelect = document.getElementById("categoriaMarmol");
  const materialSelect = document.getElementById("materialMarmol");
  const nombrePiezaInput = document.getElementById("nombrePiezaMarmol");
  const largoInput = document.getElementById("largoMarmol");
  const anchoInput = document.getElementById("anchoMarmol");
  const numPiezasInput = document.getElementById("numPiezasMarmol");
  const largoMaterialInput = document.getElementById("largoMaterialMarmol");
  const anchoMaterialInput = document.getElementById("anchoMaterialMarmol");
  const claveInput = document.getElementById("claveMarmol");
  const descripcionInput = document.getElementById("descripcionMarmol");
  const unidadInput = document.getElementById("unidadMarmol");
  const inputCantidad = document.getElementById("cantidadMarmol");
  const inputPU = document.getElementById("puMarmol");
  const inputSubtotal = document.getElementById("subtotalMarmol");
  const datalist = document.getElementById("descripcionOptions");

  // Claves de localStorage
  const MARMOL_DATA_KEY = 'acumuladoMarmolData';
  const SUPERFICIE_SOLIDA_DATA_KEY = 'acumuladoSuperficieSolidaData';

  // Función para actualizar el datalist según el material seleccionado
  function actualizarDatalist() {
    const material = materialSelect.value.toUpperCase();
    datalist.innerHTML = ''; // Limpiar datalist
    let data = [];
    
    if (material === "MARMOL") {
      data = JSON.parse(localStorage.getItem(MARMOL_DATA_KEY) || '[]');
    } else if (material === "SUPERFICIE SOLIDA") {
      data = JSON.parse(localStorage.getItem(SUPERFICIE_SOLIDA_DATA_KEY) || '[]');
    }

    if (data.length > 0) {
      const uniqueDescripciones = [...new Set(data.map(item => item.descripcion.trim()))];
      uniqueDescripciones.forEach(desc => {
        const option = document.createElement('option');
        option.value = desc;
        datalist.appendChild(option);
      });
    } else {
      console.warn(`No hay datos para ${material} cargados en localStorage. Sube un archivo en acumuladogdml.html.`);
    }
  }

  // Función de autocompletado
  function autocompletarCampos() {
    const material = materialSelect.value.toUpperCase();
    const valor = descripcionInput.value.trim();
    let data = [];

    if (material === "MARMOL") {
      data = JSON.parse(localStorage.getItem(MARMOL_DATA_KEY) || '[]');
    } else if (material === "SUPERFICIE SOLIDA") {
      data = JSON.parse(localStorage.getItem(SUPERFICIE_SOLIDA_DATA_KEY) || '[]');
    }

    const match = data.find(item => item.descripcion.trim().toUpperCase() === valor.toUpperCase());
    if (match) {
      claveInput.value = match.clave || '';
      unidadInput.value = match.unidad || '';
      inputPU.value = formatCurrency(match["P.U. ($)"] || 0);
      calcularSubtotal();
    }
  }

  // Mostrar/ocultar campos según material
  function actualizarCampos() {
    const mat = materialSelect.value.toUpperCase();
    const campoLargoMaterial = document.getElementById("campoLargoMaterial");
    const campoAnchoMaterial = document.getElementById("campoAnchoMaterial");
    campoLargoMaterial.classList.add("d-none");
    campoAnchoMaterial.classList.add("d-none");
    if (mat === "OTRO") {
      campoLargoMaterial.classList.remove("d-none");
      campoAnchoMaterial.classList.remove("d-none");
    }
    actualizarDatalist(); // Actualizar datalist al cambiar material
    calcularCantidad();
  }

  // Cálculo de cantidad
  function calcularCantidad() {
    const mat = materialSelect.value.toUpperCase();
    const largo = parseFloat(largoInput.value) || 0;
    const ancho = parseFloat(anchoInput.value) || 0;
    const piezas = parseFloat(numPiezasInput.value) || 1;
    const largoMaterial = parseFloat(largoMaterialInput.value) || 0;
    const anchoMaterial = parseFloat(anchoMaterialInput.value) || 0;
    let cantidad = 0;

    if (["SUPERFICIE SOLIDA", "MARMOL"].includes(mat)) {
      cantidad = ((largo * ancho) / 1000000) * piezas; // m²
    } else if (mat === "ADHESIVO SUPERFICIE SOLIDA") {
      cantidad = 0; // Para adhesivo, cantidad manual
    } else if (mat === "OTRO" && largoMaterial > 0 && anchoMaterial > 0) {
      cantidad = ((largo * ancho) / (largoMaterial * anchoMaterial)) * piezas;
    }

    inputCantidad.value = cantidad.toFixed(3);
    calcularSubtotal();
  }

  // Cálculo de subtotal
  function calcularSubtotal() {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    const pu = parseCurrency(inputPU.value);
    const subtotal = cantidad * pu;
    inputSubtotal.value = formatCurrency(subtotal);
  }

  // Pre-carga para edición
  if (isEdit) {
    claveInput.value = itemToEdit.clave || '';
    nombrePiezaInput.value = itemToEdit.nombrePieza || '';
    materialSelect.value = itemToEdit.material || '';
    largoInput.value = itemToEdit.largo || '';
    anchoInput.value = itemToEdit.ancho || '';
    numPiezasInput.value = itemToEdit.numPiezas || 1;
    largoMaterialInput.value = itemToEdit.largoMaterial || '';
    anchoMaterialInput.value = itemToEdit.anchoMaterial || '';
    descripcionInput.value = itemToEdit.descripcion || '';
    unidadInput.value = itemToEdit.unidad || '';
    inputCantidad.value = (parseFloat(itemToEdit.cantidad) || 0).toFixed(3);
    inputPU.value = formatCurrency(itemToEdit.pu);
    inputSubtotal.value = formatCurrency(itemToEdit.subtotal);
    
    actualizarCampos();
    claveInput.dataset.originalItem = JSON.stringify(itemToEdit);
  } else {
    actualizarCampos();
  }

  // Eventos dinámicos
  materialSelect.addEventListener("change", actualizarCampos);
  ["largoMarmol","anchoMarmol","numPiezasMarmol","largoMaterialMarmol","anchoMaterialMarmol"]
    .forEach(id => document.getElementById(id)?.addEventListener("input", calcularCantidad));
  
  inputCantidad.addEventListener("input", calcularSubtotal);
  inputPU.addEventListener("blur", () => {
    const val = parseCurrency(inputPU.value);
    inputPU.value = formatCurrency(val);
    calcularSubtotal();
  });
  inputPU.addEventListener("input", calcularSubtotal);

  descripcionInput.addEventListener("input", autocompletarCampos);
  descripcionInput.addEventListener("dblclick", () => {
    descripcionInput.value = '';
    claveInput.value = '';
    unidadInput.value = '';
    inputPU.value = '$0.00';
    calcularSubtotal();
    descripcionInput.focus();
  });

  document.getElementById("cerrarModalMarmol").onclick = () => overlay.remove();

  categoriaSelect.addEventListener("change", (e) => {
    const nuevaCat = e.target.value.toUpperCase().replace(/ /g, '').replace(/\//g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    overlay.remove();
    const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    const itemToPass = isEdit ? itemToEdit : null;
    if (typeof window[funcName] === "function") {
      window[funcName](itemToPass);
    } else {
      alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
    }
  });

  const inputs = Array.from(modal.querySelectorAll("input:not([readonly]), select, button"));
  inputs.forEach((el, i) => {
    el.addEventListener("keydown", e => {
      const isTextInput = el.tagName === "INPUT" && ["text", "number"].includes(el.type) && !el.readOnly;
      const cursorPos = isTextInput ? el.selectionStart : null;
      const textLength = isTextInput ? el.value.length : 0;

      if ((e.key === "ArrowRight" || e.key === "Enter") && e.target.type !== "submit") {
        if (!isTextInput || cursorPos === textLength) {
          e.preventDefault();
          inputs[i + 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" || (e.key === "Enter" && e.shiftKey)) {
        if (!isTextInput || cursorPos === 0) {
          e.preventDefault();
          inputs[i - 1]?.focus();
        }
      } else if (e.key === "ArrowDown") {
        if (!isTextInput || cursorPos === textLength) {
          e.preventDefault();
          inputs[i + 1]?.focus();
        }
      } else if (e.key === "ArrowUp") {
        if (!isTextInput || cursorPos === 0) {
          e.preventDefault();
          inputs[i - 1]?.focus();
        }
      }
    });
  });

  document.getElementById("marmolForm").onsubmit = (e) => {
    e.preventDefault();
    const originalItemJson = claveInput.dataset.originalItem;
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;
    const newData = {
      no: numFila,
      categoria: "MARMOL",
      material: materialSelect.value,
      nombrePieza: nombrePiezaInput.value,
      largo: parseFloat(largoInput.value) || 0,
      ancho: parseFloat(anchoInput.value) || 0,
      numPiezas: parseInt(numPiezasInput.value) || 1,
      largoMaterial: parseFloat(largoMaterialInput.value) || 0,
      anchoMaterial: parseFloat(anchoMaterialInput.value) || 0,
      clave: claveInput.value,
      descripcion: descripcionInput.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(inputCantidad.value) || 0,
      pu: parseCurrency(inputPU.value),
      subtotal: parseCurrency(inputSubtotal.value)
    };

    if (originalItem) {
      if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
        const currentList = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
        const indexToUpdate = currentList.findIndex(item => item.no === originalItem.no);
        if (indexToUpdate !== -1) {
          currentList[indexToUpdate] = newData;
          updateDespieceStorageAndRender(currentList);
          alert('ELEMENTO EDITADO CORRECTAMENTE.');
        } else {
          alert('Error al editar: No se encontró la fila original para modificar (No.: ' + originalItem.no + ').');
        }
      } else {
        if (typeof agregarFilaDespiece === "function") {
          agregarFilaDespiece(newData, originalItem);
        } else {
          alert("⚠️ No se encontraron las funciones de utilidades necesarias para la edición.");
        }
      }
    } else {
      if (typeof agregarFilaDespiece === "function") {
        agregarFilaDespiece(newData, null);
      } else {
        alert("⚠️ No se encontró la función agregarFilaDespiece().");
      }
    }
    overlay.remove();
  };
}