// Se requiere que las funciones 'agregarFilaDespiece', 'updateDespieceStorageAndRender'
// y las variables 'despieceList'/'despieceStorageKey' estén definidas en el script principal.

/**
 * Muestra el formulario de Tela/Vinipiel con funcionalidad de adición/edición.
 * (Estilo Glassmorphism/Metal Rústico)
 * @param {Object | null} itemData - Objeto de la fila si se está editando, o null si es una nueva fila.
 */
function mostrarFormularioTelavinipiel(itemData = null) {
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  // --- Funciones auxiliares para manejo de moneda ---
  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }
  // --- FIN Funciones auxiliares ---

  // 🔹 Listados y Constantes
  const categorias = [
    "PINTURA", "BARNIZ", "METAL", "MADERA", "MARMOL", "HERRAJE", "ELÉCTRICO",
    "ACRÍLICO", "ESPEJO", "VIDRIO", "GRAFICOS", "VINIL ADHERIBLE", "BACKLIGH",
    "TELA/VINIPIEL", "EMBALAJE", "INSUMOS", "MANO DE OBRA", "CORTE LASER", "EXTERNOS"
  ];
  const materiales = ["TELA M", "TELA M2", "OTRO (TELA)"];

  // 🔹 Lógica para modo Edición o Agregar
  // Es edición si el objeto viene y contiene el índice inyectado por el script principal
  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA TELA/VINIPIEL'}` : 'FORMULARIO CATEGORÍA: TELA / VINIPIEL';

  // Determina el número de fila. Si es edición, usa el número de fila original.
  const listForCount = typeof despieceList !== 'undefined' ? despieceList : (JSON.parse(localStorage.getItem(typeof despieceStorageKey !== 'undefined' ? despieceStorageKey : 'despieceList') || '[]'));
  const numFila = isEdit ? itemData.no : listForCount.length + 1;

  let valoresTemporales = {};
  let currentMaterial = valoresTemporales["materialTela"] || itemData?.material || materiales[0];


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

  // 🔹 Modal principal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)", // Fondo Glassmorphism semitransparente
    color: "#E8EBE0",
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(25px)", // Efecto Glassmorphism
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px",
    width: "850px",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  // Función para renderizar/actualizar el formulario
  function renderFormulario(material) {
    currentMaterial = valoresTemporales["materialTela"] || itemData?.material || material;

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
        #numTela, #cantidadTela, #subtotalTela {
          background: rgba(0, 0, 0, 0.4) !important;
          color: #B0B0B0 !important;
          font-weight: normal;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      </style>

      <h4 class="modal-header-metal">${modalTitle}</h4>

      <form id="telaForm" ${originalItemData}>

        <div class="row mb-3">
          <div class="col-md-6">
            <div class="mb-3">
                <label>No.</label>
                <input type="text" id="numTela" class="metal-input" value="${numFila}" readonly>
            </div>
            <div class="mb-3">
                <label>Categoría</label>
                <select id="categoriaTela" class="metal-input">
                  ${categorias.map(c => `<option value="${c}" ${c === (itemData?.categoria || "TELA/VINIPIEL") ? "selected" : ""}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label>Material</label>
                <select id="materialTela" class="metal-input">
                  ${materiales.map(m => `<option value="${m}" ${m === currentMaterial ? "selected" : ""}>${m}</option>`).join('')}
                </select>
            </div>

            ${
              currentMaterial === "OTRO (TELA)" ?
              `<div class="mb-3"><label>Largo de material (mm)</label><input type="number" id="largoMaterialTela" class="metal-input" value="${valoresTemporales["largoMaterialTela"] || itemData?.largoMaterial || ''}"></div>
              <div class="mb-3"><label>Ancho de material (mm)</label><input type="number" id="anchoMaterialTela" class="metal-input" value="${valoresTemporales["anchoMaterialTela"] || itemData?.anchoMaterial || ''}"></div>`
              : ""
            }
          </div>

          <div class="col-md-6">
            <div class="mb-3"><label>Nombre de la pieza</label><input type="text" id="nombrePiezaTela" class="metal-input" value="${itemData?.nombrePieza || ''}"></div>
            <div class="mb-3"><label>Largo (mm)</label><input type="number" id="largoTela" class="metal-input" value="${itemData?.largo || ''}"></div>
            ${
              currentMaterial === "TELA M" ? "" :
              `<div class="mb-3"><label>Ancho (mm)</label><input type="number" id="anchoTela" class="metal-input" value="${itemData?.ancho || ''}"></div>`
            }
            <div class="mb-3"><label>No. piezas</label><input type="number" id="numPiezasTela" class="metal-input" min="1" value="${itemData?.numPiezas || 1}"></div>
          </div>
        </div>

        <div class="row mb-3 border-top pt-3">
          <div class="col-md-2"><label>Clave</label><input type="text" id="claveTela" class="metal-input" value="${itemData?.clave || ''}"></div>
          <div class="col-md-3"><label>Descripción</label><input type="text" id="descripcionTela" class="metal-input" value="${itemData?.descripcion || ''}"></div>
          <div class="col-md-1"><label>Unidad</label><input type="text" id="unidadTela" class="metal-input" value="${itemData?.unidad || (currentMaterial === 'TELA M' ? 'm' : 'm2')}" readonly></div>
          <div class="col-md-2"><label>Cantidad</label><input type="number" id="cantidadTela" class="metal-input" step="0.01" value="${itemData?.cantidad || 0}" readonly></div>
          <div class="col-md-2"><label>P.U.</label><input type="text" id="puTela" class="metal-input" value="${formatCurrency(itemData?.pu || 0)}"></div>
          <div class="col-md-2"><label>Subtotal</label><input type="text" id="subtotalTela" class="metal-input" value="${formatCurrency(itemData?.subtotal || 0)}" readonly></div>
        </div>

        <div class="text-center mt-4">
          <button type="submit" class="btn-action-metal btn-agregar-metal">${submitButtonText}</button>
          <button type="button" class="btn-action-metal btn-cancelar-metal" id="cerrarModalTela">CANCELAR</button>
        </div>
      </form>
    `;

    // 🛑 Lógica de Eventos
    const telaForm = modal.querySelector("#telaForm");
    const largoInput = modal.querySelector("#largoTela");
    const anchoInput = modal.querySelector("#anchoTela");
    const numPiezasInput = modal.querySelector("#numPiezasTela");
    const cantidadInput = modal.querySelector("#cantidadTela");
    const unidadInput = modal.querySelector("#unidadTela");
    const pu = modal.querySelector("#puTela");
    const subtotal = modal.querySelector("#subtotalTela");
    const materialSelect = modal.querySelector("#materialTela");
    const categoriaSelect = modal.querySelector("#categoriaTela");
    
    // Funciones de cálculo
    function calcularCantidad() {
      const largo = parseFloat(largoInput.value) || 0;
      const numPiezas = parseInt(numPiezasInput.value) || 1;
      let cantidad = 0;

      // Actualizar unidad
      unidadInput.value = (currentMaterial === 'TELA M') ? 'm' : 'm2';

      if (currentMaterial === 'TELA M') {
          // Cálculo en metros lineales (m)
          cantidad = (largo / 1000) * numPiezas;
      } else {
          // Cálculo en metros cuadrados (m²)
          const ancho = parseFloat(anchoInput.value) || 0;
          const areaUnitario = (largo / 1000) * (ancho / 1000);
          cantidad = areaUnitario * numPiezas;
      }

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
    if (anchoInput) anchoInput.addEventListener('input', calcularCantidad); // Solo si existe
    numPiezasInput.addEventListener('input', calcularCantidad);

    // Listener para el campo P.U. para formatear la moneda
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
          // Guardar el valor actual del material y los campos dinámicos
          "materialTela": this.value,
          "largoMaterialTela": modal.querySelector("#largoMaterialTela")?.value,
          "anchoMaterialTela": modal.querySelector("#anchoMaterialTela")?.value,
          // Guardar otros valores para evitar que se borren al re-renderizar
          "nombrePieza": modal.querySelector("#nombrePiezaTela")?.value,
          "largo": largoInput.value,
          "ancho": anchoInput?.value || '',
          "numPiezas": numPiezasInput.value,
          "clave": modal.querySelector("#claveTela").value,
          "descripcion": modal.querySelector("#descripcionTela").value,
          "pu": pu.value,
        };
        // Re-renderiza para mostrar/ocultar campos dinámicos
        renderFormulario(this.value);
    });

    // Cierre del modal con el nuevo ID
    modal.querySelector("#cerrarModalTela").onclick = () => overlay.remove();

    calcularCantidad(); // Inicialización de cálculos (para modo agregar o edición)

    // Navegación con flechas
    const inputs = Array.from(modal.querySelectorAll(".metal-input, .btn-action-metal"));
    inputs.forEach((input, index) => {
      const total = inputs.length;
      input.addEventListener("keydown", e => {
        if (["ArrowDown","ArrowRight", "Enter"].includes(e.key) && !e.shiftKey) {
          e.preventDefault();
          inputs[(index + 1) % total]?.focus();
        } else if (["ArrowUp","ArrowLeft"].includes(e.key) || (e.key === "Enter" && e.shiftKey)) {
          e.preventDefault();
          inputs[(index - 1 + total) % total]?.focus();
        }
      });
    });

    // Lógica de navegación de Categoría
    categoriaSelect.addEventListener("change", (e) => {
        const raw = e.target.value.toUpperCase();
        const nuevaCat = raw.replace(/ /g, "").replace(/\//g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        overlay.remove();
        const funcName = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();

        // Obtener el objeto original de la data attribute del formulario
        const originalItemJson = telaForm.getAttribute('data-original-item');
        const itemToPass = originalItemJson ? JSON.parse(originalItemJson) : null;

        if (typeof window[funcName] === "function") {
            window[funcName](itemToPass); // Pasar el objeto a editar al nuevo formulario
        } else {
            alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
        }
    });

    // ✅ LÓGICA DE GUARDAR/ACTUALIZAR (basada en el índice)
    telaForm.onsubmit = e => {
      e.preventDefault();

      // Recolectar datos del formulario
      const data = {
        no: numFila,
        categoria: categoriaSelect.value,
        material: materialSelect.value,
        nombrePieza: modal.querySelector("#nombrePiezaTela").value,
        largo: parseFloat(largoInput.value) || 0,
        ancho: (currentMaterial === 'TELA M' ? 0 : (parseFloat(modal.querySelector("#anchoTela")?.value) || 0)), // Si es TELA M, ancho es 0
        numPiezas: parseInt(numPiezasInput.value) || 1,
        largoMaterial: materialSelect.value === "OTRO (TELA)" ? (parseFloat(modal.querySelector("#largoMaterialTela")?.value) || 0) : 0,
        anchoMaterial: materialSelect.value === "OTRO (TELA)" ? (parseFloat(modal.querySelector("#anchoMaterialTela")?.value) || 0) : 0,
        clave: modal.querySelector("#claveTela").value,
        descripcion: modal.querySelector("#descripcionTela").value,
        unidad: unidadInput.value,
        cantidad: parseFloat(modal.querySelector("#cantidadTela").value) || 0,
        pu: parseCurrency(pu.value),
        subtotal: parseCurrency(modal.querySelector("#subtotalTela").value) || 0,
      };
      
      // Obtener el objeto original de la fila que se está editando
      const originalItemJson = telaForm.getAttribute('data-original-item');
      const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;
      
      // Si originalItem NO es null y tiene el índice temporal, ACTUALIZAMOS (EDICIÓN).
      if (originalItem && typeof originalItem.__tempIndex === 'number') { 
          const indexToEdit = originalItem.__tempIndex;

          if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
              // Se debe obtener la lista actual del localStorage para editarla
              const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
              
              if (indexToEdit >= 0 && indexToEdit < current.length) {
                const dataToSave = { ...data };
                // Se guarda la data nueva en la posición del índice temporal
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
          // Si NO hay item original, se procede a AGREGAR una nueva fila.
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