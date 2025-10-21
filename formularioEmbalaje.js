// Se asume que las funciones 'agregarFilaDespiece' y 'updateDespieceStorageAndRender'
// y las variables 'despieceStorageKey' están definidas en el script principal.

/**
 * Muestra el formulario de Embalaje con funcionalidad de adición/edición.
 * (Estilo Glassmorphism/Metal Rústico con nuevo orden y campos simplificados)
 * @param {Object | null} itemData - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es una nueva fila.
 */
function mostrarFormularioEmbalaje(itemData = null) {
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
  // Es edición si el objeto viene y contiene el índice inyectado por el script principal
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA EMBALAJE'}` : 'FORMULARIO CATEGORÍA: EMBALAJE';

  // Determina el número de fila.
  const numFila = isEdit
    ? itemData.no
    : (document.getElementById("despieceList")?.rows?.length || 0) + 1;

  // 🔹 Listados y Constantes
  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELÉCTRICO",
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];
  
  // 🔹 Inicialización de valores con los defaults solicitados (si no es edición)
  const initialDescripcion = itemData?.descripcion || 'EMBALAJE'; // Default: EMBALAJE
  const initialUnidad = itemData?.unidad || 'pieza'; // Default: pieza
  const initialCantidad = itemData?.cantidad || 1; // Default: 1
  const initialPU = itemData?.pu || 100; // Default: 100.00
  const initialSubtotal = itemData?.subtotal || (initialCantidad * initialPU);


  // 🔹 Fondo del modal (Glassmorphism Rústico/Natural)
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999",
    backdropFilter: "blur(8px)" // Glassmorphism
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
    width: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  // Almacenar el item original (incluyendo __tempIndex) en el atributo data-original-item
  const originalItemDataAttr = isEdit ? `data-original-item='${JSON.stringify(itemData)}'` : '';

  const formHtml = `
    <style>
      /* Estilos Glassmorphism Rústico/Natural (METAL) */
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
        line-height: 1.5;
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
      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Botones (Estilo Rústico de Metal) */
      .btn-action-metal {
        font-size: 12px;
        border-radius: 8px;
        padding: 8px 20px;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
        text-transform: uppercase;
      }
      .btn-agregar-metal {
        background-color: #D4A373 !important; /* Accent terroso */
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

      /* Campos Readonly/Especiales */
      #subtotalEmbalaje {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
    </style>

    <h5 class="modal-header-metal">${modalTitle}</h5>

    <form id="embalajeForm" ${originalItemDataAttr}>

      <div class="row mb-3">
        <div class="col-md-3">
          <div class="mb-3">
            <label>No.</label>
            <input type="text" id="numEmbalaje" class="metal-input" value="${numFila}" readonly>
          </div>
          <div class="mb-3">
            <label>Categoría</label>
            <select id="categoriaEmbalaje" class="metal-input">
              ${categorias.map(c => `<option value="${c}" ${c === 'EMBALAJE' ? "selected" : ""}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        
        </div>

      <div class="row mb-3 border-top pt-3">
        
        <div class="col-md-2">
          <label>Clave</label>
          <input type="text" id="claveEmbalaje" class="metal-input" value="${itemData?.clave || ''}">
        </div>
        
        <div class="col-md-2"> <label>Descripción</label>
          <input type="text" id="descripcionEmbalaje" class="metal-input" value="${initialDescripcion}">
        </div>
        
        <div class="col-md-2">
          <label>Unidad</label>
          <input type="text" id="unidadEmbalaje" class="metal-input" value="${initialUnidad}">
        </div>
        
        <div class="col-md-2"> <label>Cantidad</label>
          <input type="number" id="cantidadEmbalaje" class="metal-input" step="0.001" value="${initialCantidad}">
        </div>
        
        <div class="col-md-2">
          <label>P.U. ($)</label>
          <input type="number" id="puEmbalaje" class="metal-input" step="0.01" value="${initialPU.toFixed(2)}">
        </div>
        
        <div class="col-md-2">
          <label>Subtotal ($)</label>
          <input type="text" id="subtotalEmbalaje" class="metal-input" value="${formatCurrency(initialSubtotal)}" readonly>
        </div>
      </div>

      <div class="text-center mt-4">
        <div class="row justify-content-center"> <div class="col-md-4"> <button type="submit" class="btn-action-metal btn-agregar-metal w-100">${submitButtonText}</button>
          </div>
          <div class="col-md-4"> <button type="button" class="btn-action-metal btn-cancelar-metal w-100" id="cerrarModalEmbalaje">CANCELAR</button>
          </div>
        </div>
      </div>
    </form>
  `;

  modal.innerHTML = formHtml;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- Lógica de cálculo y listeners ---
  const cantidadInput = modal.querySelector("#cantidadEmbalaje");
  const puInput = modal.querySelector("#puEmbalaje");
  const subtotalInput = modal.querySelector("#subtotalEmbalaje");
  const cerrarModalButton = modal.querySelector("#cerrarModalEmbalaje");
  const categoriaSelect = modal.querySelector("#categoriaEmbalaje");

  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseFloat(puInput.value) || 0;
    subtotalInput.value = formatCurrency(cantidad * pu);
  }

  calcularSubtotal();


  // Listeners para cantidad y P.U.
  cantidadInput.addEventListener("input", calcularSubtotal);
  puInput.addEventListener("input", calcularSubtotal);
  
  // Cierre del modal
  cerrarModalButton.onclick = () => overlay.remove();

  // 🔹 Lógica de SALTO a otro Formulario (Implementada)
  categoriaSelect.addEventListener("change", (e) => {
    const nuevaCat = e.target.value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "")
      .replace(/\//g, ""); 
    
    // 1. Cierra el modal actual
    overlay.remove();
    
    // 2. Transforma el nombre de la categoría a nombre de función: ejemplo "PINTURA" -> "mostrarFormularioPintura"
    const funcionNombre = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    
    // 3. Intenta llamar a la función, pasando el objeto original (itemData) para que la edición continúe en el nuevo formulario
    if (typeof window[funcionNombre] === "function") {
      window[funcionNombre](itemData); 
    } else {
      alert(`⚠️ Formulario para "${e.target.value}" no disponible (verifica que exista la función ${funcionNombre}).`);
      
      // Opcionalmente, si el formulario no existe, se puede reabrir el de embalaje
      // Dejamos este comportamiento simple por ahora.
    }
  });


  // 🔹 Navegación con flechas
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
  
  // 🔹 GUARDAR FILA (LÓGICA DE EDICIÓN/ADICIÓN)
  modal.querySelector("#embalajeForm").onsubmit = e => {
    e.preventDefault();
    
    // Recolectar datos
    const data = {
      no: numFila,
      categoria: "EMBALAJE", // La categoría siempre es Embalaje al guardar aquí
      clave: modal.querySelector("#claveEmbalaje").value,
      descripcion: modal.querySelector("#descripcionEmbalaje").value,
      unidad: modal.querySelector("#unidadEmbalaje").value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseFloat(puInput.value) || 0,
      subtotal: parseCurrency(subtotalInput.value)
    };
    
    // Obtener el objeto original de la data attribute del formulario
    const originalItemJson = modal.querySelector("#embalajeForm").getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    // 🛑 LÓGICA CONDICIONAL DE EDICIÓN VS. ADICIÓN
    if (originalItem && typeof originalItem.__tempIndex === 'number') {
        const indexToEdit = originalItem.__tempIndex;

        if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
            // Se debe obtener la lista actual del localStorage para editarla
            const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
            
            if (indexToEdit >= 0 && indexToEdit < current.length) {
              const dataToSave = { ...data };
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
}