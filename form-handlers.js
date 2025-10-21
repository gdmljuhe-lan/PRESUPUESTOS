// ==========================
// FORMULARIOS DINÁMICOS (COMPLETO) - Estilo: AZUL AQUA (barniz/pintura) aplicado a todos
// Categorías: METAL, MADERA, BARNIZ, PINTURA, MÁRMOL, HERRAJE, ELÉCTRICO/ELECTRICO,
// ACRÍLICO/ESPEJO/VIDRIO/VINIL ADHERIBLE/BACKLIGHT/TELA/VINIL, GRÁFICOS, EMBALAJE, MANO DE OBRA, CORTE LASER, EXTERNOS, INSUMOS
// ==========================

/* ---------------- helpers ---------------- */
function toNumber(v) {
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function formatMoney(n) {
  const num = Number(n) || 0;
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function setMoneyInput(el, n) {
  if (!el) return;
  el.value = (n === "" || n === undefined) ? "" : formatMoney(n);
}

function getMoneyInputValue(el) {
  if (!el) return 0;
  return toNumber(el.value);
}

function enableKeyboardNavigation(scope) {
  if (!scope) return;
  const selector =
    'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])';
  const inputs = Array.from(scope.querySelectorAll(selector)).filter(
    (i) => i.offsetParent !== null
  );
  inputs.forEach((el, idx) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          const prev = inputs[idx - 1];
          if (prev) prev.focus();
        } else {
          const next = inputs[idx + 1];
          if (next) next.focus();
        }
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = inputs[idx + 1];
        if (next) next.focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = inputs[idx - 1];
        if (prev) prev.focus();
      }
    });
  });
}

/* ---------------- main router ---------------- */
function updateFormForCategory(categoria) {
  const materialDetails = document.getElementById("materialDetails");
  const formSubmitButton = document.getElementById("formSubmitButton");
  if (!materialDetails) return;
  materialDetails.innerHTML = "";
  if (!categoria) {
    if (formSubmitButton) formSubmitButton.style.display = "none";
    return;
  }
  if (formSubmitButton) formSubmitButton.style.display = "block";

  const cat = categoria.toUpperCase();

  switch (cat) {
    case "METAL":
      renderMetalForm();
      break;
    case "MADERA":
      renderMaderaForm();
      break;
    case "BARNIZ":
    case "PINTURA":
      renderBarnizPinturaForm(cat);
      break;
    case "MÁRMOL":
    case "MARMOL":
      renderMarmolForm();
      break;
    case "HERRAJE":
      renderHerrajeForm();
      break;
    case "ELÉCTRICO":
    case "ELECTRICO":
      renderElectricoForm();
      break;
    case "ACRÍLICO":
    case "ACRILICO":
    case "ESPEJO":
    case "VIDRIO":
    case "VINIL ADHERIBLE":
    case "BACKLIGHT":
    case "TELA/VINIL":
    case "VINIL":
    case "GRÁFICOS": // GRÁFICOS category included
      renderPlanoForm(cat);
      break;
    case "EMBALAJE":
    case "MANO DE OBRA":
    case "CORTE LASER":
    case "CORTE LÁSER":
    case "EXTERNOS":
    case "INSUMOS":
      renderEmbalajeSimpleForm(cat);
      break;
    default:
      if (typeof buildGenericForm === "function")
        buildGenericForm(window[`${cat.toLowerCase()}Options`] || {});
      else
        materialDetails.innerHTML = "<p>No hay formulario específico para esta categoría.</p>";
  }
}

