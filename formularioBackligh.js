function mostrarFormularioBackligh(itemData = null) {
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // Funciones auxiliares
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }

  // 🔹 Listados y Constantes
  const categorias = [
    "PINTURA", "BARNIZ", "METAL", "MADERA", "MARMOL", "HERRAJE", "ELÉCTRICO",
    "ACRÍLICO", "ESPEJO", "VIDRIO", "GRAFICOS", "VINIL ADHERIBLE", "BACKLIGH",
    "TELA/VINIPIEL", "EMBALAJE", "INSUMOS", "MANO DE OBRA", "CORTE LASER", "EXTERNOS"
  ];

  const materiales = [
    "TELA LIGHT BOX SUBLIMADA CON GOMA PERIMETRAL",
    "OTRO (TELA LIGHT BOX)"
  ];

  const precioBackligh = 3561.61;

  // 🔹 Lógica para modo Edición o Agregar
  // Es edición si el objeto viene y contiene el índice inyectado por el script principal
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA BACKLIGH'}` : 'FORMULARIO CATEGORÍA: BACKLIGH';

  // Determina el número de fila. Si es edición, usa el número de fila original.
  // Se asume que 'despieceStorageKey' y 'despieceList' (o un contador de filas) existen globalmente.
  const listForCount = typeof despieceList !== 'undefined' ? despieceList : (JSON.parse(localStorage.getItem(typeof despieceStorageKey !== 'undefined' ? despieceStorageKey : 'despieceList') || '[]'));
  const numFila = isEdit ? itemData.no : listForCount.length + 1;

  let valoresTemporales = {};
  let currentMaterial = valoresTemporales["materialBackligh"] || itemData?.material || materiales[0];

  // 🔹 Fondo del modal (Glassmorphism Rústico/Natural)
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999",
    backdropFilter: "blur(8px)"
  });

  // 🔹 Modal principal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", // Fondo Glassmorphism
    color: "#E8EBE0",
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "850px",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  // Función para renderizar/actualizar el formulario (necesaria por los campos dinámicos de material)
  function renderFormulario(material) {
    currentMaterial = valoresTemporales["materialBackligh"] || itemData?.material || material;

    // Almacenar el item original (incluyendo __tempIndex) en el atributo data-original-item del formulario
    const originalItemData = isEdit ? `data-original-item='${JSON.stringify(itemData)}'` : '';

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
        #numBackligh, #cantidadBackligh, #subtotalBackligh {
          background: rgba(0, 0, 0, 0.4) !important;
          color: #B0B0B0 !important;
          font-weight: normal;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        #puBackligh {
          color: #E8EBE0 !important; 
          font-weight: bold;
        }
      </style>

      <h4 class="modal-header-metal">${modalTitle}</h4>

      <form id="backlighForm" ${originalItemData}>
        
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="mb-3">
                <label>No.</label>
                <input type="text" id="numBackligh" class="metal-input" value="${numFila}" readonly>
            </div>
            <div class="mb-3">
                <label>Categoría</label>
                <select id="categoriaBackligh" class="metal-input">
                  ${categorias.map(c => `<option value="${c}" ${c === (itemData?.categoria || "BACKLIGH") ? "selected" : ""}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label>Material</label>
                <select id="materialBackligh" class="metal-input">
                  ${materiales.map(m => `<option value="${m}" ${m === currentMaterial ? "selected" : ""}>${m}</option>`).join('')}
                </select>
            </div>

            ${
              currentMaterial === "OTRO (TELA LIGHT BOX)" ?
              `<div class="mb-3"><label>Largo de material (mm)</label><input type="number" id="largoMaterialBackligh" class="metal-input" value="${valoresTemporales["largoMaterialBackligh"] || itemData?.largoMaterial || ''}"></div>
              <div class="mb-3"><label>Ancho de material (mm)</label><input type="number" id="anchoMaterialBackligh" class="metal-input" value="${valoresTemporales["anchoMaterialBackligh"] || itemData?.anchoMaterial || ''}"></div>`
              : ""
            }
          </div>

          <div class="col-md-6">
            <div class="mb-3"><label>Nombre de la pieza</label><input type="text" id="nombrePiezaBackligh" class="metal-input" value="${itemData?.nombrePieza || ''}"></div>
            <div class="mb-3"><label>Largo (mm)</label><input type="number" id="largoBackligh" class="metal-input" value="${itemData?.largo || ''}"></div>
            <div class="mb-3"><label>Ancho (mm)</label><input type="number" id="anchoBackligh" class="metal-input" value="${itemData?.ancho || ''}"></div>
            <div class="mb-3"><label>No. piezas</label><input type="number" id="numPiezasBackligh" class="metal-input" min="1" value="${itemData?.numPiezas || 1}"></div>
          </div>
        </div>

        <div class="row mb-3 border-top pt-3">
          <div class="col-md-2"><label>Clave</label><input type="text" id="claveBackligh" class="metal-input" value="${itemData?.clave || ''}"></div>
          <div class="col-md-3"><label>Descripción</label><input type="text" id="descripcionBackligh" class="metal-input" value="${itemData?.descripcion || ''}"></div>
          <div class="col-md-1"><label>Unidad</label><input type="text" id="unidadBackligh" class="metal-input" value="${itemData?.unidad || 'm2'}" readonly></div>
          <div class="col-md-2"><label>Cantidad</label><input type="number" id="cantidadBackligh" class="metal-input" step="0.01" value="${itemData?.cantidad || 0}" readonly></div>
          <div class="col-md-2"><label>P.U.</label><input type="text" id="puBackligh" class="metal-input" value="${formatCurrency(itemData?.pu || precioBackligh)}"></div>
          <div class="col-md-2"><label>Subtotal</label><input type="text" id="subtotalBackligh" class="metal-input" value="${formatCurrency(itemData?.subtotal || 0)}" readonly></div>
        </div>

        <div class="text-center mt-4">
          <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
          <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalBackligh">CANCELAR</button>
        </div>
      </form>
    `;
    
    // 🛑 Lógica de Eventos
    const backlighForm = modal.querySelector("#backlighForm");
    const largoInput = modal.querySelector("#largoBackligh");
    const anchoInput = modal.querySelector("#anchoBackligh");
    const numPiezasInput = modal.querySelector("#numPiezasBackligh");
    const cantidadInput = modal.querySelector("#cantidadBackligh");
    const pu = modal.querySelector("#puBackligh");
    const subtotal = modal.querySelector("#subtotalBackligh");
    const materialSelect = modal.querySelector("#materialBackligh");
    const categoriaSelect = modal.querySelector("#categoriaBackligh");
    const descripcionInput = modal.querySelector("#descripcionBackligh");
    
    // Funciones de cálculo
    function calcularCantidad() {
      const largo = parseFloat(largoInput.value) || 0;
      const ancho = parseFloat(anchoInput.value) || 0;
      const numPiezas = parseInt(numPiezasInput.value) || 1;
      // Cálculo en m²: (Largo en mm / 1000) * (Ancho en mm / 1000) * No. piezas
      const areaUnitario = (largo / 1000) * (ancho / 1000);
      const cantidad = areaUnitario * numPiezas;
      cantidadInput.value = cantidad.toFixed(3);
      calcularSubtotal();
    }
    
    function calcularSubtotal() {
      const cantidad = parseFloat(cantidadInput.value) || 0;
      const puValue = parseCurrency(pu.value);
      subtotal.value = formatCurrency(cantidad * puValue);
    }

    // Listeners de cálculo
    largoInput.addEventListener('input', calcularCantidad);
    anchoInput.addEventListener('input', calcularCantidad);
    numPiezasInput.addEventListener('input', calcularCantidad);
    
    // pu.addEventListener('input', calcularSubtotal); // Se usará blur para formateo
    pu.addEventListener('blur', () => {
        const val = parseCurrency(pu.value);
        pu.value = formatCurrency(val);
        calcularSubtotal();
    });
    pu.addEventListener('focus', () => {
        // Al editar, quita el formato de moneda para que solo sean números
        pu.value = parseCurrency(pu.value);
    });
    
    // Listener de Material para re-renderizar
    materialSelect.addEventListener('change', function() {
        valoresTemporales = {
            "materialBackligh": this.value,
            // Guardar otros valores que podrían perderse
            "nombrePieza": modal.querySelector("#nombrePiezaBackligh").value,
            "largo": largoInput.value,
            "ancho": anchoInput.value,
            "numPiezas": numPiezasInput.value,
        };
        // Inicializa el PU y la descripción cuando se cambia a la opción por defecto
        if(this.value === materiales[0]) {
            itemData = { ...itemData, pu: precioBackligh, descripcion: this.value };
        }
        
        // El PU se pone en el campo de descripción si no es "OTRO"
        descripcionInput.value = this.value;

        // Re-renderiza para mostrar/ocultar campos dinámicos
        renderFormulario(this.value);
    });

    // Cierre del modal
    modal.querySelector("#cerrarModalBackligh").onclick = () => overlay.remove();

    // Navegación con flechas (adaptada al nuevo estilo 'metal-input')
    const inputs = Array.from(modal.querySelectorAll(".metal-input, .btn-action-metal"));
    inputs.forEach((input, index) => {
      input.addEventListener("keydown", e => {
        const total = inputs.length;
        if (["ArrowDown","ArrowRight"].includes(e.key) || (e.key === "Enter" && input.type !== "submit")) {
          e.preventDefault();
          inputs[(index + 1) % total].focus();
        } else if (["ArrowUp","ArrowLeft"].includes(e.key)) {
          e.preventDefault();
          inputs[(index - 1 + total) % total].focus();
        }
      });
    });


    // Lógica de navegación (para pasar el item a editar)
    categoriaSelect.addEventListener("change", (e) => {
        const raw = e.target.value.toUpperCase();
        const nuevaCat = raw.replace(/ /g, "").replace(/\//g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        overlay.remove();
        const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();

        const originalItemJson = backlighForm.getAttribute('data-original-item');
        const itemToPass = originalItemJson ? JSON.parse(originalItemJson) : null;

        if (typeof window[funcName] === "function") {
            window[funcName](itemToPass); // Pasar el objeto a editar al nuevo formulario
        } else {
            alert(`⚠️ Formulario para "${e.target.value}" no disponible (verifica que exista el archivo JS).`);
        }
    });

    // ✅ LÓGICA DE GUARDAR/ACTUALIZAR (basada en el índice)
    backlighForm.onsubmit = e => {
      e.preventDefault();

      // Recolectar datos del formulario
      const data = {
        no: numFila,
        categoria: categoriaSelect.value,
        material: materialSelect.value,
        nombrePieza: modal.querySelector("#nombrePiezaBackligh").value,
        largo: parseFloat(largoInput.value) || 0,
        ancho: parseFloat(anchoInput.value) || 0,
        numPiezas: parseInt(numPiezasInput.value) || 1,
        largoMaterial: materialSelect.value === "OTRO (TELA LIGHT BOX)" ? (parseFloat(modal.querySelector("#largoMaterialBackligh")?.value) || 0) : 0,
        anchoMaterial: materialSelect.value === "OTRO (TELA LIGHT BOX)" ? (parseFloat(modal.querySelector("#anchoMaterialBackligh")?.value) || 0) : 0,
        clave: modal.querySelector("#claveBackligh").value,
        descripcion: descripcionInput.value,
        unidad: modal.querySelector("#unidadBackligh").value,
        cantidad: parseFloat(cantidadInput.value) || 0,
        pu: parseCurrency(pu.value),
        subtotal: parseCurrency(subtotal.value) || 0,
      };
      
      const originalItemJson = backlighForm.getAttribute('data-original-item');
      const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;
      
      // Lógica de EDICIÓN
      if (originalItem && typeof originalItem.__tempIndex === 'number') { 
          const indexToEdit = originalItem.__tempIndex;

          if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
              const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
              
              if (indexToEdit >= 0 && indexToEdit < current.length) {
                // Elimina __tempIndex antes de guardar en el storage
                const dataToSave = { ...data };
                // current[indexToEdit] = { ...dataToSave, no: originalItem.no }; // Asegura que el número de fila no cambie
                current[indexToEdit] = dataToSave;
                
                updateDespieceStorageAndRender(current); 
                // Se elimina el alert de confirmación
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

  // Llamada inicial para renderizar el formulario
  renderFormulario(currentMaterial);

  document.body.appendChild(overlay);
  overlay.appendChild(modal);
}