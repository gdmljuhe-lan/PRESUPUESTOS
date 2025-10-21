// Se requiere que las funciones 'agregarFilaDespiece' estén definidas en el script principal.

/**
 * Muestra el formulario de Corte Laser.
 * (Adaptado al estilo Glassmorphism/Metal Rústico de formularioBarniz.js)
 * @param {Object | null} itemToEdit - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioCortelaser(itemToEdit = null) {
  // Elimina cualquier modal preexistente
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatoMoneda(valor) {
    if (isNaN(valor) || valor === "") return "$0.00";
    return "$" + parseFloat(valor).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function parseMoneda(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- FIN Funciones auxiliares ---

  // 🔹 Lógica para modo Edición o Agregar
  const isEdit = itemToEdit !== null && typeof itemToEdit.__tempIndex === 'number';
  const modalTitle = isEdit ? `EDITAR PIEZA DE CORTE LASER` : 'FORMULARIO CATEGORÍA: CORTE LASER';
  const buttonText = isEdit ? "GUARDAR CAMBIOS" : "AGREGAR";

  // ⭐ NUEVAS OPCIONES Y PRECIOS/UNIDADES (Minutos a $25)
  const opcionesCortelaser = [
    "LASER METAL",
    "LASER MADERA",
    "LASER ACRILICO"
  ];
  const parametrosCortelaser = {
    "LASER METAL": { unidad: "MINUTOS", pu: 25 },
    "LASER MADERA": { unidad: "MINUTOS", pu: 25 },
    "LASER ACRILICO": { unidad: "MINUTOS", pu: 25 }
  };
  
  // Determina el número de fila.
  let numFila = (itemToEdit && itemToEdit.no) ? itemToEdit.no : 0;
  if (!itemToEdit) {
    const despieceTable = document.querySelector("#despieceTable tbody");
    const currentRows = despieceTable ? despieceTable.querySelectorAll("tr").length : 0;
    numFila = currentRows + 1;
  }

  // Valores iniciales 
  const defaultDescripcion = opcionesCortelaser[0];
  const initialDescripcion = itemToEdit?.descripcion || defaultDescripcion;
  
  // Determinar P.U. y Unidad iniciales basados en la descripción
  const initialParams = parametrosCortelaser[initialDescripcion] || { unidad: 'MINUTOS', pu: 25 }; 

  const initialClave = itemToEdit?.clave || '';
  const initialUnidad = itemToEdit?.unidad || initialParams.unidad;
  // Si estamos editando y el P.U. es diferente de 0, respetamos el P.U. guardado.
  const initialPU = itemToEdit?.pu && isEdit ? itemToEdit.pu : initialParams.pu; 
  const initialCantidad = itemToEdit?.cantidad || 1;
  const initialSubtotal = isEdit ? itemToEdit.subtotal : (initialCantidad * initialPU);


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
    width: "750px", // Ancho ajustado a 6 columnas
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO",
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  // Almacenar el item original (incluyendo __tempIndex) en el atributo data-original-item
  const originalItemDataAttr = isEdit ? `data-original-item='${JSON.stringify(itemToEdit)}'` : '';


  modal.innerHTML = `
    <style>
      /* ESTILOS COPIADOS DE FORMULARIOBARNIZ */
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
        margin-top: 10px; 
        padding-bottom: 10px;
      }

      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numCortelaser, #subtotalCortelaser {
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

    <h4 class="modal-header-metal" id="cortelaserModalTitle">${modalTitle}</h4>

    <form id="cortelaserForm" ${originalItemDataAttr}>

      <div class="num-cat-row">
        <div>
          <label>No.</label><input type="text" id="numCortelaser" class="metal-input" value="${numFila}" readonly>
        </div>
        <div>
          <label>Categoría</label>
          <select id="categoriaCortelaser" class="metal-input">
            ${categorias.map(c => `<option value="${c}" ${c === "CORTE LASER" ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="final-fields-grid">
        <div class="form-group-compact"><label>Clave</label><input type="text" id="claveCortelaser" class="metal-input" placeholder="Clave" value="${initialClave}"></div>
        
        <div class="form-group-compact">
          <label>Descripción</label>
          <select id="descripcionCortelaser" class="metal-input">
            ${opcionesCortelaser.map(o => `<option value="${o}" ${o === initialDescripcion ? "selected" : ""}>${o}</option>`).join("")}
          </select>
        </div>
        
        <div class="form-group-compact"><label>Unidad</label><input type="text" id="unidadCortelaser" class="metal-input" placeholder="Unidad" value="${initialUnidad}" readonly></div>
        <div class="form-group-compact"><label>Cantidad</label><input type="number" id="cantidadCortelaser" class="metal-input" min="1" value="${initialCantidad}"></div>
        <div class="form-group-compact"><label>P.U. ($)</label><input type="text" id="puCortelaser" class="metal-input" value="${formatoMoneda(initialPU)}"></div>
        <div class="form-group-compact"><label>Subtotal ($)</label><input type="text" id="subtotalCortelaser" class="metal-input" value="${formatoMoneda(initialSubtotal)}" readonly></div>
      </div>

      <div class="text-center" style="margin-top: 25px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${buttonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalCortelaser">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 1. OBTENCIÓN DE ELEMENTOS Y CÁLCULO
  // -----------------------------------------------------------------------
  const claveInput = modal.querySelector("#claveCortelaser");
  const descripcionSelect = modal.querySelector("#descripcionCortelaser"); // Cambiado a Select
  const unidadInput = modal.querySelector("#unidadCortelaser");
  const cantidadInput = modal.querySelector("#cantidadCortelaser");
  const puInput = modal.querySelector("#puCortelaser");
  const subtotalInput = modal.querySelector("#subtotalCortelaser");
  const categoriaSelect = modal.querySelector("#categoriaCortelaser");


  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseMoneda(puInput.value);
    subtotalInput.value = formatoMoneda(cantidad * pu);
  }

  // 2. EVENTOS DINÁMICOS Y NAVEGACIÓN
  // -----------------------------------------------------------------------
  
  // ⭐ LÓGICA DE ASIGNACIÓN AUTOMÁTICA
  descripcionSelect.addEventListener("change", e => {
    const seleccion = e.target.value;
    const params = parametrosCortelaser[seleccion] || { unidad: 'PZA', pu: 0 }; // Fallback
    
    unidadInput.value = params.unidad;
    
    // Solo actualiza el P.U. si no estamos en edición O si el P.U. es 0
    // Esto respeta un P.U. editado manualmente.
    if (!isEdit || parseMoneda(puInput.value) === 0) {
      puInput.value = formatoMoneda(params.pu);
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
  
  // ⭐ DISPARAR EL EVENTO AL INICIO si es ADICIÓN para cargar los valores por defecto.
  // Si es EDICIÓN, los valores ya vienen cargados en el HTML.
  if (!isEdit) {
     descripcionSelect.dispatchEvent(new Event("change"));
  }

  // Cerrar modal
  modal.querySelector("#cerrarModalCortelaser").onclick = () => overlay.remove();

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

    // Al navegar a otro formulario, pasar el itemToEdit si estamos editando
    const originalItemJson = modal.querySelector("#cortelaserForm").getAttribute('data-original-item');
    const itemToPass = originalItemJson ? JSON.parse(originalItemJson) : null;

    if (typeof window[funcionNombre] === "function") {
      window[funcionNombre](itemToPass); // Pasar el itemToEdit al nuevo formulario
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
  modal.querySelector("#cortelaserForm").onsubmit = e => {
    e.preventDefault();

    // Recolectar datos nuevos
    const newData = {
      no: numFila,
      categoria: "CORTE LASER",
      clave: claveInput.value,
      descripcion: descripcionSelect.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseMoneda(puInput.value),
      subtotal: parseMoneda(subtotalInput.value)
    };

    // Obtener el objeto original (para edición)
    const originalItemJson = modal.querySelector("#cortelaserForm").getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    // Lógica para Adición vs. Edición
    if (originalItem && typeof originalItem.__tempIndex === 'number') {
        const indexToEdit = originalItem.__tempIndex;

        // Se asume que existe la función de actualización global o se usa agregarFilaDespiece como fallback
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
            // Fallback si no hay funciones globales de Storage
            if (typeof agregarFilaDespiece === "function") {
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