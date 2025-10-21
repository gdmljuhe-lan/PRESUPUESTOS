// Se requiere que las funciones 'agregarFilaDespiece' estén definidas en el script principal.

/**
 * Muestra el formulario de Barniz.
 * @param {Object | null} itemToEdit - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioBarniz(itemToEdit = null) {
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
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const opcionesBarniz = [
    "LACA BRILLO",
    "LACA MATE",
    "LACA HIGH GLOSS",
    "BARNIZ TRANSPARENTE",
    "FONDEADO",
    "ROYTIROL",
    "MICROCEMENTO",
    "CARDEADO (MADERA MACIZA)",
    "VIDRIOLACK",
    "OTRO (ACABADO BARNIZ)"
  ];

  // Determina el número de fila: usa el original si editas, calcula uno nuevo si añades.
  let numFila = (itemToEdit && itemToEdit.no) ? itemToEdit.no : 0;
  if (!itemToEdit) {
    const listForCount = typeof despieceList !== 'undefined' ? despieceList : (JSON.parse(localStorage.getItem(despieceStorageKey) || '[]'));
    numFila = listForCount.length + 1;
  }
  
  // Define el título del modal y el texto del botón
  const modalTitle = itemToEdit ? "EDITAR PIEZA DE BARNIZ" : "FORMULARIO CATEGORÍA: BARNIZ";
  const buttonText = itemToEdit ? "GUARDAR CAMBIOS" : "AGREGAR";

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
      #numBarniz, #subtotalBarniz {
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

    <h4 class="modal-header-metal" id="barnizModalTitle">${modalTitle}</h4>

    <form id="barnizForm">
      
      <div class="num-cat-row">
        <div>
          <label>No.</label><input type="text" id="numBarniz" class="metal-input" value="${numFila}" readonly>
        </div>
        <div>
          <label>Categoría</label>
          <select id="categoriaBarniz" class="metal-input">
            ${categorias.map(c => `<option value="${c}" ${c === "BARNIZ" ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="final-fields-grid">
        <div class="form-group-compact"><label>Clave</label><input type="text" id="claveBarniz" class="metal-input" placeholder="Clave"></div>
        <div class="form-group-compact">
          <label>Descripción</label>
          <select id="descripcionBarniz" class="metal-input">
            ${opcionesBarniz.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
        </div>
        <div class="form-group-compact"><label>Unidad</label><input type="text" id="unidadBarniz" class="metal-input" placeholder="Unidad"></div>
        <div class="form-group-compact"><label>Cantidad</label><input type="number" id="cantidadBarniz" class="metal-input" min="1" value="1"></div>
        <div class="form-group-compact"><label>P.U. ($)</label><input type="text" id="puBarniz" class="metal-input" value="$0.00"></div>
        <div class="form-group-compact"><label>Subtotal ($)</label><input type="text" id="subtotalBarniz" class="metal-input" value="$0.00" readonly></div>
      </div>

      <div class="text-center" style="margin-top: 25px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${buttonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalBarniz">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 1. OBTENCIÓN DE ELEMENTOS Y CÁLCULO
  // -----------------------------------------------------------------------
  const claveInput = modal.querySelector("#claveBarniz");
  const descripcionSelect = modal.querySelector("#descripcionBarniz");
  const unidadInput = modal.querySelector("#unidadBarniz");
  const cantidadInput = modal.querySelector("#cantidadBarniz");
  const puInput = modal.querySelector("#puBarniz");
  const subtotalInput = modal.querySelector("#subtotalBarniz");
  
  const precios = {
    "LACA BRILLO": 1031,
    "LACA MATE": 975,
    "LACA HIGH GLOSS": 1450,
    "BARNIZ TRANSPARENTE": 650,
    "FONDEADO": 80,
    "ROYTIROL": 450,
    "MICROCEMENTO": 1250,
    "CARDEADO (MADERA MACIZA)": 60,
    "VIDRIOLACK": 650,
    "OTRO (ACABADO BARNIZ)": 0
  };

  function formatoMoneda(valor) {
    if (isNaN(valor) || valor === "") return "$0.00";
    return "$" + parseFloat(valor).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const puTexto = puInput.value.replace(/[^0-9.-]/g, "");
    const pu = parseFloat(puTexto) || 0;
    subtotalInput.value = formatoMoneda(cantidad * pu);
  }
  
  // 2. LÓGICA DE PRECARGA PARA EDICIÓN
  // -----------------------------------------------------------------------
  if (itemToEdit) {
    claveInput.value = itemToEdit.clave || '';
    descripcionSelect.value = itemToEdit.descripcion || 'LACA MATE'; // Usa el valor guardado
    unidadInput.value = itemToEdit.unidad || 'm2';
    cantidadInput.value = itemToEdit.cantidad;
    puInput.value = formatoMoneda(itemToEdit.pu);
    subtotalInput.value = formatoMoneda(itemToEdit.subtotal);
    // IMPORTANTE: Almacenar el objeto original para pasarlo a la función de guardado
    claveInput.dataset.originalItem = JSON.stringify(itemToEdit);
  }


  // 3. EVENTOS DINÁMICOS Y NAVEGACIÓN
  // -----------------------------------------------------------------------
  
  // Asignación automática según descripción
  descripcionSelect.addEventListener("change", e => {
    const seleccion = e.target.value;
    if (seleccion) {
      unidadInput.value = "m2";
      // Si estamos editando, respetamos el P.U. guardado, a menos que sea 0.
      const puInicial = (itemToEdit && itemToEdit.descripcion === seleccion && itemToEdit.pu > 0) ? itemToEdit.pu : (precios[seleccion] || 0);
      puInput.value = formatoMoneda(puInicial);
      calcularSubtotal();
    } else {
      unidadInput.value = "";
      puInput.value = formatoMoneda(0);
      calcularSubtotal();
    }
    // Después de un cambio manual de descripción, el modo de edición se desactiva
    delete claveInput.dataset.originalItem;
  });

  cantidadInput.addEventListener("input", calcularSubtotal);
  puInput.addEventListener("input", calcularSubtotal);
  
  // Aplica formato solo al salir del campo
  puInput.addEventListener("blur", e => {
    const valor = parseFloat(e.target.value.replace(/[^0-9.-]/g, "")) || 0;
    e.target.value = formatoMoneda(valor);
    calcularSubtotal();
  });

  // Si no estamos editando, forzar carga inicial en “LACA MATE”
  if (!itemToEdit) {
    descripcionSelect.value = "LACA MATE";
    descripcionSelect.dispatchEvent(new Event("change"));
  }

  // Cerrar modal
  modal.querySelector("#cerrarModalBarniz").onclick = () => overlay.remove();

  // Cambio de categoría (manejo de navegación)
  modal.querySelector("#categoriaBarniz").addEventListener("change", e => {
    const nuevaCat = e.target.value.toUpperCase().replace(/ /g, '').replace(/\//g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    overlay.remove();
    const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    
    // Al navegar a otro formulario, pasar el itemToEdit si estamos editando
    const itemToPass = claveInput.dataset.originalItem ? JSON.parse(claveInput.dataset.originalItem) : null;

    if (typeof window[funcName] === "function") {
      window[funcName](itemToPass); // Pasar el itemToEdit al nuevo formulario
    } else {
      alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
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
  modal.querySelector("#barnizForm").onsubmit = e => {
    e.preventDefault();
    
    // Recolectar datos nuevos
    const newData = {
      no: numFila, // Se mantiene el número de fila original
      categoria: "BARNIZ",
      clave: claveInput.value,
      descripcion: descripcionSelect.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseFloat(puInput.value.replace(/[^0-9.-]+/g, "")) || 0,
      subtotal: parseFloat(subtotalInput.value.replace(/[^0-9.-]+/g, "")) || 0
    };

    // Obtener el objeto original si estamos en modo edición
    const originalItemJson = claveInput.dataset.originalItem;
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    // Llamar a la función principal para agregar o reemplazar
    if (typeof agregarFilaDespiece === "function") {
        agregarFilaDespiece(newData, originalItem);
    }
    
    overlay.remove();
  };
}