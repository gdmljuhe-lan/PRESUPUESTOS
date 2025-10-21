// Se requiere que las funciones 'agregarFilaDespiece' estén definidas en el script principal.

/**
 * Muestra el formulario de Mano de Obra con funcionalidad de adición/edición.
 * (Estilo Glassmorphism/Metal Rústico COPIADO de formularioBarniz.js)
 * @param {Object | null} itemToEdit - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es una nueva fila.
 */
function mostrarFormularioManodeobra(itemToEdit = null) {
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

  // 🔹 Lógica para modo Edición o Agregar
  const isEdit = itemToEdit !== null && typeof itemToEdit.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemToEdit.descripcion || 'MANO DE OBRA'}` : 'FORMULARIO CATEGORÍA: MANO DE OBRA';

  // Determina el número de fila.
  let numFila = (itemToEdit && itemToEdit.no) ? itemToEdit.no : 0;
  if (!itemToEdit) {
    const despieceTable = document.querySelector("#despieceTable tbody");
    const currentRows = despieceTable ? despieceTable.querySelectorAll("tr").length : 0;
    numFila = currentRows + 1;
  }
  
  // 🔹 Listados y Constantes
  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELÉCTRICO",
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];
  
  // ⭐ LISTADO DE DESCRIPCIONES Y PRECIOS
  const opcionesManodeobra = [
    "M.O. METAL",
    "M.O. MADERA",
    "M.O. ACRILICO",
    "M.O. ELECTRICO"
  ];
  
  const preciosManodeobra = {
    "M.O. METAL": 75,
    "M.O. MADERA": 90,
    "M.O. ACRILICO": 70,
    "M.O. ELECTRICO": 70
  };
  
  // 🔹 Inicialización de valores
  const defaultDescripcion = opcionesManodeobra[0];
  const initialDescripcion = itemToEdit?.descripcion || defaultDescripcion;

  let initialPU_calculated = preciosManodeobra[initialDescripcion] || 0;
  let initialUnidad_calculated = initialDescripcion ? 'HORAS' : ''; 

  const initialUnidad = itemToEdit?.unidad || initialUnidad_calculated;
  const initialPU = itemToEdit?.pu || initialPU_calculated; 
  const initialCantidad = itemToEdit?.cantidad || 1; 
  const initialSubtotal = isEdit ? itemToEdit.subtotal : (initialCantidad * initialPU);


  // 🔹 Fondo del modal (Glassmorphism Rústico)
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999", backdropFilter: "blur(8px)"
  });

  // 🔹 Modal principal (Glassmorphism Rústico/Natural)
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)",
    color: "#E8EBE0",
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "750px", 
    maxHeight: "90vh", 
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  // Almacenar el item original (incluyendo __tempIndex) en el atributo data-original-item
  const originalItemDataAttr = isEdit ? `data-original-item='${JSON.stringify(itemToEdit)}'` : '';


  modal.innerHTML = `
    <style>
      /* Estilos Glassmorphism Rústico/Natural (METAL) COPIADOS de formularioBarniz.js */
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
        line-height: 1.5; 
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

      /* Grid para No. y Categoría */
      .num-cat-row {
        display: grid;
        grid-template-columns: 1fr 2fr; 
        gap: 10px;
        margin-bottom: 25px; 
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Grid de la Fila Final */
      .final-fields-grid {
        display: grid;
        grid-template-columns: 4fr 2fr 2fr 2fr 2fr; 
        gap: 10px;
        margin-top: 10px; 
        padding-bottom: 10px;
      }

      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numManodeobra, #subtotalManodeobra, #unidadManodeobra {
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
        margin: 0 5px;
        text-transform: uppercase;
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
    </style>

    <h4 class="modal-header-metal" id="manodeobraModalTitle">${modalTitle}</h4>

    <form id="manodeobraForm" ${originalItemDataAttr}>
      
      <div class="num-cat-row">
        <div>
          <label>No.</label><input type="text" id="numManodeobra" class="metal-input" value="${numFila}" readonly>
        </div>
        <div>
          <label>Categoría</label>
          <select id="categoriaManodeobra" class="metal-input">
            ${categorias.map(c => `<option value="${c}" ${c === "MANO DE OBRA" ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="final-fields-grid">
        <div class="form-group-compact" style="grid-column: span 1;">
          <label>Descripción</label>
          <select id="descripcionManodeobra" class="metal-input">
            ${opcionesManodeobra.map(o => `<option value="${o}" ${o === initialDescripcion ? "selected" : ""}>${o}</option>`).join("")}
          </select>
        </div>
        <div class="form-group-compact"><label>Unidad</label><input type="text" id="unidadManodeobra" class="metal-input" value="${initialUnidad}" readonly></div>
        <div class="form-group-compact"><label>Cantidad</label><input type="number" id="cantidadManodeobra" class="metal-input" min="0" step="0.01" value="${initialCantidad}"></div>
        <div class="form-group-compact"><label>P.U. ($)</label><input type="number" id="puManodeobra" class="metal-input" min="0" step="0.01" value="${initialPU.toFixed(2)}"></div>
        <div class="form-group-compact"><label>Subtotal ($)</label><input type="text" id="subtotalManodeobra" class="metal-input" value="${formatCurrency(initialSubtotal)}" readonly></div>
      </div>

      <div class="text-center" style="margin-top: 25px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalManodeobra">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 1. OBTENCIÓN DE ELEMENTOS Y CÁLCULO
  // -----------------------------------------------------------------------
  const descripcionSelect = modal.querySelector("#descripcionManodeobra");
  const unidadInput = modal.querySelector("#unidadManodeobra");
  const cantidadInput = modal.querySelector("#cantidadManodeobra");
  const puInput = modal.querySelector("#puManodeobra");
  const subtotalInput = modal.querySelector("#subtotalManodeobra");
  const categoriaSelect = modal.querySelector("#categoriaManodeobra");
  
  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseFloat(puInput.value) || 0;
    subtotalInput.value = formatCurrency(cantidad * pu);
  }

  // 2. EVENTOS DINÁMICOS Y NAVEGACIÓN
  // -----------------------------------------------------------------------
  
  // Asignar listeners
  cantidadInput.addEventListener("input", calcularSubtotal);
  puInput.addEventListener("input", calcularSubtotal);
  
  // Listener para la descripción (LÓGICA CORREGIDA PARA PERMITIR EDICIÓN)
  descripcionSelect.addEventListener("change", (e) => {
    const seleccion = e.target.value;
    unidadInput.value = 'HORAS';
    const nuevoPU = preciosManodeobra[seleccion] || 0;
    
    // Si NO estamos en modo edición (es adición) O si el P.U. actual es 0, forzamos el P.U. por defecto.
    // Esto respeta el P.U. editado manualmente si estamos en edición.
    if (!isEdit || parseFloat(puInput.value) === 0) {
      puInput.value = nuevoPU.toFixed(2);
    }
    
    calcularSubtotal();
  });
  
  // Cerrar modal
  modal.querySelector("#cerrarModalManodeobra").onclick = () => overlay.remove();

  // Cambio de categoría (manejo de navegación)
  categoriaSelect.addEventListener("change", e => {
    const nuevaCat = e.target.value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "")
      .replace(/\//g, ""); 
    
    overlay.remove();
    
    const funcionNombre = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    
    if (typeof window[funcionNombre] === "function") {
      const itemToPass = isEdit ? itemToEdit : null;
      window[funcionNombre](itemToPass); 
    } else {
      alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
    }
  });

  // Navegación con flechas
  const inputs = Array.from(modal.querySelectorAll(".metal-input, .btn-action-metal"));
  inputs.forEach((input, index) => {
    const total = inputs.length;
    input.addEventListener("keydown", e => {
      if (["ArrowDown","ArrowRight","Enter"].includes(e.key) && !e.shiftKey) {
        e.preventDefault();
        if (e.target.type !== "submit" && e.target.type !== "button") {
          inputs[(index + 1) % total]?.focus();
        }
      } else if (["ArrowUp","ArrowLeft"].includes(e.key) || (e.key === "Enter" && e.shiftKey)) {
        e.preventDefault();
        inputs[(index - 1 + total) % total]?.focus();
      }
    });
  });

  // 3. GUARDAR FILA (LÓGICA DE EDICIÓN/ADICIÓN)
  // -----------------------------------------------------------------------
  modal.querySelector("#manodeobraForm").onsubmit = e => {
    e.preventDefault();
    
    // Recolectar datos nuevos
    const newData = {
      no: numFila, 
      categoria: "MANO DE OBRA",
      descripcion: descripcionSelect.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseFloat(puInput.value) || 0, 
      subtotal: parseCurrency(subtotalInput.value)
    };

    // Obtener el objeto original (para edición)
    // ESTE ATRIBUTO YA NO SE BORRA AL CAMBIAR LA DESCRIPCIÓN, PERMITIENDO LA EDICIÓN.
    const originalItemJson = modal.querySelector("#manodeobraForm").getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    // Lógica para Adición vs. Edición
    if (originalItem && typeof originalItem.__tempIndex === 'number') {
        const indexToEdit = originalItem.__tempIndex;

        if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
            const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
            
            if (indexToEdit >= 0 && indexToEdit < current.length) {
              const dataToSave = { ...newData };
              current[indexToEdit] = dataToSave;
              
              updateDespieceStorageAndRender(current);
              alert('ELEMENTO EDITADO CORRECTAMENTE.');
            } else {
              alert('Error al editar: Índice no válido.');
            }
        } else {
             if (typeof agregarFilaDespiece === "function") {
                // Opción fallback para agregarFilaDespiece si updateDespieceStorageAndRender no existe
                agregarFilaDespiece(newData, originalItem);
            } else {
                 alert('Error: La función updateDespieceStorageAndRender o agregarFilaDespiece no están disponibles.');
            }
        }
    } else {
        // Lógica de Adición Nueva
        if (typeof agregarFilaDespiece === "function") {
            agregarFilaDespiece(newData);
        } else {
            alert('Error: La función agregarFilaDespiece no está disponible para la adición.');
        }
    }
    
    overlay.remove();
  };
}