/* ==================== FORMULARIO METAL ==================== */
function renderMetalForm() {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="metalCard" style="padding:16px;border-radius:10px;">
      <style>
        .elegancy-blue-aqua {
          background: linear-gradient(135deg, #003d66, #0099cc);
          color: #e6faff;
          font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; gap:16px; flex-wrap:wrap; }
        .form-grid .col { flex:1; min-width:260px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa;
          background: rgba(255,255,255,0.06); color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        .bottom-row { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; margin-top:18px; }
      </style>

      <div class="form-grid">
        <div class="col" id="metalCol1">
          <label for="categoriaMetal">Categoría</label>
          <input id="categoriaMetal" name="categoria" type="text" value="METAL" readonly>

          <label for="materialMetal">Material</label>
          <select id="materialMetal" name="material" required>
            <option value="">Seleccionar</option>
            <option value="LAMINA">LAMINA</option>
            <option value="PERFIL">PERFIL</option>
            <option value="PLACA">PLACA</option>
            <option value="BARRA">BARRA</option>
            <option value="TUBO">TUBO</option>
            <option value="ANGULO">ANGULO</option>
            <option value="SOLERA">SOLERA</option>
            <option value="OTRO_PERFIL">OTRO (PERFIL, BARRA, ETC.)</option>
            <option value="OTRO_LAMINA">OTRO (LAMINA, PLACA, ETC.)</option>
          </select>

          <div id="extraMaterialArea" style="margin-top:10px;"></div>
        </div>

        <div class="col" id="metalCol2">
          <label for="nombrePieza">Nombre de la pieza</label>
          <input id="nombrePieza" name="nombrePieza" type="text">

          <label for="largoInput">Largo (mm)</label>
          <input id="largoInput" name="largo" type="number" min="0" step="0.01">

          <label id="labelAncho" for="anchoInput">Ancho (mm)</label>
          <input id="anchoInput" name="ancho" type="number" min="0" step="0.01">

          <label for="numPiezasInput">No. piezas</label>
          <input id="numPiezasInput" name="numPiezas" type="number" min="1" step="1" value="1">
        </div>
      </div>

      <div class="bottom-row" id="metalBottomRow">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="M2"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" step="0.01" readonly></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("metalCard");
  const materialSel = document.getElementById("materialMetal");
  const extraArea = document.getElementById("extraMaterialArea");
  const labelAncho = document.getElementById("labelAncho");
  const anchoInput = document.getElementById("anchoInput");
  const largoInput = document.getElementById("largoInput");
  const numPiezasInput = document.getElementById("numPiezasInput");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");

  function showAncho(show) {
    labelAncho.style.display = show ? "block" : "none";
    anchoInput.style.display = show ? "block" : "none";
    if (!show) anchoInput.value = "";
  }

  function recalc() {
    const material = materialSel.value;
    const largo = toNumber(largoInput.value);
    const ancho = toNumber(anchoInput.value);
    const piezas = Math.max(1, toNumber(numPiezasInput.value) || 1);
    let cantidad = 0;

    if (["PERFIL","BARRA","TUBO","ANGULO","SOLERA"].includes(material)) {
      cantidad = (largo / 5800) * piezas;
    } else if (material === "OTRO_PERFIL") {
      const dimEl = extraArea.querySelector("#largoMaterialPerfil");
      const dim = dimEl ? toNumber(dimEl.value) : 0;
      if (dim > 0) cantidad = (largo / dim) * piezas;
    } else if (["LAMINA","PLACA"].includes(material)) {
      cantidad = ((largo * ancho) / 3680000) * piezas;
    } else if (material === "OTRO_LAMINA") {
      const Lm = extraArea.querySelector("#largoMaterialLamina");
      const Am = extraArea.querySelector("#anchoMaterialLamina");
      const largoMat = Lm ? toNumber(Lm.value) : 0;
      const anchoMat = Am ? toNumber(Am.value) : 0;
      if (largoMat && anchoMat)
        cantidad = ((largo * ancho) / (largoMat * anchoMat)) * piezas;
    } else {
      cantidad = piezas;
    }

    cantidadInput.value = cantidad ? cantidad.toFixed(2) : "0.00";
    const subtotal = toNumber(puInput.value) * cantidad;
    subtotalInput.value = formatMoney(subtotal);
  }

  [largoInput, anchoInput, numPiezasInput].forEach(i => i.addEventListener("input", recalc));

  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalc();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });

  materialSel.addEventListener("change", () => {
    const val = materialSel.value;
    extraArea.innerHTML = "";
    if (["PERFIL","BARRA","TUBO","ANGULO","SOLERA"].includes(val)) showAncho(false);
    else if (val === "OTRO_PERFIL") {
      showAncho(false);
      extraArea.innerHTML = `<label>Largo de material (mm)</label><input id="largoMaterialPerfil" type="number" step="0.01">`;
      extraArea.querySelector("#largoMaterialPerfil").addEventListener("input", recalc);
    } else if (["LAMINA","PLACA"].includes(val)) showAncho(true);
    else if (val === "OTRO_LAMINA") {
      showAncho(true);
      extraArea.innerHTML = `
        <label>Largo de material (mm)</label><input id="largoMaterialLamina" type="number" step="0.01">
        <label>Ancho de material (mm)</label><input id="anchoMaterialLamina" type="number" step="0.01">
      `;
      extraArea.querySelectorAll("input").forEach(i => i.addEventListener("input", recalc));
    } else showAncho(true);
    recalc();
  });

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO MADERA ==================== */
function renderMaderaForm() {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="maderaCard" style="padding:18px;border-radius:12px;">
      <style>
        .elegancy-blue-aqua {
          background: linear-gradient(135deg, #003d66, #0099cc);
          color: #e6faff;
          font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; flex-wrap:wrap; gap:20px; }
        .form-grid .col { flex:1; min-width:280px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        .bottom-row { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; margin-top:22px; }
      </style>

      <div class="form-grid">
        <div class="col" id="maderaCol1">
          <label for="categoriaMadera">Categoría</label>
          <input id="categoriaMadera" name="categoria" type="text" value="MADERA" readonly>

          <label for="materialMadera">Material</label>
          <select id="materialMadera" name="material" required>
            <option value="">Seleccionar</option>
            <option value="MDF">MDF</option>
            <option value="PINO">PINO</option>
            <option value="TRIPLAY">TRIPLAY</option>
            <option value="LAMINADO">LAMINADO</option>
            <option value="ADHESIVO">ADHESIVO</option>
            <option value="TRIPLAY FLEXIBLE">TRIPLAY FLEXIBLE</option>
            <option value="MELAMINA">MELAMINA</option>
            <option value="MDF ENCHAPADO">MDF ENCHAPADO</option>
            <option value="CUBRECANTOS">CUBRECANTOS</option>
            <option value="PANEL MULTIPERFORADO">PANEL MULTIPERFORADO</option>
            <option value="MDF CON LACA">MDF CON LACA</option>
            <option value="MDF ALTO BRILLO">MDF ALTO BRILLO</option>
            <option value="TABLA DE ROBLE">TABLA DE ROBLE</option>
            <option value="TABLON BANAK">TABLON BANAK</option>
            <option value="OSB">OSB</option>
            <option value="VIGA">VIGA</option>
            <option value="BASTON">BASTON</option>
            <option value="OTRO_PANEL">OTRO (PANEL)</option>
          </select>

          <div id="extraMaterialArea" style="margin-top:10px;"></div>
        </div>

        <div class="col" id="maderaCol2">
          <label for="nombrePieza">Nombre de la pieza</label>
          <input id="nombrePieza" name="nombrePieza" type="text">

          <label for="largoInput">Largo (mm)</label>
          <input id="largoInput" name="largo" type="number" step="0.01">

          <label id="labelAncho" for="anchoInput">Ancho (mm)</label>
          <input id="anchoInput" name="ancho" type="number" step="0.01">

          <label for="numPiezasInput">No. piezas</label>
          <input id="numPiezasInput" name="numPiezas" type="number" value="1" min="1" step="1">
        </div>
      </div>

      <div class="bottom-row">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="M2"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" readonly></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("maderaCard");
  const materialSel = document.getElementById("materialMadera");
  const extraArea = document.getElementById("extraMaterialArea");
  const labelAncho = document.getElementById("labelAncho");
  const anchoInput = document.getElementById("anchoInput");
  const largoInput = document.getElementById("largoInput");
  const numPiezasInput = document.getElementById("numPiezasInput");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");

  function recalc() {
    const material = materialSel.value;
    const largo = toNumber(largoInput.value);
    const ancho = toNumber(anchoInput.value);
    const piezas = Math.max(1, toNumber(numPiezasInput.value));
    let cantidad = 0;

    if (["MDF","PINO","TRIPLAY","LAMINADO","TRIPLAY FLEXIBLE","MELAMINA","MDF ENCHAPADO","PANEL MULTIPERFORADO","MDF CON LACA","MDF ALTO BRILLO","TABLA DE ROBLE","TABLON BANAK","OSB"].includes(material)) {
      cantidad = ((largo * ancho) / 3680000) * piezas;
    } else if (material === "OTRO_PANEL") {
      const Lm = extraArea.querySelector("#largoMaterialPanel");
      const Am = extraArea.querySelector("#anchoMaterialPanel");
      const largoMat = Lm ? toNumber(Lm.value) : 0;
      const anchoMat = Am ? toNumber(Am.value) : 0;
      if (largoMat && anchoMat)
        cantidad = ((largo * ancho) / (largoMat * anchoMat)) * piezas;
    } else if (["VIGA","BASTON"].includes(material)) {
      const Lmat = extraArea.querySelector("#largoMaterialViga");
      const largoMat = Lmat ? toNumber(Lmat.value) : 0;
      if (largoMat)
        cantidad = (largo / largoMat) * piezas;
    } else if (material === "CUBRECANTOS") {
      cantidad = (largo / 1000) * piezas;
    }

    cantidadInput.value = cantidad ? cantidad.toFixed(2) : "0.00";
    subtotalInput.value = formatMoney(toNumber(puInput.value) * (cantidad || 0));
  }

  [largoInput, anchoInput, numPiezasInput].forEach(i => i.addEventListener("input", recalc));
  puInput.addEventListener("blur", () => { setMoneyInput(puInput, toNumber(puInput.value)); recalc(); });

  materialSel.addEventListener("change", () => {
    const val = materialSel.value;
    extraArea.innerHTML = "";
    labelAncho.style.display = "block";
    anchoInput.style.display = "block";

    if (val === "OTRO_PANEL") {
      extraArea.innerHTML = `
        <label>Largo de material (mm)</label><input id="largoMaterialPanel" type="number" step="0.01">
        <label>Ancho de material (mm)</label><input id="anchoMaterialPanel" type="number" step="0.01">
      `;
      extraArea.querySelectorAll("input").forEach(i => i.addEventListener("input", recalc));
    } else if (["VIGA","BASTON"].includes(val)) {
      extraArea.innerHTML = `<label>Largo de material (mm)</label><input id="largoMaterialViga" type="number" step="0.01">`;
      extraArea.querySelector("input").addEventListener("input", recalc);
      labelAncho.style.display = "none";
      anchoInput.style.display = "none";
    } else if (val === "CUBRECANTOS") {
      labelAncho.style.display = "none";
      anchoInput.style.display = "none";
    }
    recalc();
  });

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO BARNIZ / PINTURA ==================== */
function renderBarnizPinturaForm(categoria) {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="barnizPinturaCard" style="padding:18px;border-radius:12px;">
      <style>
        .elegancy-blue-aqua {
          background: linear-gradient(135deg, #003d66, #0099cc);
          color: #e6faff;
          font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; flex-wrap: wrap; gap: 20px; }
        .form-grid .col { flex: 1; min-width: 280px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        .bottom-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 22px; }
        select option { color:#000; }
      </style>

      <div class="form-grid">
        <div class="col">
          <label for="categoriaBP">Categoría:</label>
          <input type="text" id="categoriaBP" name="categoria" value="${categoria}" readonly>
        </div>
        <div class="col">
          <label for="materialBP">Material:</label>
          <select id="materialBP" name="material" required>
            <option value="">Seleccionar</option>
            <option value="${categoria}">${categoria}</option>
          </select>
        </div>
      </div>

      <div class="bottom-row">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div>
          <label>Descripción</label>
          <select id="descripcionInput" name="descripcion" style="width:auto;"></select>
        </div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="LITRO"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" step="0.01" min="0"></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("barnizPinturaCard");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");
  const unidadInput = document.getElementById("unidadInput");
  const descripcionSelect = document.getElementById("descripcionInput");

  const barnizOptions = {
    "LACA BRILLO": { unidad: "M2", precio: 1031 },
    "LACA MATE": { unidad: "M2", precio: 975 },
    "LACA HIGH GLOSS": { unidad: "M2", precio: 1450 },
    "BARNIZ TRANSPARENTE": { unidad: "M2", precio: 650 },
    "FONDEADO": { unidad: "M2", precio: 80 },
    "ROYTIROL": { unidad: "M2", precio: 450 },
    "MICROCEMENTO": { unidad: "M2", precio: 1250 },
    "CARDEADO (MADERA MACIZA)": { unidad: "M2", precio: 60 }
  };

  const pinturaOptions = {
    "PINTURA ELECTROSTÁTICA ECONOMICA": { unidad: "ML/M2", precio: 50 },
    "PINTURA ELECTROSTÁTICA MEDIA": { unidad: "ML/M2", precio: 70 },
    "PINTURA ELECTROSTÁTICA ALTA": { unidad: "ML/M2", precio: 80 },
    "SATINADO INOXIDABLE": { unidad: "ML/M2", precio: 50 },
    "PULIDO ESPEJO INOXIDABLE": { unidad: "ML/M2", precio: 150 },
    "CROMO NEGRO INOXIDABLE": { unidad: "ML/M2", precio: 980 },
    "CROMO, NIQUEL, LATON": { unidad: "ML/M2", precio: 160 }
  };

  const currentOptions = categoria === "BARNIZ" ? barnizOptions : pinturaOptions;

  descripcionSelect.innerHTML = `
    <option value="">Seleccionar</option>
    ${Object.keys(currentOptions).map(d => `<option value="${d}">${d}</option>`).join("")}
  `;

  const longest = Object.keys(currentOptions).reduce((a,b)=>a.length>b.length?a:b,"");
  const span = document.createElement("span");
  span.style.visibility="hidden"; span.style.whiteSpace="nowrap"; span.textContent=longest;
  document.body.appendChild(span);
  descripcionSelect.style.width = span.offsetWidth + 60 + "px";
  document.body.removeChild(span);

  function recalcSubtotal() {
    subtotalInput.value = formatMoney(toNumber(cantidadInput.value) * toNumber(puInput.value));
  }

  descripcionSelect.addEventListener("change", () => {
    const sel = currentOptions[descripcionSelect.value];
    if (sel) {
      unidadInput.value = sel.unidad;
      setMoneyInput(puInput, sel.precio);
      recalcSubtotal();
    }
  });

  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalcSubtotal();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });
  cantidadInput.addEventListener("input", recalcSubtotal);

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO MÁRMOL ==================== */
function renderMarmolForm() {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="marmolCard" style="padding:18px; border-radius:12px;">
      <style>
        .elegancy-blue-aqua {
          background: linear-gradient(135deg, #003d66, #0099cc);
          color: #e6faff;
          font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; flex-wrap: wrap; gap: 20px; }
        .form-grid .col { flex:1; min-width:280px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        .bottom-row { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; margin-top:22px; }
      </style>

      <div class="form-grid">
        <div class="col">
          <label for="categoriaMarmol">Categoría</label>
          <input type="text" id="categoriaMarmol" name="categoria" value="MÁRMOL" readonly>

          <label for="materialMarmol">Material</label>
          <select id="materialMarmol" name="material" required>
            <option value="">Seleccionar</option>
            <option value="MÁRMOL">MÁRMOL</option>
            <option value="GRANITO">GRANITO</option>
            <option value="CUARZO">CUARZO</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>

        <div class="col">
          <label for="nombrePieza">Nombre de la pieza</label>
          <input id="nombrePieza" name="nombrePieza" type="text" list="nombrePiezaList">

          <label for="largoInput">Largo (mm)</label>
          <input id="largoInput" name="largo" type="number" step="0.01" min="0">

          <label for="anchoInput">Ancho (mm)</label>
          <input id="anchoInput" name="ancho" type="number" step="0.01" min="0">

          <label for="numPiezasInput">No. piezas</label>
          <input id="numPiezasInput" name="numPiezas" type="number" min="1" step="1" value="1">
        </div>
      </div>

      <div class="bottom-row">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="M2"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" readonly></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("marmolCard");
  const largoInput = document.getElementById("largoInput");
  const anchoInput = document.getElementById("anchoInput");
  const numPiezasInput = document.getElementById("numPiezasInput");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");

  function recalc() {
    const largo = toNumber(largoInput.value);
    const ancho = toNumber(anchoInput.value);
    const piezas = Math.max(1, toNumber(numPiezasInput.value) || 1);
    const cantidad = ((largo * ancho) / 3680000) * piezas;

    cantidadInput.value = cantidad ? cantidad.toFixed(2) : "0.00";
    const subtotal = toNumber(puInput.value) * (cantidad || 0);
    subtotalInput.value = formatMoney(subtotal);
  }

  [largoInput, anchoInput, numPiezasInput].forEach(i => i.addEventListener("input", recalc));

  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalc();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO HERRAJE ==================== */
function renderHerrajeForm() {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="herrajeCard" style="padding:18px;border-radius:12px;">
      <style>
        .elegancy-blue-aqua { background: linear-gradient(135deg, #003d66, #0099cc); color:#e6faff; font-family: 'Segoe UI', Roboto, sans-serif; }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; flex-wrap:wrap; gap:20px; }
        .form-grid .col { flex:1; min-width:280px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        .bottom-row { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; margin-top:22px; }
      </style>

      <div class="form-grid">
        <div class="col">
          <label for="categoriaHerraje">Categoría</label>
          <input type="text" id="categoriaHerraje" name="categoria" value="HERRAJE" readonly>
        </div>

        <div class="col">
          <label for="tipoHerraje">Tipo de Herraje</label>
          <select id="tipoHerraje" name="tipoHerraje" required>
            <option value="">Seleccionar</option>
            <option value="BISAGRA">BISAGRA</option>
            <option value="CORREDERA">CORREDERA</option>
            <option value="MANIJA">MANIJA</option>
            <option value="TORNILLO">TORNILLO</option>
            <option value="SOPORTE">SOPORTE</option>
            <option value="PISTÓN">PISTÓN</option>
            <option value="CERRADURA">CERRADURA</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>
      </div>

      <div class="bottom-row">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="PZA"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" value="1" min="0" step="1"></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("herrajeCard");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");

  function recalc() {
    const cantidad = toNumber(cantidadInput.value) || 1;
    const pu = toNumber(puInput.value);
    subtotalInput.value = formatMoney(cantidad * pu);
  }

  cantidadInput.addEventListener("input", recalc);
  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalc();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO ELÉCTRICO ==================== */
function renderElectricoForm() {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="electricoCard" style="padding:18px;border-radius:12px;">
      <style>
        .elegancy-blue-aqua { background: linear-gradient(135deg, #003d66, #0099cc); color:#e6faff; font-family: 'Segoe UI', Roboto, sans-serif; }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; flex-wrap:wrap; gap:20px; }
        .form-grid .col { flex:1; min-width:280px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        .bottom-row { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; margin-top:22px; }
      </style>

      <div class="form-grid">
        <div class="col">
          <label for="categoriaElectrico">Categoría</label>
          <input type="text" id="categoriaElectrico" name="categoria" value="ELÉCTRICO" readonly>
        </div>

        <div class="col">
          <label for="tipoSistemaElectrico">Tipo de Herraje</label>
          <select id="tipoSistemaElectrico" name="tipoSistemaElectrico" required>
            <option value="">Seleccionar</option>
            <option value="CABLE">CABLE</option>
            <option value="FOCO">FOCO</option>
            <option value="INTERRUPTOR">INTERRUPTOR</option>
            <option value="ENCHUFE">ENCHUFE</option>
            <option value="EXTENSIÓN">EXTENSIÓN</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>
      </div>

      <div class="bottom-row">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="PZA"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" value="1" min="0" step="1"></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("electricoCard");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");

  function recalc() {
    const cantidad = toNumber(cantidadInput.value) || 1;
    const pu = toNumber(puInput.value);
    subtotalInput.value = formatMoney(cantidad * pu);
  }

  cantidadInput.addEventListener("input", recalc);
  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalc();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO PLANO (ACRÍLICO / ACRILICO / ESPEJO / VIDRIO / VINIL / BACKLIGHT / TELA/VINIL / GRÁFICOS) ==================== */
function renderPlanoForm(categoria) {
  const materialDetails = document.getElementById("materialDetails");
  // Define material options for GRÁFICOS
  const materialOptions = categoria === "GRÁFICOS" ? `
    <option value="">Seleccionar</option>
    <option value="VINIL IMPRESO">VINIL IMPRESO</option>
    <option value="LONA">LONA</option>
    <option value="PAPEL FOTOGRÁFICO">PAPEL FOTOGRÁFICO</option>
    <option value="BACKLIGHT">BACKLIGHT</option>
    <option value="OTRO">OTRO</option>
  ` : `
    <option value="">Seleccionar</option>
    <option value="ESTÁNDAR">ESTÁNDAR</option>
    <option value="OTRO">OTRO</option>
  `;

  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="planoCard" style="padding:18px;border-radius:12px;">
      <style>
        .elegancy-blue-aqua { background: linear-gradient(135deg, #003d66, #0099cc); color:#e6faff; font-family: 'Segoe UI', Roboto, sans-serif; }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .form-grid { display:flex; flex-wrap:wrap; gap:20px; }
        .form-grid .col { flex:1; min-width:280px; }
        .form-grid input, .form-grid select, .bottom-row input, .bottom-row select {
          width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        .bottom-row { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; margin-top:22px; }
      </style>

      <div class="form-grid">
        <div class="col">
          <label for="categoriaPlano">Categoría</label>
          <input type="text" id="categoriaPlano" name="categoria" value="${categoria}" readonly>

          <label for="materialPlano">Material</label>
          <select id="materialPlano" name="material" required>
            ${materialOptions}
          </select>
        </div>

        <div class="col">
          <label for="nombrePieza">Nombre de la pieza</label>
          <input id="nombrePieza" name="nombrePieza" type="text">

          <label for="largoInput">Largo (mm)</label>
          <input id="largoInput" name="largo" type="number" step="0.01" min="0">

          <label id="labelAncho" for="anchoInput">Ancho (mm)</label>
          <input id="anchoInput" name="ancho" type="number" step="0.01" min="0">

          <label for="numPiezasInput">No. piezas</label>
          <input id="numPiezasInput" name="numPiezas" type="number" min="1" step="1" value="1">
        </div>
      </div>

      <div class="bottom-row">
        <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
        <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
        <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="M2"></div>
        <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" readonly></div>
        <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
        <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
      </div>
    </div>
  `;

  const card = document.getElementById("planoCard");
  const materialSel = document.getElementById("materialPlano");
  const largoInput = document.getElementById("largoInput");
  const anchoInput = document.getElementById("anchoInput");
  const numPiezasInput = document.getElementById("numPiezasInput");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");
  const unidadInput = document.getElementById("unidadInput");
  const labelAncho = document.getElementById("labelAncho");

  function showAncho(show) {
    labelAncho.style.display = show ? "block" : "none";
    anchoInput.style.display = show ? "block" : "none";
    if (!show) anchoInput.value = "";
  }

  function recalc() {
    const material = materialSel.value;
    const largo = toNumber(largoInput.value);
    const ancho = toNumber(anchoInput.value);
    const piezas = Math.max(1, toNumber(numPiezasInput.value) || 1);
    let cantidad = 0;

    if (categoria === "GRÁFICOS" && material === "VINIL IMPRESO" && !ancho) {
      // For roll-based materials like VINIL IMPRESO, calculate in linear meters
      cantidad = (largo / 1000) * piezas; // Convert mm to meters
      unidadInput.value = "ML";
    } else {
      // For area-based materials (default for other categories and materials)
      cantidad = ((largo * ancho) / 3680000) * piezas; // Standard sheet size 1220mm x 2440mm
      unidadInput.value = "M2";
    }

    cantidadInput.value = cantidad ? cantidad.toFixed(2) : "0.00";
    const subtotal = toNumber(puInput.value) * (cantidad || 0);
    subtotalInput.value = formatMoney(subtotal);
  }

  materialSel.addEventListener("change", () => {
    const val = materialSel.value;
    if (categoria === "GRÁFICOS" && val === "VINIL IMPRESO") {
      showAncho(false); // Hide ancho for roll-based materials
    } else {
      showAncho(true);
    }
    recalc();
  });

  [largoInput, anchoInput, numPiezasInput].forEach(i => i.addEventListener("input", recalc));

  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalc();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });

  enableKeyboardNavigation(card);
}

/* ==================== FORMULARIO EMBALAJE / MANO DE OBRA / CORTE LASER / EXTERNOS / INSUMOS ==================== */
function renderEmbalajeSimpleForm(categoria) {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="simpleCard" style="padding:18px;border-radius:12px;">
      <style>
        .elegancy-blue-aqua { background: linear-gradient(135deg, #003d66, #0099cc); color:#e6faff; font-family:'Segoe UI', Roboto, sans-serif; }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        .row-grid { display:grid; grid-template-columns: repeat(6, 1fr); gap:10px; align-items:end; }
        .row-grid .span-2 { grid-column: span 2; }
        .row-grid .span-4 { grid-column: span 4; }
        input, select { width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06); color:#e6faff; box-sizing:border-box; }
        select option { color:#000; }
      </style>

      <div style="display:block; gap:12px;">
        <div class="row-grid" style="margin-bottom:12px;">
          <div style="grid-column: span 3;"><label>Categoría</label><input type="text" name="categoria" value="${categoria}" readonly></div>
          <div style="grid-column: span 3;"><label>Material</label>
            <select id="materialSimple" name="material" required>
              <option value="">Seleccionar</option>
              <option value="ESTÁNDAR">ESTÁNDAR</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>
        </div>

        <div class="row-grid">
          <div><label>Clave</label><input id="claveInput" name="clave" type="text"></div>
          <div><label>Descripción</label><input id="descripcionInput" name="descripcion" type="text"></div>
          <div><label>Unidad</label><input id="unidadInput" name="unidad" type="text" value="PZA"></div>
          <div><label>Cantidad</label><input id="cantidadInput" name="cantidad" type="number" value="1" min="0" step="1"></div>
          <div><label>P.U.</label><input id="puInput" name="pu" type="text" placeholder="$0.00"></div>
          <div><label>Subtotal</label><input id="subtotalInput" name="subtotal" type="text" readonly></div>
        </div>
      </div>
    </div>
  `;

  const card = document.getElementById("simpleCard");
  const cantidadInput = document.getElementById("cantidadInput");
  const puInput = document.getElementById("puInput");
  const subtotalInput = document.getElementById("subtotalInput");

  function recalc() {
    const cantidad = toNumber(cantidadInput.value) || 1;
    const pu = toNumber(puInput.value);
    subtotalInput.value = formatMoney(cantidad * pu);
  }

  cantidadInput.addEventListener("input", recalc);
  puInput.addEventListener("input", () => {
    puInput.value = puInput.value.replace(/[^\d.,]/g, "");
  });
  puInput.addEventListener("blur", () => {
    setMoneyInput(puInput, toNumber(puInput.value));
    recalc();
  });
  puInput.addEventListener("focus", () => {
    puInput.value = puInput.value.replace(/[^0-9.-]/g, "");
  });

  enableKeyboardNavigation(card);
}

/* ================= generic fallback ================= */
function buildGenericForm(options) {
  const materialDetails = document.getElementById("materialDetails");
  materialDetails.innerHTML = `
    <div class="elegancy-blue-aqua" id="genericFormContainer" style="padding:12px;border-radius:8px;">
      <style>
        .elegancy-blue-aqua { background: linear-gradient(135deg, #003d66, #0099cc); color:#e6faff; font-family:'Segoe UI', Roboto, sans-serif; }
        .elegancy-blue-aqua label { display:block; font-weight:600; margin-bottom:6px; }
        input, select { width:100%; padding:8px; border-radius:6px; border:1px solid #0077aa; background: rgba(255,255,255,0.06); color:#e6faff; box-sizing:border-box; }
        select option { color:#000; }
      </style>
      <div><label>DESCRIPCIÓN:</label><select id="descripcionInput"><option>Seleccionar</option>${Object.keys(options||{}).map(o=>`<option>${o}</option>`).join("")}</select></div>
      <div><label>UNIDAD:</label><input id="unidadInput" type="text" readonly></div>
      <div><label>CANTIDAD:</label><input id="cantidadInput" type="number" step="0.01"></div>
      <div><label>P.U.:</label><input id="puInput" type="text" placeholder="$0.00"></div>
      <div><label>SUBTOTAL:</label><input id="subtotalInput" type="text" readonly></div>
    </div>`;
  enableKeyboardNavigation(document.getElementById("genericFormContainer"));
}

/* ============ Inicialización y eventos ============ */
document.addEventListener("DOMContentLoaded", () => {
  const categoriaSelect = document.getElementById("categoriaInput");
  if (categoriaSelect) {
    categoriaSelect.addEventListener("change", function () {
      const cat = this.value ? this.value.toUpperCase() : "";
      updateFormForCategory(cat);
    });
  }

  const form = document.getElementById("addMaterialForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      console.log("Datos del formulario:", Object.fromEntries(formData.entries()));
    });
  }

  if (categoriaSelect) {
    const initialCat = categoriaSelect.value ? categoriaSelect.value.toUpperCase() : "";
    updateFormForCategory(initialCat);
  }
});