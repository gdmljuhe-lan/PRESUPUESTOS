// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender'
// y la variable 'despieceStorageKey' estén definidas en el script principal.

function mostrarFormularioViniladherible(itemData = null) {
  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    // Usa toFixed(2) para asegurar dos decimales, y luego toLocaleString para el separador de miles si fuera necesario, aunque el toFixed(2) lo limita.
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- FIN Funciones auxiliares ---

  // 🔹 Lógica de Edición/Adición
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'VINIL ADHERIBLE'}` : 'FORMULARIO CATEGORÍA: VINIL ADHERIBLE';

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

  // 🔹 Modal principal (Glassmorphism Rústico/Natural - Estilo METAL)
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", // Fondo semitransparente
    color: "#E8EBE0", // Color de texto claro
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)", // Efecto Glassmorphism
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "850px", // Mantiene el ancho original
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif" // Misma fuente de Metal
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO",
    "ACRILICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const materiales = [
    "IMPRESION DE VINIL IMANTADO",
    "IMPRESION DE VINIL CALIDAD HD",
    "IMPRESION EN VINIL TRANSPARENTE CON FONDEO BLANCO",
    "IMPRESION EN VINIL BRILLANTE",
    "IMPRESIÓN DE VINIL MATE",
    "IMPRESIÓN DE VINIL MATE TIPO CONCRETO",
    "IMPRESION DE VINIL ADHERIBLE",
    "IMPRESION DE VINIL ADHERIBLE TEXTURIZADO GRANULADO",
    "IMPRESION EN VINIL MADEROSO MATE",
    "IMPRESION DE LONA PARA CAJA DE LUZ",
    "OTRO (VINIL)"
  ];

  const preciosVinil = {
    "IMPRESION DE VINIL IMANTADO": 1125,
    "IMPRESION DE VINIL CALIDAD HD": 650,
    "IMPRESION EN VINIL TRANSPARENTE CON FONDEO BLANCO": 886.88,
    "IMPRESION EN VINIL BRILLANTE": 224.62,
    "IMPRESIÓN DE VINIL MATE": 432.69,
    "IMPRESIÓN DE VINIL MATE TIPO CONCRETO": 14201.18,
    "IMPRESION DE VINIL ADHERIBLE": 283.98,
    "IMPRESION DE VINIL ADHERIBLE TEXTURIZADO GRANULADO": 654.89,
    "IMPRESION EN VINIL MADEROSO MATE": 1334.41,
    "IMPRESION DE LONA PARA CAJA DE LUZ": 3561.62
  };
  
  // Estilos de campos (Adaptados al estilo METAL)
  const estiloCampos = `
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
        line-height: 1.5; /* Ajuste para que se vea bien */
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
      #numViniladherible, #cantidadViniladherible, #subtotalViniladherible {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Usamos "metal-input" en lugar de "form-control-sm" en el HTML */
    </style>
  `;

  function generarFilaFinal(submitButtonText) {
    return `
      <div class="row mb-3 border-top pt-3">
        <div class="col-md-2"><label>Clave</label><input type="text" id="claveViniladherible" class="metal-input"></div>
        <div class="col-md-3"><label>Descripción</label><input type="text" id="descripcionViniladherible" class="metal-input"></div>
        <div class="col-md-1"><label>Unidad</label><input type="text" id="unidadViniladherible" class="metal-input"></div>
        <div class="col-md-2"><label>Cantidad (m²)</label><input type="number" id="cantidadViniladherible" class="metal-input" readonly></div>
        <div class="col-md-2"><label>P.U. ($)</label><input type="number" id="puViniladherible" class="metal-input" step="0.01"></div>
        <div class="col-md-2"><label>Subtotal ($)</label><input type="text" id="subtotalViniladherible" class="metal-input" readonly value="$0.00"></div>
      </div>
      <div class="text-center mt-4">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalViniladherible">CANCELAR</button>
      </div>`;
  }

  function generarFormularioBase(numFila, categorias, materiales) {
    return `
      <h4 class="modal-header-metal">${modalTitle}</h4>
      <form id="viniladheribleForm">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="mb-3"><label>No.</label><input type="text" id="numViniladherible" class="metal-input" value="${numFila}" readonly></div>
            <div class="mb-3">
              <label>Categoría</label>
              <select id="categoriaViniladherible" class="metal-input">
                ${categorias.map(c => `<option value="${c}" ${c==="VINIL ADHERIBLE"?"selected":""}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="mb-3">
              <label>Material</label>
              <select id="materialViniladherible" class="metal-input">
                ${materiales.map(m => `<option value="${m}">${m}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3"><label>Nombre de la pieza</label><input type="text" id="nombrePiezaViniladherible" class="metal-input"></div>
            <div class="mb-3"><label>Largo (mm)</label><input type="number" id="largoViniladherible" class="metal-input"></div>
            <div class="mb-3"><label>Ancho (mm)</label><input type="number" id="anchoViniladherible" class="metal-input"></div>
            <div class="mb-3"><label>No. piezas</label><input type="number" id="numPiezasViniladherible" class="metal-input" min="1" value="1"></div>
          </div>
        </div>
        ${generarFilaFinal(submitButtonText)}
      </form>`;
  }

  modal.innerHTML = estiloCampos + generarFormularioBase(numFila, categorias, materiales);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- REFERENCIAS DE ELEMENTOS ---
  const materialSelect = modal.querySelector("#materialViniladherible");
  const nombrePiezaInput = modal.querySelector("#nombrePiezaViniladherible");
  const largoInput = modal.querySelector("#largoViniladherible");
  const anchoInput = modal.querySelector("#anchoViniladherible");
  const numPiezasInput = modal.querySelector("#numPiezasViniladherible");
  const claveInput = modal.querySelector("#claveViniladherible");
  const descripcionInput = modal.querySelector("#descripcionViniladherible");
  const unidadInput = modal.querySelector("#unidadViniladherible");
  const cantidadInput = modal.querySelector("#cantidadViniladherible");
  const puInput = modal.querySelector("#puViniladherible");
  const subtotalInput = modal.querySelector("#subtotalViniladherible");
  
  // --- LÓGICA DE CÁLCULO Y VALORES ---
  function calcularCantidad() {
    const L = parseFloat(largoInput?.value) || 0;
    const A = parseFloat(anchoInput?.value) || 0;
    const P = parseFloat(numPiezasInput?.value) || 1;
    // Cálculo de m²: (Largo * Ancho) / 1,000,000 * Piezas
    const cantidad = ((L * A) / 1000000) * P; 
    cantidadInput.value = cantidad.toFixed(3);
    calcularSubtotal();
  }

  function calcularSubtotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const pu = parseFloat(puInput.value) || 0;
    subtotalInput.value = formatCurrency(cantidad * pu);
  }

  function obtenerValores() {
    const data = {
      no: numFila,
      categoria: "VINIL ADHERIBLE",
      material: materialSelect.value,
      nombrePieza: nombrePiezaInput.value,
      largo: largoInput.value,
      ancho: anchoInput.value,
      numPiezas: numPiezasInput.value,
      clave: claveInput.value,
      descripcion: descripcionInput.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseFloat(puInput.value) || 0,
      subtotal: parseCurrency(subtotalInput.value),
    };
    // Adjuntar índice temporal si estamos en edición
    return isEdit ? { ...data, __tempIndex: itemData.__tempIndex } : data;
  }
  
  // --- INICIALIZACIÓN PARA EDICIÓN ---
  if (isEdit) {
    // Rellenar campos del formulario
    materialSelect.value = itemData.material || materiales[0];
    nombrePiezaInput.value = itemData.nombrePieza || '';
    largoInput.value = itemData.largo || '';
    anchoInput.value = itemData.ancho || '';
    numPiezasInput.value = itemData.numPiezas || 1;
    claveInput.value = itemData.clave || '';
    descripcionInput.value = itemData.descripcion || '';
    unidadInput.value = itemData.unidad || 'm²';
    cantidadInput.value = parseFloat(itemData.cantidad).toFixed(3) || '0.000';
    puInput.value = itemData.pu || '';
    subtotalInput.value = formatCurrency(itemData.subtotal || 0);
  }

  // --- EVENTOS ---
  function inicializarEventos() {
    modal.querySelector("#cerrarModalViniladherible").onclick = () => overlay.remove();

    // Movimiento con flechas (adaptado al nuevo estilo 'metal-input')
    const inputs = Array.from(modal.querySelectorAll(".metal-input, .btn-action-metal"));
    inputs.forEach((input, idx) => {
      input.addEventListener("keydown", (e) => {
        const total = inputs.length;
        // Navegación secuencial, ignora 'Enter' si es un campo de texto y no el botón final
        if (["ArrowDown", "ArrowRight"].includes(e.key) || (e.key === "Enter" && input.type !== "submit")) { 
          e.preventDefault(); 
          inputs[(idx + 1) % total].focus();
        }
        if (["ArrowUp", "ArrowLeft"].includes(e.key)) { 
          e.preventDefault(); 
          inputs[(idx - 1 + total) % total].focus(); 
        }
      });
    });

    // ✅ Cambio de categoría dinámico
    modal.querySelector("#categoriaViniladherible").addEventListener("change", (e) => {
      const nuevaCat = e.target.value.toUpperCase().replace(/ /g, '').replace(/\//g, '');
      overlay.remove();
      const funcion = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
      if (typeof window[funcion] === "function") {
        window[funcion](itemData); // Pasa itemData para preservar el contexto de edición
      } else {
        alert(`⚠️ Formulario para "${e.target.value}" no disponible (verifica que exista el archivo JS).`);
      }
    });

    // Cambio de material (solo se dispara si no estamos en edición o si el material no está ya seleccionado)
    materialSelect.addEventListener("change", (e) => {
      const material = e.target.value;
      if (preciosVinil[material] !== undefined) {
        unidadInput.value = "m²";
        puInput.value = preciosVinil[material];
        descripcionInput.value = material;
      }
      calcularCantidad(); // Recalcula al cambiar material
    });

    // Cálculos automáticos
    [largoInput, anchoInput, numPiezasInput].forEach(el => {
      el.addEventListener("input", calcularCantidad);
    });
    puInput.addEventListener("input", calcularSubtotal);
    
    // Al perder foco en P.U., se aplica el formato de moneda
    puInput.addEventListener("blur", () => {
      const val = parseFloat(puInput.value) || 0;
      puInput.value = val.toFixed(2);
      calcularSubtotal();
    });

    // 🔹 Lógica de Guardar (ADICIÓN/EDICIÓN)
    modal.querySelector("#viniladheribleForm").onsubmit = (e) => {
      e.preventDefault();
      const data = obtenerValores();

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
          if (typeof window.agregarFilaDespiece === "function") {
              window.agregarFilaDespiece(data);
          } else {
              alert('Error: La función agregarFilaDespiece no está disponible.');
          }
      }
      
      overlay.remove();
    };
  }

  inicializarEventos();
  // Asegurar que el cálculo se ejecute al abrir si hay datos de edición
  if (isEdit) calcularCantidad();
}