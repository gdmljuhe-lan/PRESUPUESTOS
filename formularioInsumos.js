function mostrarFormularioInsumos(itemData = null) {
  document.querySelectorAll("#modalOverlay").forEach(el => el.remove());

  function formatCurrency(v) {
    if (isNaN(v) || v === "") return "$0.00";
    return `$${parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function parseCurrency(s) {
    return parseFloat(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  }

  const isEdit = itemData !== null && typeof itemData.__tempIndex === 'number';
  const submitButtonText = isEdit ? 'GUARDAR CAMBIOS' : 'AGREGAR';
  const modalTitle = isEdit ? `EDITAR: ${itemData.descripcion || 'PIEZA INSUMO'}` : 'FORMULARIO CATEGORÍA: INSUMOS';
  const numFila = isEdit ? itemData.no : (document.querySelectorAll("#despieceTable tbody tr").length + 1);

  const categorias = [
    "PINTURA","BARNIZ","METAL","MADERA","MARMOL","HERRAJE","ELÉCTRICO",
    "ACRÍLICO","ESPEJO","VIDRIO","GRAFICOS","VINIL ADHERIBLE","BACKLIGH",
    "TELA/VINIPIEL","EMBALAJE","INSUMOS","MANO DE OBRA","CORTE LASER","EXTERNOS"
  ];

  const initialClave = itemData?.clave || '';
  const initialDescripcion = itemData?.descripcion || (isEdit ? '' : 'INSUMOS'); 
  const initialUnidad = itemData?.unidad || (isEdit ? '' : 'LOTE'); 
  const initialCantidad = itemData?.cantidad || (isEdit ? 1 : 0.1); 

  // 🔹 P.U. = suma de subtotales de todas las categorías excepto INSUMOS
  let initialPU = 0;
  if (typeof despieceStorageKey !== "undefined") {
    const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
    initialPU = current.reduce((acc, item) => {
      if (item.categoria !== "INSUMOS") return acc + (parseFloat(item.subtotal) || 0);
      return acc;
    }, 0);
  }

  const initialSubtotal = isEdit ? itemData.subtotal : (initialCantidad * initialPU);

  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: "9999", backdropFilter: "blur(8px)"
  });

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(255, 255, 255, 0.15)",
    color: "#E8EBE0",
    borderRadius: "20px",
    boxShadow: "0 4px 60px rgba(0,0,0,0.4)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "30px", width: "800px", maxHeight: "90vh", overflowY: "auto",
    fontFamily: "'Avenir Next LT Pro Light', 'Helvetica Neue', Arial, sans-serif"
  });

  const originalItemDataAttr = isEdit ? `data-original-item='${JSON.stringify(itemData)}'` : '';

  modal.innerHTML = `
    <style>
      .modal-header-metal { color:#D4A373; font-weight:bold; text-shadow:0 0 8px rgba(212,163,115,0.3); font-size:18px;text-align:center;margin-bottom:25px; }
      .metal-input { background: rgba(0,0,0,0.25); color:#E8EBE0; border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:6px 10px; text-transform:uppercase; font-size:11px; width:100%; box-sizing:border-box; line-height:1.5; }
      .metal-input:focus { background: rgba(0,0,0,0.35); border-color:#D4A373; box-shadow:0 0 5px rgba(212,163,115,0.6); color:#fff; outline:none; }
      label { font-weight:600;color:#E8EBE0;font-size:11px;margin-bottom:4px;display:block; }
      select option { background-color:#3C473C;color:#E8EBE0; }
      ::placeholder { color:#B0B0B0; opacity:0.8; }
      .btn-action-metal { font-size:12px;border-radius:8px;padding:8px 20px;cursor:pointer;border:none;text-transform:uppercase; }
      .btn-agregar-metal { background-color:#D4A373;color:#2A302A;font-weight:bold; }
      .btn-agregar-metal:hover { background-color:#E8B986; }
      .btn-cancelar-metal { background-color: rgba(255,255,255,0.1); color:#E8EBE0; border:1px solid rgba(255,255,255,0.2); }
      .btn-cancelar-metal:hover { background-color: rgba(255,255,255,0.2); }
      #subtotalInsumos,#puInsumos { background: rgba(0,0,0,0.4); color:#B0B0B0; font-weight:normal; border-color: rgba(255,255,255,0.1); }
    </style>
    <h5 class="modal-header-metal">${modalTitle}</h5>
    <form id="insumosForm" ${originalItemDataAttr}>
      <div class="row mb-3">
        <div class="col-md-3">
          <div class="mb-3">
            <label>No.</label>
            <input type="text" id="numInsumos" class="metal-input" value="${numFila}" readonly>
          </div>
          <div class="mb-3">
            <label>Categoría</label>
            <select id="categoriaInsumos" class="metal-input">
              ${categorias.map(c => `<option value="${c}" ${c==='INSUMOS'?"selected":""}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="row mb-3 border-top pt-3">
        <div class="col-md-2"><label>Clave</label><input type="text" id="claveInsumos" class="metal-input" value="${initialClave}"></div>
        <div class="col-md-2"><label>Descripción</label><input type="text" id="descripcionInsumos" class="metal-input" value="${initialDescripcion}"></div>
        <div class="col-md-2"><label>Unidad</label><input type="text" id="unidadInsumos" class="metal-input" value="${initialUnidad}"></div>
        <div class="col-md-2"><label>Cantidad</label><input type="number" id="cantidadInsumos" class="metal-input" step="0.001" value="${initialCantidad}"></div>
        <div class="col-md-2"><label>P.U. ($)</label><input type="text" id="puInsumos" class="metal-input" value="${formatCurrency(initialPU)}" readonly></div>
        <div class="col-md-2"><label>Subtotal ($)</label><input type="text" id="subtotalInsumos" class="metal-input" value="${formatCurrency(initialSubtotal)}" readonly></div>
      </div>
      <div class="text-center mt-4">
        <div class="row justify-content-center">
          <div class="col-md-4"><button type="submit" class="btn-action-metal btn-agregar-metal w-100">${submitButtonText}</button></div>
          <div class="col-md-4"><button type="button" class="btn-action-metal btn-cancelar-metal w-100" id="cerrarModalInsumos">CANCELAR</button></div>
        </div>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const cantidadInput = modal.querySelector("#cantidadInsumos");
  const puInput = modal.querySelector("#puInsumos");
  const subtotalInput = modal.querySelector("#subtotalInsumos");
  const cerrarModalButton = modal.querySelector("#cerrarModalInsumos");
  const categoriaSelect = modal.querySelector("#categoriaInsumos");

  function calcularSubtotal() {
    // P.U. = suma de subtotales de todas las categorías excepto INSUMOS
    let puTotal = 0;
    if (typeof despieceStorageKey !== "undefined") {
      const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
      puTotal = current.reduce((acc, item) => item.categoria !== "INSUMOS" ? acc + (parseFloat(item.subtotal)||0) : acc, 0);
    }
    puInput.value = formatCurrency(puTotal);

    const cantidad = parseFloat(cantidadInput.value) || 0;
    subtotalInput.value = formatCurrency(cantidad * puTotal);
  }

  calcularSubtotal();
  cantidadInput.addEventListener("input", calcularSubtotal);

  cerrarModalButton.onclick = () => overlay.remove();

  categoriaSelect.addEventListener("change", e => {
    const nuevaCat = e.target.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ /g,"").replace(/\//g,"");
    overlay.remove();
    const funcionNombre = "mostrarFormulario" + nuevaCat.charAt(0) + nuevaCat.slice(1).toLowerCase();
    if (typeof window[funcionNombre] === "function") window[funcionNombre](itemData);
    else alert(`⚠️ Formulario para "${e.target.value}" no disponible.`);
  });

  // Guardar fila en lista y storage
  modal.querySelector("#insumosForm").onsubmit = e => {
    e.preventDefault();
    const data = {
      no: numFila,
      categoria: "INSUMOS",
      clave: modal.querySelector("#claveInsumos").value,
      descripcion: modal.querySelector("#descripcionInsumos").value,
      unidad: modal.querySelector("#unidadInsumos").value,
      cantidad: parseFloat(cantidadInput.value) || 0,
      pu: parseCurrency(puInput.value),
      subtotal: parseCurrency(subtotalInput.value) // ✅ subtotal = cantidad × P.U.
    };

    const originalItemJson = modal.querySelector("#insumosForm").getAttribute('data-original-item');
    const originalItem = originalItemJson ? JSON.parse(originalItemJson) : null;

    if (originalItem && typeof originalItem.__tempIndex === 'number') {
      const indexToEdit = originalItem.__tempIndex;
      if (typeof updateDespieceStorageAndRender === 'function' && typeof despieceStorageKey !== 'undefined') {
        const current = JSON.parse(localStorage.getItem(despieceStorageKey) || '[]');
        if (indexToEdit >=0 && indexToEdit < current.length) {
          current[indexToEdit] = { ...data };
          updateDespieceStorageAndRender(current);
          alert('ELEMENTO EDITADO CORRECTAMENTE.');
        } else alert('Error al editar: Índice no válido.');
      } else alert('Error: función o variable para editar no disponible.');
    } else {
      if (typeof agregarFilaDespiece === "function") agregarFilaDespiece(data); // ✅ Se agrega subtotal a la lista
      else alert('Error: función para agregar no disponible.');
    }
    overlay.remove();
  };
}
