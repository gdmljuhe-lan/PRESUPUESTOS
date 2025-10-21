// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender', y la variable 'despieceList'
// (y despieceStorageKey) estén definidas en el script principal (analiticosgdml.html)

function mostrarFormularioMetal(itemData = null) {
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
    width: "700px", // Ancho optimizado para doble columna
    maxHeight: "90vh", 
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELECTRICO","ACRILICO",
    "ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH","TELA/VINIPIEL",
    "EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];
  const materiales = [
    "LAMINA","PERFIL","PLACA","BARRA","TUBO","ANGULO","SOLERA",
    "OTRO (PERFIL, BARRA, ETC.)","OTRO (LAMINA, PLACA, ETC.)"
  ];
  
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA METAL'}` : 'FORMULARIO CATEGORÍA: METAL';
  
  const listForCount = typeof despieceList !== 'undefined' ? despieceList : (JSON.parse(localStorage.getItem(despieceStorageKey) || '[]'));
  const numFila = isEdit ? itemData.__tempIndex + 1 : listForCount.length + 1;

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
        width: 100%; /* Asegura que ocupe todo el espacio de su contenedor */
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

      /* Grid Principal (2 Columnas) */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr; /* 50% y 50% */
        gap: 20px; /* Espacio entre columnas */
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Grid para No. y Categoría (Sub-Grid) */
      .num-cat-row {
        display: grid;
        grid-template-columns: 4fr 8fr; /* Simula col-md-4 y col-md-8 */
        gap: 10px;
        margin-bottom: 12px;
      }

      /* Grid de la Fila Final (6 Columnas) */
      .final-fields-grid {
        display: grid;
        /* Proporciones: 2/12, 3/12, 1/12, 2/12, 2/12, 2/12 */
        grid-template-columns: 2fr 3fr 1fr 2fr 2fr 2fr; 
        gap: 10px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      select option { background-color: #3C473C; color: #E8EBE0; }
      ::placeholder { color: #B0B0B0 !important; opacity: 0.8; }

      /* Campos de solo lectura o especiales */
      #numMetal, #subtotalMetal {
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

    <form id="metalForm">
      
      <div class="form-grid">
        
        <div>
          
          <div class="num-cat-row">
            <div>
              <label>No.</label><input type="text" id="numMetal" class="metal-input" value="${numFila}" readonly>
            </div>
            <div>
              <label>Categoría</label>
              <select id="categoriaMetal" class="metal-input">
                ${categorias.map(c=>`<option value="${c}" ${c===(itemData?.categoria || 'METAL')?'selected':''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div class="form-group-compact">
            <label>Material</label>
            <select id="materialMetal" class="metal-input" required>
              <option value="">Seleccione...</option>
              ${materiales.map(m=>`<option value="${m}" ${m===itemData?.material?'selected':''}>${m}</option>`).join('')}
            </select>
          </div>

          <div class="form-group-compact ${['OTRO (PERFIL, BARRA, ETC.)', 'OTRO (LAMINA, PLACA, ETC.)'].includes(itemData?.material) ? '' : 'd-none'}" id="campoLargoMaterial">
            <label>Largo de material (mm)</label><input type="number" id="largoMaterialMetal" class="metal-input" step="0.01" value="${itemData?.largoMaterial || ''}">
          </div>

          <div class="form-group-compact ${['OTRO (LAMINA, PLACA, ETC.)'].includes(itemData?.material) ? '' : 'd-none'}" id="campoAnchoMaterial">
            <label>Ancho de material (mm)</label><input type="number" id="anchoMaterialMetal" class="metal-input" step="0.01" value="${itemData?.anchoMaterial || ''}">
          </div>
        </div>

        <div>
          <div class="form-group-compact">
            <label>Nombre de la pieza</label><input type="text" id="nombrePiezaMetal" class="metal-input" required value="${itemData?.nombrePieza || ''}">
          </div>

          <div class="form-group-compact">
            <label>Largo (mm)</label><input type="number" id="largoMetal" class="metal-input" step="0.01" value="${itemData?.largo || ''}">
          </div>

          <div class="form-group-compact" id="campoAncho" class="${['PERFIL','BARRA','TUBO','ANGULO','SOLERA', 'OTRO (PERFIL, BARRA, ETC.)'].includes(itemData?.material) ? 'd-none' : ''}">
            <label>Ancho (mm)</label><input type="number" id="anchoMetal" class="metal-input" step="0.01" value="${itemData?.ancho || ''}">
          </div>
          
          <div class="form-group-compact">
            <label>No. piezas</label><input type="number" id="numPiezasMetal" class="metal-input" step="1" min="1" value="${itemData?.numPiezas || 1}">
          </div>
        </div>
      </div>

      <div class="final-fields-grid">
        <div><label>Clave</label><input type="text" id="claveMetal" class="metal-input" value="${itemData?.clave || ''}"></div>
        <div><label>Descripción</label><input type="text" id="descripcionMetal" class="metal-input" list="descripcionOptions" value="${itemData?.descripcion || ''}"></div>
        <div><label>Unidad</label><input type="text" id="unidadMetal" class="metal-input" value="${itemData?.unidad || ''}"></div>
        <div><label>Cantidad</label><input type="number" id="cantidadMetal" class="metal-input" value="${(itemData?.cantidad || 0).toFixed(3)}" readonly></div>
        <div><label>P.U. ($)</label><input type="text" id="puMetal" class="metal-input" placeholder="$0.00" value="${formatCurrency(itemData?.pu || 0)}"></div>
        <div><label>Subtotal ($)</label><input type="text" id="subtotalMetal" class="metal-input" value="${formatCurrency(itemData?.subtotal || 0)}" readonly></div>
      </div>

      <div class="text-center" style="margin-top: 20px;">
        <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
        <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalMetal">CANCELAR</button>
      </div>
    </form>
  `;

  // Crear el datalist para las sugerencias de descripción
  const datalist = document.createElement('datalist');
  datalist.id = 'descripcionOptions';
  modal.appendChild(datalist);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById("cerrarModalMetal").onclick = () => overlay.remove();
  
  // 🔹 CAMBIO DE CATEGORÍA
  document.getElementById("categoriaMetal").addEventListener("change", (e) => {
    const nuevaCat = e.target.value.toUpperCase().replace(/ /g, '').replace(/\//g, '');
    overlay.remove();
    const funcion = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    if (typeof window[funcion] === "function") window[funcion]();
    else alert(`⚠️ No se encontró la función: ${funcion}()`);
  });

  const materialSelect = document.getElementById("materialMetal"),
        campoAncho = document.getElementById("campoAncho"),
        campoLargoMaterial = document.getElementById("campoLargoMaterial"),
        campoAnchoMaterial = document.getElementById("campoAnchoMaterial"),
        inputPU = document.getElementById("puMetal"),
        inputSubtotal = document.getElementById("subtotalMetal");

  materialSelect.addEventListener("change", actualizarCampos);
  ["largoMetal", "anchoMetal", "numPiezasMetal", "largoMaterialMetal", "anchoMaterialMetal"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", calcularCantidad);
  });

  inputPU.addEventListener("blur", () => {
    const val = parseCurrency(inputPU.value);
    inputPU.value = formatCurrency(val);
    calcularSubtotal();
  });
  inputPU.addEventListener("input", calcularSubtotal);

  // 🔹 Navegación con flechas: Permitir movimiento del cursor dentro de inputs de texto
  const inputs = modal.querySelectorAll("input,select,button");
  inputs.forEach((el, i) => {
    el.addEventListener("keydown", e => {
      const isTextInput = el.tagName === "INPUT" && ["text", "number"].includes(el.type) && !el.readOnly;
      const cursorPos = isTextInput ? el.selectionStart : null;
      const textLength = isTextInput ? el.value.length : 0;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (!isTextInput || cursorPos === textLength) { // Navegar solo si está al final del texto
          e.preventDefault();
          inputs[i + 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" || (e.key === "Enter" && e.shiftKey)) {
        if (!isTextInput || cursorPos === 0) { // Navegar solo si está al inicio del texto
          e.preventDefault();
          inputs[i - 1]?.focus();
        }
      } else if (e.key === "ArrowDown") {
        if (!isTextInput || cursorPos === textLength) { // Navegar solo si está al final
          e.preventDefault();
          inputs[i + 1]?.focus();
        }
      } else if (e.key === "ArrowUp") {
        if (!isTextInput || cursorPos === 0) { // Navegar solo si está al inicio
          e.preventDefault();
          inputs[i - 1]?.focus();
        }
      }
    });
  });
  
  // Función auxiliar para obtener los datos actuales del formulario
  function getCurrentFormData() {
      return {
          categoria: "METAL",
          material: materialSelect.value,
          nombrePieza: document.getElementById("nombrePiezaMetal").value,
          largo: parseFloat(document.getElementById("largoMetal").value) || 0,
          ancho: parseFloat(document.getElementById("anchoMetal").value) || 0,
          numPiezas: parseInt(document.getElementById("numPiezasMetal").value) || 1,
          largoMaterial: parseFloat(document.getElementById("largoMaterialMetal").value) || 0,
          anchoMaterial: parseFloat(document.getElementById("anchoMaterialMetal").value) || 0,
          clave: document.getElementById("claveMetal").value,
          descripcion: document.getElementById("descripcionMetal").value,
          unidad: document.getElementById("unidadMetal").value,
          cantidad: parseFloat(document.getElementById("cantidadMetal").value) || 0,
          pu: parseCurrency(inputPU.value), 
          subtotal: parseCurrency(inputSubtotal.value),
          // Incluir el índice temporal SOLO si se está en modo edición
          ...(isEdit && { __tempIndex: itemData.__tempIndex }) 
      };
  }

  function actualizarCampos() {
    const mat = materialSelect.value.toUpperCase();
    campoAncho.classList.remove("d-none"); campoLargoMaterial.classList.add("d-none"); campoAnchoMaterial.classList.add("d-none");
    if (["PERFIL", "BARRA", "TUBO", "ANGULO", "SOLERA"].includes(mat)) campoAncho.classList.add("d-none");
    else if (mat === "OTRO (PERFIL, BARRA, ETC.)") { campoLargoMaterial.classList.remove("d-none"); campoAncho.classList.add("d-none"); }
    else if (mat === "OTRO (LAMINA, PLACA, ETC.)") { campoLargoMaterial.classList.remove("d-none"); campoAnchoMaterial.classList.remove("d-none"); }
    calcularCantidad();
  }

  function calcularCantidad() {
    const mat = materialSelect.value.toUpperCase();
    const largo = parseFloat(document.getElementById("largoMetal").value) || 0;
    const ancho = parseFloat(document.getElementById("anchoMetal").value) || 0;
    const piezas = parseFloat(document.getElementById("numPiezasMetal").value) || 1;
    const largoMat = parseFloat(document.getElementById("largoMaterialMetal").value) || 0;
    const anchoMat = parseFloat(document.getElementById("anchoMaterialMetal").value) || 0;
    let cantidad = 0;
    
    // Las longitudes de material se asumen en milímetros (mm)
    if (["PERFIL", "BARRA", "TUBO", "ANGULO", "SOLERA"].includes(mat)) cantidad = (largo / 5800) * piezas; 
    else if (mat === "OTRO (PERFIL, BARRA, ETC.)" && largoMat > 0) cantidad = (largo / largoMat) * piezas; 
    else if (["LAMINA", "PLACA"].includes(mat)) cantidad = ((largo * ancho) / 3680000) * piezas; 
    else if (mat === "OTRO (LAMINA, PLACA, ETC.)" && largoMat > 0 && anchoMat > 0) cantidad = ((largo * ancho) / (largoMat * anchoMat)) * piezas;
    
    document.getElementById("cantidadMetal").value = cantidad.toFixed(3); calcularSubtotal();
  }

  function calcularSubtotal() {
    const cantidad = parseFloat(document.getElementById("cantidadMetal").value) || 0;
    const pu = parseCurrency(inputPU.value);
    const subtotal = cantidad * pu;
    inputSubtotal.value = formatCurrency(subtotal);
  }

  function formatCurrency(v) { if (isNaN(v) || v === "") return "$0.00"; return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
  function parseCurrency(s) { return parseFloat(s.replace(/[^0-9.-]+/g, "")) || 0; }
  
  // Si hay data (modo edición), se inicializan los campos y se recalcula la cantidad
  if (itemData) {
      actualizarCampos();
      // Solo para asegurar que se ejecute el cálculo al abrir
      calcularCantidad();
  }

  // 🔹 Nueva funcionalidad: Cargar datos de autocompletado desde localStorage (subidos en acumuladogdml.html)
  const METAL_DATA_KEY = 'acumuladoMetalData'; // Clave coincidente con acumuladogdml.html
  const metalData = JSON.parse(localStorage.getItem(METAL_DATA_KEY) || '[]');

  if (metalData.length > 0) {
    // Llenar el datalist con las descripciones únicas (columna B)
    const uniqueDescripciones = [...new Set(metalData.map(item => item.descripcion.trim()))];
    uniqueDescripciones.forEach(desc => {
      const option = document.createElement('option');
      option.value = desc;
      datalist.appendChild(option);
    });

    // Evento para autocompletar al cambiar/seleccionar en descripción
    const inputDescripcion = document.getElementById("descripcionMetal");
    inputDescripcion.addEventListener("input", () => {
      const valor = inputDescripcion.value.trim();
      // Buscar coincidencia exacta (case-insensitive) en los datos
      const match = metalData.find(item => item.descripcion.trim().toUpperCase() === valor.toUpperCase());
      if (match) {
        // Autocompletar los campos
        document.getElementById("claveMetal").value = match.clave || '';
        document.getElementById("unidadMetal").value = match.unidad || '';
        const precioBase = match["P.U. ($)"] || 0;
        const precioCon16 = precioBase * 1.16; // Aplicar 16% de impuesto
        inputPU.value = formatCurrency(precioCon16);
        calcularSubtotal(); // Recalcular subtotal si es necesario
      }
    });

    // 🔹 Nueva funcionalidad: Limpiar campo descripción al hacer doble clic
    inputDescripcion.addEventListener("dblclick", () => {
      inputDescripcion.value = ''; // Limpiar el campo
      inputDescripcion.focus(); // Poner el foco para permitir edición inmediata
    });

    // Agregar dblclick para limpiar otras casillas
    const inputClave = document.getElementById("claveMetal");
    inputClave.addEventListener("dblclick", () => {
      inputClave.value = '';
      inputClave.focus();
    });

    const inputUnidad = document.getElementById("unidadMetal");
    inputUnidad.addEventListener("dblclick", () => {
      inputUnidad.value = '';
      inputUnidad.focus();
    });

    inputPU.addEventListener("dblclick", () => {
      inputPU.value = '';
      inputPU.focus();
    });

  } else {
    // Opcional: Mostrar un mensaje si no hay datos cargados
    console.warn("No hay datos de metal cargados en localStorage. Sube un archivo en acumuladogdml.html.");
  }

  document.getElementById("metalForm").onsubmit = e => {
    e.preventDefault();
    const data = getCurrentFormData();
    
    if (isEdit) {
      // Lógica de EDICIÓN
      if (typeof updateDespieceStorageAndRender === 'function') {
        const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
        if (data.__tempIndex >= 0 && data.__tempIndex < current.length) {
            const dataToSave = { ...data };
            delete dataToSave.__tempIndex; 
            current[itemData.__tempIndex] = dataToSave; 
            updateDespieceStorageAndRender(current); 
            alert('ELEMENTO EDITADO CORRECTAMENTE.');
        } else {
            alert('Error al editar: Índice no válido.');
        }
      } else {
          alert('Error: La función updateDespieceStorageAndRender no está disponible.');
      }
    } else {
      // Lógica de AGREGAR
      agregarFilaDespiece(data);
    }
    
    overlay.remove();
  };
}