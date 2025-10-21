// ==========================
// FORMULARIO METAL - Independiente (Agregar materiales al listado)
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("materialDetails");
  if (!container) return;

  container.innerHTML = `
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
        .form-grid input, .form-grid select {
          width:100%; padding:8px; border-radius:6px;
          border:1px solid #0077aa;
          background: rgba(255,255,255,0.06);
          color:#e6faff; box-sizing:border-box;
        }
        select option { color:#000; }
        table {
          width:100%; border-collapse:collapse; margin-top:20px;
          color:#e6faff; background:rgba(255,255,255,0.08);
        }
        table th, table td {
          padding:8px; border:1px solid #0077aa; text-align:left;
        }
        .add-btn {
          margin-top:10px; background:#00bfff; color:#003d66;
          font-weight:bold; border:none; padding:8px 14px;
          border-radius:6px; cursor:pointer;
        }
        .add-btn:hover { background:#33ccff; }
      </style>

      <!-- Sección principal del formulario -->
      <div class="form-grid">
        <div class="col">
          <label>Categoría</label>
          <input type="text" id="categoriaMetal" value="METAL" readonly>

          <label>Material</label>
          <select id="materialMetal" required>
            <option value="">Seleccionar</option>
            <option value="LAMINA">LAMINA</option>
            <option value="PERFIL">PERFIL</option>
            <option value="PLACA">PLACA</option>
            <option value="BARRA">BARRA</option>
            <option value="TUBO">TUBO</option>
            <option value="ANGULO">ANGULO</option>
            <option value="SOLERA">SOLERA</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>

        <div class="col">
          <label>Nombre de la pieza</label>
          <input type="text" id="nombrePieza">

          <label>Largo (mm)</label>
          <input type="number" id="largoInput" min="0" step="0.01">

          <label>Ancho (mm)</label>
          <input type="number" id="anchoInput" min="0" step="0.01">

          <label>No. piezas</label>
          <input type="number" id="numPiezasInput" min="1" step="1" value="1">
        </div>
      </div>

      <!-- Tabla de materiales -->
      <table id="tablaMateriales">
        <thead>
          <tr>
            <th>Clave</th>
            <th>Descripción</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>P.U. ($)</th>
            <th>Subtotal ($)</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      <button id="addMaterialBtn" class="add-btn">+ Agregar material</button>
    </div>
  `;

  const tabla = document.getElementById("tablaMateriales").querySelector("tbody");
  const addBtn = document.getElementById("addMaterialBtn");

  addBtn.addEventListener("click", () => {
    const categoria = document.getElementById("categoriaMetal").value;
    const material = document.getElementById("materialMetal").value;
    const nombre = document.getElementById("nombrePieza").value;
    const largo = parseFloat(document.getElementById("largoInput").value) || 0;
    const ancho = parseFloat(document.getElementById("anchoInput").value) || 0;
    const piezas = parseInt(document.getElementById("numPiezasInput").value) || 1;

    if (!material || !nombre) {
      alert("Completa los campos Material y Nombre de pieza.");
      return;
    }

    // Cálculo de cantidad base
    const cantidad = ((largo * ancho) / 3680000) * piezas;
    const unidad = "M2";
    const pu = 0.00;
    const subtotal = cantidad * pu;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td contenteditable="true"></td>
      <td>${categoria} - ${material} - ${nombre}</td>
      <td>${unidad}</td>
      <td>${cantidad.toFixed(2)}</td>
      <td contenteditable="true">$0.00</td>
      <td>$${subtotal.toFixed(2)}</td>
    `;

    tabla.appendChild(fila);

    fila.querySelectorAll("td[contenteditable]").forEach(td => {
      td.addEventListener("input", () => {
        const puTexto = fila.cells[4].innerText.replace(/[^0-9.]/g, "");
        const puNum = parseFloat(puTexto) || 0;
        const cantNum = parseFloat(fila.cells[3].innerText) || 0;
        fila.cells[5].innerText = `$${(puNum * cantNum).toFixed(2)}`;
      });
    });

    document.getElementById("materialMetal").value = "";
    document.getElementById("nombrePieza").value = "";
    document.getElementById("largoInput").value = "";
    document.getElementById("anchoInput").value = "";
    document.getElementById("numPiezasInput").value = "1";
  });
});
