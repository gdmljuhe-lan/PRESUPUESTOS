// Se asume que las funciones 'agregarFilaDespiece' y 'updateDespieceStorageAndRender'
// y las variables 'despieceStorageKey' están definidas en el script principal.

/**
 * Muestra el formulario de EXTERNOS con funcionalidad de adición/edición.
 * (Estilo Glassmorphism/Metal Rústico con nuevo orden y campos simplificados)
 * @param {Object | null} itemData - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es una nueva fila.
 */
function mostrarFormularioExternos(itemData = null) {
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- CONFIGURACIÓN DE EXTERNOS (Nuevo) ---
  const DESCRIPCIONES_EXTERNOS = [
    "SUPERFICIE SOLIDA",
    "MARMOL/GRANITO",
    "CORTE DE MARMOL/GRANITO",
    "PORCELANATO",
    "TAPICERIA (INCLUYE AGLUTINADO, HULE ESPUMA)",
    "TAPICERIA (FORRO CON TEXTIL)",
    "INSTALACION DE VINILES",
    "INSTALACION DE PAPEL TAPIZ",
    "CORTE RECTO",
    "CORTE CURVO",
    "CANTOS PULIDOS",
    "CANTOS CON NARIZ",
    "CORTES ESPECIALES"
  ];

  // Mapeo de descripción a Unidad y P.U.
  const EXTERNOS_CONFIG = {
    "SUPERFICIE SOLIDA": { unidad: "M2", pu: 380.00 },
    "MARMOL/GRANITO": { unidad: "M2", pu: 580.00 },
    "CORTE DE MARMOL/GRANITO": { unidad: "M2", pu: 234.60 },
    "PORCELANATO": { unidad: "M2", pu: 500.00 },
    "TAPICERIA (INCLUYE AGLUTINADO, HULE ESPUMA)": { unidad: "M2", pu: 0.00 }, // PU no especificado, se usa 0.00
    "TAPICERIA (FORRO CON TEXTIL)": { unidad: "M2", pu: 0.00 }, // PU no especificado, se usa 0.00
    "INSTALACION DE VINILES": { unidad: "M2", pu: 49.05 },
    "INSTALACION DE PAPEL TAPIZ": { unidad: "M2", pu: 250.00 },
    "CORTE RECTO": { unidad: "ML", pu: 116.00 },
    "CORTE CURVO": { unidad: "ML", pu: 290.00 },
    "CANTOS PULIDOS": { unidad: "ML", pu: 174.00 },
    "CANTOS CON NARIZ": { unidad: "ML", pu: 406.00 },
    "CORTES ESPECIALES": { unidad: "ML", pu: 116.00 }
  };
  // --- FIN CONFIGURACIÓN DE EXTERNOS ---


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
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA EXTERNOS'}` : 'FORMULARIO CATEGORÍA: EXTERNOS';

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
  
  // 🔹 Inicialización de valores con la nueva lógica de presets
  const initialClave = itemData?.clave || '';
  
  // Establecer valor de descripción por defecto/edición
  const defaultDesc = DESCRIPCIONES_EXTERNOS[0]; // SUPERFICIE SOLIDA
  const descValue = itemData?.descripcion || defaultDesc; 
  
  const defaultConf = EXTERNOS_CONFIG[defaultDesc] || { unidad: 'PZA', pu: 0 };
  const currentConf = EXTERNOS_CONFIG[descValue] || defaultConf;

  // Si es edición, usa los valores guardados. Si es nuevo, usa el preset (SUPERFICIE SOLIDA).
  const initialUnidad = itemData?.unidad || currentConf.unidad;
  const initialPU = itemData?.pu || currentConf.pu; 
  const initialCantidad = itemData?.cantidad || 1; 
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
      /* Estilo para opciones de select */
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
      #numExternos, #subtotalExternos {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
    </style>

    <h5 class="modal-header-metal">${modalTitle}</h5>

    <form id="externosForm" ${originalItemDataAttr}>

      <div class="row mb-3">
        <div class="col-md-3">
          <div class="mb-3">
            <label>No.</label>
            <input type="text" id="numExternos" class="metal-input" value="${numFila}" readonly>
          </div>
          <div class="mb-3">
            <label>Categoría</label>
            <select id="categoriaExternos" class="metal-input">
              ${categorias.map(c => `<option value="${c}" ${c === 'EXTERNOS' ? "selected" : ""}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        
        </div>

      <div class="row mb-3 border-top pt-3">
        
        <div class="col-md-2">
          <label>Clave</label>
          <input type="text" id="claveExternos" class="metal-input" value="${initialClave}">
        </div>
        
        <div class="col-md-2"> <label>Descripción</label>
          <select id="descripcionExternos" class="metal-input">
            ${DESCRIPCIONES_EXTERNOS.map(d => `<option value="${d}" ${d === descValue ? "selected" : ""}>${d}</option>`).join('')}
          </select>
        </div>
        
        <div class="col-md-2">
          <label>Unidad</label>
          <input type="text" id="unidadExternos" class="metal-input" value="${initialUnidad}" readonly>
        </div>
        
        <div class="col-md-2"> <label>Cantidad</label>
          <input type="number" id="cantidadExternos" class="metal-input" step="0.001" value="${initialCantidad}">
        </div>
        
        <div class="col-md-2">
          <label>P.U. ($)</label>
          <input type="number" id="puExternos" class="metal-input" step="0.01" value="${initialPU.toFixed(2)}">
        </div>
        
        <div class="col-md-2">
          <label>Subtotal ($)</label>
          <input type="text" id="subtotalExternos" class="metal-input" value="${formatCurrency(initialSubtotal)}" readonly>
        </div>
      </div>

      <div class="text-center mt-4">
        <div class="row justify-content-center"> <div class="col-md-4"> <button type="submit" class="btn-action-metal btn-agregar-metal w-100">${submitButtonText}</button>
          </div>
          <div class="col-md-4"> <button type="button" class="btn-action-metal btn-cancelar-metal w-100" id="cerrarModalExternos">CANCELAR</button>
          </div>
        </div>
      </div>
    </form>
  `;

  modal.innerHTML = formHtml;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- Lógica de cálculo y listeners ---
  const claveInput = modal.querySelector("#claveExternos");
  const descripcionSelect = modal.querySelector("#descripcionExternos"); // Modificado
  const unidadInput = modal.querySelector("#unidadExternos");
  const cantidadInput = modal.querySelector("#cantidadExternos");
  const puInput = modal.querySelector("#puExternos");
  const subtotalInput = modal.querySelector("#subtotalExternos");
  const cerrarModalButton = modal.querySelector("#cerrarModalExternos");
  const categoriaSelect = modal.querySelector("#categoriaExternos");

  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    // Usar parseCurrency para asegurar que el valor del P.U. sea numérico, aunque se usa .value directamente.
    const pu = parseFloat(puInput.value) || 0; 
    subtotalInput.value = formatCurrency(cantidad * pu);
  }

  // Nueva función para actualizar Unidad y PU basado en Descripción (Nuevo)
  function updateFieldsByDescription() {
      const selectedDesc = descripcionSelect.value;
      const config = EXTERNOS_CONFIG[selectedDesc];

      if (config) {
          unidadInput.value = config.unidad;
          // Actualizar P.U. y asegurar 2 decimales
          puInput.value = config.pu.toFixed(2);
          
          // Recalcular Subtotal inmediatamente
          calcularSubtotal();
      }
  }

  calcularSubtotal();


  // Listeners para cantidad y P.U.
  cantidadInput.addEventListener("input", calcularSubtotal);
  puInput.addEventListener("input", calcularSubtotal);
  
  // Listener para la descripción (Nuevo)
  descripcionSelect.addEventListener("change", updateFieldsByDescription);

  // Cierre del modal
  cerrarModalButton.onclick = () => overlay.remove();

  // 🔹 Lógica de SALTO a otro Formulario
  categoriaSelect.addEventListener("change", (e) => {
    const nuevaCat = e.target.value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "")
      .replace(/\//g, "");	
    
    overlay.remove();
    
    const funcionNombre = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    
    if (typeof window[funcionNombre] === "function") {
      window[funcionNombre](itemData);	
    } else {
      alert(`⚠️ Formulario para "${e.target.value}" no disponible (verifica que exista la función ${funcionNombre}).`);
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
  
  // 🔹 GUARDAR FILA (LÓGICA DE EDICIÓN/ADICIÓN - CÓDIGO REVERTIDO)
  modal.querySelector("#externosForm").onsubmit = e => {
    e.preventDefault();
    
    // Recolectar datos
    const data = {
      no: numFila,
      categoria: "EXTERNOS", 
      clave: claveInput.value,
      descripcion: descripcionSelect.value, // Modificado: usar el valor del select
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseFloat(puInput.value) || 0,
      subtotal: parseCurrency(subtotalInput.value)
    };
    
    // Obtener el objeto original de la data attribute del formulario
    const originalItemJson = modal.querySelector("#externosForm").getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    // 🛑 LÓGICA CONDICIONAL DE EDICIÓN VS. ADICIÓN (LÓGICA MANUAL REVERTIDA)
    if (originalItem && typeof originalItem.__tempIndex === 'number') {
        const indexToEdit = originalItem.__tempIndex;

        if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
            // Se debe obtener la lista actual del localStorage para editarla
            const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
            
            if (indexToEdit >= 0 && indexToEdit < current.length) {
              const dataToSave = { ...data, no: originalItem.no }; // Asegurar que 'no' se respete
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
        // Lógica de Adición Nueva (Usa agregarFilaDespiece)
        if (typeof agregarFilaDespiece === "function") {
            agregarFilaDespiece(data);
        }
    }
    
    overlay.remove();
  };
}