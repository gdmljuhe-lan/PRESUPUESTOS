// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender', y la variable 'despieceList'
// (y despieceStorageKey) estén definidas en el script principal (analiticosgdml.html)

/**
 * Muestra el formulario de Pintura con estilo Glassmorphism Rústico.
 * @param {Object | null} itemToEdit - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioPintura(itemToEdit = null) {
  // Elimina cualquier modal preexistente
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

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
    width: "750px", // Ancho ajustado para la fila de 6 campos
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO",
    "ACRILICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const opcionesPintura = [
    "PINTURA ELECTROSTÁTICA ECONÓMICA",
    "PINTURA ELECTROSTÁTICA MEDIA",
    "PINTURA ELECTROSTÁTICA ALTA",
    "SATINADO INOXIDABLE",
    "PULIDO ESPEJO INOXIDABLE",
    "CROMO NEGRO INOXIDABLE",
    "CROMO, NIQUEL, LATON",
    "OTRO (ACABADO PINTURA)"
  ];
  
  // Lógica de Edición/Adición
  const isEdit = itemToEdit !== null && typeof itemToEdit.__tempIndex === 'number';

  // Determina el número de fila: usa el original si editas, calcula uno nuevo si añades.
  let numFila = (itemToEdit && itemToEdit.no) ? itemToEdit.no : 0;
  if (!itemToEdit) {
    // Usar despieceList o localStorage para contar filas (similar a Barniz)
    const listForCount = typeof despieceList !== 'undefined' ? despieceList : (JSON.parse(localStorage.getItem(despieceStorageKey) || '[]'));
    numFila = listForCount.length + 1;
  }

  // Define el título del modal y el texto del botón
  const modalTitle = isEdit ? `EDITAR: ${itemToEdit.descripcion || 'PIEZA DE PINTURA'}` : "FORMULARIO CATEGORÍA: PINTURA";
  const buttonText = isEdit ? "GUARDAR CAMBIOS" : "AGREGAR";


  modal.innerHTML = `
    <style>
      /* Estilos Glassmorphism Rústico/Natural (Copiados de Barniz) */
      .modal-header-metal {
        color: #D4A373; /* Accent terroso */
        font-weight: bold;
        text-shadow: 0 0 8px rgba(212, 163, 115, 0.3);
        font-size: 18px !important;
        text-align: center;
        margin-bottom: 25px;
      }

      /* Inputs y Selects: Fuente en 11px y padding reducido */
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

      /* Etiquetas: Fuente en 11px */
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

      /* Grid para No. y Categoría (Sub-Grid) */
      .num-cat-row {
        display: grid;
        grid-template-columns: 1fr 2fr; /* Columna No. (1/3) y Categoría (2/3) */
        gap: 10px;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Grid de la Fila Final (6 Columnas) */
      .final-fields-grid {
        display: grid;
        /* Proporciones: Clave(2), Desc(3), Unidad(1), Cant(2), P.U.(2), Sub(2) -> Total 12fr */
        grid-template-columns: 2fr 3fr 1fr 2fr 2fr 2fr;
        gap: 10px;
        margin-top: 10px; /* Reducción de margen para compactar */
        padding-bottom: 10px;
      }

      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numPintura, #subtotalPintura {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Botones (Estilo Rústico) */
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

    <h4 class="modal-header-metal" id="pinturaModalTitle">${modalTitle}</h4>

    <form id="pinturaForm">

      <div class="num-cat-row">
        <div>
          <label>No.</label><input type="text" id="numPintura" class="metal-input" value="${numFila}" readonly>
        </div>
        <div>
          <label>Categoría</label>
          <select id="categoriaPintura" class="metal-input">
            ${categorias.map(c => `<option value="${c}" ${c === (itemToEdit?.categoria || "PINTURA") ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="final-fields-grid">
        <div class="form-group-compact"><label>Clave</label><input type="text" id="clavePintura" class="metal-input" placeholder="Clave"></div>
        <div class="form-group-compact">
          <label>Descripción</label>
          <select id="descripcionPintura" class="metal-input">
            ${opcionesPintura.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
        </div>
        <div class="form-group-compact"><label>Unidad</label><input type="text" id="unidadPintura" class="metal-input" placeholder="Unidad"></div>
        <div class="form-group-compact"><label>Cantidad</label><input type="number" id="cantidadPintura" class="metal-input" min="1" value="1"></div>
        <div class="form-group-compact"><label>P.U. ($)</label><input type="text" id="puPintura" class="metal-input" value="$0.00"></div>
        <div class="form-group-compact"><label>Subtotal ($)</label><input type="text" id="subtotalPintura" class="metal-input" value="$0.00" readonly></div>
      </div>

      <div class="text-center" style="margin-top: 25px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${buttonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalPintura">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 1. OBTENCIÓN DE ELEMENTOS Y CÁLCULO
  // -----------------------------------------------------------------------
  const pinturaForm = modal.querySelector("#pinturaForm");
  const claveInput = modal.querySelector("#clavePintura");
  const descripcionSelect = modal.querySelector("#descripcionPintura");
  const unidadInput = modal.querySelector("#unidadPintura");
  const cantidadInput = modal.querySelector("#cantidadPintura");
  const puInput = modal.querySelector("#puPintura");
  const subtotalInput = modal.querySelector("#subtotalPintura");

  const precios = {
    "PINTURA ELECTROSTÁTICA ECONÓMICA": 50,
    "PINTURA ELECTROSTÁTICA MEDIA": 70,
    "PINTURA ELECTROSTÁTICA ALTA": 80,
    "SATINADO INOXIDABLE": 50,
    "PULIDO ESPEJO INOXIDABLE": 150,
    "CROMO NEGRO INOXIDABLE": 980,
    "CROMO, NIQUEL, LATON": 160,
    "OTRO (ACABADO PINTURA)": 0
  };

  // Función de formato
  function formatoMoneda(valor) {
    if (isNaN(valor) || valor === "") return "$0.00";
    return "$" + parseFloat(valor).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Función para parsear a número
  function parseMoneda(texto) {
    return parseFloat(texto.replace(/[^0-9.-]/g, "")) || 0;
  }

  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseMoneda(puInput.value);
    subtotalInput.value = formatoMoneda(cantidad * pu);
  }

  // 2. LÓGICA DE PRECARGA PARA EDICIÓN
  // -----------------------------------------------------------------------
  if (itemToEdit) {
    claveInput.value = itemToEdit.clave || '';
    descripcionSelect.value = itemToEdit.descripcion || 'PINTURA ELECTROSTÁTICA ALTA';
    unidadInput.value = itemToEdit.unidad || 'ml/m2'; // Carga la unidad guardada
    cantidadInput.value = itemToEdit.cantidad;
    puInput.value = formatoMoneda(itemToEdit.pu);
    subtotalInput.value = formatoMoneda(itemToEdit.subtotal);
    // ✅ Se almacena el objeto original (incluyendo __tempIndex) para la edición por índice
    claveInput.dataset.originalItem = JSON.stringify(itemToEdit);
  } else {
    // Si es nuevo, asegurar que los valores iniciales sean los por defecto
    descripcionSelect.value = "PINTURA ELECTROSTÁTICA ALTA";
    unidadInput.value = "ml/m2"; // Establece la unidad por defecto SOLAMENTE para filas nuevas
  }


  // 3. EVENTOS DINÁMICOS Y NAVEGACIÓN
  // -----------------------------------------------------------------------

  // Asignación automática de precios
  descripcionSelect.addEventListener("change", () => {
    const val = descripcionSelect.value;
    const precio = precios[val] || 0;

    // Obtener el objeto original de la data attribute (puede ser null)
    const originalItemJson = claveInput.dataset.originalItem;
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    let puInicial = precio;
    
    // Si la descripción seleccionada coincide con la original y había un PU guardado, lo respetamos.
    if (originalItem && originalItem.descripcion === val && originalItem.pu > 0) {
      puInicial = originalItem.pu;
    }

    puInput.value = formatoMoneda(puInicial);

    // Si la unidad está vacía, se le asigna el valor por defecto.
    if (unidadInput.value.trim() === "") {
        unidadInput.value = "ml/m2";
    }

    calcularSubtotal();
  });

  cantidadInput.addEventListener("input", calcularSubtotal);
  puInput.addEventListener("input", calcularSubtotal);

  // Aplica formato solo al salir del campo
  puInput.addEventListener("blur", e => {
    const valor = parseMoneda(e.target.value);
    e.target.value = formatoMoneda(valor);
    calcularSubtotal();
  });

  // Forzar carga inicial (llama al change event para cargar precio y subtotal)
  descripcionSelect.dispatchEvent(new Event("change"));


  // Cerrar modal
  document.getElementById("cerrarModalPintura").onclick = () => overlay.remove();

  // Cambio de categoría (manejo de navegación)
  modal.querySelector("#categoriaPintura").addEventListener("change", (e) => {
    const raw = e.target.value.toUpperCase();
    const nuevaCat = raw.replace(/ /g, "").replace(/\//g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    overlay.remove();
    const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();

    // Al navegar a otro formulario, pasar el itemToEdit si estamos editando
    const itemToPass = claveInput.dataset.originalItem ? JSON.parse(claveInput.dataset.originalItem) : null;

    if (typeof window[funcName] === "function") {
        window[funcName](itemToPass); // Pasar el itemToEdit al nuevo formulario
    } else {
        alert(`⚠️ Formulario para "${e.target.value}" no disponible (verifica que exista el archivo JS).`);
    }
  });

  // Navegación con flechas
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

  // 4. GUARDAR FILA (LÓGICA DE EDICIÓN/ADICIÓN)
  // -----------------------------------------------------------------------
  modal.querySelector("#pinturaForm").onsubmit = e => {
    e.preventDefault();

    // Recolectar datos nuevos
    const newData = {
      no: numFila, // Se mantiene el número de fila original
      categoria: "PINTURA",
      clave: claveInput.value,
      descripcion: descripcionSelect.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseMoneda(puInput.value),
      subtotal: parseMoneda(subtotalInput.value)
    };

    // Obtener el objeto original. Si está presente, indica que es una actualización.
    const originalItemJson = claveInput.dataset.originalItem;
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;
    
    // ✅ LÓGICA DE EDICIÓN (basada en el índice __tempIndex)
    if (originalItem && typeof originalItem.__tempIndex === 'number') { 
        const indexToEdit = originalItem.__tempIndex;

        if (typeof updateDespieceStorageAndRender === 'function') {
            // Obtener la lista actual (usando la variable global o cargándola)
            const current = typeof despieceList !== 'undefined' ? despieceList : JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
            
            if (indexToEdit >= 0 && indexToEdit < current.length) {
                current[indexToEdit] = newData; // Reemplaza por el índice
                
                // Llama a la función central para guardar y renderizar
                updateDespieceStorageAndRender(current); 
                // Se elimina el alert de confirmación
            } else {
                alert('Error al editar: Índice no válido.');
            }
        } else {
            alert('Error: La función updateDespieceStorageAndRender no está disponible.');
        }
    } else {
        // Lógica de Adición Nueva: Llama a agregarFilaDespiece (solo con el objeto)
        if (typeof agregarFilaDespiece === "function") {
            agregarFilaDespiece(newData);
        }
    }

    overlay.remove();
  };
}