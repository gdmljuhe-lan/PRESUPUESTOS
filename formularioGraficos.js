// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender'
// y la variable 'despieceStorageKey' estén definidas en el script principal.

// --- Funciones auxiliares para manejo de moneda ---
function formatCurrency(v) {
  if (isNaN(v) || v === "") return "$0.00";
  return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function parseCurrency(s) {
  return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
}
// --- FIN Funciones auxiliares ---

/**
 * Muestra el formulario de Graficos con estilo Glassmorphism Rústico/Natural (METAL).
 * @param {Object | null} itemData - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioGraficos(itemData = null) {
  // 🔹 Lógica de Edición/Adición
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'GRAFICO'}` : 'FORMULARIO CATEGORÍA: GRAFICOS';

  // Determina el número de fila: usa el original si editas, calcula uno nuevo si añades.
  const numFila = isEdit ? itemData.no : (document.querySelectorAll("#despieceTable tbody tr").length + 1);

  // 🔹 Cierra cualquier modal anterior
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
    color: "#E8EBE0", // Color de texto claro (Estilo Metal)
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)", // Efecto Glassmorphism
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif" // Misma fuente de Metal
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO","ACRILICO",
    "ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH","TELA/VINIPIEL",
    "EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];
  
  // 🔹 Contenido HTML con los estilos de METAL
  modal.innerHTML = `
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
      
      /* Grid para No. y Categoría */
      .num-cat-row {
        display: grid;
        grid-template-columns: 3fr 7fr;
        gap: 10px;
        margin-bottom: 20px;
      }

      /* Grid de la Fila Final (6 Columnas) */
      .final-fields-grid {
        display: grid;
        /* Proporciones: 2/12, 3/12, 1/12, 2/12, 2/12, 2/12 */
        grid-template-columns: 2fr 3fr 1fr 2fr 2fr 2fr; 
        gap: 10px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
      }

      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numGraficos, #subtotalGraficos {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Botones (Estilo Rústico de Metal) */
      .btn-action-metal {
        font-size: 12px;
        border-radius: 8px;
        padding: 8px 20px;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
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
      
      .text-center { text-align: center; }
      .form-group-compact { margin-bottom: 12px; }
    </style>

    <h4 class="modal-header-metal">${modalTitle}</h4>

    <form id="graficosForm">
      
      <div class="num-cat-row">
        <div>
          <label>No.</label>
          <input type="text" id="numGraficos" class="metal-input" value="${numFila}" readonly>
        </div>
        <div>
          <label>Categoría</label>
          <select id="categoriaGraficos" class="metal-input">
            ${categorias.map(c => `<option value="${c}" ${c==='GRAFICOS' ? 'selected' : ''}>${c}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="final-fields-grid">
        <div class="form-group-compact">
          <label>Clave</label>
          <input type="text" id="claveGraficos" class="metal-input" placeholder="Clave" value="${itemData?.clave || ''}">
        </div>
        <div class="form-group-compact">
          <label>Descripción</label>
          <input type="text" id="descripcionGraficos" class="metal-input" placeholder="Descripción del gráfico" value="${itemData?.descripcion || ''}">
        </div>
        <div class="form-group-compact">
          <label>Unidad</label>
          <input type="text" id="unidadGraficos" class="metal-input" placeholder="PZA" value="${itemData?.unidad || 'PZA'}">
        </div>
        <div class="form-group-compact">
          <label>Cantidad</label>
          <input type="number" id="cantidadGraficos" class="metal-input" min="1" value="${itemData?.cantidad || 1}">
        </div>
        <div class="form-group-compact">
          <label>P.U. ($)</label>
          <input type="text" id="puGraficos" class="metal-input" placeholder="$0.00" value="${formatCurrency(itemData?.pu || 0)}">
        </div>
        <div class="form-group-compact">
          <label>Subtotal ($)</label>
          <input type="text" id="subtotalGraficos" class="metal-input" value="${formatCurrency(itemData?.subtotal || 0)}" readonly>
        </div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalGraficos">CANCELAR</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- OBTENCIÓN DE ELEMENTOS ---
  const pu = modal.querySelector("#puGraficos");
  const cantidad = modal.querySelector("#cantidadGraficos");
  const subtotal = modal.querySelector("#subtotalGraficos");
  const clave = modal.querySelector("#claveGraficos");
  const descripcion = modal.querySelector("#descripcionGraficos");
  const unidad = modal.querySelector("#unidadGraficos");

  // === AUXILIARES PARA EDICIÓN ===
  
  // 1. Obtener la data actual del formulario
  function getCurrentFormData() {
    const data = {
      no: numFila,
      categoria: "GRAFICOS",
      clave: clave.value,
      descripcion: descripcion.value,
      unidad: unidad.value,
      cantidad: parseFloat(cantidad.value) || 0,
      pu: parseCurrency(pu.value),
      subtotal: parseCurrency(subtotal.value)
    };

    // Si estamos editando, incluimos el índice temporal para la actualización
    return isEdit ? { ...data, __tempIndex: itemData.__tempIndex } : data;
  }
  
  // === Lógica de cálculo y formato ===
  function calcularSubtotal() {
    const c = parseFloat(cantidad.value) || 0;
    const p = parseCurrency(pu.value);
    subtotal.value = formatCurrency(c * p);
  }
  
  // Event Listeners
  pu.addEventListener("blur", () => { 
    pu.value = formatCurrency(parseCurrency(pu.value)); 
    calcularSubtotal();
  });
  
  cantidad.addEventListener("input", calcularSubtotal);
  pu.addEventListener("input", () => { calcularSubtotal(); });

  // 🔹 Cerrar modal
  modal.querySelector("#cerrarModalGraficos").onclick = () => overlay.remove();

  // 🔹 Cambio de categoría (Mantiene la lógica de edición/adición al saltar)
  document.getElementById("categoriaGraficos").addEventListener("change", (e) => {
    const nuevaCat = e.target.value
      .toUpperCase()
      .replace(/ /g, '')
      .replace(/\//g, '');
    overlay.remove();
    const funcion = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    if (typeof window[funcion] === "function") {
      window[funcion](itemData); // Pasa itemData para preservar el contexto de edición
    } else {
      alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
    }
  });

  // 🔹 Guardar fila (LÓGICA DE EDICIÓN/ADICIÓN)
  modal.querySelector("#graficosForm").onsubmit = e => {
    e.preventDefault();
    const data = getCurrentFormData();

    if (isEdit) {
        // Lógica de Edición
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