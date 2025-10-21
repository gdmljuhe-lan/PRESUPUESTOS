// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender', y la variable 'despieceList'
// (y despieceStorageKey) estén definidas en el script principal (analiticosgdml.html)

/**
 * Muestra el formulario de Acrílico con estilo Glassmorphism Rústico.
 * @param {Object | null} itemData - Objeto de la fila si se está editando (debe contener __tempIndex), o null si es una nueva fila.
 */
function mostrarFormularioAcrilico(itemData = null) {
  // 🔹 Cierra cualquier modal anterior
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }

  // --- LÓGICA DE EDICIÓN/ADICIÓN Y ESTADO DEL MATERIAL ---
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA ACRÍLICO'}` : 'FORMULARIO CATEGORÍA: ACRÍLICO';

  // Asumiendo despieceList/despieceStorageKey están disponibles globalmente
  const despieceList = typeof window.despieceList !== 'undefined' ? window.despieceList : (typeof despieceStorageKey !== 'undefined' ? JSON.parse(localStorage.getItem(despieceStorageKey) || '[]') : []);
  const numFila = isEdit ? itemData.no : despieceList.length + 1;

  const currentMaterial = itemData?.material?.toUpperCase() || '';
  const isRolloAluminio = currentMaterial === 'ROLLO DE ALUMINIO';
  const isOtro = currentMaterial.includes('OTRO');

  // 🔹 Fondo del modal (Estilo Glassmorphism Rústico de Metal)
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999", backdropFilter: "blur(8px)"
  });

  // 🔹 Modal principal (Estilo Glassmorphism Rústico/Natural de Metal)
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)",
    color: "#E8EBE0",
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  const categorias = [
    "PINTURA", "BARNIZ", "METAL", "MADERA", "MARMOL", "HERRAJE", "ELÉCTRICO",
    "ACRÍLICO", "ESPEJO", "VIDRIO", "GRAFICOS", "VINIL ADHERIBLE", "BACKLIGH",
    "TELA/VINIPIEL", "EMBALAJE", "INSUMOS", "MANO DE OBRA", "CORTE LASER", "EXTERNOS"
  ];

  const materiales = [
    "ACRILICO CRISTAL", "ACRILICO LECHOSO", "ACRILICO ESMERILADO", "ACRILICO DE COLOR",
    "ACRILICO OPALINO", "NYLAMID", "TROVICEL", "ROLLO DE ALUMINIO", "OTRO (ACRILICO, NYLAMID, ETC.)"
  ];

  // Lista de descripciones predefinidas para autocompletado
  const descripcionesPorMaterial = {
    "ACRILICO CRISTAL": [
      "ACRILICO CRISTAL 2 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 3 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL ESPEJO 3 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 4.5 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 6 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 9 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 12 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 15 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 18 MM 1.22 X 2.44 M",
      "ACRILICO CRISTAL 3 MM 1.93 X 2.7 M",
      "ACRILICO CRISTAL 3 MM 2.54 X 2.9 M",
      "ACRILICO CRISTAL DURAPLEX 4.5 MM ANCHO 1.93 M",
      "ACRILICO CRISTAL 6 MM 1.88 X 2.44 M"
    ],
    "ACRILICO LECHOSO": [
      "ACRILICO LECHOSO 3 MM 1.22 X 2.44 M",
      "ACRILICO LECHOSO 4.5 MM 1.22 X 2.44 M",
      "ACRILICO LECHOSO 6 MM 1.22 X 2.44 M",
      "ACRILICO LECHOSO 18 MM 1.22 X 2.44 M",
      "ACRILICO LECHOSO 3 MM 1.83 X 2.44 M",
      "ACRILICO BLANCO LECHOSO 4.5 MM 1.88 X 2.49 M",
      "ACRILICO LECHOSO 4.5 MM 1.93 X 2.80 M",
      "ACRILICO LECHOSO 4.5 MM 1.88 X 2.49 M"
    ],
    "ACRILICO ESMERILADO": [
      "ACRILICO ESMERILADO 3 MM 1.22 X 2.44 M",
      "ACRILICO ESMERILADO 6 MM 1.22 X 2.44 M",
      "ACRILICO ESMERILADO 12 MM 1.22 X 2.44 M",
      "ACRILICO ESMERILADO 6 MM 1.83 X 2.44 M"
    ],
    "ACRILICO DE COLOR": [
      "ACRILICO NEGRO 3 MM 1.22 X 2.44 M",
      "ACRILICO NEGRO TRASLUCIDO 3 MM MC-2074 1.22 X 2.44 M",
      "ACRILICO NEGRO 6 MM 1.22 X 2.44 M",
      "ACRILICO DE 3 MM AMARILLO MC 2037 1.22 X 2.44 M",
      "ACRILICO ROJO SOLIDO 3 MM MCA. NEWTON 1.22 X 2.44 M",
      "ACRILICO VERDE MC-993 3 MM 1.22 X 2.44 M",
      "ACRILICO NEGRO 3 MM 1.88 X 2.49 M"
    ],
    "ACRILICO OPALINO": [
      "ACRILICO OPALINO 3 MM 1.22 X 2.44 M"
    ],
    "NYLAMID": [
      "PLACA DE NYLAMID TIPO M DE 1\" X 24\" X 24\""
    ],
    "TROVICEL": [
      "TROVICEL NEGRO 3 MM 1.22 X 2.44 M",
      "TROVICEL NEGRO 6 MM 1.22 X 2.44 M",
      "TROVICEL BLANCO 3 MM 1.22 X 2.44 M",
      "TROVICEL BLANCO 6 MM 1.22 X 2.44 M",
      "TROVICEL BLANCO 10 MM 1.22 X 2.44 M",
      "TROVICEL BLANCO 12 MM 1.22 X 2.44 M"
    ],
    "ROLLO DE ALUMINIO": [
      "ROLLO DE ALUMINIO (0.6 MM X 100 MM X 100 M)",
      "ROLLO DE ALUMINIO (0.6 MM X 60 MM X 50 M)",
      "ROLLO DE ALUMINIO (0.6 MM X 60 MM X 100 M)",
      "ROLLO DE ALUMINIO NEGRO BRILLANTE (0.6 MM X 100 MM X 100 M)"
    ],
    "OTRO (ACRILICO, NYLAMID, ETC.)": []
  };

  // Dimensiones de material para autocompletado en "OTRO"
  const dimensionesMaterial = {
    "ACRILICO CRISTAL 2 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL ESPEJO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 4.5 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 6 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 9 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 12 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 15 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 18 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO CRISTAL 3 MM 1.93 X 2.7 M": { largo: 2700, ancho: 1930 },
    "ACRILICO CRISTAL 3 MM 2.54 X 2.9 M": { largo: 2900, ancho: 2540 },
    "ACRILICO CRISTAL DURAPLEX 4.5 MM ANCHO 1.93 M": { largo: 0, ancho: 1930 },
    "ACRILICO CRISTAL 6 MM 1.88 X 2.44 M": { largo: 2440, ancho: 1880 },
    "ACRILICO LECHOSO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO LECHOSO 4.5 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO LECHOSO 6 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO LECHOSO 18 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO LECHOSO 3 MM 1.83 X 2.44 M": { largo: 2440, ancho: 1830 },
    "ACRILICO BLANCO LECHOSO 4.5 MM 1.88 X 2.49 M": { largo: 2490, ancho: 1880 },
    "ACRILICO LECHOSO 4.5 MM 1.93 X 2.80 M": { largo: 2800, ancho: 1930 },
    "ACRILICO LECHOSO 4.5 MM 1.88 X 2.49 M": { largo: 2490, ancho: 1880 },
    "ACRILICO ESMERILADO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO ESMERILADO 6 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO ESMERILADO 12 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO ESMERILADO 6 MM 1.83 X 2.44 M": { largo: 2440, ancho: 1830 },
    "ACRILICO NEGRO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO NEGRO TRASLUCIDO 3 MM MC-2074 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO NEGRO 6 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO DE 3 MM AMARILLO MC 2037 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO ROJO SOLIDO 3 MM MCA. NEWTON 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO VERDE MC-993 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ACRILICO NEGRO 3 MM 1.88 X 2.49 M": { largo: 2490, ancho: 1880 },
    "ACRILICO OPALINO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "PLACA DE NYLAMID TIPO M DE 1\" X 24\" X 24\"": { largo: 609.6, ancho: 609.6 },
    "TROVICEL NEGRO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "TROVICEL NEGRO 6 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "TROVICEL BLANCO 3 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "TROVICEL BLANCO 6 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "TROVICEL BLANCO 10 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "TROVICEL BLANCO 12 MM 1.22 X 2.44 M": { largo: 2440, ancho: 1220 },
    "ROLLO DE ALUMINIO (0.6 MM X 100 MM X 100 M)": { largo: 100000, ancho: 100 },
    "ROLLO DE ALUMINIO (0.6 MM X 60 MM X 50 M)": { largo: 50000, ancho: 60 },
    "ROLLO DE ALUMINIO (0.6 MM X 60 MM X 100 M)": { largo: 100000, ancho: 60 },
    "ROLLO DE ALUMINIO NEGRO BRILLANTE (0.6 MM X 100 MM X 100 M)": { largo: 100000, ancho: 100 }
  };

  modal.innerHTML = `
    <style>
      .modal-header-metal {
        color: #D4A373;
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
      .form-group-compact {
        margin-bottom: 12px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      .num-cat-row {
        display: grid;
        grid-template-columns: 4fr 8fr;
        gap: 10px;
        margin-bottom: 12px;
      }
      .final-fields-grid {
        display: grid;
        grid-template-columns: 2fr 3fr 1fr 2fr 2fr 2fr;
        gap: 10px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }
      #numAcrilico, #cantidadAcrilico, #subtotalAcrilico, #claveAcrilico[readonly], #descripcionAcrilico[readonly], #unidadAcrilico[readonly], #puAcrilico[readonly] {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #B0B0B0 !important;
        font-weight: normal;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
      .btn-action-metal {
        font-size: 12px;
        border-radius: 8px;
        padding: 8px 20px;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
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
      .d-none { display: none !important; }
    </style>

    <h4 class="modal-header-metal">${modalTitle}</h4>

    <form id="acrilicoForm">
      <div class="form-grid">
        <div>
          <div class="num-cat-row">
            <div>
              <label>No.</label><input type="text" id="numAcrilico" class="metal-input" value="${numFila}" readonly>
            </div>
            <div>
              <label>Categoría</label>
              <select id="categoriaAcrilico" class="metal-input">
                ${categorias.map(c => `<option value="${c}" ${c === (itemData?.categoria || 'ACRÍLICO') ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group-compact">
            <label>Material</label>
            <select id="materialAcrilico" class="metal-input" required>
              <option value="">Seleccione...</option>
              ${materiales.map(m => `<option value="${m}" ${m === currentMaterial ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          <div class="form-group-compact ${isOtro ? '' : 'd-none'}" id="campoLargoMaterial">
            <label>Largo de material (mm)</label><input type="number" id="largoMaterialAcrilico" class="metal-input" step="0.01" value="${itemData?.largoMaterial || ''}">
          </div>
          <div class="form-group-compact ${isOtro ? '' : 'd-none'}" id="campoAnchoMaterial">
            <label>Ancho de material (mm)</label><input type="number" id="anchoMaterialAcrilico" class="metal-input" step="0.01" value="${itemData?.anchoMaterial || ''}">
          </div>
        </div>
        <div>
          <div class="form-group-compact">
            <label>Nombre de la pieza</label><input type="text" id="nombrePiezaAcrilico" class="metal-input" required value="${itemData?.nombrePieza || ''}">
          </div>
          <div class="form-group-compact">
            <label>Largo (mm)</label><input type="number" id="largoAcrilico" class="metal-input" step="0.01" value="${itemData?.largo || ''}">
          </div>
          <div class="form-group-compact ${isRolloAluminio ? 'd-none' : ''}" id="campoAncho">
            <label>Ancho (mm)</label><input type="number" id="anchoAcrilico" class="metal-input" step="0.01" value="${itemData?.ancho || ''}">
          </div>
          <div class="form-group-compact">
            <label>No. piezas</label><input type="number" id="numPiezasAcrilico" class="metal-input" step="1" min="1" value="${itemData?.numPiezas || 1}">
          </div>
        </div>
      </div>
      <div class="final-fields-grid">
        <div><label>Clave</label><input type="text" id="claveAcrilico" class="metal-input" value="${itemData?.clave || ''}"></div>
        <div><label>Descripción</label><input type="text" id="descripcionAcrilico" class="metal-input" list="descripcionOptions" value="${itemData?.descripcion || ''}"></div>
        <div><label>Unidad</label><input type="text" id="unidadAcrilico" class="metal-input" value="${itemData?.unidad || ''}"></div>
        <div><label>Cantidad</label><input type="text" id="cantidadAcrilico" class="metal-input" value="${(itemData?.cantidad || 0).toFixed(3)}" readonly></div>
        <div><label>P.U. ($)</label><input type="text" id="puAcrilico" class="metal-input" placeholder="$0.00" value="${formatCurrency(itemData?.pu || 0)}"></div>
        <div><label>Subtotal ($)</label><input type="text" id="subtotalAcrilico" class="metal-input" value="${formatCurrency(itemData?.subtotal || 0)}" readonly></div>
      </div>
      <div class="text-center" style="margin-top: 20px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalAcrilico">CANCELAR</button>
      </div>
    </form>
    <datalist id="descripcionOptions"></datalist>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 🔹 Elementos del formulario
  const materialSelect = document.getElementById("materialAcrilico");
  const campoAncho = document.getElementById("campoAncho");
  const campoLargoMaterial = document.getElementById("campoLargoMaterial");
  const campoAnchoMaterial = document.getElementById("campoAnchoMaterial");
  const inputPU = document.getElementById("puAcrilico");
  const inputCantidad = document.getElementById("cantidadAcrilico");
  const inputSubtotal = document.getElementById("subtotalAcrilico");
  const largoInput = document.getElementById("largoAcrilico");
  const anchoInput = document.getElementById("anchoAcrilico");
  const numPiezasInput = document.getElementById("numPiezasAcrilico");
  const unidadInput = document.getElementById("unidadAcrilico");
  const descInput = document.getElementById("descripcionAcrilico");
  const claveInput = document.getElementById("claveAcrilico");
  const datalist = document.getElementById("descripcionOptions");

  // 🔹 Cerrar modal
  document.getElementById("cerrarModalAcrilico").onclick = () => overlay.remove();

  // 🔹 Cambio de categoría
  document.getElementById("categoriaAcrilico").addEventListener("change", (e) => {
    const rawCat = e.target.value;
    const normalized = rawCat.toUpperCase().replace(/ /g, '').replace(/\//g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    overlay.remove();
    const funcName = "mostrarFormulario" + normalized.charAt(0) + normalized.slice(1).toLowerCase();
    const itemToPass = isEdit ? itemData : null;
    if (typeof window[funcName] === "function" && rawCat !== "ACRÍLICO") {
      window[funcName](itemToPass);
    } else if (rawCat === "ACRÍLICO") {
      mostrarFormularioAcrilico(itemToPass);
    }
  });

  // 🔹 Cálculo dinámico
  function calcularCantidad() {
    const mat = materialSelect.value.toUpperCase();
    const largo = parseFloat(largoInput.value) || 0;
    const ancho = parseFloat(anchoInput.value) || 0;
    const piezas = parseFloat(numPiezasInput.value) || 1;
    const largoMat = parseFloat(campoLargoMaterial.querySelector('input').value) || 0;
    const anchoMat = parseFloat(campoAnchoMaterial.querySelector('input').value) || 0;
    let cantidad = 0;
    const ACRILICO_GROUP = ["ACRILICO CRISTAL", "ACRILICO LECHOSO", "ACRILICO ESMERILADO", "ACRILICO DE COLOR", "ACRILICO OPALINO", "TROVICEL"];

    if (ACRILICO_GROUP.includes(mat)) {
      cantidad = (largo * ancho) / 3680000 * piezas;
    } else if (mat === "NYLAMID") {
      cantidad = (largo * ancho) / 360000 * piezas;
    } else if (mat === "ROLLO DE ALUMINIO") {
      cantidad = (largo / 1000) * piezas;
    } else if (mat.includes("OTRO")) {
      if (largoMat > 0 && anchoMat > 0) {
        cantidad = (largo * ancho) / (largoMat * anchoMat) * piezas;
      } else {
        cantidad = (largo * ancho) / 2880000 * piezas;
      }
    } else {
      cantidad = (largo / 1000) * (ancho / 1000) * piezas;
    }

    inputCantidad.value = cantidad.toFixed(3);
    calcularSubtotal();
  }

  function calcularSubtotal() {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    const pu = parseCurrency(inputPU.value);
    const subtotal = cantidad * pu;
    inputSubtotal.value = formatCurrency(subtotal);
  }

  // 🔹 Mostrar/ocultar campos y establecer unidad según material
  function actualizarCampos() {
    const mat = materialSelect.value.toUpperCase();
    campoAncho.classList.remove("d-none");
    campoLargoMaterial.classList.add("d-none");
    campoAnchoMaterial.classList.add("d-none");
    unidadInput.value = 'm2';

    if (mat === "ROLLO DE ALUMINIO") {
      campoAncho.classList.add("d-none");
      unidadInput.value = 'ml';
    } else if (mat.includes("OTRO")) {
      campoLargoMaterial.classList.remove("d-none");
      campoAnchoMaterial.classList.remove("d-none");
    }

    // Actualizar opciones de descripción según material seleccionado
    datalist.innerHTML = '';
    const descripciones = descripcionesPorMaterial[mat] || [];
    const acrilicoData = JSON.parse(localStorage.getItem('acumuladoAcrilicoData') || '[]');
    const filteredData = acrilicoData.filter(item => descripciones.includes(item.descripcion.trim()));
    filteredData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.descripcion.trim();
      datalist.appendChild(option);
    });

    calcularCantidad();
  }

  // 🔹 Cargar datos de autocompletado desde localStorage
  const ACRILICO_DATA_KEY = 'acumuladoAcrilicoData';
  function cargarAutocompletado() {
    const acrilicoData = JSON.parse(localStorage.getItem(ACRILICO_DATA_KEY) || '[]');
    datalist.innerHTML = '';
    const mat = materialSelect.value.toUpperCase();
    const descripciones = descripcionesPorMaterial[mat] || [];
    const filteredData = acrilicoData.filter(item => descripciones.includes(item.descripcion.trim()));
    filteredData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.descripcion.trim();
      datalist.appendChild(option);
    });

    if (acrilicoData.length === 0) {
      console.warn("No hay datos de acrílico cargados en localStorage. Sube un archivo en acumuladogdml.html.");
    }
  }

  // 🔹 Autocompletado al seleccionar descripción
  descInput.addEventListener("input", () => {
    const valor = descInput.value.trim();
    const acrilicoData = JSON.parse(localStorage.getItem(ACRILICO_DATA_KEY) || '[]');
    const match = acrilicoData.find(item => item.descripcion.trim().toUpperCase() === valor.toUpperCase());
    if (match) {
      claveInput.value = match.clave || '';
      unidadInput.value = match.unidad || '';
      const precioCon16 = (match["P.U. ($)"] || 0) * 1.16;
      inputPU.value = formatCurrency(precioCon16);
      if (materialSelect.value.includes("OTRO")) {
        const dims = dimensionesMaterial[valor] || { largo: 0, ancho: 0 };
        campoLargoMaterial.querySelector('input').value = dims.largo || '';
        campoAnchoMaterial.querySelector('input').value = dims.ancho || '';
      }
      calcularSubtotal();
    }
  });

  // 🔹 Doble clic para limpiar campos
  [claveInput, descInput, unidadInput, inputPU].forEach(input => {
    input.addEventListener("dblclick", () => {
      input.readOnly = false;
      input.value = '';
      if (input === inputPU) calcularSubtotal();
      if (materialSelect.value.includes("OTRO")) {
        campoLargoMaterial.querySelector('input').value = '';
        campoAnchoMaterial.querySelector('input').value = '';
      }
    });
  });

  // 🔹 Event listeners
  materialSelect.addEventListener("change", () => {
    actualizarCampos();
    cargarAutocompletado();
  });
  [largoInput, anchoInput, numPiezasInput, campoLargoMaterial.querySelector('input'), campoAnchoMaterial.querySelector('input')].forEach(el => {
    el?.addEventListener("input", calcularCantidad);
  });
  inputPU.addEventListener("blur", () => {
    const val = parseCurrency(inputPU.value);
    inputPU.value = formatCurrency(val);
    calcularSubtotal();
  });
  inputPU.addEventListener("input", calcularSubtotal);

  // 🔹 Navegación con teclado
  const inputs = modal.querySelectorAll("input, select, button");
  inputs.forEach((el, i) => {
    el.addEventListener("keydown", e => {
      const isTextInput = el.tagName === "INPUT" && ["text", "number"].includes(el.type) && !el.readOnly;
      const cursorPos = isTextInput ? el.selectionStart : null;
      const textLength = isTextInput ? el.value.length : 0;

      if (e.key === "ArrowRight" || e.key === "Enter") {
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

  // 🔹 Guardar fila
  document.getElementById("acrilicoForm").onsubmit = (e) => {
    e.preventDefault();
    const data = {
      id: isEdit ? itemData.id : (typeof generateUUID === 'function' ? generateUUID() : 'temp-' + Date.now()),
      no: numFila,
      categoria: "ACRÍLICO",
      material: materialSelect.value,
      nombrePieza: document.getElementById("nombrePiezaAcrilico").value,
      largo: parseFloat(largoInput.value) || 0,
      ancho: parseFloat(anchoInput.value) || 0,
      numPiezas: parseInt(numPiezasInput.value) || 1,
      largoMaterial: parseFloat(campoLargoMaterial.querySelector('input').value) || 0,
      anchoMaterial: parseFloat(campoAnchoMaterial.querySelector('input').value) || 0,
      clave: claveInput.value,
      descripcion: descInput.value,
      unidad: unidadInput.value,
      cantidad: parseFloat(inputCantidad.value) || 0,
      pu: parseCurrency(inputPU.value),
      subtotal: parseCurrency(inputSubtotal.value)
    };

    if (isEdit) {
      if (typeof updateDespieceStorageAndRender === 'function') {
        const current = typeof despieceList !== 'undefined' ? despieceList : JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
        const indexToEdit = itemData.__tempIndex;
        if (indexToEdit >= 0 && indexToEdit < current.length) {
          const dataToSave = { ...data };
          delete dataToSave.__tempIndex;
          current[indexToEdit] = dataToSave;
          updateDespieceStorageAndRender(current);
          alert('ELEMENTO EDITADO CORRECTAMENTE.');
        } else {
          alert('Error al editar: Índice no válido.');
        }
      } else {
        alert('Error: La función updateDespieceStorageAndRender no está disponible.');
      }
    } else {
      if (typeof agregarFilaDespiece === "function") {
        agregarFilaDespiece(data);
        alert('ELEMENTO AGREGADO CORRECTAMENTE.');
      } else {
        alert('Error: La función agregarFilaDespiece no está disponible.');
      }
    }

    overlay.remove();
  };

  // Inicializar campos y autocompletado
  actualizarCampos();
  cargarAutocompletado();
}