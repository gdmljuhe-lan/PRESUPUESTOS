// Se asume que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender'
// y la variable 'despieceStorageKey' están definidas en el script principal.

/**
 * Muestra el formulario de Herraje con funcionalidad de adición/edición.
 * @param {Object | null} itemToEdit - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioHerraje(itemToEdit = null) {
  // 🔹 Cierra cualquier modal anterior
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda (copiadas de Madera) ---
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- FIN Funciones auxiliares ---

  // --- LÓGICA DE EDICIÓN/ADICIÓN ---
  const isEdit = itemToEdit !== null;
  // Determina el número de fila: usa el original si editas, calcula uno nuevo si añades.
  const numFila = isEdit ? itemToEdit.no : (document.querySelectorAll("#despieceTable tbody tr").length + 1);
  
  const modalTitle = isEdit ? "EDITAR PIEZA DE HERRAJE" : "FORMULARIO CATEGORÍA: HERRAJE";
  const buttonText = isEdit ? "GUARDAR CAMBIOS" : "AGREGAR";
  // --- FIN LÓGICA DE EDICIÓN/ADICIÓN ---

  // 🔹 Fondo del modal (Estilo Glassmorphism Rústico/Metal)
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
    background: "rgba(255, 255, 255, 0.15)", // Fondo semitransparente
    color: "#E8EBE0", // Color de texto claro
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)", // Efecto Glassmorphism
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px", // Más padding para estilo Metal
    width: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif" // Fuente Metal
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO",
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  // 🔹 Contenido HTML con estilos de Metal
  modal.innerHTML = `
    <style>
      /* Estilos Glassmorphism Rústico/Natural (Copiados de formularioMetal.js) */
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
        padding: 6px 10px; /* Tamaño de input reducido */
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
        color: #E8EBE0; /* Texto claro de Metal */
        font-size: 11px !important;
        margin-bottom: 4px;
        display: block;
      }
      select option, datalist option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }
      
      /* Campos de solo lectura/calculados */
      #numHerraje, #subtotalHerraje { 
          color: #B0B0B0 !important; 
          background: rgba(0, 0, 0, 0.4) !important;
          font-weight: normal;
          border-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      /* Botones (Estilo Rústico - Copiado de Metal) */
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
        background-color: #D4A373 !important; /* Accent color */
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
    
    <form id="herrajeForm">
      <div class="row mb-3">
        <div class="col-md-2">
          <label>No.</label>
          <input type="text" id="numHerraje" class="metal-input" value="${numFila}" readonly data-original-item='${isEdit ? JSON.stringify(itemToEdit) : ''}'>
        </div>
        <div class="col-md-4">
          <label>Categoría</label>
          <select id="categoriaHerraje" class="metal-input">
            ${categorias.map(cat => `<option value="${cat}" ${cat === 'HERRAJE' ? 'selected' : ''}>${cat}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-3">
          <label>Clave</label>
          <input type="text" id="claveHerraje" class="metal-input" value="${itemToEdit?.clave || ''}">
        </div>
        <div class="col-md-3">
          <label>Unidad</label>
          <input type="text" id="unidadHerraje" class="metal-input" value="${itemToEdit?.unidad || ''}">
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4">
          <label>Descripción</label>
          <input type="text" id="descripcionHerraje" class="metal-input" value="${itemToEdit?.descripcion || ''}" list="descripcionList">
          <datalist id="descripcionList"></datalist>
        </div>
        <div class="col-md-2">
          <label>Cantidad</label>
          <input type="number" id="cantidadHerraje" class="metal-input" value="${itemToEdit?.cantidad || 0}">
        </div>
        <div class="col-md-3">
          <label>P.U. ($)</label>
          <input type="text" id="puHerraje" class="metal-input" placeholder="$0.00" value="${formatCurrency(itemToEdit?.pu || 0)}">
        </div>
        <div class="col-md-3">
          <label>Subtotal ($)</label>
          <input type="text" id="subtotalHerraje" class="metal-input" value="${formatCurrency(itemToEdit?.subtotal || 0)}" readonly>
        </div>
      </div>
      <div class="text-center mt-4">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${buttonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalHerraje">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 🔹 Variables principales
  const numInput = modal.querySelector("#numHerraje");
  const claveInput = modal.querySelector("#claveHerraje");
  const unidadInput = modal.querySelector("#unidadHerraje");
  const descripcionInput = modal.querySelector("#descripcionHerraje");
  const descripcionList = modal.querySelector("#descripcionList");
  const cantidadInput = modal.querySelector("#cantidadHerraje");
  const puInput = modal.querySelector("#puHerraje");
  const subtotalInput = modal.querySelector("#subtotalHerraje");

  // 🔹 Cargar datos de autocompletado desde localStorage
  const HERRAJE_DATA_KEY = 'acumuladoHerrajeData';
  const herrajeData = JSON.parse(localStorage.getItem(HERRAJE_DATA_KEY) || '[]');

  // Llenar el datalist de descripción con los datos de la columna B
  if (herrajeData.length > 0) {
    const uniqueDescripciones = [...new Set(herrajeData.map(item => item.descripcion.trim()))];
    descripcionList.innerHTML = uniqueDescripciones.map(desc => `<option value="${desc}">`).join('');

    // Evento para autocompletar al cambiar el valor de descripción
    descripcionInput.addEventListener("input", () => {
      const valor = descripcionInput.value.trim();
      const match = herrajeData.find(item => item.descripcion.trim().toUpperCase() === valor.toUpperCase());
      if (match) {
        claveInput.value = match.clave || '';
        unidadInput.value = match.unidad || '';
        puInput.value = formatCurrency(match["P.U. ($)"] || 0);
        calcularSubtotal();
      } else {
        // No limpiar los campos si el usuario escribe un valor personalizado
        calcularSubtotal();
      }
    });

    // 🔹 Limpiar campo descripción al hacer doble clic
    descripcionInput.addEventListener("dblclick", () => {
      descripcionInput.value = '';
      claveInput.value = '';
      unidadInput.value = '';
      puInput.value = formatCurrency(0);
      calcularSubtotal();
      descripcionInput.focus();
    });

    // 🔹 Limpiar campo cantidad al hacer doble clic
    cantidadInput.addEventListener("dblclick", () => {
      cantidadInput.value = 0;
      calcularSubtotal();
      cantidadInput.focus();
    });
  } else {
    console.warn("No hay datos de herraje cargados en localStorage. Sube un archivo en acumuladogdml.html.");
  }

  // 🔹 Cálculo del subtotal
  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseCurrency(puInput.value);
    subtotalInput.value = formatCurrency(cantidad * pu);
  }

  // Si estamos editando, realizar el cálculo inicial
  if (isEdit) calcularSubtotal();

  // 🔹 Eventos dinámicos
  cantidadInput.addEventListener("input", calcularSubtotal);
  puInput.addEventListener("input", calcularSubtotal);

  // Aplica formato de moneda solo al salir del campo P.U.
  puInput.addEventListener("blur", e => {
    const valor = parseCurrency(e.target.value);
    e.target.value = formatCurrency(valor);
    calcularSubtotal();
  });

  // 🔹 Cerrar modal
  modal.querySelector("#cerrarModalHerraje").onclick = () => overlay.remove();

  // 🔹 Cambio de categoría (Manejo de navegación con paso de itemToEdit)
  modal.querySelector("#categoriaHerraje").addEventListener("change", e => {
    const nuevaCat = e.target.value
      .toUpperCase()
      .replace(/ /g, '')
      .replace(/\//g, '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Normalización completa

    overlay.remove();

    const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();

    // Al navegar a otro formulario, pasar el itemToEdit si estamos editando
    const originalItemJson = numInput.dataset.originalItem;
    const itemToPass = originalItemJson ? JSON.parse(originalItemJson) : null;
    
    if (typeof window[funcName] === "function") {
      window[funcName](itemToPass); // Pasar el itemToEdit al nuevo formulario
    } else {
      alert("⚠️ No existe el formulario para la categoría seleccionada: " + e.target.value);
    }
  });

  // 🔹 Navegación con flechas
  const inputs = Array.from(modal.querySelectorAll("input, select, button"));
  inputs.forEach((input, index) => {
    input.addEventListener("keydown", e => {
      if (["ArrowDown","ArrowRight", "Enter"].includes(e.key) && !e.shiftKey) {
        e.preventDefault();
        inputs[index + 1]?.focus();
      } else if (["ArrowUp","ArrowLeft"].includes(e.key) || (e.key === "Enter" && e.shiftKey)) {
        e.preventDefault();
        inputs[index - 1]?.focus();
      }
    });
  });

  // 🔹 Guardar fila (LÓGICA DE EDICIÓN/ADICIÓN)
  modal.querySelector("#herrajeForm").onsubmit = e => {
    e.preventDefault();
    
    // Obtener el objeto original
    const originalItemJson = numInput.dataset.originalItem;
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;
    
    // Recolectar datos nuevos
    const newData = {
      no: numFila, // Se mantiene el número de fila original
      categoria: "HERRAJE",
      clave: claveInput.value,
      descripcion: descripcionInput.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseCurrency(puInput.value),
      subtotal: parseCurrency(subtotalInput.value),
    };

    // --- LÓGICA DE EDICIÓN ---
    if (originalItem) {
        // Se asume la existencia de despieceStorageKey y updateDespieceStorageAndRender
        if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
            const currentList = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
            
            // Buscar el índice del elemento original usando el número de fila ('no')
            const indexToUpdate = currentList.findIndex(item => item.no === originalItem.no);

            if (indexToUpdate !== -1) {
                // Reemplazar el elemento en la lista.
                currentList[indexToUpdate] = newData;

                // Persistir y re-renderizar la tabla
                updateDespieceStorageAndRender(currentList);
                alert('ELEMENTO EDITADO CORRECTAMENTE.');
            } else {
                alert('Error al editar: No se encontró la fila original para modificar (No.: ' + originalItem.no + ').');
            }
        } else {
            // Recurso alternativo: usar la función 'agregarFilaDespiece' con el contrato original
            if (typeof agregarFilaDespiece === "function") {
                // Esta llamada no es la estándar para edición, pero se mantiene como estaba antes de la refactorización a updateDespieceStorageAndRender.
                agregarFilaDespiece(newData, originalItem);
            } else {
                alert("⚠️ No se encontraron las funciones de utilidades necesarias para la edición.");
            }
        }
    } else {
        // --- LÓGICA DE ADICIÓN (Nueva fila) ---
        if (typeof agregarFilaDespiece === "function") {
            agregarFilaDespiece(newData, null);
        } else {
            alert("⚠️ No se encontró la función agregarFilaDespiece().");
        }
    }
    
    overlay.remove();
  };
}